import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://iknstvfrjqsvqpkriqvl.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbnN0dmZyanFzdnFwa3JpcXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDY3ODcsImV4cCI6MjEwMjI4Mjc4N30.FxUnkgnJQKoWNmRe6_hAWnGfI3hNmp27X_-1F0ztGoM";

// Secondary non-persisting client so Admin / Staff account creation does NOT replace active admin session!
const nonPersistSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// All data here comes from and goes straight to Supabase. There is no
// localStorage cache and no bundled fallback data — if a query fails or a
// table is empty, callers get an empty array/null and should render an
// empty state rather than a stand-in record.

// ============================================================================
// 1. AUTH & USER PROFILES SERVICE
// ============================================================================

export async function loginWithSupabase(emailOrPhone: string, passwordText: string) {
  try {
    const email = emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone.replace(/\D/g, "")}@mediq.health`;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: passwordText,
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// Preferred way to create staff/patient accounts from the Admin panel.
// Runs entirely server-side via the admin-create-user Edge Function, using
// the service role key, so it isn't subject to the same-user RLS rule that
// blocks a normal client-side insert into `profiles`.
export async function createUserAsAdmin(params: {
  name: string;
  email: string;
  phone: string;
  role: string;
  passwordText: string;
  bloodGroup?: string;
  address?: string;
}) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: {
        name: params.name,
        email: params.email,
        phone: params.phone,
        role: params.role,
        password: params.passwordText,
        bloodGroup: params.bloodGroup,
        address: params.address,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: data?.error ? { message: data.error } : null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function registerWithSupabase(params: {
  name: string;
  email: string;
  phone: string;
  role: string;
  passwordText: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  address?: string;
}) {
  try {
    const email = params.email && params.email.includes("@")
      ? params.email
      : `${params.phone.replace(/\D/g, "") || Date.now()}@mediq.health`;

    // Use nonPersistSupabase so current admin session is NOT overwritten!
    const { data: authData, error: authError } = await nonPersistSupabase.auth.signUp({
      email,
      password: params.passwordText,
      options: {
        data: {
          name: params.name,
          phone: params.phone,
          role: params.role,
          age: params.age,
          gender: params.gender || "Not specified",
          bloodGroup: params.bloodGroup || "",
          address: params.address || "",
        },
      },
    });

    if (authError) {
      console.warn("Supabase Auth signUp note:", authError.message);
    }

    // The `on_auth_user_created` DB trigger creates the profiles row from
    // this same metadata, so we don't insert/upsert it again from the
    // client. We still upsert here as a safety net in case the trigger is
    // missing (e.g. schema not yet migrated), using whatever id Auth gave us.
    let profileError: any = null;
    if (authData?.user?.id) {
      try {
        const { error: upsertError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          name: params.name,
          email,
          phone: params.phone,
          role: params.role,
          age: params.age,
          gender: params.gender || "Not specified",
          blood_group: params.bloodGroup || null,
          address: params.address || "",
        });
        if (upsertError) {
          console.error("Supabase profiles table upsert failed:", upsertError);
          profileError = upsertError;
        }
      } catch (e) {
        console.error("Supabase profiles table upsert threw:", e);
        profileError = e;
      }
    }

    return { data: authData, error: authError || profileError };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 2. APPOINTMENTS SERVICE
// ============================================================================

function mapAppointment(a: any) {
  return {
    id: a.id,
    appointmentId: a.appointment_id || a.id,
    patientId: a.patient_id,
    patientName: a.patient_name,
    patientPhone: a.patient_phone,
    doctorName: a.doctor_name,
    doctorId: a.doctor_id,
    patientAge: a.patient_age,
    patientGender: a.patient_gender || "Other",
    patientBloodGroup: a.patient_blood_group || "",
    appointmentTime: a.appointment_time,
    appointmentDate: a.appointment_date,
    appointmentType: a.appointment_type || "In-Person",
    department: a.department || a.specialty,
    specialty: a.specialty,
    status: a.status || "Scheduled",
    serialNumber: a.serial_number,
    serialToken: a.serial_token || (a.serial_number ? `Serial #${a.serial_number}` : ""),
    reason: a.reason || "",
    fee: a.fee != null ? Number(a.fee) : 0,
    patientAvatar: a.patient_avatar || "",
  };
}

