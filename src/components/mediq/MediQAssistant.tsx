import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X, Bot, UserRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { askMediQAssistant } from "@/utils/ai-assistant.functions";
import { useLanguage } from "@/hooks/use-language";

type Message = { id: string; role: "user" | "assistant"; content: string };

const welcome = "Hi, I’m MediQ Assistant. I can help you find doctors and departments, understand appointments and hospital services, or check live MediQ information.";
const suggestions = ["Find a doctor", "Show hospital bed availability", "How do I book an appointment?", "Which pharmacy medicines are available?"];

export function MediQAssistant() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: "welcome", role: "assistant", content: welcome }]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async (value = input) => {
    const content = value.trim();
    if (!content || sending) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    try {
      const result = await askMediQAssistant({
        data: { messages: nextMessages.map(({ role, content: text }) => ({ role, content: text })) },
      });
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: result.answer }]);
    } catch (error: any) {
      toast.error(error?.message || "The assistant is unavailable right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <section className="fixed inset-x-4 bottom-24 z-[70] flex h-[min(680px,calc(100vh-7rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[410px]" aria-label="MediQ AI Assistant">
          <header className="flex items-center justify-between bg-gradient-to-r from-primary to-teal px-5 py-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15"><Sparkles className="h-5 w-5" /></span>
              <div><p className="font-bold">MediQ Assistant</p><p className="text-xs text-primary-foreground/75">Live healthcare platform help</p></div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full text-primary-foreground hover:bg-white/15" aria-label="Close assistant"><X className="h-5 w-5" /></Button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-background/70 p-4">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">I use MediQ’s current doctors, hospitals, beds, and pharmacy data when it is relevant.</div>
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}>
                {message.role === "assistant" && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Bot className="h-4 w-4" /></span>}
                <div className={cn("max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", message.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border bg-card text-foreground")}>{message.content}</div>
                {message.role === "user" && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><UserRound className="h-4 w-4" /></span>}
              </div>
            ))}
            {sending && <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary"><Bot className="h-4 w-4" /></span><Loader2 className="h-4 w-4 animate-spin" /> Thinking...</div>}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && <div className="flex gap-2 overflow-x-auto border-t border-border bg-card px-4 py-3 no-scrollbar">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void sendMessage(suggestion)} className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">{t(suggestion)}</button>)}</div>}
          <form onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} className="flex gap-2 border-t border-border bg-card p-3">
            <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask MediQ Assistant..." aria-label="Ask MediQ Assistant" className="h-11 rounded-2xl bg-background" disabled={sending} />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-2xl" disabled={!input.trim() || sending} aria-label="Send message"><Send className="h-4 w-4" /></Button>
          </form>
        </section>
      )}
      <Button onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-4 z-[70] h-14 rounded-full bg-gradient-to-r from-primary to-teal px-5 text-primary-foreground shadow-xl transition-transform hover:scale-105 sm:right-6" aria-label="Open MediQ AI Assistant"><span className="relative mr-2"><MessageCircle className="h-5 w-5" /><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-300 ring-2 ring-primary" /></span><span className="hidden font-bold sm:inline">MediQ Assistant</span></Button>
    </>
  );
}
