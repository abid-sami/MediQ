import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCheck,
  Clock,
  Microscope,
  Calendar,
  User,
  Activity,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { DoctorNotification } from "@/data/doctor-data";

interface NotificationsModuleProps {
  notifications: DoctorNotification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

export function NotificationsModule({
  notifications,
  onMarkAllRead,
  onMarkRead,
}: NotificationsModuleProps) {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredNotifs = notifications.filter((n) =>
    filterType === "all" ? true : n.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Healthcare Alert & Notifications Center
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time updates on appointment changes, lab report readiness, and emergency queue alerts.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            onMarkAllRead();
            toast.success("All notifications marked as read");
          }}
          className="rounded-xl text-xs font-semibold"
        >
          <CheckCheck className="mr-1.5 h-4 w-4 text-emerald-500" /> Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "appointment", "lab", "diagnostic", "patient"].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(type)}
            className={`rounded-xl text-xs font-semibold capitalize ${
              filterType === type ? "gradient-primary text-primary-foreground" : ""
            }`}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.read
                  ? "bg-card/50 border-border"
                  : "bg-card border-primary/40 shadow-xs ring-1 ring-primary/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    n.type === "lab"
                      ? "bg-teal/10 text-teal"
                      : n.type === "appointment"
                      ? "bg-primary/10 text-primary"
                      : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {n.type === "lab" ? (
                    <Microscope className="h-5 w-5" />
                  ) : n.type === "appointment" ? (
                    <Calendar className="h-5 w-5" />
                  ) : (
                    <Activity className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">{n.title}</h4>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
              </div>

              <span className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                <Clock className="h-3 w-3" /> {n.timestamp}
              </span>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-card border border-border rounded-2xl">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">No notifications found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
