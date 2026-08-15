/**
 * MediQ Hospital Indoor Navigation & Floor Plan Store
 * Provides multi-floor layout coordinates, locations, and predefined step-by-step routes.
 */

export type FloorId = "Ground Floor" | "1st Floor" | "2nd Floor" | "3rd Floor";

export type LocationCategory =
  | "Emergency"
  | "Reception"
  | "Ward"
  | "ICU"
  | "Pharmacy"
  | "Laboratory"
  | "Blood Bank"
  | "Doctor Chambers"
  | "Elevators & Stairs"
  | "Facilities";

export interface HospitalLocation {
  id: string;
  name: string;
  category: LocationCategory;
  floor: FloorId;
  wing: string; // e.g. "East Wing", "West Wing", "Central Lobby", "North Corridor"
  roomNumber: string; // e.g. "Room G-101", "Room 104-A"
  description: string;
  iconName: string;
  x: number; // Percentage 0-100 on floor map
  y: number;
  w: number;
  h: number;
  status?: "available" | "limited" | "full" | "operational";
  color?: string;
  predefinedRoutes: {
    fromEntrance: string; // e.g. "Main Entrance", "Emergency Gate"
    steps: string[];
    pathPoints: { x: number; y: number }[];
    estimatedMinutes: number;
  }[];
}

