import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Undo2,
  Redo2,
  Eraser,
  RotateCcw,
  Download,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Flower2,
  TreePine,
  Building2,
  Mountain,
  Heart,
  Shapes,
} from "lucide-react";
import { toast } from "sonner";
import { saveWellnessSession } from "@/data/wellness-data";

interface CalmColoringActivityProps {
  onExit: () => void;
}

// Color Palette Presets
const COLOR_PALETTES = [
  {
    name: "Pastel Serenity",
    colors: ["#FCA5A5", "#FDBA74", "#FDE047", "#86EFAC", "#67E8F9", "#93C5FD", "#C4B5FD", "#F472B6", "#FFFFFF"],
  },
  {
    name: "Nature & Earth",
    colors: ["#15803D", "#16A34A", "#4ADE80", "#854D0E", "#A16207", "#CA8A04", "#0284C7", "#0D9488", "#E2E8F0"],
  },
  {
    name: "Healing Warmth",
    colors: ["#EF4444", "#F97316", "#FB923C", "#FBBF24", "#EC4899", "#8B5CF6", "#6366F1", "#14B8A6", "#38BDF8"],
  },
  {
    name: "Calm Night",
    colors: ["#1E293B", "#334155", "#475569", "#64748B", "#38BDF8", "#818CF8", "#A78BFA", "#E0E7FF", "#F8FAFC"],
  },
];

// Illustrations with SVG path data
interface Artwork {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  renderPaths: (
    fills: Record<string, string>,
    onSelectSegment: (id: string) => void
  ) => React.ReactNode;
}

