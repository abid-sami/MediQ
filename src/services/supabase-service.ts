import { supabase } from "@/lib/supabase";


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
      return [];
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
    return [];
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
      return [];
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
      return [];
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
    return [];
  }
}

// ============================================================================
// 4. LABORATORY TEST REQUISITIONS SERVICE
// ============================================================================

export async function fetchSupabaseLabOrders() {
  try {
    const { data, error } = await supabase.from("lab_test_orders").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
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

// ============================================================================
// 5. PHARMACY ORDERS & MEDICINES SERVICE
// ============================================================================

export async function fetchSupabasePharmacyOrders() {
  try {
    const { data, error } = await supabase.from("pharmacy_orders").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
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

// ============================================================================
// 6. BLOOD BANK REPOSITORY SERVICE
// ============================================================================

export async function fetchSupabaseBloodInventory() {
  try {
    const { data, error } = await supabase.from("blood_inventory").select("*");
    if (error || !data || data.length === 0) {
      return [];
    }
    return data.map((b: any) => ({
      group: b.blood_group,
      availableUnits: b.available_units,
      reservedUnits: b.reserved_units,
      criticalThreshold: b.critical_threshold,
      status: b.status,
    }));
  } catch (e) {
    return [];
  }
}

export async function fetchSupabaseBloodRequests() {
  try {
    const { data, error } = await supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
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
      return [];
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

// ============================================================================
// 8. PHARMACY MEDICINES & INVENTORY SERVICE
// ============================================================================

export async function fetchSupabasePharmacyMedicines() {
  try {
    const { data, error } = await supabase.from("pharmacy_inventory").select("*").order("medicine_name", { ascending: true });
    if (error || !data || data.length === 0) {
      return [];
    }
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
// 9. LABORATORY CATALOG SERVICE
// ============================================================================

export async function fetchSupabaseLabCatalog() {
  try {
    const { data, error } = await supabase.from("lab_catalog").select("*").order("test_name", { ascending: true });
    if (error || !data || data.length === 0) {
      return [];
    }
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
// 10. USER PROFILES & SYSTEM USERS SERVICE
// ============================================================================

export async function fetchSupabaseProfiles(role?: string) {
  try {
    let query = supabase.from("profiles").select("*");
    if (role) {
      query = query.eq("role", role);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data) {
      return [];
    }
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      role: p.role,
      bloodGroup: p.blood_group,
      address: p.address,
      avatarUrl: p.avatar_url,
      badgeId: p.badge_id,
      specialty: p.specialty,
      licenseNo: p.license_no,
      workingHours: p.working_hours,
      patientCapacity: p.patient_capacity,
      onlineBookingEnabled: p.online_booking_enabled,
    }));
  } catch (e) {
    return [];
  }
}

export async function fetchSupabaseUserProfile(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) {
      return null;
    }
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      bloodGroup: data.blood_group,
      address: data.address,
      avatarUrl: data.avatar_url,
      badgeId: data.badge_id,
      specialty: data.specialty,
      licenseNo: data.license_no,
      workingHours: data.working_hours,
      patientCapacity: data.patient_capacity,
      onlineBookingEnabled: data.online_booking_enabled,
    };
  } catch (e) {
    return null;
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

// ============================================================================
// 11. AUDIT LOGS SERVICE
// ============================================================================

export async function fetchSupabaseAuditLogs() {
  try {
    const { data, error } = await supabase.from("audit_logs").select("*").order("timestamp", { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
    }
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
// 12. BLOOD DONORS SERVICE
// ============================================================================

export async function fetchSupabaseBloodDonors() {
  try {
    const { data, error } = await supabase.from("blood_donors").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return [];
    }
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
// 13. UPDATE & DELETE OPERATIONS
// ============================================================================

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

export async function updateSupabaseBedStatus(bedId: string, status: string, admittedPatientName?: string) {
  try {
    const updateData: any = { status };
    if (admittedPatientName) {
      updateData.admitted_patient_name = admittedPatientName;
      updateData.admission_date = new Date().toISOString().split("T")[0];
    }
    const { data, error } = await supabase.from("beds").update(updateData).eq("id", bedId);
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

export async function updateSupabasePharmacyOrderStatus(orderId: string, status: string) {
  try {
    const { data, error } = await supabase.from("pharmacy_orders").update({ order_status: status }).eq("order_id", orderId);
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

export async function updateSupabaseSOSStatus(requestId: string, status: string) {
  try {
    const { data, error } = await supabase.from("sos_requests").update({ ambulance_status: status }).eq("request_id", requestId);
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
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
