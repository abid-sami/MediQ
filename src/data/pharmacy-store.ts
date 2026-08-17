import { PharmacyMedicine, PharmacyOrder, StockStatus, PharmacyCategory } from "./pharmacy-data";
import { supabase } from "@/integrations/supabase/client";

export const PHARMACY_INVENTORY_KEY = "mediq_pharmacy_inventory_store";
export const PHARMACY_ORDERS_KEY = "mediq_pharmacy_orders_store";

// 1. Fetch Dynamic Medicines — Supabase is the single source of truth.
export async function getDynamicMedicines(): Promise<PharmacyMedicine[]> {
  let dbMeds: PharmacyMedicine[] = [];

  try {
    const { data, error } = await supabase
      .from("pharmacy_inventory")
      .select("*")
      .order("medicine_name", { ascending: true });

    if (!error && data) {
      dbMeds = data.map((m: any) => ({
        id: m.id,
        name: m.medicine_name || m.name,
        genericName: m.generic_name || "",
        brand: m.manufacturer || m.brand || "",
        strength: m.dosage_strength || m.strength || "",
        category: m.category || "General",
        price: Number(m.price_per_unit || m.price || 0),
        stock: Number(m.stock || 0),
        reorderLevel: Number(m.reorder_level || 20),
        expiryDate: m.expiry_date || "",
        prescriptionRequired: m.prescription_required ?? true,
        stockStatus: (m.stock <= 0 ? "Out of Stock" : m.stock < (m.reorder_level || 20) ? "Low Stock" : "In Stock") as StockStatus,
      }));
    } else if (error) {
      console.warn("Supabase pharmacy medicines fetch error:", error);
    }
  } catch (e) {
    console.warn("Supabase pharmacy medicines fetch note:", e);
  }

  // Keep a local mirror purely for offline resilience within this browser —
  // it always reflects the last known database state, never seed/fake data.
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PHARMACY_INVENTORY_KEY, JSON.stringify(dbMeds));
    } catch (e) {}
  }

  return dbMeds;
}

