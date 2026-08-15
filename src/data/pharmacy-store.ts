import { PharmacyMedicine, PharmacyOrder, StockStatus } from "./pharmacy-data";
import { supabase } from "@/integrations/supabase/client";

export const PHARMACY_INVENTORY_KEY = "mediq_pharmacy_inventory_store";
export const PHARMACY_ORDERS_KEY = "mediq_pharmacy_orders_store";

export const DEFAULT_SEED_MEDICINES: PharmacyMedicine[] = [
  {
    id: "med-01",
    name: "Napa Extra",
    genericName: "Paracetamol + Caffeine",
    brand: "Beximco Pharma",
    strength: "500mg + 65mg",
    category: "Pain & Fever",
    price: 2.5,
    stock: 140,
    reorderLevel: 30,
    expiryDate: "2027-10-31",
    prescriptionRequired: false,
    stockStatus: "In Stock",
  },
  {
    id: "med-02",
    name: "Amlopin 5",
    genericName: "Amlodipine Besylate",
    brand: "Square Pharmaceuticals",
    strength: "5mg Tablet",
    category: "Cardiac & Hypertension",
    price: 4.8,
    stock: 85,
    reorderLevel: 25,
    expiryDate: "2028-05-15",
    prescriptionRequired: true,
    stockStatus: "In Stock",
  },
  {
    id: "med-03",
    name: "Metformin HCl",
    genericName: "Metformin Hydrochloride",
    brand: "Incepta Pharmaceuticals",
    strength: "500mg XR",
    category: "Diabetes Care",
    price: 3.2,
    stock: 110,
    reorderLevel: 30,
    expiryDate: "2027-12-31",
    prescriptionRequired: true,
    stockStatus: "In Stock",
  },
  {
    id: "med-04",
    name: "Azithrocin 500",
    genericName: "Azithromycin",
    brand: "Beximco Pharma",
    strength: "500mg Capsule",
    category: "Antibiotics",
    price: 9.5,
    stock: 45,
    reorderLevel: 20,
    expiryDate: "2027-08-20",
    prescriptionRequired: true,
    stockStatus: "In Stock",
  },
  {
    id: "med-05",
    name: "Seclo 20",
    genericName: "Omeprazole",
    brand: "Square Pharmaceuticals",
    strength: "20mg Capsule",
    category: "Gastrointestinal",
    price: 3.0,
    stock: 160,
    reorderLevel: 40,
    expiryDate: "2028-01-10",
    prescriptionRequired: false,
    stockStatus: "In Stock",
  },
  {
    id: "med-06",
    name: "Ventolin Inhaler",
    genericName: "Salbutamol Sulfate",
    brand: "GSK Health",
    strength: "100mcg / Dose",
    category: "Respiratory",
    price: 12.0,
    stock: 18,
    reorderLevel: 20,
    expiryDate: "2027-11-30",
    prescriptionRequired: true,
    stockStatus: "Low Stock",
  },
  {
    id: "med-07",
    name: "Ceevit 500",
    genericName: "Ascorbic Acid (Vitamin C)",
    brand: "Square Pharmaceuticals",
    strength: "500mg Chewable",
    category: "Vitamins & Supplements",
    price: 1.8,
    stock: 220,
    reorderLevel: 50,
    expiryDate: "2028-04-30",
    prescriptionRequired: false,
    stockStatus: "In Stock",
  },
  {
    id: "med-08",
    name: "Fexo 120",
    genericName: "Fexofenadine Hydrochloride",
    brand: "Incepta Pharmaceuticals",
    strength: "120mg Tablet",
    category: "Allergy & Cold",
    price: 5.5,
    stock: 90,
    reorderLevel: 25,
    expiryDate: "2027-09-15",
    prescriptionRequired: false,
    stockStatus: "In Stock",
  },
];

