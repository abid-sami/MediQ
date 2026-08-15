import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Stethoscope,
  Siren,
  Building2,
  Pill,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Smile,
  Activity,
  Layers,
  Droplet,
  Flower2,
  Dna,
} from "lucide-react";
import { saveWellnessSession } from "@/data/wellness-data";

interface MemoryMatchActivityProps {
  onExit: () => void;
}

type Difficulty = "Easy" | "Medium" | "Hard";

interface CardItem {
  uid: string;
  cardId: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const AVAILABLE_CARDS = [
  { id: "heart", name: "Heart Care", icon: Heart, color: "text-red-500", bgLight: "bg-red-500/10 border-red-500/30" },
  { id: "stethoscope", name: "Stethoscope", icon: Stethoscope, color: "text-teal", bgLight: "bg-teal/10 border-teal/30" },
  { id: "ambulance", name: "Ambulance", icon: Siren, color: "text-amber-500", bgLight: "bg-amber-500/10 border-amber-500/30" },
  { id: "hospital", name: "Hospital", icon: Building2, color: "text-blue-500", bgLight: "bg-blue-500/10 border-blue-500/30" },
  { id: "medicine", name: "Medicine", icon: Pill, color: "text-purple-500", bgLight: "bg-purple-500/10 border-purple-500/30" },
  { id: "activity", name: "Mindfulness", icon: Activity, color: "text-emerald-500", bgLight: "bg-emerald-500/10 border-emerald-500/30" },
  { id: "droplet", name: "Pure Droplet", icon: Droplet, color: "text-sky-500", bgLight: "bg-sky-500/10 border-sky-500/30" },
  { id: "nature", name: "Botanical Healing", icon: Flower2, color: "text-rose-400", bgLight: "bg-rose-400/10 border-rose-400/30" },
  { id: "dna", name: "Life & Vitality", icon: Dna, color: "text-indigo-500", bgLight: "bg-indigo-500/10 border-indigo-500/30" },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { pairCount: number; gridClass: string; label: string }> = {
  Easy: { pairCount: 3, gridClass: "grid-cols-2 sm:grid-cols-3 max-w-lg", label: "6 Cards (3 Pairs)" },
  Medium: { pairCount: 6, gridClass: "grid-cols-3 sm:grid-cols-4 max-w-2xl", label: "12 Cards (6 Pairs)" },
  Hard: { pairCount: 9, gridClass: "grid-cols-3 sm:grid-cols-6 max-w-4xl", label: "18 Cards (9 Pairs)" },
};

const SUPPORTIVE_MESSAGES = [
  "Take your time — there is no rush.",
  "Nice match! Breathing and relaxing.",
  "Keep going at your own comfortable pace.",
  "Wonderful focus and presence.",
  "Gentle progress is peaceful progress.",
  "You're doing wonderfully.",
];

export function MemoryMatchActivity({ onExit }: MemoryMatchActivityProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [supportiveMessage, setSupportiveMessage] = useState<string>("Take your time at your own pace.");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Setup / Initialize cards
  const initializeGame = (diff: Difficulty) => {
    const config = DIFFICULTY_CONFIG[diff];
    const selected = AVAILABLE_CARDS.slice(0, config.pairCount);

    // Duplicate into pairs
    const deck: CardItem[] = [];
    selected.forEach((item) => {
      deck.push({
        uid: `${item.id}-1`,
        cardId: item.id,
        name: item.name,
        icon: item.icon,
        color: item.color,
        bgLight: item.bgLight,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        uid: `${item.id}-2`,
        cardId: item.id,
        name: item.name,
        icon: item.icon,
        color: item.color,
        bgLight: item.bgLight,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedUids([]);
    setMoves(0);
    setMatchedPairsCount(0);
    setIsCompleted(false);
    setIsProcessing(false);
    setSupportiveMessage("Take your time — there is no rush.");
    setStartTime(Date.now());
  };

  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);

  // Handle Card Click
  const handleCardClick = (card: CardItem) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;

    // Flip card
    const updatedCards = cards.map((c) =>
      c.uid === card.uid ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedUids, card.uid];
    setFlippedUids(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsProcessing(true);

      const firstCard = updatedCards.find((c) => c.uid === newFlipped[0]);
      const secondCard = updatedCards.find((c) => c.uid === newFlipped[1]);

      if (firstCard && secondCard && firstCard.cardId === secondCard.cardId) {
        // MATCH!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === firstCard.cardId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedUids([]);
          setIsProcessing(false);

          const newMatchCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchCount);

          // Rotate friendly messages
          const randomMsg = SUPPORTIVE_MESSAGES[Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)];
          setSupportiveMessage(randomMsg);

          // Check if all pairs found
          if (newMatchCount === DIFFICULTY_CONFIG[difficulty].pairCount) {
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            setIsCompleted(true);
            saveWellnessSession({
              activityType: "memory-match",
              activityTitle: "Memory Match",
              durationSeconds: elapsed,
              completed: true,
              details: {
                difficulty,
                moves: moves + 1,
                pairsFound: newMatchCount,
              },
            });
          }
        }, 600);
      } else {
        // NO MATCH: Soft flip back after gentle pause
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.uid) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedUids([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const totalPairs = DIFFICULTY_CONFIG[difficulty].pairCount;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Gentle Memory Match</h2>
              <p className="text-[11px] text-muted-foreground">Relaxing visual matching at your own pace</p>
            </div>
          </div>
        </div>

        {/* Difficulty Selector Switcher */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border self-end sm:self-auto">
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDifficulty(d);
                initializeGame(d);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                difficulty === d
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Surface */}
      {!isCompleted ? (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lift space-y-6">
          {/* Supportive Progress Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs px-3 py-1 font-bold">
                Pairs: {matchedPairsCount} / {totalPairs}
              </Badge>
              <span className="text-muted-foreground font-semibold">
                Moves: <strong className="text-foreground">{moves}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-teal font-medium bg-teal/10 px-3 py-1 rounded-full border border-teal/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{supportiveMessage}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => initializeGame(difficulty)}
              className="rounded-xl text-xs text-muted-foreground hover:text-foreground h-8"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Cards
            </Button>
          </div>

          {/* Cards Grid */}
          <div className={`grid gap-3.5 mx-auto ${DIFFICULTY_CONFIG[difficulty].gridClass}`}>
            {cards.map((card) => {
              const IconComp = card.icon;
              const isRevealed = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.uid}
                  type="button"
                  onClick={() => handleCardClick(card)}
                  disabled={card.isMatched || isProcessing}
                  className={`aspect-square rounded-2xl border transition-all duration-300 transform relative flex flex-col items-center justify-center p-3 select-none ${
                    card.isMatched
                      ? `${card.bgLight} shadow-xs scale-95 opacity-85`
                      : isRevealed
                      ? "bg-card border-primary shadow-soft scale-100"
                      : "bg-muted/40 hover:bg-muted/70 border-border/80 hover:border-primary/40 hover:scale-[1.03] cursor-pointer"
                  }`}
                >
                  {isRevealed ? (
                    <div className="flex flex-col items-center justify-center space-y-1 animate-in fade-in zoom-in-75 duration-200">
                      <IconComp className={`h-8 w-8 sm:h-9 sm:w-9 ${card.color}`} />
                      <span className="text-[10px] font-bold text-foreground text-center leading-tight truncate max-w-full">
                        {card.name}
                      </span>
                      {card.isMatched && (
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                          ✓ Matched
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1 opacity-50">
                      <div className="h-7 w-7 rounded-xl bg-muted border border-border/60 flex items-center justify-center text-muted-foreground font-black text-xs">
                        Q
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">Tap</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Gentle Bottom Prompt */}
          <p className="text-center text-[11px] text-muted-foreground pt-2">
            No timers or countdowns. Enjoy finding pairs at your own pace.
          </p>
        </div>
      ) : (
        /* Completion Celebration Screen */
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-lift space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-purple-500/15 text-purple-500 flex items-center justify-center shadow-soft animate-bounce">
            <Smile className="h-10 w-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              All Pairs Completed!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Wonderful job! You completed the {difficulty.toLowerCase()} memory match exercise. Taking gentle moments of focus helps refresh the mind.
            </p>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Difficulty</span>
              <span className="font-extrabold text-foreground text-base block mt-0.5">{difficulty}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Pairs Matched</span>
              <span className="font-extrabold text-teal text-base block mt-0.5">
                {totalPairs} / {totalPairs}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border text-center">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Total Moves</span>
              <span className="font-extrabold text-primary text-base block mt-0.5">{moves}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => initializeGame(difficulty)}
              className="gradient-primary text-primary-foreground font-bold px-6 py-5 rounded-xl shadow-md text-xs w-full sm:w-auto"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" /> Play Again
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
      )}
    </div>
  );
}
