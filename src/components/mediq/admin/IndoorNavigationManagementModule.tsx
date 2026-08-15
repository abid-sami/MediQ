import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MapPin,
  Layers,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Compass,
  Route as RouteIcon,
  CheckCircle2,
  Building2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  FloorId,
  HospitalLocation,
  LocationCategory,
  getHospitalLocations,
  addHospitalLocation,
  updateHospitalLocation,
  deleteHospitalLocation,
  resetToDefaultLocations,
} from "@/data/indoor-navigation-store";

const floors: FloorId[] = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];
const categories: LocationCategory[] = [
  "Emergency",
  "Reception",
  "Ward",
  "ICU",
  "Pharmacy",
  "Laboratory",
  "Blood Bank",
  "Doctor Chambers",
  "Elevators & Stairs",
  "Facilities",
];

export function IndoorNavigationManagementModule() {
  const [locations, setLocations] = useState<HospitalLocation[]>(() => getHospitalLocations());
  const [activeFloor, setActiveFloor] = useState<FloorId>("Ground Floor");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<LocationCategory>("Doctor Chambers");
  const [floor, setFloor] = useState<FloorId>("Ground Floor");
  const [wing, setWing] = useState("East Wing");
  const [roomNumber, setRoomNumber] = useState("Room 101");
  const [description, setDescription] = useState("");
  const [xCoord, setXCoord] = useState<number>(50);
  const [yCoord, setYCoord] = useState<number>(50);
  const [wCoord, setWCoord] = useState<number>(25);
  const [hCoord, setHCoord] = useState<number>(25);
  const [routeStepsText, setRouteStepsText] = useState(
    "Enter through Main Entrance\nTake Central Elevator to target floor\nTurn towards designated wing\nArrive at destination"
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(2);

  useEffect(() => {
    const handleUpdate = () => {
      setLocations(getHospitalLocations());
    };
    window.addEventListener("mediq_navigation_updated", handleUpdate);
    return () => window.removeEventListener("mediq_navigation_updated", handleUpdate);
  }, []);

  const filteredLocations = locations.filter((loc) => {
    const matchesFloor = loc.floor === activeFloor;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.wing.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || loc.category === categoryFilter;
    return matchesFloor && matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName("");
    setCategory("Doctor Chambers");
    setFloor(activeFloor);
    setWing("East Wing");
    setRoomNumber(`Room ${activeFloor === "Ground Floor" ? "G-0" : activeFloor.charAt(0) + "0"}${Math.floor(1 + Math.random() * 9)}`);
    setDescription("Consultation and treatment facility.");
    setXCoord(20);
    setYCoord(20);
    setWCoord(25);
    setHCoord(25);
    setRouteStepsText(
      `Enter through Main Entrance\nTake Central Elevator A to ${activeFloor}\nProceed into East Wing\nArrive at room`
    );
    setEstimatedMinutes(2);
    setModalOpen(true);
  };

  const handleOpenEditModal = (loc: HospitalLocation) => {
    setIsEditing(true);
    setEditingId(loc.id);
    setName(loc.name);
    setCategory(loc.category);
    setFloor(loc.floor);
    setWing(loc.wing);
    setRoomNumber(loc.roomNumber);
    setDescription(loc.description);
    setXCoord(loc.x);
    setYCoord(loc.y);
    setWCoord(loc.w);
    setHCoord(loc.h);
    const primaryRoute = loc.predefinedRoutes[0];
    setRouteStepsText(primaryRoute ? primaryRoute.steps.join("\n") : "");
    setEstimatedMinutes(primaryRoute?.estimatedMinutes || 2);
    setModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomNumber.trim()) {
      toast.error("Location name and room number are required.");
      return;
    }

    const stepsArray = routeStepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const locationData: HospitalLocation = {
      id: isEditing && editingId ? editingId : `loc-${Date.now()}`,
      name,
      category,
      floor,
      wing,
      roomNumber,
      description,
      iconName: "Compass",
      x: Number(xCoord),
      y: Number(yCoord),
      w: Number(wCoord),
      h: Number(hCoord),
      status: "operational",
      color: "#0d9488",
      predefinedRoutes: [
        {
          fromEntrance: "Main Entrance",
          steps: stepsArray.length > 0 ? stepsArray : ["Enter through Main Entrance", "Proceed to destination"],
          pathPoints: [
            { x: 50, y: 90 },
            { x: Number(xCoord) + Number(wCoord) / 2, y: Number(yCoord) + Number(hCoord) / 2 },
          ],
          estimatedMinutes: Number(estimatedMinutes) || 2,
        },
      ],
    };

    if (isEditing) {
      updateHospitalLocation(locationData);
      toast.success(`Updated ${name} (${roomNumber})`);
    } else {
      addHospitalLocation(locationData);
      toast.success(`Added new location: ${name}`);
    }

    setModalOpen(false);
  };

  const handleDelete = (loc: HospitalLocation) => {
    if (confirm(`Are you sure you want to delete ${loc.name} (${loc.roomNumber})?`)) {
      deleteHospitalLocation(loc.id);
      toast.success(`Deleted ${loc.name}`);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all hospital indoor maps and routes to system defaults?")) {
      resetToDefaultLocations();
      toast.success("Reset floor maps to defaults");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" /> Hospital Indoor Navigation Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Super Admin control to create, modify, and delete hospital floor locations, room numbers, wings, and step-by-step route directions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Defaults
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Location / Room
          </Button>
        </div>
      </div>

      {/* Floor Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border overflow-x-auto">
        {floors.map((fl) => {
          const count = locations.filter((l) => l.floor === fl).length;
          const isActive = activeFloor === fl;
          return (
            <button
              key={fl}
              type="button"
              onClick={() => setActiveFloor(fl)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{fl}</span>
              <Badge
                variant="secondary"
                className={`text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : ""}`}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card border border-border p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Room Number, Department, or Wing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 text-xs rounded-xl">
            <SelectValue placeholder="Filter Category..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Locations Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> {activeFloor} Directory ({filteredLocations.length} locations)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Room No.</th>
                <th className="p-3.5">Location Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Wing / Side</th>
                <th className="p-3.5">Map Position (X, Y, W, H)</th>
                <th className="p-3.5">Route Steps</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-foreground">
                    <Badge variant="outline" className="font-mono text-xs font-bold">
                      {loc.roomNumber}
                    </Badge>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{loc.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-xs">{loc.description}</p>
                  </td>
                  <td className="p-3.5">
                    <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] font-bold">
                      {loc.category}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-medium text-foreground">{loc.wing}</td>
                  <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                    X:{loc.x}% Y:{loc.y}% ({loc.w}x{loc.h}%)
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] font-semibold text-teal flex items-center gap-1">
                      <RouteIcon className="h-3 w-3" />
                      {loc.predefinedRoutes[0]?.steps.length || 0} steps (~{loc.predefinedRoutes[0]?.estimatedMinutes || 2}m)
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditModal(loc)}
                      className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary/10"
                      title="Edit Location"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(loc)}
                      className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                      title="Delete Location"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl bg-card border-border max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              {isEditing ? `Edit Location: ${name}` : "Add New Hospital Location"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveLocation} className="space-y-4 text-xs mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Location / Department Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cardiology OPD Suite"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Room / Unit Number *</Label>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. Room 204-A"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Floor Level *</Label>
                <Select value={floor} onValueChange={(v) => setFloor(v as FloorId)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {floors.map((fl) => (
                      <SelectItem key={fl} value={fl}>
                        {fl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Wing / Corridor *</Label>
                <Input
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  placeholder="e.g. East Wing"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as LocationCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description / Services Summary</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of treatments, consultations, or services offered in this room..."
                rows={2}
                className="text-xs"
              />
            </div>

            {/* Map 2D Coordinate Box */}
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2.5">
              <Label className="font-bold flex items-center justify-between text-muted-foreground">
                <span>Floor Map Coordinates (0 - 100%)</span>
                <span className="text-[10px] text-primary">Position & Room Size</span>
              </Label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground">X Pos (%):</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={xCoord}
                    onChange={(e) => setXCoord(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Y Pos (%):</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={yCoord}
                    onChange={(e) => setYCoord(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Width (%):</span>
                  <Input
                    type="number"
                    min={5}
                    max={60}
                    value={wCoord}
                    onChange={(e) => setWCoord(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">Height (%):</span>
                  <Input
                    type="number"
                    min={5}
                    max={60}
                    value={hCoord}
                    onChange={(e) => setHCoord(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Predefined Step-by-Step Route Guidance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Predefined Route Steps (One step per line)</Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Walk Time:</span>
                  <Input
                    type="number"
                    min={1}
                    max={15}
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-16 h-7 text-xs font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground">mins</span>
                </div>
              </div>
              <Textarea
                value={routeStepsText}
                onChange={(e) => setRouteStepsText(e.target.value)}
                placeholder="Enter step by step directions from Main Entrance..."
                rows={4}
                className="text-xs font-mono leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-primary text-primary-foreground font-bold rounded-xl text-xs"
              >
                {isEditing ? "Save Changes" : "Create Location"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
