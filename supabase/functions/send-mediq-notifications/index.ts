// Supabase Edge Function: send-mediq-notifications
// Deploy with: supabase functions deploy send-mediq-notifications
// SUPABASE_SERVICE_ROLE_KEY must remain configured only in Supabase secrets.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const response = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "POST is required" }, 405);

  try {
    const authorization = req.headers.get("Authorization") || "";
    const token = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!token) return response({ error: "Not authenticated" }, 401);

    const { data: caller, error: callerError } = await adminClient.auth.getUser(token);
    if (callerError || !caller.user) return response({ error: "Not authenticated" }, 401);

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", caller.user.id)
      .maybeSingle();
    if (profileError) return response({ error: profileError.message }, 500);

    const role = String(profile?.role || "").trim().toLowerCase();
    if (!["admin", "super admin", "receptionist"].includes(role)) {
      return response({ error: "Only Admin or Receptionist users can send notifications" }, 403);
    }

    const body = await req.json();
    const recipientIds = Array.from(new Set((body.recipientIds || []).filter((id: unknown) => typeof id === "string" && id.length > 0)));
    const title = String(body.title || "").trim();
    const message = String(body.message || "").trim();
    const type = String(body.type || "general").trim() || "general";

    if (recipientIds.length === 0) return response({ error: "Select at least one recipient" }, 400);
    if (!title || !message) return response({ error: "Notification title and message are required" }, 400);

    // Keep only IDs that still exist in profiles. This prevents a stale
    // recipient selection from failing the entire multi-recipient insert.
    const { data: existingProfiles, error: recipientError } = await adminClient
      .from("profiles")
      .select("id")
      .in("id", recipientIds);
    if (recipientError) {
      console.error("notification_recipient_lookup_failed", recipientError);
      return response({ error: recipientError.message, code: recipientError.code || null, details: recipientError.details || null }, 400);
    }
    const validRecipientIds = new Set((existingProfiles || []).map((profileRow) => profileRow.id));
    const validIds = recipientIds.filter((recipientId) => validRecipientIds.has(recipientId));
    if (validIds.length === 0) return response({ error: "No valid recipient profiles were found" }, 400);

    const rows = validIds.map((recipientId) => ({
      recipient_id: recipientId,
      sender_id: caller.user.id,
      title,
      message,
      notification_type: type,
    }));
    // Do not chain select() here. The service-role insert only needs to write;
    // avoiding a returning query removes an unnecessary schema/RLS dependency.
    const { error: insertError } = await adminClient
      .from("mediq_notifications")
      .insert(rows);
    if (insertError) {
      console.error("notification_insert_failed", insertError);
      return response({ error: insertError.message, code: insertError.code || null, details: insertError.details || null, hint: insertError.hint || null }, 400);
    }

    return response({ data: [], inserted: validIds.length });
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : "Unable to send notification" }, 500);
  }
});
