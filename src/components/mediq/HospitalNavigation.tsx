// Design: Guided Floorplan — map-first clinical wayfinding with thumb-reachable mobile controls and open plan space.
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  MapPin,
  Search,
  Layers,
  ArrowRight,
  Route as RouteIcon,
  DoorOpen,
  Siren,
  Pill,
  Droplet,
  Microscope,
  Stethoscope,
  Bed,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Activity,
  Clock,
  Navigation,
  Info,
  CheckCircle2,
  Share2,
  Maximize2,
  Building2,
  Accessibility,
  QrCode,
  LocateFixed,
  Footprints,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  FloorId,
  HospitalLocation,
  LocationCategory,
  getHospitalLocations,
} from "@/data/indoor-navigation-store";
import { Reveal, Section, SectionHeading } from "./primitives";
import { toast } from "sonner";

const floorsList: FloorId[] = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];

const categoryIcons: Record<string, any> = {
  Emergency: Siren,
  Reception: Compass,
  Ward: Bed,
  ICU: HeartPulse,
  Pharmacy: Pill,
  Laboratory: Microscope,
  "Blood Bank": Droplet,
  "Doctor Chambers": Stethoscope,
  "Elevators & Stairs": Layers,
  Facilities: DoorOpen,
};

export function HospitalNavigation() {
  const [locations, setLocations] = useState<HospitalLocation[]>(() => getHospitalLocations());
  const [selectedFloor, setSelectedFloor] = useState<FloorId>("Ground Floor");
  const [selectedLocation, setSelectedLocation] = useState<HospitalLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedEntrance, setSelectedEntrance] = useState<string>("Main Entrance");
  const [showRouteMode, setShowRouteMode] = useState(false);
  const [routePreference, setRoutePreference] = useState<"shortest" | "accessible">("shortest");
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const qrVideoRef = useRef<HTMLVideoElement>(null);
  const [animatingStep, setAnimatingStep] = useState<number>(0);
  const [mobilePane, setMobilePane] = useState<"map" | "details">("map");
  const [mapZoom, setMapZoom] = useState(1);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getHospitalLocations();
      setLocations(fresh);
      if (selectedLocation) {
        const updatedSelected = fresh.find((l) => l.id === selectedLocation.id);
        if (updatedSelected) setSelectedLocation(updatedSelected);
      }
    };
    window.addEventListener("mediq_navigation_updated", handleUpdate);
    return () => window.removeEventListener("mediq_navigation_updated", handleUpdate);
  }, [selectedLocation]);

  // Set default selected location on first load
  useEffect(() => {
    if (!selectedLocation && locations.length > 0) {
      const defaultLoc = locations.find((l) => l.floor === "Ground Floor" && l.id === "loc-reception") || locations[0];
      setSelectedLocation(defaultLoc);
    }
  }, [locations, selectedLocation]);

  // Filter locations on the active floor
  const floorLocations = useMemo(() => {
    return locations.filter((loc) => loc.floor === selectedFloor);
  }, [locations, selectedFloor]);

  // Search filter across all floors
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return locations.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.roomNumber.toLowerCase().includes(term) ||
        l.wing.toLowerCase().includes(term) ||
        l.category.toLowerCase().includes(term) ||
        l.description.toLowerCase().includes(term)
    );
  }, [locations, searchTerm]);

  // Pick the fastest route, or the safest accessible route when requested.
  const activeRoute = useMemo(() => {
    if (!selectedLocation) return null;
    const candidates = selectedLocation.predefinedRoutes.filter((r) => r.fromEntrance === selectedEntrance);
    const fallback = selectedLocation.predefinedRoutes;
    const routes = candidates.length > 0 ? candidates : fallback;
    const accessible = routes.filter((r: any) => r.accessible !== false && !r.steps.some((step: string) => /staircase|stairs/i.test(step)));
    return [...(routePreference === "accessible" && accessible.length > 0 ? accessible : routes)].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)[0] || null;
  }, [selectedLocation, selectedEntrance, routePreference]);

  // Animate route steps
  useEffect(() => {
    if (showRouteMode && activeRoute) {
      setAnimatingStep(0);
      const interval = setInterval(() => {
        setAnimatingStep((prev) => {
          if (prev < activeRoute.steps.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [showRouteMode, activeRoute]);

  const handleSelectLocation = (loc: HospitalLocation) => {
    setSelectedLocation(loc);
    setSelectedFloor(loc.floor);
    setSearchTerm("");
    setMobilePane("details");
  };

  const handleStartRoute = (loc: HospitalLocation) => {
    handleSelectLocation(loc);
    setShowRouteMode(true);
  };

  useEffect(() => {
    if (!qrScannerOpen) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    const scan = async () => {
      const BarcodeDetectorApi = (window as any).BarcodeDetector;
      if (!BarcodeDetectorApi) {
        toast.error("QR scanning is not supported in this browser. Use search instead.");
        setQrScannerOpen(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!qrVideoRef.current || cancelled) return;
        qrVideoRef.current.srcObject = stream;
        await qrVideoRef.current.play();
        const detector = new BarcodeDetectorApi({ formats: ["qr_code"] });
        const read = async () => {
          if (cancelled || !qrVideoRef.current) return;
          const codes = await detector.detect(qrVideoRef.current);
          const value = codes[0]?.rawValue as string | undefined;
          if (value) {
            const match = locations.find((loc) => value.includes(loc.id) || value.toLowerCase().includes(loc.name.toLowerCase()) || value.includes(loc.roomNumber));
            if (match) {
              handleSelectLocation(match);
              toast.success(`Location detected: ${match.name}`);
            } else {
              toast.error("QR code does not match a MediQ hospital location.");
            }
            setQrScannerOpen(false);
            return;
          }
          window.setTimeout(read, 400);
        };
        void read();
      } catch {
        toast.error("Camera access was denied. Use search or floor selection instead.");
        setQrScannerOpen(false);
      }
    };
    void scan();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [qrScannerOpen, locations]);

  const handleShareRoute = () => {
    if (!selectedLocation) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `MediQ Navigation: ${selectedLocation.name} (${selectedLocation.roomNumber}, ${selectedLocation.floor}, ${selectedLocation.wing})`
      );
      toast.success("Location directions copied to clipboard!");
    }
  };

  return (
    <Section id="indoor-navigation" className="scroll-mt-16">
      <SectionHeading
        eyebrow="Interactive Wayfinding"
        title="Hospital Indoor Navigation"
        subtitle="Explore hospital floors, departments, doctor chambers, and step-by-step route directions."
      />

      <div className="mt-8 space-y-6">
        {/* Top Controls: Search Bar & Floor Selector */}
        <div className="flex flex-col items-stretch justify-between gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center">
          {/* Quick Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search department, doctor chamber, room (e.g. ICU, Room 204)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs rounded-2xl bg-surface border-border"
            />
            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 z-50 bg-card border border-border rounded-2xl shadow-xl p-2 max-h-72 overflow-y-auto space-y-1">
                {searchResults.map((res) => {
                  const Icon = categoryIcons[res.category] || Compass;
                  return (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => handleSelectLocation(res)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-primary/10 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="p-1.5 rounded-lg bg-primary/15 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{res.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {res.floor} · {res.wing} · {res.roomNumber}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0 font-bold">
                        {res.category}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Floor Switcher Buttons */}
          <div className="-mx-1 flex max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5 sm:mx-0">
            {floorsList.map((floor) => {
              const count = locations.filter((l) => l.floor === floor).length;
              const isActive = selectedFloor === floor;
              return (
                <button
                  key={floor}
                  type="button"
                  onClick={() => {
                    setSelectedFloor(floor);
                    setShowRouteMode(false);
                    setMobilePane("map");
                    setMapZoom(1);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  )}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{floor}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs sm:flex-row sm:items-center">
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Button type="button" variant={routePreference === "shortest" ? "default" : "outline"} onClick={() => setRoutePreference("shortest")} className="h-10 justify-center rounded-xl text-xs font-bold sm:h-9 sm:justify-start"><Footprints className="mr-1.5 h-3.5 w-3.5" /> Shortest Route</Button>
            <Button type="button" variant={routePreference === "accessible" ? "default" : "outline"} onClick={() => setRoutePreference("accessible")} className="h-10 justify-center rounded-xl text-xs font-bold sm:h-9 sm:justify-start"><Accessibility className="mr-1.5 h-3.5 w-3.5" /> Wheelchair Route</Button>
            <Button type="button" variant="outline" onClick={() => setQrScannerOpen(true)} className="h-10 justify-center rounded-xl text-xs font-bold sm:h-9 sm:justify-start"><QrCode className="mr-1.5 h-3.5 w-3.5" /> Scan Location QR</Button>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><LocateFixed className="h-3.5 w-3.5 text-primary" /> Start: {selectedEntrance}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/30 p-1.5 lg:hidden">
          <Button type="button" variant={mobilePane === "map" ? "default" : "ghost"} onClick={() => setMobilePane("map")} className="h-10 rounded-xl text-xs font-bold"><Layers className="mr-1.5 h-3.5 w-3.5" /> 2D Map</Button>
          <Button type="button" variant={mobilePane === "details" ? "default" : "ghost"} onClick={() => setMobilePane("details")} className="h-10 rounded-xl text-xs font-bold"><Info className="mr-1.5 h-3.5 w-3.5" /> Destination</Button>
        </div>

        {/* Main Grid: Interactive Map (Left) & Location Details / Route (Right) */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Map Plan Viewport */}
          <div className={cn("space-y-4 rounded-3xl border border-border bg-card p-3 shadow-soft sm:p-6 lg:col-span-8", mobilePane === "details" && "hidden lg:block")}>
            {/* Map Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-teal/15 text-teal">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                    {selectedFloor} Plan
                    <Badge variant="outline" className="text-[10px] font-bold text-teal border-teal/30">
                      Main Hospital Tower
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Click any zone to inspect room details or view path directions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={showRouteMode ? "default" : "outline"}
                  onClick={() => setShowRouteMode(!showRouteMode)}
                  className={cn(
                    "rounded-xl text-xs font-bold h-8",
                    showRouteMode ? "gradient-primary text-primary-foreground" : "text-primary hover:bg-primary/10"
                  )}
                >
                  <RouteIcon className="mr-1.5 h-3.5 w-3.5" />
                  {showRouteMode ? "Hide Route" : "Show Route"}
                </Button>
              </div>
            </div>

            {/* Interactive 2D Floor Plan Canvas Container */}
            <div className="relative aspect-[4/3] w-full touch-manipulation select-none overflow-hidden rounded-2xl border border-border bg-surface/90 p-2 sm:aspect-[16/10] sm:p-3">
              <div
                className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
                style={{ transform: `scale(${mapZoom})` }}
              >
              {/* Floor Plan Blueprint Grid Background */}
              <div
                className="absolute inset-0 opacity-[0.25]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px), url('/manus-storage/mediq-map-texture_4240f817.png')",
                  backgroundSize: "24px 24px, 24px 24px, cover",
                }}
              />

              {/* Floor Outer Boundary Wall Outline */}
              <div className="absolute inset-2 sm:inset-3 rounded-2xl border-2 border-dashed border-primary/20 pointer-events-none" />

              {/* Central Hallway Corridor Lines */}
              <div className="absolute left-[38%] right-[38%] top-[10%] bottom-[10%] border-x border-border/60 bg-muted/10 pointer-events-none rounded-sm" />
              <div className="absolute top-[48%] bottom-[48%] left-[4%] right-[4%] border-y border-border/60 bg-muted/10 pointer-events-none" />

              {/* Room Blocks */}
              {floorLocations.map((loc) => {
                const Icon = categoryIcons[loc.category] || Compass;
                const isSelected = selectedLocation?.id === loc.id;

                return (
                  <motion.button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute flex flex-col justify-between p-2 sm:p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer shadow-2xs group",
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card bg-primary/15 border-primary z-20 shadow-md scale-[1.02]"
                        : "bg-card/90 hover:bg-card hover:border-primary/40 border-border hover:z-10 hover:shadow-xs"
                    )}
                    style={{
                      left: `${loc.x}%`,
                      top: `${loc.y}%`,
                      width: `${loc.w}%`,
                      height: `${loc.h}%`,
                    }}
                  >
                    <div className="flex items-center justify-between w-full gap-1 min-w-0">
                      <span className="flex items-center gap-1 min-w-0">
                        <Icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-colors",
                            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          )}
                        />
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold text-muted-foreground truncate">
                          {loc.roomNumber}
                        </span>
                      </span>

                      {isSelected && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-extrabold text-[10px] sm:text-[11px] text-foreground truncate leading-tight">
                        {loc.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate hidden sm:block">
                        {loc.wing}
                      </p>
                    </div>
                  </motion.button>
                );
              })}

              {/* Animated SVG Route Path Overlay */}
              {showRouteMode && activeRoute && activeRoute.pathPoints && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-30"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0d9488" />
                      <stop offset="50%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  {/* Route Polyline with moving dashed stroke */}
                  <polyline
                    points={activeRoute.pathPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    className="animate-pulse"
                  />

                  {/* Entrance Marker */}
                  {activeRoute.pathPoints[0] && (
                    <g transform={`translate(${activeRoute.pathPoints[0].x}, ${activeRoute.pathPoints[0].y})`}>
                      <circle r="2.5" fill="#0d9488" stroke="#ffffff" strokeWidth="0.8" />
                    </g>
                  )}

                  {/* Destination Marker */}
                  {activeRoute.pathPoints[activeRoute.pathPoints.length - 1] && (
                    <g
                      transform={`translate(${
                        activeRoute.pathPoints[activeRoute.pathPoints.length - 1].x
                      }, ${activeRoute.pathPoints[activeRoute.pathPoints.length - 1].y})`}
                    >
                      <circle r="3.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
                      <circle r="5" fill="none" stroke="#ef4444" strokeWidth="0.5" className="animate-ping" />
                    </g>
                  )}
                </svg>
              )}
              </div>

              <div className="absolute bottom-3 left-3 z-40 flex items-center overflow-hidden rounded-xl border border-border bg-card/95 shadow-soft backdrop-blur sm:bottom-4 sm:left-4">
                <Button type="button" variant="ghost" size="icon" onClick={() => setMapZoom((zoom) => Math.max(1, Number((zoom - 0.1).toFixed(1))))} disabled={mapZoom <= 1} className="h-9 w-9 rounded-none" aria-label="Zoom out of floor plan"><ZoomOut className="h-4 w-4" /></Button>
                <span className="min-w-12 border-x border-border px-2 text-center text-[10px] font-bold text-muted-foreground">{Math.round(mapZoom * 100)}%</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => setMapZoom((zoom) => Math.min(1.4, Number((zoom + 0.1).toFixed(1))))} disabled={mapZoom >= 1.4} className="h-9 w-9 rounded-none" aria-label="Zoom in on floor plan"><ZoomIn className="h-4 w-4" /></Button>
              </div>

              <Button type="button" variant="secondary" size="sm" onClick={() => setMapZoom(1)} className="absolute bottom-3 right-3 z-40 h-9 rounded-xl border border-border bg-card/95 px-3 text-[10px] font-bold shadow-soft backdrop-blur sm:bottom-4 sm:right-4" aria-label="Reset floor plan zoom"><Maximize2 className="mr-1.5 h-3.5 w-3.5" /> Reset</Button>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground pt-1">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Emergency / ICU
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Reception & Registration
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Pharmacy & Labs
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Doctor Chambers
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Elevators / Stairs
                </span>
              </div>

              <span className="text-xs font-semibold text-primary">
                {floorLocations.length} locations on {selectedFloor}
              </span>
            </div>
          </div>

          {/* Right Panel: Location Details & Step-by-Step Route Guidance */}
          <div className={cn("space-y-4 lg:col-span-4", mobilePane === "map" && "hidden lg:block")}>
            {selectedLocation ? (
              <div className="bg-card border border-border rounded-3xl p-5 shadow-soft space-y-5">
                {/* Location Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-bold text-xs">
                      {selectedLocation.category}
                    </Badge>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-surface border border-border">
                      {selectedLocation.roomNumber}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-foreground">{selectedLocation.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedLocation.description}
                  </p>
                </div>

                {/* Location Spec Table */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-surface border border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Floor Level</span>
                    <span className="font-bold text-foreground">{selectedLocation.floor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block">Wing / Side</span>
                    <span className="font-bold text-foreground">{selectedLocation.wing}</span>
                  </div>
                </div>

                {/* Step-by-Step Route Flow / Breadcrumb */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <RouteIcon className="h-4 w-4 text-teal" /> Step-by-Step Route
                    </Label>

                    {/* Entrance selector */}
                    <Select value={selectedEntrance} onValueChange={setSelectedEntrance}>
                      <SelectTrigger className="h-7 text-[11px] rounded-lg w-36 font-semibold">
                        <SelectValue placeholder="From Entrance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Entrance">Main Entrance</SelectItem>
                        <SelectItem value="Emergency Gate">Emergency Gate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {activeRoute ? (
                    <div className="space-y-2.5">
                      {/* Highlighted Route Breadcrumb */}
                      <div className="p-3 rounded-xl bg-teal/10 border border-teal/20 text-xs font-bold text-teal-foreground dark:text-teal space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{selectedEntrance}</span>
                          <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                          {selectedLocation.floor !== "Ground Floor" && (
                            <>
                              <span>Elevator Bank A</span>
                              <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                              <span>{selectedLocation.floor}</span>
                              <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                            </>
                          )}
                          <span>{selectedLocation.wing}</span>
                          <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                          <span className="text-foreground underline underline-offset-2">{selectedLocation.name}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium pt-0.5">
                          Estimated walk time: ~{activeRoute.estimatedMinutes || 2} mins
                        </p>
                      </div>

                      {/* Step by Step List */}
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {activeRoute.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition-all",
                              animatingStep === idx
                                ? "bg-primary/10 border-primary font-bold text-foreground"
                                : "bg-card border-border text-muted-foreground"
                            )}
                          >
                            <span className="h-5 w-5 rounded-full bg-primary/15 text-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/40 border border-border">
                      No direct predefined route from {selectedEntrance}. Please use Main Entrance.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                  <span>{routePreference === "accessible" ? "Wheelchair-accessible route" : "Shortest available route"}</span>
                  <span>~{activeRoute?.estimatedMinutes || 2} min</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={() => setShowRouteMode(true)}
                    className="flex-1 gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md py-4"
                  >
                    <Navigation className="mr-1.5 h-3.5 w-3.5" /> Highlight Path on Map
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShareRoute}
                    className="rounded-xl text-xs font-semibold h-10 px-3"
                    title="Copy directions"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-8 text-center space-y-3">
                <Compass className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                <h4 className="font-bold text-sm text-foreground">Select a Location on Map</h4>
                <p className="text-xs text-muted-foreground">
                  Click any department, ward, or chamber on the floor map to view details and route directions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={qrScannerOpen} onOpenChange={setQrScannerOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" /> Scan MediQ Location QR</DialogTitle></DialogHeader>
          <div className="overflow-hidden rounded-2xl border border-border bg-black">
            <video ref={qrVideoRef} className="aspect-video w-full object-cover" muted playsInline />
          </div>
          <p className="text-xs text-muted-foreground">Point your camera at a MediQ location QR code to set your current location and open the matching destination.</p>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