export async function fetchSupabaseAppointments(patientName?: string) {
  try {
    let query = supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (patientName?.trim()) query = query.eq("patient_name", patientName.trim());
    const { data, error } = await query;

    if (error || !data) return [];
    return data.map(mapAppointment);
  } catch (e) {
    console.warn("fetchSupabaseAppointments error:", e);
    return [];
  }
}

export async function createSupabaseAppointment(payload: {
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  doctorId?: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  serialNumber: number;
  serialToken: string;
  fee?: number;
}) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        appointment_id: payload.appointmentId,
        patient_name: payload.patientName,
        patient_phone: payload.patientPhone,
        doctor_name: payload.doctorName,
        doctor_id: payload.doctorId || null,
        specialty: payload.specialty,
        department: payload.specialty,
        appointment_date: payload.appointmentDate,
        appointment_time: payload.appointmentTime,
        serial_number: payload.serialNumber,
        serial_token: payload.serialToken,
        fee: payload.fee || 0,
        status: "Scheduled",
      })
      .select()
      .single();

    return { data: data ? mapAppointment(data) : null, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabaseAppointmentStatus(appointmentId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 3. HOSPITALS & BEDS SERVICE
// ============================================================================

export async function fetchSupabaseHospitals() {
  try {
    const { data, error } = await supabase.from("hospitals").select("*");
    if (error || !data) return [];
    return data.map((h: any) => ({
      id: h.id,
      name: h.name,
      location: h.location,
      totalBeds: h.total_beds,
      availableBeds: h.available_beds,
      doctorCount: h.doctor_count,
      emergencyStatus: h.emergency_status,
      occupancyPercent: h.occupancy_percent,
      supportHours: h.support_hours || "24/7",
    }));
  } catch (e) {
    console.warn("fetchSupabaseHospitals error:", e);
    return [];
  }
}

export async function createSupabaseHospital(payload: {
  name: string;
  location: string;
  totalBeds: number;
  availableBeds: number;
  doctorCount: number;
}) {
  try {
    const { data, error } = await supabase.from("hospitals").insert({
      name: payload.name,
      location: payload.location,
      total_beds: payload.totalBeds,
      available_beds: payload.availableBeds,
      doctor_count: payload.doctorCount,
      emergency_status: "Active",
      occupancy_percent:
        payload.totalBeds > 0
          ? Math.round(((payload.totalBeds - payload.availableBeds) / payload.totalBeds) * 100)
          : 0,
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// Lets Admin edit hospital-level settings that aren't derived from another
// table — e.g. emergency support hours shown on the public landing page.
export async function updateSupabaseHospital(hospitalId: string, payload: Record<string, any>) {
  try {
    const { data, error } = await supabase.from("hospitals").update(payload).eq("id", hospitalId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function fetchSupabaseBeds() {
  try {
    const { data, error } = await supabase.from("beds").select("*");
    if (error || !data) return [];
    return data.map((b: any) => ({
      id: b.id,
      bedNumber: b.bed_number,
      wardType: b.ward_type,
      floorNumber: b.floor_number,
      dailyRate: Number(b.daily_rate),
      status: b.status,
      admittedPatientName: b.admitted_patient_name,
      attendingDoctor: b.attending_doctor,
      admissionDate: b.admission_date,
      hospitalId: b.hospital_id,
    }));
  } catch (e) {
    console.warn("fetchSupabaseBeds error:", e);
    return [];
  }
}

export async function updateSupabaseBedStatus(bedId: string, status: string, admittedPatientName?: string) {
  try {
    const updateData: any = { status };
    if (status === "Occupied") {
      updateData.admitted_patient_name = admittedPatientName?.trim() || null;
      updateData.admission_date = new Date().toISOString().split("T")[0];
    } else {
      updateData.admitted_patient_name = null;
      updateData.admission_date = null;
    }
    const { data, error } = await supabase.from("beds").update(updateData).eq("id", bedId).select().single();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabaseBed(
  bedId: string,
  payload: {
    bedNumber: string;
    wardType: string;
    floorNumber: number;
    dailyRate: number;
  },
) {
  try {
    const { data, error } = await supabase
      .from("beds")
      .update({
        bed_number: payload.bedNumber,
        ward_type: payload.wardType,
        floor_number: payload.floorNumber,
        daily_rate: payload.dailyRate,
      })
      .eq("id", bedId)
      .select()
      .single();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabaseWard(
  currentWardType: string,
  payload: { wardType: string; floorNumber: number; dailyRate: number },
) {
  try {
    const { data, error } = await supabase
      .from("beds")
      .update({
        ward_type: payload.wardType,
        floor_number: payload.floorNumber,
        daily_rate: payload.dailyRate,
      })
      .eq("ward_type", currentWardType)
      .select();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function createSupabaseBed(payload: {
  bedNumber: string;
  wardType: string;
  floorNumber?: number;
  dailyRate?: number;
  hospitalId?: string;
}) {
  try {
    const { data, error } = await supabase
      .from("beds")
      .insert({
        bed_number: payload.bedNumber,
        ward_type: payload.wardType,
        floor_number: payload.floorNumber || 1,
        daily_rate: payload.dailyRate || 0,
        hospital_id: payload.hospitalId || null,
        status: "Available",
      })
      .select()
      .single();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// Creates several beds of the same ward type at once — used by the Admin
// "Add Ward / Beds" form so an admin can stand up a new ward in one action.
export async function createSupabaseBedsBulk(payload: {
  wardType: string;
  count: number;
  floorNumber?: number;
  dailyRate?: number;
  hospitalId?: string;
}) {
  try {
    const prefix = payload.wardType.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "") || "WRD";
    const rows = Array.from({ length: payload.count }, (_, i) => ({
      bed_number: `${prefix}-${Date.now().toString().slice(-4)}-${String(i + 1).padStart(2, "0")}`,
      ward_type: payload.wardType,
      floor_number: payload.floorNumber || 1,
      daily_rate: payload.dailyRate || 0,
      hospital_id: payload.hospitalId || null,
      status: "Available",
    }));

    const { data, error } = await supabase.from("beds").insert(rows).select();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteSupabaseBed(bedId: string) {
  try {
    const { data, error } = await supabase.from("beds").delete().eq("id", bedId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 4. LABORATORY TEST REQUISITIONS SERVICE
// ============================================================================

export async function fetchSupabaseLabOrders(patientName?: string) {
  try {
    let query = supabase.from("lab_test_orders").select("*").order("created_at", { ascending: false });
    if (patientName?.trim()) query = query.eq("patient_name", patientName.trim());
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((o: any) => ({
      id: o.id,
      testId: o.test_id,
      patientName: o.patient_name,
      patientAge: o.patient_age,
      doctorName: o.doctor_name,
      testName: o.test_name,
      category: o.category,
      priority: o.priority,
      status: o.status,
      date: o.created_at ? new Date(o.created_at).toISOString().split("T")[0] : "",
      containerId: o.container_id,
      collectionTime: o.collection_time,
    }));
  } catch (e) {
    console.warn("fetchSupabaseLabOrders error:", e);
    return [];
  }
}

export async function createSupabaseLabOrder(payload: {
  testId: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  testName: string;
  category: string;
  priority: string;
}) {
  try {
    const { data, error } = await supabase.from("lab_test_orders").insert({
      test_id: payload.testId,
      patient_name: payload.patientName,
      patient_age: payload.patientAge,
      doctor_name: payload.doctorName,
      test_name: payload.testName,
      category: payload.category,
      priority: payload.priority,
      status: "Sample Pending",
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabaseLabOrderStatus(testId: string, status: string) {
  try {
    const { data, error } = await supabase.from("lab_test_orders").update({ status }).eq("test_id", testId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 5. LABORATORY CATALOG SERVICE
// ============================================================================

export async function fetchSupabaseLabCatalog() {
  try {
    const { data, error } = await supabase.from("lab_catalog").select("*").order("test_name", { ascending: true });
    if (error || !data) return [];
    return data.map((t: any) => ({
      id: t.id,
      testCode: t.test_code,
      testName: t.test_name,
      department: t.department,
      specimenType: t.specimen_type,
      price: Number(t.price),
      tatHours: t.tat_hours,
      referenceRange: t.reference_range,
    }));
  } catch (e) {
    console.warn("fetchSupabaseLabCatalog error:", e);
    return [];
  }
}

export async function createSupabaseLabTest(payload: {
  testCode: string;
  testName: string;
  department: string;
  specimenType: string;
  price: number;
  tatHours: number;
  referenceRange: string;
}) {
  try {
    const { data, error } = await supabase.from("lab_catalog").insert({
      test_code: payload.testCode,
      test_name: payload.testName,
      department: payload.department,
      specimen_type: payload.specimenType,
      price: payload.price,
      tat_hours: payload.tatHours,
      reference_range: payload.referenceRange,
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 6. PHARMACY ORDERS SERVICE
// ============================================================================

export async function fetchSupabasePharmacyOrders(patientName?: string) {
  try {
    let query = supabase.from("pharmacy_orders").select("*").order("created_at", { ascending: false });
    if (patientName?.trim()) query = query.eq("patient_name", patientName.trim());
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((p: any) => ({
      id: p.id,
      orderId: p.order_id,
      patientName: p.patient_name,
      patientContact: p.patient_contact,
      medicines: p.medicines || [],
      totalAmount: Number(p.total_amount),
      prescriptionStatus: p.prescription_status,
      orderStatus: p.order_status,
      orderTime: p.created_at ? new Date(p.created_at).toLocaleTimeString() : "",
    }));
  } catch (e) {
    console.warn("fetchSupabasePharmacyOrders error:", e);
    return [];
  }
}

export async function createSupabasePharmacyOrder(payload: {
  orderId: string;
  patientName: string;
  patientContact: string;
  medicines: any[];
  totalAmount: number;
}) {
  try {
    const { data, error } = await supabase.from("pharmacy_orders").insert({
      order_id: payload.orderId,
      patient_name: payload.patientName,
      patient_contact: payload.patientContact,
      medicines: payload.medicines,
      total_amount: payload.totalAmount,
      prescription_status: "Verified",
      order_status: "Processing",
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabasePharmacyOrderStatus(orderId: string, status: string) {
  try {
    const { data, error } = await supabase.from("pharmacy_orders").update({ order_status: status }).eq("order_id", orderId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 7. PHARMACY MEDICINES & INVENTORY SERVICE
// ============================================================================

export async function fetchSupabasePharmacyMedicines() {
  try {
    const { data, error } = await supabase.from("pharmacy_inventory").select("*").order("medicine_name", { ascending: true });
    if (error || !data) return [];
    return data.map((m: any) => ({
      id: m.id,
      medicineCode: m.medicine_code,
      medicineName: m.medicine_name,
      genericName: m.generic_name,
      category: m.category,
      dosageStrength: m.dosage_strength,
      pricePerUnit: Number(m.price_per_unit),
      stock: m.stock,
      reorderLevel: m.reorder_level,
      manufacturer: m.manufacturer,
      stockStatus: m.stock_status,
    }));
  } catch (e) {
    console.warn("fetchSupabasePharmacyMedicines error:", e);
    return [];
  }
}

export async function createSupabasePharmacyMedicine(payload: {
  medicineCode: string;
  medicineName: string;
  genericName: string;
  category: string;
  dosageStrength: string;
  pricePerUnit: number;
  stock: number;
  reorderLevel: number;
  manufacturer: string;
}) {
  try {
    const { data, error } = await supabase.from("pharmacy_inventory").insert({
      medicine_code: payload.medicineCode,
      medicine_name: payload.medicineName,
      generic_name: payload.genericName,
      category: payload.category,
      dosage_strength: payload.dosageStrength,
      price_per_unit: payload.pricePerUnit,
      stock: payload.stock,
      reorder_level: payload.reorderLevel,
      manufacturer: payload.manufacturer,
      stock_status: payload.stock >= payload.reorderLevel ? "In Stock" : "Low Stock",
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabasePharmacyMedicineStock(medicineId: string, newStock: number) {
  try {
    const { data, error } = await supabase
      .from("pharmacy_inventory")
      .update({ stock: newStock })
      .eq("id", medicineId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 8. BLOOD BANK REPOSITORY SERVICE
// ============================================================================

export async function fetchSupabaseBloodInventory() {
  try {
    const { data, error } = await supabase.from("blood_inventory").select("*");
    if (error || !data) return [];
    return data.map((b: any) => ({
      group: b.blood_group,
      availableUnits: b.available_units,
      reservedUnits: b.reserved_units,
      criticalThreshold: b.critical_threshold,
      status: b.status,
    }));
  } catch (e) {
    console.warn("fetchSupabaseBloodInventory error:", e);
    return [];
  }
}

export async function updateSupabaseBloodInventory(bloodGroup: string, availableUnits: number, reservedUnits: number) {
  try {
    const { data, error } = await supabase
      .from("blood_inventory")
      .update({ available_units: availableUnits, reserved_units: reservedUnits })
      .eq("blood_group", bloodGroup);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function fetchSupabaseBloodRequests(patientName?: string) {
  try {
    let query = supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
    if (patientName?.trim()) query = query.eq("patient_name", patientName.trim());
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      requestId: r.request_id,
      patientName: r.patient_name,
      patientAge: r.patient_age,
      bloodGroup: r.blood_group,
      unitsNeeded: r.units_needed,
      hospitalName: r.hospital_name,
      doctorName: r.doctor_name,
      requiredDate: r.required_date,
      urgency: r.urgency,
      status: r.status,
    }));
  } catch (e) {
    console.warn("fetchSupabaseBloodRequests error:", e);
    return [];
  }
}

export async function createSupabaseBloodRequest(payload: {
  requestId: string;
  patientName: string;
  patientAge: number;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  doctorName: string;
  urgency: string;
}) {
  try {
    const { data, error } = await supabase
      .from("blood_requests")
      .insert({
        request_id: payload.requestId,
        patient_name: payload.patientName,
        patient_age: payload.patientAge,
        blood_group: payload.bloodGroup,
        units_needed: payload.unitsNeeded,
        hospital_name: payload.hospitalName,
        doctor_name: payload.doctorName,
        urgency: payload.urgency,
        status: "Pending",
      })
      .select()
      .single();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabaseBloodRequestStatus(requestId: string, status: string) {
  try {
    const { data, error } = await supabase.from("blood_requests").update({ status }).eq("request_id", requestId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 9. BLOOD DONORS SERVICE
// ============================================================================

export async function fetchSupabaseBloodDonors() {
  try {
    const { data, error } = await supabase.from("blood_donors").select("*").order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      donorId: d.donor_id,
      name: d.name,
      bloodGroup: d.blood_group,
      phone: d.phone,
      email: d.email,
      lastDonationDate: d.last_donation_date,
      totalDonations: d.total_donations,
      eligibilityStatus: d.eligibility_status,
    }));
  } catch (e) {
    console.warn("fetchSupabaseBloodDonors error:", e);
    return [];
  }
}

export async function createSupabaseBloodDonor(payload: {
  donorId: string;
  name: string;
  bloodGroup: string;
  phone: string;
  email?: string;
}) {
  try {
    const { data, error } = await supabase.from("blood_donors").insert({
      donor_id: payload.donorId,
      name: payload.name,
      blood_group: payload.bloodGroup,
      phone: payload.phone,
      email: payload.email || "",
      total_donations: 1,
      eligibility_status: "Eligible",
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 10. EMERGENCY SOS DISPATCHES SERVICE
// ============================================================================

export async function fetchSupabaseSOS(patientName?: string) {
  try {
    let query = supabase.from("sos_requests").select("*").order("created_at", { ascending: false });
    if (patientName?.trim()) query = query.eq("patient_name", patientName.trim());
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((s: any) => ({
      id: s.id,
      requestId: s.request_id,
      patientName: s.patient_name,
      patientPhone: s.patient_phone,
      emergencyType: s.emergency_type,
      location: s.location,
      destinationHospital: s.destination_hospital,
      assignedDriver: s.assigned_driver,
      eta: s.eta,
      ambulanceStatus: s.ambulance_status,
      requestTime: s.created_at || "",
      createdAt: s.created_at || "",
    }));
  } catch (e) {
    console.warn("fetchSupabaseSOS error:", e);
    return [];
  }
}

export async function createSupabaseSOS(payload: {
  requestId: string;
  patientName: string;
  patientPhone: string;
  emergencyType: string;
  location: string;
  destinationHospital: string;
  assignedDriver: string;
  eta: string;
}) {
  try {
    const { data, error } = await supabase
      .from("sos_requests")
      .insert({
        request_id: payload.requestId,
        patient_name: payload.patientName,
        patient_phone: payload.patientPhone,
        emergency_type: payload.emergencyType,
        location: payload.location,
        destination_hospital: payload.destinationHospital,
        assigned_driver: payload.assignedDriver,
        eta: payload.eta,
        ambulance_status: "Going to Pickup",
      });

    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateSupabaseSOSStatus(requestId: string, status: string) {
  try {
    const { data, error } = await supabase.from("sos_requests").update({ ambulance_status: status }).eq("request_id", requestId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 11. RESQ ACCIDENT ALERTS SERVICE
// ============================================================================

export type ResQAccidentAlert = {
  id: string;
  alertId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  severity: string;
  impactType: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  occupants: number;
  injuries: number;
  fireRisk: boolean;
  medicalAssistanceNeeded: boolean;
  status: string;
  createdAt: string;
};

function mapResQAlert(row: any): ResQAccidentAlert {
  return {
    id: String(row.id),
    alertId: row.alert_id,
    vehicleId: row.vehicle_id,
    vehiclePlate: row.vehicle_plate || "",
    driverName: row.driver_name || "",
    driverPhone: row.driver_phone || "",
    severity: row.severity || "High",
    impactType: row.impact_type || "Collision",
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    occupants: Number(row.occupants || 0),
    injuries: Number(row.injuries || 0),
    fireRisk: Boolean(row.fire_risk),
    medicalAssistanceNeeded: Boolean(row.medical_assistance_needed),
    status: row.status || "New",
    createdAt: row.created_at || "",
  };
}

export async function fetchResQAccidentAlerts() {
  try {
    const { data, error } = await supabase.from("resq_accident_alerts").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) {
      console.warn("fetchResQAccidentAlerts error:", error);
      return [];
    }
    return (data || []).map(mapResQAlert);
  } catch (error) {
    console.warn("fetchResQAccidentAlerts error:", error);
    return [];
  }
}

export async function createDemoResQAccidentAlert() {
  const alertId = `RESQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
  const payload = {
    alert_id: alertId,
    vehicle_id: `VEH-${Math.floor(100 + Math.random() * 900)}`,
    vehicle_plate: `DHAKA-METRO-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}`,
    driver_name: "Demo ResQ Driver",
    driver_phone: "+880 1700 000000",
    severity: "Critical",
    impact_type: "High-impact collision",
    location: "Demo Accident Zone, Dhaka",
    latitude: 23.8103,
    longitude: 90.4125,
    occupants: 3,
    injuries: 2,
    fire_risk: true,
    medical_assistance_needed: true,
    status: "New",
  };
  try {
    const { data, error } = await supabase.from("resq_accident_alerts").insert(payload).select("*").single();
    return { data: data ? mapResQAlert(data) : null, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateResQAccidentStatus(alertId: string, status: string) {
  try {
    const { data, error } = await supabase.from("resq_accident_alerts").update({ status }).eq("alert_id", alertId).select("*").maybeSingle();
    return { data: data ? mapResQAlert(data) : null, error };
  } catch (error) {
    return { data: null, error };
  }
}

// ============================================================================
// 12. PROFILES SERVICE (staff & patient directory)
// ============================================================================

function mapProfile(p: any) {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    role: p.role,
    age: p.age,
    gender: p.gender,
    bloodGroup: p.blood_group,
    address: p.address,
    avatarUrl: p.avatar_url,
    badgeId: p.badge_id,
    specialty: p.specialty,
    licenseNo: p.license_no,
    workingHours: p.working_hours,
    patientCapacity: p.patient_capacity,
    onlineBookingEnabled: p.online_booking_enabled,
    isFeatured: p.is_featured || false,
  };
}

export async function fetchSupabaseProfiles(role?: string) {
  try {
    let query = supabase.from("profiles").select("*");
    if (role) {
      query = query.eq("role", role);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) {
      console.error("fetchSupabaseProfiles: profiles SELECT failed:", error);
      return [];
    }
    return (data || []).map(mapProfile);
  } catch (e) {
    console.warn("fetchSupabaseProfiles error:", e);
    return [];
  }
}

export async function fetchSupabaseUserProfile(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error || !data) return null;
    return mapProfile(data);
  } catch (e) {
    console.warn("fetchSupabaseUserProfile error:", e);
    return null;
  }
}

// Home page "Meet Our Doctors" section — Admin curates which doctors show
// up here (see UserManagementModule "Featured on Home" toggle).
export async function fetchSupabaseFeaturedDoctors(limit = 4) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "Doctor")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map(mapProfile);
  } catch (e) {
    console.warn("fetchSupabaseFeaturedDoctors error:", e);
    return [];
  }
}

export async function updateSupabaseProfile(userId: string, payload: any) {
  try {
    const { data, error } = await supabase.from("profiles").update(payload).eq("id", userId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteSupabaseProfile(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").delete().eq("id", userId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 12. AUDIT LOGS SERVICE
// ============================================================================

export async function fetchSupabaseAuditLogs() {
  try {
    const { data, error } = await supabase.from("audit_logs").select("*").order("timestamp", { ascending: false });
    if (error || !data) return [];
    return data.map((log: any) => ({
      id: log.id,
      user: log.user_name,
      role: log.role,
      action: log.action,
      module: log.action,
      timestamp: log.timestamp,
      ipAddress: log.ip_address,
      details: log.details,
    }));
  } catch (e) {
    console.warn("fetchSupabaseAuditLogs error:", e);
    return [];
  }
}

export async function createSupabaseAuditLog(payload: {
  userName: string;
  role: string;
  action: string;
  ipAddress?: string;
  details?: string;
}) {
  try {
    const { data, error } = await supabase.from("audit_logs").insert({
      user_name: payload.userName,
      role: payload.role,
      action: payload.action,
      ip_address: payload.ipAddress || "127.0.0.1",
      details: payload.details || "",
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 13. HOME FEEDBACK SERVICE
// ============================================================================
export type HomeFeedback = {
  id: string;
  name: string;
  feedback: string;
  createdAt: string;
};

export async function createSupabaseFeedback(payload: { name: string; feedback: string }) {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .insert({ name: payload.name.trim(), feedback: payload.feedback.trim() })
      .select("id, name, feedback, created_at")
      .single();
    return {
      data: data ? { id: data.id, name: data.name, feedback: data.feedback, createdAt: data.created_at } : null,
      error,
    };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function fetchSupabaseFeedback(): Promise<HomeFeedback[]> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("id, name, feedback, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((item: any) => ({ id: item.id, name: item.name, feedback: item.feedback, createdAt: item.created_at }));
  } catch (err) {
    console.warn("fetchSupabaseFeedback error:", err);
    return [];
  }
}

export async function deleteSupabaseFeedback(feedbackId: string) {
  try {
    const { data, error } = await supabase.from("feedback").delete().eq("id", feedbackId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 14. DYNAMIC MEDIQ NOTIFICATIONS
// ============================================================================
export interface SupabaseNotification {
  id: string;
  recipientId: string;
  senderId?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function mapSupabaseNotification(row: any): SupabaseNotification {
  return {
    id: row.id,
    recipientId: row.recipient_id,
    senderId: row.sender_id || undefined,
    title: row.title,
    message: row.message,
    type: row.notification_type || "general",
    read: Boolean(row.read_at),
    createdAt: row.created_at,
  };
}

export async function fetchSupabaseNotifications(userId: string, limit = 100) {
  try {
    const { data, error } = await supabase
      .from("mediq_notifications")
      .select("*")
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { data: (data || []).map(mapSupabaseNotification), error: null };
  } catch (error: any) {
    console.warn("fetchSupabaseNotifications error:", error);
    return { data: [], error };
  }
}

export async function sendSupabaseCustomNotification(payload: {
  senderId?: string;
  recipientIds: string[];
  title: string;
  message: string;
  type?: string;
}) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const senderId = sessionData.session?.user.id || payload.senderId;
    if (!senderId) throw new Error("Your authenticated session is not ready. Please sign in again.");
    const recipientIds = Array.from(new Set(payload.recipientIds.filter(Boolean)));
    if (recipientIds.length === 0) throw new Error("Select at least one recipient.");
    if (!payload.title.trim() || !payload.message.trim()) throw new Error("Title and message are required.");
    const { data, error } = await supabase.functions.invoke("send-mediq-notifications", {
      body: {
        recipientIds,
        title: payload.title.trim(),
        message: payload.message.trim(),
        type: payload.type || "general",
      },
    });
    const functionError = error || (data?.error ? { message: data.error } : null);
    return { data: (data?.data || []).map(mapSupabaseNotification), error: functionError };
  } catch (error: any) {
    return { data: [], error };
  }
}

export async function markSupabaseNotificationRead(notificationId: string, userId: string) {
  try {
    const { error } = await supabase
      .from("mediq_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)
      .eq("recipient_id", userId);
    return { error };
  } catch (error: any) {
    return { error };
  }
}

export async function markAllSupabaseNotificationsRead(userId: string) {
  try {
    const { error } = await supabase
      .from("mediq_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("recipient_id", userId)
      .is("read_at", null);
    return { error };
  } catch (error: any) {
    return { error };
  }
}