// 2. Add New Medicine (Managed by Pharmacist)
export async function addDynamicMedicine(newMed: Omit<PharmacyMedicine, "id"> & { id?: string }): Promise<PharmacyMedicine> {
  const medicineId = newMed.id || `med-${Date.now()}`;
  const fullMedicine: PharmacyMedicine = {
    ...newMed,
    id: medicineId,
    stockStatus: newMed.stock <= 0 ? "Out of Stock" : newMed.stock < newMed.reorderLevel ? "Low Stock" : "In Stock",
  };

  // 1. Update localStorage
  if (typeof window !== "undefined") {
    try {
      const current = await getDynamicMedicines();
      const updated = [fullMedicine, ...current.filter((m) => m.id !== medicineId)];
      localStorage.setItem(PHARMACY_INVENTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  // 2. Insert into Supabase. The database owns the UUID primary key;
  // medicine_code is the required human-readable catalog identifier.
  const { data, error } = await supabase
    .from("pharmacy_inventory")
    .insert({
      medicine_code: `MED-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      medicine_name: fullMedicine.name,
      generic_name: fullMedicine.genericName,
      manufacturer: fullMedicine.brand,
      dosage_strength: fullMedicine.strength,
      category: fullMedicine.category,
      price_per_unit: fullMedicine.price,
      stock: fullMedicine.stock,
      reorder_level: fullMedicine.reorderLevel,
      prescription_required: fullMedicine.prescriptionRequired,
      expiry_date: fullMedicine.expiryDate || null,
      stock_status: fullMedicine.stockStatus,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase medicine insert error:", error);
    throw error;
  }

  return {
    ...fullMedicine,
    id: data.id,
  };
}

export async function getDynamicPharmacyCategories(): Promise<PharmacyCategory[]> {
  try {
    const { data, error } = await supabase
      .from("pharmacy_categories")
      .select("id, name, is_active, sort_order, created_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) {
      console.warn("Supabase pharmacy categories fetch error:", error);
      return [];
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      isActive: row.is_active,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.warn("Supabase pharmacy categories fetch note:", error);
    return [];
  }
}

export async function addDynamicPharmacyCategory(name: string): Promise<PharmacyCategory> {
  const { data, error } = await supabase
    .from("pharmacy_categories")
    .insert({ name: name.trim(), sort_order: 999 })
    .select()
    .single();
  if (error) throw error;
  return { id: data.id, name: data.name, isActive: data.is_active, sortOrder: data.sort_order, createdAt: data.created_at };
}

export async function updateDynamicPharmacyCategory(id: string, name: string): Promise<void> {
  const { error } = await supabase.from("pharmacy_categories").update({ name: name.trim() }).eq("id", id);
  if (error) throw error;
}

export async function deleteDynamicPharmacyCategory(id: string): Promise<void> {
  const { error } = await supabase.from("pharmacy_categories").update({ is_active: false }).eq("id", id);
  if (error) throw error;
}

// 3. Update Medicine Details or Stock
export async function updateDynamicMedicine(medicineId: string, updates: Partial<PharmacyMedicine>): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getDynamicMedicines();
      const updated = current.map((m) => {
        if (m.id === medicineId) {
          const merged = { ...m, ...updates };
          merged.stockStatus = merged.stock <= 0 ? "Out of Stock" : merged.stock < merged.reorderLevel ? "Low Stock" : "In Stock";
          return merged;
        }
        return m;
      });
      localStorage.setItem(PHARMACY_INVENTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  try {
    const supabasePayload: any = {};
    if (updates.name !== undefined) supabasePayload.medicine_name = updates.name;
    if (updates.genericName !== undefined) supabasePayload.generic_name = updates.genericName;
    if (updates.brand !== undefined) supabasePayload.manufacturer = updates.brand;
    if (updates.strength !== undefined) supabasePayload.dosage_strength = updates.strength;
    if (updates.category !== undefined) supabasePayload.category = updates.category;
    if (updates.price !== undefined) supabasePayload.price_per_unit = updates.price;
    if (updates.stock !== undefined) supabasePayload.stock = updates.stock;
    if (updates.reorderLevel !== undefined) supabasePayload.reorder_level = updates.reorderLevel;
    if (updates.expiryDate !== undefined) supabasePayload.expiry_date = updates.expiryDate || null;
    if (updates.prescriptionRequired !== undefined) supabasePayload.prescription_required = updates.prescriptionRequired;
    if (updates.stock !== undefined || updates.reorderLevel !== undefined) {
      const nextStock = updates.stock ?? (await getDynamicMedicines()).find((m) => m.id === medicineId)?.stock ?? 0;
      const nextReorder = updates.reorderLevel ?? (await getDynamicMedicines()).find((m) => m.id === medicineId)?.reorderLevel ?? 20;
      supabasePayload.stock_status = nextStock <= 0 ? "Out of Stock" : nextStock < nextReorder ? "Low Stock" : "In Stock";
    }

    const { error } = await supabase.from("pharmacy_inventory").update(supabasePayload).eq("id", medicineId);
    if (error) throw error;
  } catch (e) {
    console.warn("Supabase medicine update error:", e);
    throw e;
  }
}

// 4. Delete Medicine
export async function deleteDynamicMedicine(medicineId: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getDynamicMedicines();
      const updated = current.filter((m) => m.id !== medicineId);
      localStorage.setItem(PHARMACY_INVENTORY_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  const { error } = await supabase.from("pharmacy_inventory").delete().eq("id", medicineId);
  if (error) {
    console.warn("Supabase medicine delete error:", error);
    throw error;
  }
}

// 5. Dynamic Pharmacy Orders CRUD
export async function getDynamicPharmacyOrders(): Promise<PharmacyOrder[]> {
  let dbOrders: PharmacyOrder[] = [];

  try {
    const { data, error } = await supabase
      .from("pharmacy_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      dbOrders = data.map((o: any) => ({
        id: o.id,
        orderId: o.order_id || `ORD-${o.id.substring(0, 6)}`,
        patientName: o.patient_name || "Patient",
        patientContact: o.patient_contact || "+1 (555) 000-0000",
        medicines: o.medicines || [],
        orderTime: o.created_at ? new Date(o.created_at).toLocaleDateString() : "Today",
        totalAmount: Number(o.total_amount || 0),
        prescriptionRequired: o.prescription_required ?? false,
        prescriptionStatus: o.prescription_status || "Verified",
        orderStatus: o.order_status || "Processing",
        deliveryType: o.delivery_type || "Home Delivery",
      }));
    }
  } catch (e) {}

  let localOrders: PharmacyOrder[] = [];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PHARMACY_ORDERS_KEY);
      if (stored) {
        localOrders = JSON.parse(stored);
      }
    } catch (e) {}
  }

  const merged = [...dbOrders];
  for (const lo of localOrders) {
    if (!merged.some((mo) => mo.id === lo.id || mo.orderId === lo.orderId)) {
      merged.push(lo);
    }
  }

  return merged;
}

// 6. Create Pharmacy Order (When patient checks out cart)
export async function createDynamicPharmacyOrder(order: PharmacyOrder): Promise<void> {
  // 1. Save to local storage
  if (typeof window !== "undefined") {
    try {
      const current = await getDynamicPharmacyOrders();
      const updated = [order, ...current.filter((o) => o.id !== order.id)];
      localStorage.setItem(PHARMACY_ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  // 2. Decrement medicine stock
  for (const item of order.medicines) {
    try {
      const allMeds = await getDynamicMedicines();
      const matched = allMeds.find((m) => m.name.toLowerCase() === item.medicineName.toLowerCase());
      if (matched) {
        const newStock = Math.max(0, matched.stock - item.quantity);
        await updateDynamicMedicine(matched.id, { stock: newStock });
      }
    } catch (e) {}
  }

  // 3. Save to Supabase
  try {
    const { error } = await supabase.from("pharmacy_orders").insert({
      order_id: order.orderId,
      patient_name: order.patientName,
      patient_contact: order.patientContact,
      medicines: order.medicines,
      total_amount: order.totalAmount,
      prescription_status: order.prescriptionStatus,
      order_status: order.orderStatus,
      delivery_type: order.deliveryType,
      prescription_required: order.prescriptionRequired,
    });
    if (error) throw error;
  } catch (e) {
    console.warn("Supabase order insert error:", e);
    throw e;
  }
}

// 7. Persistent prescription uploads and pharmacist verification
export async function getDynamicPrescriptionSubmissions(): Promise<import("./pharmacy-data").PrescriptionToVerify[]> {
  const { data, error } = await supabase
    .from("prescription_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    prescriptionId: row.prescription_id,
    patientName: row.patient_name || "Patient",
    patientAge: 0,
    doctorName: "Uploaded by patient",
    doctorSpecialization: "External prescription",
    date: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "",
    diagnosis: row.file_name || "Uploaded prescription",
    medicines: [],
    verificationStatus: row.verification_status,
    notes: row.pharmacist_notes || row.notes || "",
    fileName: row.file_name,
    fileUrl: row.file_url,
    orderReference: row.order_reference || "",
    uploadedAt: row.created_at,
  }));
}

export async function uploadPrescriptionSubmission(payload: {
  file: File;
  patientName: string;
  orderReference?: string;
  notes?: string;
}) {
  const safeName = payload.file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const filePath = `${Date.now()}-${safeName}`;
  const upload = await supabase.storage.from("prescriptions").upload(filePath, payload.file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (upload.error) throw upload.error;

  const fileUrl = supabase.storage.from("prescriptions").getPublicUrl(filePath).data.publicUrl;
  const { data, error } = await supabase
    .from("prescription_submissions")
    .insert({
      prescription_id: `RX-UP-${Date.now().toString(36).toUpperCase()}`,
      patient_name: payload.patientName,
      order_reference: payload.orderReference || null,
      file_name: payload.file.name,
      file_path: filePath,
      file_url: fileUrl,
      mime_type: payload.file.type || "application/octet-stream",
      file_size: payload.file.size,
      notes: payload.notes || "",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDynamicPrescriptionStatus(
  prescriptionId: string,
  status: "Pending" | "Verified" | "Rejected" | "Clarification Requested",
  notes?: string,
) {
  const { data, error } = await supabase
    .from("prescription_submissions")
    .update({
      verification_status: status,
      pharmacist_notes: notes || null,
      reviewed_at: status === "Pending" ? null : new Date().toISOString(),
    })
    .eq("id", prescriptionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 8. Update Order Status (Pharmacist updates order)
export async function updateDynamicPharmacyOrderStatus(orderId: string, newStatus: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getDynamicPharmacyOrders();
      const updated = current.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, orderStatus: newStatus as any } : o));
      localStorage.setItem(PHARMACY_ORDERS_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  try {
    await supabase.from("pharmacy_orders").update({ order_status: newStatus }).or(`id.eq.${orderId},order_id.eq.${orderId}`);
  } catch (e) {}
}