export const defaultLocations: HospitalLocation[] = [
  // ===================== GROUND FLOOR =====================
  {
    id: "loc-main-entrance",
    name: "Main Hospital Entrance",
    category: "Facilities",
    floor: "Ground Floor",
    wing: "South Entrance",
    roomNumber: "Gate 1",
    description: "Primary public entrance, visitor screening, and patient drop-off concourse.",
    iconName: "DoorOpen",
    x: 42,
    y: 86,
    w: 16,
    h: 12,
    status: "operational",
    color: "#0d9488",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: ["Main Entrance (Gate 1) - You are here"],
        pathPoints: [{ x: 50, y: 92 }],
        estimatedMinutes: 0,
      },
    ],
  },
  {
    id: "loc-reception",
    name: "Central Reception & Helpdesk",
    category: "Reception",
    floor: "Ground Floor",
    wing: "Central Lobby",
    roomNumber: "Room G-01",
    description: "General patient inquiries, registration counters, appointments check-in, and visitor passes.",
    iconName: "Compass",
    x: 38,
    y: 58,
    w: 24,
    h: 18,
    status: "operational",
    color: "#3b82f6",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Hospital Entrance (Gate 1)",
          "Walk straight ahead 15 meters into the Central Grand Lobby",
          "Arrive at Central Reception & Helpdesk on your left (Room G-01)",
        ],
        pathPoints: [
          { x: 50, y: 90 },
          { x: 50, y: 67 },
        ],
        estimatedMinutes: 1,
      },
      {
        fromEntrance: "Emergency Gate",
        steps: [
          "Enter through Emergency Gate 2",
          "Follow the blue floor line east towards the central corridor",
          "Turn right into Central Lobby to reach Reception (Room G-01)",
        ],
        pathPoints: [
          { x: 12, y: 70 },
          { x: 30, y: 70 },
          { x: 50, y: 67 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-emergency",
    name: "Emergency & Trauma Center",
    category: "Emergency",
    floor: "Ground Floor",
    wing: "West Wing",
    roomNumber: "Room G-02",
    description: "24/7 Acute critical trauma care, resuscitation bays, ambulance dispatch bay, and emergency triage.",
    iconName: "Siren",
    x: 4,
    y: 60,
    w: 26,
    h: 30,
    status: "operational",
    color: "#ef4444",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Entrance (Gate 1)",
          "Turn immediately Left into the West Wing Emergency Corridor",
          "Follow red floor lighting markers straight for 20 meters",
          "Arrive at Emergency & Trauma Center (Room G-02)",
        ],
        pathPoints: [
          { x: 50, y: 90 },
          { x: 50, y: 80 },
          { x: 17, y: 80 },
          { x: 17, y: 75 },
        ],
        estimatedMinutes: 1,
      },
      {
        fromEntrance: "Emergency Gate",
        steps: [
          "Enter directly through Emergency Dedicated Gate 2",
          "Immediate access into Emergency & Trauma Center Bays",
        ],
        pathPoints: [
          { x: 6, y: 88 },
          { x: 17, y: 75 },
        ],
        estimatedMinutes: 1,
      },
    ],
  },
  {
    id: "loc-pharmacy-g",
    name: "Central Outpatient Pharmacy",
    category: "Pharmacy",
    floor: "Ground Floor",
    wing: "East Wing",
    roomNumber: "Room G-03",
    description: "24/7 Prescription medication dispensing, OTC health supplies, and pharmaceutical counseling.",
    iconName: "Pill",
    x: 70,
    y: 60,
    w: 26,
    h: 28,
    status: "operational",
    color: "#10b981",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Entrance (Gate 1)",
          "Turn Right towards the East Wing Corridor",
          "Walk past the coffee kiosk 18 meters",
          "Arrive at Central Outpatient Pharmacy (Room G-03) on your right",
        ],
        pathPoints: [
          { x: 50, y: 90 },
          { x: 50, y: 80 },
          { x: 83, y: 80 },
          { x: 83, y: 74 },
        ],
        estimatedMinutes: 1,
      },
    ],
  },
  {
    id: "loc-blood-bank",
    name: "Blood Bank & Transfusion Medicine",
    category: "Blood Bank",
    floor: "Ground Floor",
    wing: "North-West Wing",
    roomNumber: "Room G-04",
    description: "Blood donation registry, emergency blood component testing, cross-matching, and apheresis collection.",
    iconName: "Droplet",
    x: 4,
    y: 10,
    w: 28,
    h: 38,
    status: "operational",
    color: "#dc2626",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Entrance and pass Central Reception",
          "Take the West North Corridor past Elevator Bank A",
          "Follow the red droplet indicators for 30 meters",
          "Arrive at Blood Bank & Transfusion Suite (Room G-04)",
        ],
        pathPoints: [
          { x: 50, y: 90 },
          { x: 50, y: 52 },
          { x: 18, y: 52 },
          { x: 18, y: 29 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-elevator-g",
    name: "Elevator Bank A (Central)",
    category: "Elevators & Stairs",
    floor: "Ground Floor",
    wing: "Central Core",
    roomNumber: "Elevator Tower 1-4",
    description: "High-speed bed and passenger elevators connecting Ground Floor to 1st, 2nd, 3rd, and Roof Helipad.",
    iconName: "Layers",
    x: 40,
    y: 20,
    w: 20,
    h: 24,
    status: "operational",
    color: "#6366f1",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Entrance",
          "Walk straight past Reception through Central Lobby",
          "Arrive at Central Elevator Bank A directly ahead (Tower 1-4)",
        ],
        pathPoints: [
          { x: 50, y: 90 },
          { x: 50, y: 32 },
        ],
        estimatedMinutes: 1,
      },
    ],
  },
  {
    id: "loc-stairs-g",
    name: "Staircase Tower 1",
    category: "Elevators & Stairs",
    floor: "Ground Floor",
    wing: "East Core",
    roomNumber: "Stairs E1",
    description: "Emergency fire-rated stairwell providing direct access to Floors 1, 2, and 3.",
    iconName: "Activity",
    x: 72,
    y: 20,
    w: 24,
    h: 24,
    status: "operational",
    color: "#64748b",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter Main Entrance, turn slight right past Central Lobby",
          "Enter East Core vestibule to access Staircase Tower 1",
        ],
        pathPoints: [
          { x: 50, y: 90 },
          { x: 50, y: 52 },
          { x: 84, y: 52 },
          { x: 84, y: 32 },
        ],
        estimatedMinutes: 1,
      },
    ],
  },

  // ===================== 1ST FLOOR =====================
  {
    id: "loc-pathology-lab",
    name: "Pathology & Diagnostic Laboratory",
    category: "Laboratory",
    floor: "1st Floor",
    wing: "West Wing",
    roomNumber: "Room 101",
    description: "Clinical biochemistry, hematology, microbiology, histopathology, and routine sample collection.",
    iconName: "Microscope",
    x: 4,
    y: 10,
    w: 30,
    h: 42,
    status: "operational",
    color: "#059669",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "From Main Entrance, proceed straight to Central Elevator Bank A",
          "Take Elevator to 1st Floor",
          "Exit Elevator and turn Left into West Wing Corridor",
          "Arrive at Pathology & Diagnostic Laboratory (Room 101)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 19, y: 32 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-radiology",
    name: "Radiology & Imaging (MRI / CT / X-Ray)",
    category: "Laboratory",
    floor: "1st Floor",
    wing: "South-West Wing",
    roomNumber: "Room 102",
    description: "Advanced 3T MRI, 128-Slice CT Scan, Digital X-Ray, 4D Ultrasonography, and DEXA Bone Densitometry.",
    iconName: "Activity",
    x: 4,
    y: 58,
    w: 30,
    h: 36,
    status: "operational",
    color: "#0284c7",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "From Main Entrance, take Central Elevator A to 1st Floor",
          "Exit elevator, turn Left, and walk 15 meters down the South-West hallway",
          "Arrive at Radiology & Imaging Department (Room 102)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 76 },
          { x: 19, y: 76 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-doctor-chambers-1",
    name: "Doctor Chambers - OPD Suite A",
    category: "Doctor Chambers",
    floor: "1st Floor",
    wing: "East Wing",
    roomNumber: "Rooms 104 - 108",
    description: "Consultation chambers for Internal Medicine, Dermatology, ENT, Pediatrics, and General Surgery.",
    iconName: "Stethoscope",
    x: 66,
    y: 10,
    w: 30,
    h: 42,
    status: "operational",
    color: "#8b5cf6",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "From Main Entrance, take Central Elevator A to 1st Floor",
          "Exit elevator and turn Right into the East Wing Specialty Clinic Concourse",
          "Doctor Chambers 104-108 are located along the right and left consultation bays",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 81, y: 32 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-dialysis",
    name: "Renal Dialysis Center",
    category: "Ward",
    floor: "1st Floor",
    wing: "South-East Wing",
    roomNumber: "Room 109",
    description: "Hemodialysis stations, peritoneal dialysis suites, and specialized nephrology nursing care.",
    iconName: "HeartPulse",
    x: 66,
    y: 58,
    w: 30,
    h: 36,
    status: "operational",
    color: "#06b6d4",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator A to 1st Floor",
          "Exit elevator, turn Right, then proceed South down the East wing corridor",
          "Arrive at Renal Dialysis Center (Room 109)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 76 },
          { x: 81, y: 76 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-nurse-station-1",
    name: "Nurse Station 1 & Triage Hub",
    category: "Reception",
    floor: "1st Floor",
    wing: "Central Core",
    roomNumber: "Hub 1",
    description: "Floor 1 nursing command, vital signs assessment, patient queue management, and lab test coordination.",
    iconName: "ShieldCheck",
    x: 40,
    y: 58,
    w: 20,
    h: 24,
    status: "operational",
    color: "#ec4899",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator A to 1st Floor",
          "Exit Elevator straight ahead into the Central Floor Lounge",
          "Nurse Station 1 is positioned directly in front of you (Hub 1)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 70 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },

  // ===================== 2ND FLOOR =====================
  {
    id: "loc-cardiology-ward",
    name: "Cardiology Ward & CCU",
    category: "Ward",
    floor: "2nd Floor",
    wing: "East Wing",
    roomNumber: "Room 201 - 204",
    description: "Cardiac Care Unit (CCU), ECG/Echo diagnostics, post-angiography telemetry, and cardiologist suites.",
    iconName: "HeartPulse",
    x: 66,
    y: 10,
    w: 30,
    h: 44,
    status: "operational",
    color: "#e11d48",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Entrance and take Central Elevator Bank A to 2nd Floor",
          "Exit Elevator and turn Right into the East Wing",
          "Walk 20 meters down the Heart Institute Corridor",
          "Arrive at Cardiology Ward & CCU (Rooms 201-204)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 81, y: 32 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-general-ward-2",
    name: "General Inpatient Ward (Male & Female)",
    category: "Ward",
    floor: "2nd Floor",
    wing: "West Wing",
    roomNumber: "Rooms 205 - 212",
    description: "Spacious semi-private and general inpatient beds with continuous nursing monitoring and care.",
    iconName: "Bed",
    x: 4,
    y: 10,
    w: 30,
    h: 44,
    status: "operational",
    color: "#3b82f6",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 2nd Floor",
          "Exit Elevator and turn Left into West Wing",
          "Pass through glass security doors into General Inpatient Ward (Rooms 205-212)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 19, y: 32 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-surgical-suites",
    name: "Modular Operation Theatres (OT 1-4)",
    category: "Facilities",
    floor: "2nd Floor",
    wing: "North-West Wing",
    roomNumber: "OT Complex",
    description: "Laminar airflow sterile surgical suites, robotic surgery consoles, and post-anesthesia recovery (PACU).",
    iconName: "Sparkles",
    x: 4,
    y: 60,
    w: 30,
    h: 34,
    status: "operational",
    color: "#0d9488",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 2nd Floor",
          "Exit elevator, turn Left, and proceed south-west towards the OT Sterile Air-lock Zone",
          "Arrive at Modular Operation Theatres Complex",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 77 },
          { x: 19, y: 77 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-doctor-chambers-2",
    name: "Specialist Doctor Chambers Suite B",
    category: "Doctor Chambers",
    floor: "2nd Floor",
    wing: "South-East Wing",
    roomNumber: "Rooms 215 - 220",
    description: "Consultation chambers for Neurologists, Orthopedic Surgeons, Cardiologists, and Oncologists.",
    iconName: "Stethoscope",
    x: 66,
    y: 60,
    w: 30,
    h: 34,
    status: "operational",
    color: "#7c3aed",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 2nd Floor",
          "Exit elevator, turn Right, then proceed South down the East wing concourse",
          "Arrive at Specialist Doctor Chambers Suite B (Rooms 215-220)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 77 },
          { x: 81, y: 77 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-nurse-station-2",
    name: "Nurse Station 2 & Clinical Desk",
    category: "Reception",
    floor: "2nd Floor",
    wing: "Central Core",
    roomNumber: "Hub 2",
    description: "Central Floor 2 nursing command, patient admission desk, medication prep room, and doctor assistance.",
    iconName: "ShieldCheck",
    x: 40,
    y: 60,
    w: 20,
    h: 24,
    status: "operational",
    color: "#ec4899",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 2nd Floor",
          "Exit elevator straight ahead into Central Corridor to Nurse Station 2 (Hub 2)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 72 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },

  // ===================== 3RD FLOOR =====================
  {
    id: "loc-icu",
    name: "Intensive Care Unit (ICU)",
    category: "ICU",
    floor: "3rd Floor",
    wing: "North-West Wing",
    roomNumber: "ICU Beds 301 - 316",
    description: "Tertiary level intensive critical care unit equipped with advanced mechanical ventilators and multi-parameter monitoring.",
    iconName: "Activity",
    x: 4,
    y: 10,
    w: 32,
    h: 46,
    status: "operational",
    color: "#dc2626",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Enter through Main Entrance and take Central Elevator Bank A to 3rd Floor",
          "Exit Elevator and turn Left into the High Dependency Critical Wing",
          "Follow the purple sterile corridor straight ahead for 15 meters",
          "Arrive at Intensive Care Unit (ICU) Main Airlock (Rooms 301-316)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 20, y: 32 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-nicu",
    name: "Neonatal & Pediatric ICU (NICU/PICU)",
    category: "ICU",
    floor: "3rd Floor",
    wing: "South-West Wing",
    roomNumber: "Rooms 317 - 322",
    description: "Specialized newborn incubators, phototherapy units, pediatric critical care, and maternal kangaroo care suites.",
    iconName: "HeartPulse",
    x: 4,
    y: 60,
    w: 32,
    h: 34,
    status: "operational",
    color: "#f59e0b",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 3rd Floor",
          "Exit elevator, turn Left, and walk South down the pediatric corridor",
          "Arrive at NICU & PICU Neonatal Intensive Care Wing (Rooms 317-322)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 77 },
          { x: 20, y: 77 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-maternity",
    name: "Maternity & Birthing Suites",
    category: "Ward",
    floor: "3rd Floor",
    wing: "North-East Wing",
    roomNumber: "Suites 323 - 330",
    description: "Private labor and delivery suites (LDR), fetal monitoring rooms, and postnatal luxury recovery rooms.",
    iconName: "Bed",
    x: 64,
    y: 10,
    w: 32,
    h: 46,
    status: "operational",
    color: "#ec4899",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 3rd Floor",
          "Exit elevator and turn Right into the Maternal Health Pavilion",
          "Arrive at Maternity & Birthing Suites (Suites 323-330)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 80, y: 32 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-vip-cabins",
    name: "Private Executive Cabins",
    category: "Ward",
    floor: "3rd Floor",
    wing: "South-East Wing",
    roomNumber: "Cabins 331 - 340",
    description: "Premium single-patient recovery cabins with attendant loungers, ensuite bathrooms, and dedicated concierge.",
    iconName: "Sparkles",
    x: 64,
    y: 60,
    w: 32,
    h: 34,
    status: "operational",
    color: "#0d9488",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 3rd Floor",
          "Exit elevator, turn Right, then proceed South towards the Luxury Cabin Concourse",
          "Arrive at Private Executive Cabins (Cabins 331-340)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 77 },
          { x: 80, y: 77 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: "loc-nurse-station-3",
    name: "Floor 3 Critical Care Nursing Command",
    category: "Reception",
    floor: "3rd Floor",
    wing: "Central Core",
    roomNumber: "Hub 3",
    description: "Central ICU nursing command desk, medical telemetry hub, and doctor emergency paging terminal.",
    iconName: "ShieldCheck",
    x: 40,
    y: 60,
    w: 20,
    h: 24,
    status: "operational",
    color: "#6366f1",
    predefinedRoutes: [
      {
        fromEntrance: "Main Entrance",
        steps: [
          "Take Central Elevator Bank A to 3rd Floor",
          "Exit elevator directly into Floor 3 Nursing Command Desk (Hub 3)",
        ],
        pathPoints: [
          { x: 50, y: 32 },
          { x: 50, y: 72 },
        ],
        estimatedMinutes: 2,
      },
    ],
  },
];

const STORAGE_KEY = "mediq_indoor_navigation_v1";

export function getHospitalLocations(): HospitalLocation[] {
  if (typeof window === "undefined") return defaultLocations;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLocations));
      return defaultLocations;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultLocations;
  } catch (e) {
    return defaultLocations;
  }
}

export function saveHospitalLocations(locs: HospitalLocation[]): HospitalLocation[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locs));
    window.dispatchEvent(new Event("mediq_navigation_updated"));
  } catch (e) {
    console.error("Failed to save indoor navigation locations:", e);
  }
  return locs;
}

export function addHospitalLocation(loc: HospitalLocation): HospitalLocation[] {
  const current = getHospitalLocations();
  const updated = [loc, ...current];
  return saveHospitalLocations(updated);
}

export function updateHospitalLocation(loc: HospitalLocation): HospitalLocation[] {
  const current = getHospitalLocations();
  const updated = current.map((item) => (item.id === loc.id ? loc : item));
  return saveHospitalLocations(updated);
}

export function deleteHospitalLocation(locId: string): HospitalLocation[] {
  const current = getHospitalLocations();
  const updated = current.filter((item) => item.id !== locId);
  return saveHospitalLocations(updated);
}

export function resetToDefaultLocations(): HospitalLocation[] {
  return saveHospitalLocations(defaultLocations);
}
