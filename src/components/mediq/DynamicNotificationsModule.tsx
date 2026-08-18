import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Send, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import {
  fetchSupabaseNotifications,
  fetchSupabaseProfiles,
  markAllSupabaseNotificationsRead,
  markSupabaseNotificationRead,
  sendSupabaseCustomNotification,
  SupabaseNotification,
} from "@/services/supabase-service";

interface RecipientProfile { id: string; name?: string; role?: string; email?: string; }
interface Props { userId?: string; canCompose?: boolean; }

export function DynamicNotificationsModule({ userId, canCompose = false }: Props) {
  const [notifications, setNotifications] = useState<SupabaseNotification[]>([]);
  const [recipients, setRecipients] = useState<RecipientProfile[]>([]);
  const [target, setTarget] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadNotifications = async () => {
    if (!userId) return;
    const result = await fetchSupabaseNotifications(userId);
    setNotifications(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    void loadNotifications();
    const interval = window.setInterval(() => void loadNotifications(), 10000);
    const channel = supabase
      .channel(`mediq-notifications-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "mediq_notifications", filter: `recipient_id=eq.${userId}` }, () => void loadNotifications())
      .subscribe();
    return () => { window.clearInterval(interval); void supabase.removeChannel(channel); };
  }, [userId]);

  useEffect(() => {
    if (!canCompose) return;
    void fetchSupabaseProfiles().then((profiles) => setRecipients((profiles || []) as RecipientProfile[]));
  }, [canCompose]);

  const roles = useMemo(() => Array.from(new Set(recipients.map((r) => r.role).filter(Boolean))).sort(), [recipients]);
  const selectedRecipients = useMemo(() => {
    if (target === "all") return recipients.map((r) => r.id);
    if (target.startsWith("role:")) return recipients.filter((r) => r.role === target.slice(5)).map((r) => r.id);
    return selectedIds;
  }, [recipients, target, selectedIds]);
  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    if (!userId) return;
    await markSupabaseNotificationRead(id, userId);
    setNotifications((current) => current.map((n) => n.id === id ? { ...n, read: true } : n));
  };
  const markAllRead = async () => {
    if (!userId) return;
    await markAllSupabaseNotificationsRead(userId);
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };
  const sendNotification = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return toast.error("Your user session is not ready.");
    setSending(true);
    const result = await sendSupabaseCustomNotification({ senderId: userId, recipientIds: selectedRecipients, title, message, type });
    setSending(false);
    if (result.error) return toast.error(result.error.message || "Could not send notification.");
    setTitle(""); setMessage(""); setSelectedIds([]);
    toast.success(`Notification sent to ${selectedRecipients.length} recipient${selectedRecipients.length === 1 ? "" : "s"}.`);
  };

  return (
    <div className="space-y-6">
      {canCompose && (
        <form onSubmit={sendNotification} className="space-y-4 rounded-2xl border border-primary/20 bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /><div><h2 className="text-lg font-bold">Send Custom Notification</h2><p className="text-xs text-muted-foreground">Send an announcement to everyone, a role, or selected users.</p></div></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><Label className="text-xs font-bold">Audience</Label><select value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs"><option value="all">All users</option>{roles.map((role) => <option key={role} value={`role:${role}`}>{role}</option>)}<option value="selected">Selected users</option></select></div>
            <div><Label className="text-xs font-bold">Type</Label><select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-3 text-xs"><option value="general">General</option><option value="urgent">Urgent</option><option value="announcement">Announcement</option><option value="maintenance">Maintenance</option></select></div>
            <div className="flex items-end"><Badge variant="outline" className="h-10 w-full justify-center rounded-xl text-xs"><Users className="mr-1.5 h-3.5 w-3.5" /> {selectedRecipients.length} recipients</Badge></div>
          </div>
          {target === "selected" && <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-border p-2">{recipients.map((recipient) => <label key={recipient.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-muted"><input type="checkbox" checked={selectedIds.includes(recipient.id)} onChange={(e) => setSelectedIds((current) => e.target.checked ? [...current, recipient.id] : current.filter((id) => id !== recipient.id))} /><UserCheck className="h-3.5 w-3.5 text-primary" /><span className="font-semibold">{recipient.name || recipient.email}</span><span className="ml-auto text-muted-foreground">{recipient.role}</span></label>)}</div>}
          <div className="grid gap-3 sm:grid-cols-2"><Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="rounded-xl text-xs" /><Textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." className="min-h-10 rounded-xl text-xs sm:col-span-1" /></div>
          <Button type="submit" disabled={sending || selectedRecipients.length === 0} className="rounded-xl gradient-primary text-xs font-bold"><Send className="mr-1.5 h-3.5 w-3.5" /> {sending ? "Sending..." : "Send Notification"}</Button>
        </form>
      )}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5"><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /><div><h2 className="text-lg font-bold">Notifications</h2><p className="text-xs text-muted-foreground">Live messages and operational updates for your account.</p></div>{unread > 0 && <Badge className="bg-primary text-primary-foreground">{unread} unread</Badge>}</div><Button variant="outline" onClick={() => void markAllRead()} className="rounded-xl text-xs font-semibold"><CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read</Button></div>
      <div className="space-y-3">{loading ? <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading notifications...</div> : notifications.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No notifications yet.</div> : notifications.map((notification) => <button key={notification.id} type="button" onClick={() => void markRead(notification.id)} className={`w-full rounded-2xl border p-4 text-left transition-colors ${notification.read ? "border-border bg-card/60" : "border-primary/40 bg-primary/5"}`}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h3 className="text-sm font-bold">{notification.title}</h3><Badge variant="outline" className="text-[10px] capitalize">{notification.type}</Badge></div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{notification.message}</p></div><span className="whitespace-nowrap text-[10px] text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</span></div></button>)}</div>
    </div>
  );
}
