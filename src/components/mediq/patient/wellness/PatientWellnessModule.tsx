import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wind,
  Layers,
  Palette,
  Clock,
  CheckCircle2,
  Heart,
  History,
  ArrowRight,
  ShieldCheck,
  Smile,
  Activity,
  Calendar,
} from "lucide-react";
import {
  WellnessActivityType,
  WellnessSessionRecord,
  getStoredWellnessSessions,
} from "@/data/wellness-data";
import { GuidedBreathingActivity } from "./GuidedBreathingActivity";
import { MemoryMatchActivity } from "./MemoryMatchActivity";
import { CalmColoringActivity } from "./CalmColoringActivity";

interface PatientWellnessModuleProps {
  initialActivity?: WellnessActivityType | null;
}

export function PatientWellnessModule({ initialActivity }: PatientWellnessModuleProps) {
  const [activeActivity, setActiveActivity] = useState<WellnessActivityType | null>(initialActivity || null);
  const [sessionHistory, setSessionHistory] = useState<WellnessSessionRecord[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Load session history
  const loadHistory = () => {
    const records = getStoredWellnessSessions();
    setSessionHistory(records);
  };

  useEffect(() => {
    loadHistory();
  }, [activeActivity]);

  // Compute summary stats
  const totalCompletedSessions = sessionHistory.filter((s) => s.completed).length;
  const totalRelaxationSeconds = sessionHistory.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalRelaxationSeconds / 60);

  // If an activity is active, render it directly
  if (activeActivity === "guided-breathing") {
    return <GuidedBreathingActivity onExit={() => setActiveActivity(null)} />;
  }

  if (activeActivity === "memory-match") {
    return <MemoryMatchActivity onExit={() => setActiveActivity(null)} />;
  }

  if (activeActivity === "calm-coloring") {
    return <CalmColoringActivity onExit={() => setActiveActivity(null)} />;
  }

  // Otherwise, render the Main Wellness & Relaxation Hub
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="gradient-primary p-6 sm:p-8 rounded-3xl text-primary-foreground shadow-lift relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Patient Wellness & Relaxation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mindful Moments & Gentle Relaxation
          </h1>
          <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
            Simple, low-pressure activities designed to bring calm and gentle focus while you wait for appointments, recover, or take a peaceful mental break.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="relative z-10 flex sm:flex-col items-center sm:items-end justify-between gap-3 bg-black/15 p-4 rounded-2xl border border-white/20 backdrop-blur-md shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider block">Mindful Time</span>
            <span className="text-2xl font-black text-white">{totalMinutes} Mins</span>
          </div>
          <div className="h-8 w-px bg-white/20 sm:hidden" />
          <div className="text-right">
            <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider block">Completed</span>
            <span className="text-sm font-extrabold text-emerald-300">{totalCompletedSessions} Sessions</span>
          </div>
        </div>
      </div>

      {/* 3 Core Activities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Available Activities</h2>
            <p className="text-xs text-muted-foreground">Select an exercise to begin at your own comfortable pace</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryModal(!showHistoryModal)}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <History className="h-3.5 w-3.5 text-primary" />
            <span>{showHistoryModal ? "Hide History" : "View Session History"}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Guided Breathing */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft hover:shadow-lift hover:border-teal/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-teal/15 text-teal flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Wind className="h-6 w-6" />
                </div>
                <Badge className="bg-teal/10 text-teal border-teal/20 text-[10px] font-bold">
                  1 - 3 Mins
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-teal transition-colors">
                  Guided Breathing
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Take a few minutes to relax and breathe. Watch the soothing sphere expand and contract with rhythmic guidance.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-teal" /> 4-4-6 Calm & Box Breathing
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-teal" /> Smooth visual expansion & ring
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-teal" /> Optional gentle audio chimes
                </div>
              </div>
            </div>

            <Button
              onClick={() => setActiveActivity("guided-breathing")}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-2xl py-5 shadow-soft text-xs gap-1.5 group-hover:shadow-md"
            >
              <span>Start Breathing</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 2: Memory Match */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft hover:shadow-lift hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[10px] font-bold">
                  3 Levels
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-purple-500 transition-colors">
                  Memory Match
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  A simple memory activity at your own pace. Flip healthcare-themed cards with zero timers or scoring pressure.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-purple-500" /> Easy (6), Medium (12), Hard (18)
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-purple-500" /> Heart, Stethoscope & Care icons
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-purple-500" /> Encouraging supportive feedback
                </div>
              </div>
            </div>

            <Button
              onClick={() => setActiveActivity("memory-match")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl py-5 shadow-soft text-xs gap-1.5 group-hover:shadow-md"
            >
              <span>Start Memory Match</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 3: Calm Coloring */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft hover:shadow-lift hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Palette className="h-6 w-6" />
                </div>
                <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 text-[10px] font-bold">
                  6 Artworks
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-pink-500 transition-colors">
                  Calm Coloring
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Relax and create something. Tap to color peaceful illustrations including lotuses, trees, hospitals, and mandalas.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-pink-500" /> Pastel, Earth & Serene palettes
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-pink-500" /> Undo, Redo, Eraser & Reset
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-pink-500" /> Save your artwork to history
                </div>
              </div>
            </div>

            <Button
              onClick={() => setActiveActivity("calm-coloring")}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-2xl py-5 shadow-soft text-xs gap-1.5 group-hover:shadow-md"
            >
              <span>Start Coloring</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Optional Session History Section */}
      {showHistoryModal && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-lift space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Personal Relaxation Session History
            </h3>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {sessionHistory.length} Recorded Sessions
            </Badge>
          </div>

          {sessionHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              <Smile className="h-8 w-8 mx-auto mb-2 opacity-30 text-primary" />
              <p className="font-semibold">No sessions recorded yet.</p>
              <p className="text-[11px] mt-0.5">Start any relaxation activity above to record your mindful time.</p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-muted/10">
              {sessionHistory.slice(0, 8).map((record) => (
                <div key={record.id} className="p-4 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      {record.activityType === "guided-breathing" ? (
                        <Wind className="h-4 w-4 text-teal" />
                      ) : record.activityType === "memory-match" ? (
                        <Layers className="h-4 w-4 text-purple-500" />
                      ) : (
                        <Palette className="h-4 w-4 text-pink-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{record.activityTitle}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(record.timestamp).toLocaleDateString()} at{" "}
                        {new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {record.details?.difficulty ? ` • ${record.details.difficulty} Level` : ""}
                        {record.details?.artworkTitle ? ` • "${record.details.artworkTitle}"` : ""}
                        {record.details?.cyclesCompleted ? ` • ${record.details.cyclesCompleted} Cycles` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      ✓ Completed
                    </Badge>
                    <p className="text-[10px] font-mono text-muted-foreground">{record.durationSeconds}s duration</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Healthcare Disclaimer & UX Notice */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 text-xs text-muted-foreground flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <h4 className="font-bold text-foreground">Healthcare Relaxation & Wellness Notice</h4>
          <p className="text-[11px]">
            These interactive activities are provided solely as wellness and relaxation tools to encourage comfort and calm while resting or waiting. They do not constitute medical treatments, psychiatric therapies, or diagnostic procedures.
          </p>
        </div>
      </div>
    </div>
  );
}
