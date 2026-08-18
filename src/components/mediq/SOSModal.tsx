import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Crosshair, Loader2, MapPin, Navigation, Siren } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { emergencyTypes } from "@/data/mediq";
import { createSupabaseSOS, fetchSupabaseProfiles } from "@/services/supabase-service";

import { useMediQActions } from "./actions-context";
import { useAuth } from "@/hooks/use-auth";

type Dispatch = {
  requestId: string;
  ambulanceId: string;
  driver: string;
  driverPhone: string;
  eta: string;
  status: string;
};

const statusFlow = ["Locating nearest ambulance", "Ambulance assigned", "On the way to you"];

export function SOSModal() {
  const { sosOpen, closeSos } = useMediQActions();
  const { profile, user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [type, setType] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dispatch, setDispatch] = useState<Dispatch | null>(null);
  const [statusStep, setStatusStep] = useState(0);

  useEffect(() => {
    if (sosOpen && profile) {
      setName((current) => current || profile.name || user?.user_metadata?.full_name || "");
      setPhone((current) => current || profile.phone || user?.user_metadata?.phone || "");
    }
  }, [sosOpen, profile, user]);

  const reset = () => {
    setDispatch(null);
    setStatusStep(0);
    setName("");
    setPhone("");
    setLocation("");
    setUserCoords(null);
    setType("");
  };

  const detectLocation = () => {
    setLocating(true);
    if (!("geolocation" in navigator)) {
      setLocating(false);
      toast.error("Location is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
        setLocating(false);
        toast.success("Location detected");
      },
      () => {
        setLocating(false);
        toast.error("Location permission denied — please type your address.");
      },
      { timeout: 8000 },
    );
  };

  const calculateEtaMinutes = (coords: { lat: number; lng: number } | null) => {
    if (!coords) return null;
    const hospital = { lat: 23.8103, lng: 90.4125 };
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const dLat = toRadians(hospital.lat - coords.lat);
    const dLng = toRadians(hospital.lng - coords.lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(coords.lat)) * Math.cos(toRadians(hospital.lat)) * Math.sin(dLng / 2) ** 2;
    const distanceKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(4, Math.ceil((distanceKm / 28) * 60 * 1.25));
  };

  const getLiveCoordinates = () => new Promise<{ lat: number; lng: number } | null>((resolve) => {
    if (!("geolocation" in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 5000 },
    );
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !location || !type) {
      toast.error("Please complete all fields so responders can reach you.");
      return;
    }
    setSubmitting(true);

    const liveCoords = userCoords || await getLiveCoordinates();
    if (liveCoords && !userCoords) {
      setUserCoords(liveCoords);
      setLocation(`${liveCoords.lat.toFixed(5)}, ${liveCoords.lng.toFixed(5)}`);
    }

    const drivers = await fetchSupabaseProfiles("Ambulance Driver");
    const assignedDriver = drivers.length > 0 ? drivers[Math.floor(Math.random() * drivers.length)] : null;
    const requestId = `SOS-${Math.floor(100000 + Math.random() * 899999)}`;
    const etaMinutes = calculateEtaMinutes(liveCoords);
    const eta = etaMinutes ? `${etaMinutes}` : "Pending";

    const { data, error } = await createSupabaseSOS({
      requestId,
      patientName: name,
      patientPhone: phone,
      emergencyType: type,
      location,
      destinationHospital: "MediQ Central Hospital",
      assignedDriver: assignedDriver?.name || "Awaiting dispatch",
      eta: eta === "Pending" ? "Pending" : `${eta} minutes`,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Couldn't send the request. Please try calling emergency services directly.");
      return;
    }

    setDispatch({
      requestId,
      ambulanceId: data?.id ? String(data.id).slice(0, 8).toUpperCase() : requestId,
      driver: assignedDriver?.name || "Dispatch coordinating nearest driver",
      driverPhone: assignedDriver?.phone || "Not available",
      eta: eta === "Pending" ? "Pending" : `${eta} minutes`,
      status: statusFlow[0]!,
    });
    toast.success("Ambulance request sent");
    window.setTimeout(() => setStatusStep(1), 1800);
    window.setTimeout(() => setStatusStep(2), 4200);
  };

  return (
    <Dialog
      open={sosOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeSos();
          window.setTimeout(reset, 250);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          {!dispatch ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <DialogHeader>
                <div className="mb-2 flex items-center gap-3">
                  <span className="pulse-ring relative grid h-11 w-11 place-items-center rounded-2xl gradient-emergency text-emergency-foreground">
                    <Siren className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <DialogTitle className="text-xl">Emergency SOS</DialogTitle>
                    <DialogDescription>
                      Request the nearest available ambulance.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={submit} className="mt-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sos-name">Full Name</Label>
                  <Input
                    id="sos-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Patient full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sos-phone">Phone Number</Label>
                  <Input
                    id="sos-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sos-location">Current Location</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="sos-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Address or coordinates"
                      className="min-w-0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={detectLocation}
                      className="shrink-0 gap-2"
                      disabled={locating}
                    >
                      {locating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Crosshair className="h-4 w-4" />
                      )}
                      Detect My Location
                    </Button>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    Location is used only to dispatch the nearest ambulance.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sos-type">Emergency Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="sos-type">
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      {emergencyTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl gradient-emergency py-6 text-base font-bold tracking-wide text-emergency-foreground hover:opacity-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SENDING REQUEST
                    </>
                  ) : (
                    "REQUEST AMBULANCE"
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  A dispatch coordinator will confirm your request shortly.
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <DialogHeader className="items-center">
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.span>
                <DialogTitle className="mt-3 text-center text-xl">
                  Ambulance Request Sent
                </DialogTitle>
                <DialogDescription className="text-center">
                  Stay with the patient. Our coordinator will call you shortly.
                </DialogDescription>
              </DialogHeader>

              <dl className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface text-left">
                {(
                  [["Request ID", dispatch.requestId],
                  ["Ambulance status", statusFlow[statusStep]!],
                  ["Estimated arrival", dispatch.eta === "Pending" ? "Pending" : dispatch.eta],
                  ["Assigned ambulance", dispatch.ambulanceId],
                  ["Driver", dispatch.driver],
                  ["Driver phone", dispatch.driverPhone]] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 px-4 py-3">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="min-w-0 truncate text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Button
                  className="rounded-xl gradient-primary font-semibold text-primary-foreground"
                  onClick={() => toast.info("Live tracking will open once dispatch is connected.")}
                >
                  <Navigation className="mr-2 h-4 w-4" /> Live Tracking
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl font-semibold"
                  onClick={() => {
                    closeSos();
                    window.setTimeout(reset, 250);
                  }}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
