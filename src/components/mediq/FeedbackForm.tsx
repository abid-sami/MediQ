import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseFeedback } from "@/services/supabase-service";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !feedback.trim()) {
      toast.error("Please enter your name and feedback.");
      return;
    }

    setSubmitting(true);
    const { error } = await createSupabaseFeedback({ name, feedback });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not submit feedback.");
      return;
    }

    setName("");
    setFeedback("");
    toast.success("Thank you. Your feedback was submitted.");
  };

  return (
    <section id="feedback" className="border-t border-border bg-card/50 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-primary"><MessageSquare className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-widest">Feedback</span></div>
          <h2 className="text-2xl font-bold tracking-tight">Help us improve MediQ</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Share your experience with our team. Your feedback is reviewed by the Admin and Receptionist teams.</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="feedback-name">Name *</Label><Input id="feedback-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="feedback-message">Feedback *</Label><Textarea id="feedback-message" value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Tell us what you think..." rows={4} required /></div>
          </div>
          <Button type="submit" disabled={submitting} className="mt-4 rounded-xl gradient-primary font-bold"><Send className="mr-2 h-4 w-4" />{submitting ? "Submitting..." : "Submit Feedback"}</Button>
        </form>
      </div>
    </section>
  );
}