// 1. Fetch Dynamic Medicines
export async function getDynamicMedicines(): Promise<PharmacyMedicine[]> {
  let dbMeds: PharmacyMedicine[] = [];

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from("pharmacy_inventory")
      .select("*")
      .order("medicine_name", { ascending: true });

    if (!error && data && data.length > 0) {
      dbMeds = data.map((m: any) => ({
        id: m.id,
        name: m.medicine_name || m.name,
        genericName: m.generic_name || "",
        brand: m.manufacturer || m.brand || "MediQ Pharma",
        strength: m.dosage_strength || m.strength || "Standard",
        category: m.category || "General",
        price: Number(m.price_per_unit || m.price || 5.0),
        stock: Number(m.stock || 0),
        reorderLevel: Number(m.reorder_level || 20),
        expiryDate: m.expiry_date || "2028-12-31",
        prescriptionRequired: m.prescription_required ?? true,
        stockStatus: (m.stock <= 0 ? "Out of Stock" : m.stock < (m.reorder_level || 20) ? "Low Stock" : "In Stock") as StockStatus,
      }));
    }
  } catch (e) {
    console.warn("Supabase pharmacy medicines fetch note:", e);
  }

  // Check localStorage store
  let localMeds: PharmacyMedicine[] = [];
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(PHARMACY_INVENTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localMeds = parsed;
        }
      } else {
        // First run seed
        localStorage.setItem(PHARMACY_INVENTORY_KEY, JSON.stringify(DEFAULT_SEED_MEDICINES));
        localMeds = DEFAULT_SEED_MEDICINES;
      }
    }
  } catch (e) {
    console.warn("Local storage medicines read note:", e);
  }

  if (dbMeds.length > 0) {
    // Sync to local
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(PHARMACY_INVENTORY_KEY, JSON.stringify(dbMeds));
      } catch (e) {}
    }
    return dbMeds;
  }

  return localMeds.length > 0 ? localMeds : DEFAULT_SEED_MEDICINES;
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

  // 2. Insert into Supabase
  try {
    await supabase.from("pharmacy_inventory").insert({
      id: medicineId,
      medicine_name: fullMedicine.name,
      generic_name: fullMedicine.genericName,
      manufacturer: fullMedicine.brand,
      dosage_strength: fullMedicine.strength,
      category: fullMedicine.category,
      price_per_unit: fullMedicine.price,
      stock: fullMedicine.stock,
      reorder_level: fullMedicine.reorderLevel,
      prescription_required: fullMedicine.prescriptionRequired,
      stock_status: fullMedicine.stockStatus,
    });
  } catch (e) {
    console.warn("Supabase medicine insert error:", e);
  }

  return fullMedicine;
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
    if (updates.name) supabasePayload.medicine_name = updates.name;
    if (updates.genericName) supabasePayload.generic_name = updates.genericName;
    if (updates.brand) supabasePayload.manufacturer = updates.brand;
    if (updates.strength) supabasePayload.dosage_strength = updates.strength;
    if (updates.price !== undefined) supabasePayload.price_per_unit = updates.price;
    if (updates.stock !== undefined) supabasePayload.stock = updates.stock;
    if (updates.reorderLevel !== undefined) supabasePayload.reorder_level = updates.reorderLevel;
    if (updates.prescriptionRequired !== undefined) supabasePayload.prescription_required = updates.prescriptionRequired;

    await supabase.from("pharmacy_inventory").update(supabasePayload).eq("id", medicineId);
  } catch (e) {
    console.warn("Supabase medicine update error:", e);
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

  try {
    await supabase.from("pharmacy_inventory").delete().eq("id", medicineId);
  } catch (e) {
    console.warn("Supabase medicine delete error:", e);
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
    await supabase.from("pharmacy_orders").insert({
      id: order.id,
      order_id: order.orderId,
      patient_name: order.patientName,
      patient_contact: order.patientContact,
      medicines: order.medicines,
      total_amount: order.totalAmount,
      prescription_status: order.prescriptionStatus,
      order_status: order.orderStatus,
      delivery_type: order.deliveryType,
    });
  } catch (e) {
    console.warn("Supabase order insert error:", e);
  }
}

// 7. Update Order Status (Pharmacist updates order)
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
