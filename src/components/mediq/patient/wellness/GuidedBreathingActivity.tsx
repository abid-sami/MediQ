import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";
import { saveWellnessSession } from "@/data/wellness-data";

interface GuidedBreathingActivityProps {
  onExit: () => void;
}

type BreathingPhase = "inhale" | "hold" | "exhale" | "hold2";

interface BreathingPattern {
  name: string;
  description: string;
  inhaleSec: number;
  holdSec: number;
  exhaleSec: number;
  hold2Sec?: number;
}

const PATTERNS: BreathingPattern[] = [
  {
    name: "Calm & Balance (4-4-6)",
    description: "Soothing flow that gently reduces pulse and eases anxiety",
    inhaleSec: 4,
    holdSec: 4,
    exhaleSec: 6,
  },
  {
    name: "Box Breathing (4-4-4-4)",
    description: "Equal phases for mental clarity, steady focus and grounding",
    inhaleSec: 4,
    holdSec: 4,
    exhaleSec: 4,
    hold2Sec: 4,
  },
  {
    name: "Deep Rest (4-7-8)",
    description: "Extended exhalation for total relaxation and muscle release",
    inhaleSec: 4,
    holdSec: 7,
    exhaleSec: 8,
  },
];

const DURATIONS = [
  { label: "1 Minute", seconds: 60 },
  { label: "2 Minutes", seconds: 120 },
  { label: "3 Minutes", seconds: 180 },
];

