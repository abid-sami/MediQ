// Design: Guided Floorplan — the assistant is concise, safety-aware, and optimized for low-latency care-platform guidance.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchSupabaseBeds, fetchSupabaseFeaturedDoctors, fetchSupabaseHospitals } from "@/services/supabase-service";
import { getDynamicMedicines } from "@/data/pharmacy-store";

const chatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(1800) })).min(1).max(6),
});

type ContextSnapshot = {
  createdAt: number;
  doctors: unknown[];
  hospitals: unknown[];
  beds: unknown[];
  medicines: unknown[];
};
let contextCache: ContextSnapshot | null = null;
const CONTEXT_TTL_MS = 90_000;
const REQUEST_TIMEOUT_MS = 12_000;
const LIVE_DATA_PATTERN = /\b(doctor|specialist|department|hospital|bed|ward|medicine|medication|pharmacy|blood|availability|stock|appointment)\b/i;

async function getMediQContext(): Promise<ContextSnapshot> {
  if (contextCache && Date.now() - contextCache.createdAt < CONTEXT_TTL_MS) return contextCache;
  const [doctors, hospitals, beds, medicines] = await Promise.all([
    fetchSupabaseFeaturedDoctors(12),
    fetchSupabaseHospitals(),
    fetchSupabaseBeds(),
    getDynamicMedicines(),
  ]);
  contextCache = { createdAt: Date.now(), doctors, hospitals, beds, medicines };
  return contextCache;
}

function compactContext(context: ContextSnapshot) {
  const doctors = context.doctors.slice(0, 12).map((doctor: any) => ({
    name: doctor.name,
    specialty: doctor.specialty,
    department: doctor.department,
    hospital: doctor.hospital,
    available: doctor.onlineBookingEnabled,
  }));
  const hospitals = context.hospitals.map((hospital: any) => ({
    name: hospital.name,
    location: hospital.location,
    availableBeds: hospital.availableBeds,
    totalBeds: hospital.totalBeds,
    emergencyStatus: hospital.emergencyStatus,
    supportHours: hospital.supportHours,
  }));
  const beds = context.beds.slice(0, 24).map((bed: any) => ({
    bedNumber: bed.bedNumber,
    ward: bed.wardType,
    status: bed.status,
    hospitalId: bed.hospitalId,
  }));
  const medicines = context.medicines.slice(0, 24).map((medicine: any) => ({
    name: medicine.name,
    genericName: medicine.genericName,
    brand: medicine.brand,
    strength: medicine.strength,
    category: medicine.category,
    stock: medicine.stock,
    prescriptionRequired: medicine.prescriptionRequired,
  }));
  return { doctors, hospitals, beds, medicines };
}

function needsLiveContext(messages: Array<{ role: "user" | "assistant"; content: string }>) {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
  return LIVE_DATA_PATTERN.test(latestUserMessage);
}

export const askMediQAssistant = createServerFn({ method: "POST" })
  .validator(chatInput)
  .handler(async ({ data }) => {
    const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env || {};
    const apiKey = (process.env.GEMINI_API_KEY || viteEnv.GEMINI_API_KEY || "").trim();
    if (!apiKey) throw new Error("The AI assistant is not configured. Add GEMINI_API_KEY to the server environment.");

    const recentMessages = data.messages.slice(-5);
    const includeLiveData = needsLiveContext(recentMessages);
    const context = includeLiveData ? await getMediQContext() : null;
    const model = (process.env.GEMINI_CHAT_MODEL || viteEnv.GEMINI_CHAT_MODEL || "gemini-3.6-flash").trim();
    const systemInstruction = `You are MediQ Assistant, a fast healthcare-platform guide. Answer only questions about MediQ services and how to use the platform. Use short, direct answers with a maximum of four concise sentences or four bullets. Never diagnose, prescribe, or replace a clinician. If a medical emergency is described, tell the user to contact local emergency services and use MediQ Emergency SOS. Keep the user's language. ${context ? `Use this current MediQ data when relevant; never invent availability or records.\n\nLIVE MEDIQ DATA:\n${JSON.stringify(compactContext(context))}` : "For general navigation questions, answer directly without claiming unverified live availability."}`;
    const contents = recentMessages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.15,
            maxOutputTokens: 320,
            thinkingConfig: { thinkingLevel: "minimal" },
          },
        }),
      });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error("The AI assistant is taking longer than expected. Please try a shorter question.");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Gemini assistant provider error:", response.status, detail.slice(0, 500));
      let providerMessage = "The AI assistant is temporarily unavailable. Please try again.";
      if (response.status === 400 || response.status === 403) providerMessage = "The Gemini server key is invalid, restricted, or the selected model is unavailable. Please update GEMINI_API_KEY or GEMINI_CHAT_MODEL.";
      if (response.status === 429) providerMessage = "The Gemini provider is temporarily rate-limited or out of quota. Please check the Gemini API project quota.";
      throw new Error(providerMessage);
    }
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const answer = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join(" ").trim();
    if (!answer) throw new Error("The AI assistant returned an empty response. Please try again.");
    return { answer };
  });
