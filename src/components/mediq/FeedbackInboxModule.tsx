import { useEffect, useState } from "react";
import { MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HomeFeedback, deleteSupabaseFeedback, fetchSupabaseFeedback } from "@/services/supabase-service";

export function FeedbackInboxModule() {
  const [items, setItems] = useState<HomeFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setItems(await fetchSupabaseFeedback());
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (item: HomeFeedback) => {
    const { error } = await deleteSupabaseFeedback(item.id);
    if (error) {
      toast.error(error.message || "Could not remove feedback.");
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    toast.success("Feedback removed.");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="flex items-center gap-2 text-lg font-bold"><MessageSquare className="h-5 w-5 text-primary" /> Home Feedback</h2><p className="mt-1 text-xs text-muted-foreground">Feedback submitted by visitors from the Home page.</p></div>
        <Button variant="outline" onClick={() => void load()} className="rounded-xl text-xs font-bold"><RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh</Button>
      </div>
      {loading ? <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading feedback...</div> : items.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No feedback submitted yet.</div> : <div className="space-y-3">{items.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-xs"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold">{item.name}</h3><p className="text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p></div><Button variant="ghost" size="icon" onClick={() => void remove(item)} className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{item.feedback}</p></article>)}</div>}
    </div>
  );
}