export function GuidedBreathingActivity({ onExit }: GuidedBreathingActivityProps) {
  // Config state
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(0);

  // Session state
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Live timer & cycle
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);

  const pattern = PATTERNS[selectedPatternIndex];

  // Sound chime toggle (soft synthesizer audio or silent)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Soft audio chime using Web Audio API for a relaxing tone
  const playChime = (type: BreathingPhase) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const freq = type === "inhale" ? 440 : type === "hold" ? 523.25 : 392;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Start breathing exercise
  const handleStart = () => {
    setSecondsRemaining(selectedDuration);
    setTotalSecondsElapsed(0);
    setCyclesCompleted(0);
    setCurrentPhase("inhale");
    setPhaseSecondsLeft(pattern.inhaleSec);
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
    playChime("inhale");
  };

  // Pause / Resume
  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Reset to configuration
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setSecondsRemaining(selectedDuration);
    setCurrentPhase("inhale");
    setPhaseSecondsLeft(pattern.inhaleSec);
    setTotalSecondsElapsed(0);
    setCyclesCompleted(0);
  };

  // Finish session
  const finishSession = (completedFull: boolean = true) => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(true);

    saveWellnessSession({
      activityType: "guided-breathing",
      activityTitle: "Guided Breathing",
      durationSeconds: totalSecondsElapsed || (selectedDuration - secondsRemaining),
      completed: completedFull,
      details: {
        breathingPattern: pattern.name,
        cyclesCompleted,
      },
    });
  };

  // Main breathing & timer loop
  useEffect(() => {
    if (!isActive || isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishSession(true);
          return 0;
        }
        return prev - 1;
      });

      setTotalSecondsElapsed((prev) => prev + 1);

      setPhaseSecondsLeft((prevPhaseSec) => {
        if (prevPhaseSec <= 1) {
          // Advance to next phase
          if (currentPhase === "inhale") {
            setCurrentPhase("hold");
            playChime("hold");
            return pattern.holdSec;
          } else if (currentPhase === "hold") {
            setCurrentPhase("exhale");
            playChime("exhale");
            return pattern.exhaleSec;
          } else if (currentPhase === "exhale") {
            if (pattern.hold2Sec && pattern.hold2Sec > 0) {
              setCurrentPhase("hold2");
              playChime("hold");
              return pattern.hold2Sec;
            } else {
              setCyclesCompleted((c) => c + 1);
              setCurrentPhase("inhale");
              playChime("inhale");
              return pattern.inhaleSec;
            }
          } else {
            // hold2 -> inhale
            setCyclesCompleted((c) => c + 1);
            setCurrentPhase("inhale");
            playChime("inhale");
            return pattern.inhaleSec;
          }
        }
        return prevPhaseSec - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, isCompleted, currentPhase, pattern]);

  // Phase text & instruction
  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case "inhale":
        return {
          title: "Breathe In Slowly",
          subtitle: "Fill your chest and belly with clean, calming air",
          scaleClass: "scale-125 md:scale-135",
          ringColor: "text-teal-400 stroke-teal-400",
          glowColor: "shadow-[0_0_60px_rgba(45,212,191,0.55)]",
          bgGradient: "from-teal-500/30 via-emerald-400/20 to-transparent",
        };
      case "hold":
      case "hold2":
        return {
          title: "Gently Hold",
          subtitle: "Stay still and let your body absorb the quiet stillness",
          scaleClass: "scale-125 md:scale-135",
          ringColor: "text-blue-400 stroke-blue-400",
          glowColor: "shadow-[0_0_60px_rgba(96,165,250,0.55)]",
          bgGradient: "from-blue-500/30 via-indigo-400/20 to-transparent",
        };
      case "exhale":
        return {
          title: "Breathe Out Softly",
          subtitle: "Release all tension, letting your shoulders gently drop",
          scaleClass: "scale-90 md:scale-85",
          ringColor: "text-purple-400 stroke-purple-400",
          glowColor: "shadow-[0_0_40px_rgba(192,132,252,0.4)]",
          bgGradient: "from-purple-500/30 via-pink-400/20 to-transparent",
        };
    }
  };

  const currentInfo = getPhaseInstruction();

  // Progress percentage of overall session
  const totalSessionProgress = selectedDuration > 0 ? ((selectedDuration - secondsRemaining) / selectedDuration) * 100 : 0;

  // Format time (mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Navigation */}
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
            <div className="h-8 w-8 rounded-xl bg-teal/15 text-teal flex items-center justify-center">
              <Wind className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Guided Breathing Space</h2>
              <p className="text-[11px] text-muted-foreground">Gentle rhythmic breathing for relaxation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-xl text-xs h-9 text-muted-foreground"
            title={soundEnabled ? "Mute chimes" : "Enable gentle chimes"}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="ml-1 text-[11px]">{soundEnabled ? "Chimes On" : "Silent"}</span>
          </Button>
        </div>
      </div>

      {/* Main Exercise Experience Area */}
      {!isActive && !isCompleted ? (
        /* Configuration Screen before starting */
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lift space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Healthcare Relaxation Tool
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Take a moment to pause and breathe
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Rhythmic breathing stimulates your parasympathetic nervous system, lowering stress hormone levels and bringing a calming sense of ease while you wait.
            </p>
          </div>

          {/* Session Duration Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              1. Choose Session Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DURATIONS.map((dur) => {
                const selected = selectedDuration === dur.seconds;
                return (
                  <button
                    key={dur.seconds}
                    type="button"
                    onClick={() => {
                      setSelectedDuration(dur.seconds);
                      setSecondsRemaining(dur.seconds);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                      selected
                        ? "gradient-primary text-primary-foreground border-primary shadow-soft"
                        : "bg-muted/30 border-border/80 text-foreground hover:bg-muted"
                    }`}
                  >
                    <Clock className={`h-4 w-4 ${selected ? "text-primary-foreground" : "text-primary"}`} />
                    <span className="font-bold text-sm">{dur.label}</span>
                    <span className={`text-[10px] ${selected ? "opacity-90" : "text-muted-foreground"}`}>
                      {dur.seconds / 60} min calm
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Breathing Pattern Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              2. Select Breathing Pattern
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PATTERNS.map((pat, idx) => {
                const selected = selectedPatternIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPatternIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 flex flex-col justify-between ${
                      selected
                        ? "bg-primary/10 border-primary shadow-xs"
                        : "bg-muted/20 border-border hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs ${selected ? "text-primary" : "text-foreground"}`}>
                          {pat.name}
                        </span>
                        {selected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{pat.description}</p>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                      <span className="text-teal font-semibold">In: {pat.inhaleSec}s</span> •{" "}
                      <span className="text-blue-500 font-semibold">Hold: {pat.holdSec}s</span> •{" "}
                      <span className="text-purple-500 font-semibold">Out: {pat.exhaleSec}s</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Action Button */}
          <div className="pt-4 text-center">
            <Button
              size="lg"
              onClick={handleStart}
              className="gradient-primary text-primary-foreground font-bold px-10 py-6 rounded-2xl shadow-lift text-sm transition-transform hover:scale-105"
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> Begin Breathing Exercise
            </Button>
            <p className="text-[11px] text-muted-foreground mt-2">
              Find a comfortable sitting position and gently relax your shoulders.
            </p>
          </div>
        </div>
      ) : isCompleted ? (
        /* Calm Completion Screen */
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-lift space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shadow-soft animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Breathing Session Completed
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Wonderful job taking mindful time for your wellbeing. Notice how your body and breathing feel right now.
            </p>
          </div>

          {/* Summary Metric Chips */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Total Time</span>
              <span className="font-extrabold text-foreground text-base block mt-0.5">
                {formatTime(totalSecondsElapsed)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Cycles</span>
              <span className="font-extrabold text-teal text-base block mt-0.5">
                {cyclesCompleted} Deep Breaths
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Pattern</span>
              <span className="font-extrabold text-primary text-xs block mt-1 truncate">
                {pattern.name.split(" ")[0]}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={handleStart}
              className="gradient-primary text-primary-foreground font-bold px-6 py-5 rounded-xl shadow-md text-xs w-full sm:w-auto"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" /> Start Another Session
            </Button>
            <Button
              variant="outline"
              onClick={onExit}
              className="rounded-xl text-xs px-6 py-5 font-semibold w-full sm:w-auto"
            >
              Return to Activities Hub
            </Button>
          </div>
        </div>
      ) : (
        /* Active Animated Guided Breathing Sphere */
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lift flex flex-col items-center justify-between min-h-[480px] sm:min-h-[540px] relative overflow-hidden">
          {/* Subtle Ambient Background Waves */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Top Status Bar: Remaining Time & Current Pattern */}
          <div className="w-full flex items-center justify-between text-xs relative z-10">
            <Badge variant="outline" className="font-mono text-xs px-3 py-1 font-bold">
              Pattern: {pattern.name.split(" ")[0]}
            </Badge>

            <div className="flex items-center gap-2 font-mono font-bold text-sm text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(secondsRemaining)} remaining</span>
            </div>
          </div>

          {/* Center Dynamic Breathing Sphere Animation */}
          <div className="my-auto py-8 relative flex flex-col items-center justify-center z-10">
            {/* Outer Progress Ring SVG */}
            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 pointer-events-none">
                {/* Background Ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="110"
                  className="stroke-muted/30 fill-none"
                  strokeWidth="6"
                />
                {/* Active Session Progress Ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="110"
                  className="stroke-primary fill-none transition-all duration-1000 ease-linear"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={2 * Math.PI * 110 * (1 - totalSessionProgress / 100)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Expanding & Contracting Pulsing Sphere */}
              <div
                className={`absolute rounded-full transition-all duration-[3500ms] ease-in-out flex flex-col items-center justify-center text-center p-6 bg-gradient-to-tr ${currentInfo.bgGradient} ${currentInfo.scaleClass} ${currentInfo.glowColor} border-2 border-primary/40 backdrop-blur-sm h-48 w-48 sm:h-52 sm:w-52`}
              >
                {/* Soft breathing icon */}
                <Wind className="h-6 w-6 text-primary mb-1 animate-pulse" />

                <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight transition-all duration-500">
                  {currentPhase === "inhale"
                    ? "Inhale"
                    : currentPhase === "hold" || currentPhase === "hold2"
                    ? "Hold"
                    : "Exhale"}
                </span>

                <span className="text-xs font-mono font-bold text-primary mt-1">
                  {phaseSecondsLeft}s
                </span>
              </div>
            </div>

            {/* Instruction Prompts */}
            <div className="mt-6 text-center space-y-1">
              <h3 className="text-lg font-bold text-foreground transition-all duration-500">
                {currentInfo.title}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {currentInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Bottom Live Controls */}
          <div className="w-full pt-4 border-t border-border/70 flex items-center justify-between gap-2 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="rounded-xl text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restart
            </Button>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleTogglePause}
                className={`rounded-xl text-xs font-bold px-5 h-10 ${
                  isPaused
                    ? "gradient-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="mr-1.5 h-3.5 w-3.5 fill-current" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-1.5 h-3.5 w-3.5" /> Pause
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => finishSession(false)}
                className="rounded-xl text-xs font-semibold h-10 text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
              >
                End Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