const ARTWORKS: Artwork[] = [
  {
    id: "lotus",
    title: "Lotus in Bloom",
    description: "Symbol of tranquility, purity and calm regeneration",
    icon: Flower2,
    renderPaths: (fills, onSelect) => (
      <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] drop-shadow-sm cursor-pointer select-none">
        {/* Background / Water */}
        <path
          d="M20,320 C100,310 180,330 260,315 C340,300 380,325 380,325 L380,380 L20,380 Z"
          fill={fills["water"] || "#E2E8F0"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("water")}
        />
        {/* Lily Pads */}
        <path
          d="M60,320 C30,300 40,270 90,270 C140,270 160,300 130,330 C100,360 80,340 60,320 Z"
          fill={fills["pad1"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("pad1")}
        />
        <path
          d="M260,330 C230,300 250,270 300,270 C350,270 370,310 330,340 C300,360 280,350 260,330 Z"
          fill={fills["pad2"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("pad2")}
        />
        {/* Outer Petals */}
        <path
          d="M200,280 C130,260 100,190 120,150 C140,190 170,240 200,280 Z"
          fill={fills["petal_out_l"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("petal_out_l")}
        />
        <path
          d="M200,280 C270,260 300,190 280,150 C260,190 230,240 200,280 Z"
          fill={fills["petal_out_r"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("petal_out_r")}
        />
        {/* Mid Petals */}
        <path
          d="M200,280 C150,240 130,150 160,100 C175,150 190,220 200,280 Z"
          fill={fills["petal_mid_l"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("petal_mid_l")}
        />
        <path
          d="M200,280 C250,240 270,150 240,100 C225,150 210,220 200,280 Z"
          fill={fills["petal_mid_r"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("petal_mid_r")}
        />
        {/* Center Petal */}
        <path
          d="M200,280 C180,210 180,120 200,70 C220,120 220,210 200,280 Z"
          fill={fills["petal_center"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("petal_center")}
        />
        {/* Flower Core / Seed Pod */}
        <ellipse
          cx="200"
          cy="260"
          rx="25"
          ry="15"
          fill={fills["flower_core"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("flower_core")}
        />
      </svg>
    ),
  },
  {
    id: "tree",
    title: "Tree of Life",
    description: "Deep roots, gentle leaves, and peaceful strength",
    icon: TreePine,
    renderPaths: (fills, onSelect) => (
      <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] drop-shadow-sm cursor-pointer select-none">
        {/* Ground */}
        <path
          d="M40,340 Q200,310 360,340 L360,380 L40,380 Z"
          fill={fills["ground"] || "#E2E8F0"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("ground")}
        />
        {/* Trunk & Roots */}
        <path
          d="M170,340 Q160,260 180,200 L220,200 Q240,260 230,340 Q200,320 170,340 Z"
          fill={fills["trunk"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("trunk")}
        />
        {/* Branches Left & Right */}
        <path
          d="M180,200 C150,180 120,190 100,160 C120,170 160,170 190,190 Z"
          fill={fills["branch_l"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("branch_l")}
        />
        <path
          d="M220,200 C250,180 280,190 300,160 C280,170 240,170 210,190 Z"
          fill={fills["branch_r"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("branch_r")}
        />
        {/* Foliage Clusters */}
        <circle
          cx="130"
          cy="140"
          r="45"
          fill={fills["foliage_1"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("foliage_1")}
        />
        <circle
          cx="270"
          cy="140"
          r="45"
          fill={fills["foliage_2"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("foliage_2")}
        />
        <circle
          cx="170"
          cy="100"
          r="45"
          fill={fills["foliage_3"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("foliage_3")}
        />
        <circle
          cx="230"
          cy="100"
          r="45"
          fill={fills["foliage_4"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("foliage_4")}
        />
        <circle
          cx="200"
          cy="60"
          r="38"
          fill={fills["foliage_5"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("foliage_5")}
        />
      </svg>
    ),
  },
  {
    id: "hospital",
    title: "Healing Haven",
    description: "A bright sanctuary of medical care and kindness",
    icon: Building2,
    renderPaths: (fills, onSelect) => (
      <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] drop-shadow-sm cursor-pointer select-none">
        {/* Sky / Sun */}
        <circle
          cx="80"
          cy="80"
          r="35"
          fill={fills["sun"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("sun")}
        />
        {/* Main Hospital Building Body */}
        <rect
          x="100"
          y="140"
          width="200"
          height="200"
          rx="12"
          fill={fills["bldg_main"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("bldg_main")}
        />
        {/* Roof Crest */}
        <path
          d="M100,140 L200,80 L300,140 Z"
          fill={fills["roof"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("roof")}
        />
        {/* Medical Cross Symbol */}
        <path
          d="M185,110 H215 V125 H230 V155 H215 V170 H185 V155 H170 V125 H185 Z"
          fill={fills["cross"] || "#EF4444"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("cross")}
        />
        {/* Windows */}
        <rect
          x="125"
          y="190"
          width="40"
          height="40"
          rx="6"
          fill={fills["win1"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("win1")}
        />
        <rect
          x="235"
          y="190"
          width="40"
          height="40"
          rx="6"
          fill={fills["win2"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("win2")}
        />
        {/* Entrance Door */}
        <path
          d="M175,270 H225 V340 H175 Z"
          fill={fills["door"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("door")}
        />
        {/* Landscaping Bushes */}
        <circle
          cx="60"
          cy="340"
          r="25"
          fill={fills["bush_l"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("bush_l")}
        />
        <circle
          cx="340"
          cy="340"
          r="25"
          fill={fills["bush_r"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("bush_r")}
        />
      </svg>
    ),
  },
  {
    id: "mountains",
    title: "Serene Horizon",
    description: "Majestic mountains and calm morning waters",
    icon: Mountain,
    renderPaths: (fills, onSelect) => (
      <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] drop-shadow-sm cursor-pointer select-none">
        {/* Sky */}
        <rect
          x="30"
          y="30"
          width="340"
          height="180"
          rx="16"
          fill={fills["sky"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("sky")}
        />
        {/* Sun */}
        <circle
          cx="200"
          cy="120"
          r="30"
          fill={fills["mtn_sun"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("mtn_sun")}
        />
        {/* Back Mountain */}
        <path
          d="M110,210 L200,90 L290,210 Z"
          fill={fills["mtn_back"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("mtn_back")}
        />
        {/* Left Front Mountain */}
        <path
          d="M30,230 L130,130 L230,230 Z"
          fill={fills["mtn_front_l"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("mtn_front_l")}
        />
        {/* Right Front Mountain */}
        <path
          d="M170,230 L270,120 L370,230 Z"
          fill={fills["mtn_front_r"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("mtn_front_r")}
        />
        {/* Mountain Lake Water */}
        <path
          d="M30,230 L370,230 L370,360 L30,360 Z"
          fill={fills["lake"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("lake")}
        />
      </svg>
    ),
  },
  {
    id: "heart",
    title: "Caring Heart",
    description: "Warmth, healing, and caring pulse",
    icon: Heart,
    renderPaths: (fills, onSelect) => (
      <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] drop-shadow-sm cursor-pointer select-none">
        {/* Background Aura */}
        <circle
          cx="200"
          cy="200"
          r="150"
          fill={fills["heart_aura"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("heart_aura")}
        />
        {/* Left Heart Lobe */}
        <path
          d="M200,290 C130,230 70,170 70,120 C70,70 120,60 160,80 C180,90 200,120 200,120 Z"
          fill={fills["heart_left"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("heart_left")}
        />
        {/* Right Heart Lobe */}
        <path
          d="M200,290 C270,230 330,170 330,120 C330,70 280,60 240,80 C220,90 200,120 200,120 Z"
          fill={fills["heart_right"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          strokeLinejoin="round"
          onClick={() => onSelect("heart_right")}
        />
        {/* Center Healing Glow */}
        <circle
          cx="200"
          cy="180"
          r="30"
          fill={fills["heart_center"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("heart_center")}
        />
      </svg>
    ),
  },
  {
    id: "mandala",
    title: "Harmonious Mandala",
    description: "Symmetrical patterns for mindful presence and ease",
    icon: Shapes,
    renderPaths: (fills, onSelect) => (
      <svg viewBox="0 0 400 400" className="w-full h-full max-h-[380px] drop-shadow-sm cursor-pointer select-none">
        {/* Outer Ring */}
        <circle
          cx="200"
          cy="200"
          r="160"
          fill={fills["mandala_outer"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("mandala_outer")}
        />
        {/* 4 Cardinal Quadrant Petals */}
        <path
          d="M200,200 L200,50 Q280,100 200,200 Z"
          fill={fills["m_top"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("m_top")}
        />
        <path
          d="M200,200 L350,200 Q300,280 200,200 Z"
          fill={fills["m_right"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("m_right")}
        />
        <path
          d="M200,200 L200,350 Q120,300 200,200 Z"
          fill={fills["m_bottom"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("m_bottom")}
        />
        <path
          d="M200,200 L50,200 Q100,120 200,200 Z"
          fill={fills["m_left"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="2.5"
          onClick={() => onSelect("m_left")}
        />
        {/* Mid Ring */}
        <circle
          cx="200"
          cy="200"
          r="70"
          fill={fills["mandala_mid"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("mandala_mid")}
        />
        {/* Inner Core */}
        <circle
          cx="200"
          cy="200"
          r="30"
          fill={fills["mandala_core"] || "#FFFFFF"}
          stroke="#334155"
          strokeWidth="3"
          onClick={() => onSelect("mandala_core")}
        />
      </svg>
    ),
  },
];

export function CalmColoringActivity({ onExit }: CalmColoringActivityProps) {
  const [selectedArtworkIndex, setSelectedArtworkIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>("#67E8F9");
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [paletteIndex, setPaletteIndex] = useState<number>(0);

  // Per-artwork fill states
  const [fills, setFills] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const currentArtwork = ARTWORKS[selectedArtworkIndex];

  // Select a new illustration
  const handleSelectArtwork = (idx: number) => {
    setSelectedArtworkIndex(idx);
    setFills({});
    setHistory([{}]);
    setHistoryIndex(0);
  };

  // Color segment click
  const handleSelectSegment = (segmentId: string) => {
    const colorToApply = isEraser ? "#FFFFFF" : selectedColor;
    const newFills = { ...fills, [segmentId]: colorToApply };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFills);

    setFills(newFills);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setFills(history[newIdx]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setFills(history[newIdx]);
    }
  };

  // Clear / Reset illustration
  const handleResetCanvas = () => {
    setFills({});
    setHistory([{}]);
    setHistoryIndex(0);
    toast.success("Illustration reset to clean canvas");
  };

  // Save / Export Artwork
  const handleSaveArtwork = () => {
    // Save session record
    saveWellnessSession({
      activityType: "calm-coloring",
      activityTitle: "Calm Coloring",
      durationSeconds: 120, // gentle record
      completed: true,
      details: {
        artworkTitle: currentArtwork.title,
      },
    });

    toast.success(`Artwork "${currentArtwork.title}" saved to your wellness session history!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Activities
          </Button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Calm Digital Coloring</h2>
              <p className="text-[11px] text-muted-foreground">Relaxing tap-to-color art with peaceful tones</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveArtwork}
            className="rounded-xl text-xs font-bold gap-1.5 h-9 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
          >
            <Download className="h-3.5 w-3.5" /> Save Artwork
          </Button>
        </div>
      </div>

      {/* Main Canvas & Palette Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Artwork Canvas */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lift flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">{currentArtwork.title}</h3>
              <p className="text-xs text-muted-foreground">{currentArtwork.description}</p>
            </div>

            <Badge variant="outline" className="text-[11px] px-3 py-1">
              Tap any area to fill color
            </Badge>
          </div>

          {/* SVG Art Viewport */}
          <div
            ref={canvasRef}
            className="w-full flex items-center justify-center p-4 bg-muted/20 border border-border rounded-2xl min-h-[360px] sm:min-h-[400px]"
          >
            {currentArtwork.renderPaths(fills, handleSelectSegment)}
          </div>

          {/* Canvas Bottom Action Bar: Undo, Redo, Eraser, Clear */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="rounded-xl text-xs h-9"
                title="Undo last color"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="rounded-xl text-xs h-9"
                title="Redo color"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEraser(!isEraser)}
                className={`rounded-xl text-xs h-9 gap-1.5 ${
                  isEraser ? "bg-destructive/10 text-destructive border-destructive/30 font-bold" : "text-muted-foreground"
                }`}
                title="Eraser (reset segment to clean white)"
              >
                <Eraser className="h-3.5 w-3.5" />
                <span>{isEraser ? "Eraser Active" : "Eraser"}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetCanvas}
              className="rounded-xl text-xs text-muted-foreground hover:text-foreground h-9"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Clear All
            </Button>
          </div>
        </div>

        {/* Right Side: Palette Controls & Illustration Selector */}
        <div className="space-y-6">
          {/* Palette Selector */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-primary" /> Curated Color Palette
              </h4>

              {/* Active Color Preview Chip */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">Active:</span>
                <span
                  className="h-5 w-5 rounded-full border border-black/20 shadow-xs block"
                  style={{ backgroundColor: isEraser ? "#FFFFFF" : selectedColor }}
                />
              </div>
            </div>

            {/* Palette Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-muted/40 p-1 rounded-xl border border-border text-[11px]">
              {COLOR_PALETTES.map((pal, idx) => (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => setPaletteIndex(idx)}
                  className={`py-1.5 px-2 rounded-lg font-bold truncate transition-all ${
                    paletteIndex === idx
                      ? "bg-card text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pal.name}
                </button>
              ))}
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
              {COLOR_PALETTES[paletteIndex].colors.map((colorHex) => {
                const isCurrent = !isEraser && selectedColor === colorHex;
                return (
                  <button
                    key={colorHex}
                    type="button"
                    onClick={() => {
                      setSelectedColor(colorHex);
                      setIsEraser(false);
                    }}
                    className={`aspect-square rounded-2xl border-2 transition-all transform hover:scale-110 shadow-xs flex items-center justify-center ${
                      isCurrent ? "border-foreground scale-110 shadow-md ring-2 ring-primary/40" : "border-border/60"
                    }`}
                    style={{ backgroundColor: colorHex }}
                  >
                    {isCurrent && (
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          colorHex === "#FFFFFF" || colorHex === "#FDE047" || colorHex === "#F8FAFC"
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Illustration Selection Picker */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Choose Illustration (6 Artworks)
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {ARTWORKS.map((art, idx) => {
                const isSelected = selectedArtworkIndex === idx;
                const IconComp = art.icon;
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleSelectArtwork(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all space-y-1 flex flex-col justify-between ${
                      isSelected
                        ? "gradient-primary text-primary-foreground border-primary shadow-soft"
                        : "bg-muted/20 border-border/80 text-foreground hover:bg-muted"
                    }`}
                  >
                    <IconComp className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                    <div>
                      <h5 className="font-bold text-xs truncate">{art.title}</h5>
                      <span className={`text-[10px] block truncate ${isSelected ? "opacity-90" : "text-muted-foreground"}`}>
                        {art.description.split(" ")[0]} peaceful art
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
