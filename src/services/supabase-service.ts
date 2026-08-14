import { supabase } from "@/lib/supabase";
import { initialBloodGroups, initialBloodRequests } from "@/data/blood-bank-data";
import { initialLabOrders, initialLabCatalog } from "@/data/lab-staff-data";
import { initialPharmacyOrders, initialMedicines, initialSuppliers } from "@/data/pharmacy-data";
import { initialNetworkHospitals, initialAdminSOS, initialSystemUsers, initialAdminAuditLogs } from "@/data/admin-data";
import { initialWardBeds } from "@/data/nurse-data";
import { initialAppointments } from "@/data/doctor-data";

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

export async function registerWithSupabase(params: {
  name: string;
  email: string;
  phone: string;
  role: string;
  passwordText: string;
  bloodGroup?: string;
  address?: string;
}) {
  try {
    const email = params.email && params.email.includes("@")
      ? params.email
      : `${params.phone.replace(/\D/g, "") || Date.now()}@mediq.health`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: params.passwordText,
      options: {
        data: {
          name: params.name,
          phone: params.phone,
          role: params.role,
          bloodGroup: params.bloodGroup || "O+",
          address: params.address || "",
        },
      },
    });

    if (authError) {
      console.warn("Supabase Auth signUp note:", authError.message);
    }

    // Upsert into public.profiles
    if (authData?.user?.id) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        name: params.name,
        email,
        phone: params.phone,
        role: params.role,
        blood_group: params.bloodGroup || "O+",
        address: params.address || "",
      });
    }

    return { data: authData, error: authError };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 2. APPOINTMENTS SERVICE
// ============================================================================

export async function fetchSupabaseAppointments() {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return initialAppointments;
    }

    return data.map((a: any) => ({
      id: a.id,
      patientId: a.patient_id || a.appointment_id,
      patientName: a.patient_name,
      patientAge: a.patient_age || 30,
      patientGender: "Other",
      patientBloodGroup: "O+",
      appointmentTime: a.appointment_time,
      appointmentType: "In-Person",
      department: a.department || a.specialty,
      status: a.status || "Scheduled",
      serialNumber: a.serial_number || 1,
      serialToken: a.serial_token || `Serial #${a.serial_number}`,
      reason: "General consultation and checkup",
      patientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    }));
  } catch (e) {
    console.warn("Using local appointments store:", e);
    return initialAppointments;
  }
}

export async function createSupabaseAppointment(payload: {
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  serialNumber: number;
  serialToken: string;
}) {
  try {
    const { data, error } = await supabase.from("appointments").insert({
      appointment_id: payload.appointmentId,
      patient_name: payload.patientName,
      patient_phone: payload.patientPhone,
      doctor_name: payload.doctorName,
      specialty: payload.specialty,
      appointment_date: payload.appointmentDate,
      appointment_time: payload.appointmentTime,
      serial_number: payload.serialNumber,
      serial_token: payload.serialToken,
      status: "Scheduled",
    });
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
    if (error || !data || data.length === 0) {
      return initialNetworkHospitals;
    }
    return data.map((h: any) => ({
      id: h.id,
      name: h.name,
      location: h.location,
      totalBeds: h.total_beds,
      availableBeds: h.available_beds,
      doctorCount: h.doctor_count,
      emergencyStatus: h.emergency_status,
      occupancyPercent: h.occupancy_percent,
    }));
  } catch (e) {
    return initialNetworkHospitals;
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
      occupancy_percent: Math.round(((payload.totalBeds - payload.availableBeds) / payload.totalBeds) * 100),
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function fetchSupabaseBeds() {
  try {
    const { data, error } = await supabase.from("beds").select("*");
    if (error || !data || data.length === 0) {
      return initialWardBeds;
    }
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
    }));
  } catch (e) {
    return initialWardBeds;
  }
}

// ============================================================================
// 4. LABORATORY TEST REQUISITIONS SERVICE
// ============================================================================

export async function fetchSupabaseLabOrders() {
  try {
    const { data, error } = await supabase.from("lab_test_orders").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return initialLabOrders;
    }
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
      date: o.created_at ? new Date(o.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      containerId: o.container_id,
      collectionTime: o.collection_time,
    }));
  } catch (e) {
    return initialLabOrders;
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

// ============================================================================
// 5. PHARMACY ORDERS & MEDICINES SERVICE
// ============================================================================

export async function fetchSupabasePharmacyOrders() {
  try {
    const { data, error } = await supabase.from("pharmacy_orders").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return initialPharmacyOrders;
    }
    return data.map((p: any) => ({
      id: p.id,
      orderId: p.order_id,
      patientName: p.patient_name,
      patientContact: p.patient_contact,
      medicines: p.medicines || [],
      totalAmount: Number(p.total_amount),
      prescriptionStatus: p.prescription_status,
      orderStatus: p.order_status,
      orderTime: p.created_at ? new Date(p.created_at).toLocaleTimeString() : "Just now",
    }));
  } catch (e) {
    return initialPharmacyOrders;
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

// ============================================================================
// 6. BLOOD BANK REPOSITORY SERVICE
// ============================================================================

export async function fetchSupabaseBloodInventory() {
  try {
    const { data, error } = await supabase.from("blood_inventory").select("*");
    if (error || !data || data.length === 0) {
      return initialBloodGroups;
    }
    return data.map((b: any) => ({
      group: b.blood_group,
      availableUnits: b.available_units,
      reservedUnits: b.reserved_units,
      criticalThreshold: b.critical_threshold,
      status: b.status,
    }));
  } catch (e) {
    return initialBloodGroups;
  }
}

export async function fetchSupabaseBloodRequests() {
  try {
    const { data, error } = await supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return initialBloodRequests;
    }
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
    return initialBloodRequests;
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
    const { data, error } = await supabase.from("blood_requests").insert({
      request_id: payload.requestId,
      patient_name: payload.patientName,
      patient_age: payload.patientAge,
      blood_group: payload.bloodGroup,
      units_needed: payload.unitsNeeded,
      hospital_name: payload.hospitalName,
      doctor_name: payload.doctorName,
      urgency: payload.urgency,
      status: "Pending",
    });
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ============================================================================
// 7. EMERGENCY SOS DISPATCHES SERVICE
// ============================================================================

export async function fetchSupabaseSOS() {
  try {
    const { data, error } = await supabase.from("sos_requests").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return initialAdminSOS;
    }
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
    }));
  } catch (e) {
    return initialAdminSOS;
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
    const { data, error } = await supabase.from("sos_requests").insert({
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
