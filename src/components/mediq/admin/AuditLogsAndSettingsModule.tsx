import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShieldCheck,
  History,
  Settings,
  Lock,
  Building2,
  Bell,
  Siren,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminAuditLog } from "@/data/admin-data";

interface AuditLogsAndSettingsModuleProps {
  logs: AdminAuditLog[];
}

export function AuditLogsAndSettingsModule({
  logs,
}: AuditLogsAndSettingsModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"logs" | "settings">("logs");

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-6">
          <TabsTrigger value="logs" className="rounded-lg text-xs font-semibold">
            <History className="mr-1.5 h-3.5 w-3.5 text-primary" /> Enterprise System Audit Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg text-xs font-semibold">
            <Settings className="mr-1.5 h-3.5 w-3.5 text-teal" /> Platform Governance Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border font-bold text-sm flex items-center justify-between">
              <span>Real-Time Platform Governance Audit Logs</span>
              <Badge variant="outline" className="text-xs font-bold">{logs.length} Recent Actions</Badge>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">User & Role</th>
                  <th className="p-3.5">Action Logged</th>
                  <th className="p-3.5">Module</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">{l.user}</p>
                      <Badge variant="outline" className="text-[10px]">{l.role}</Badge>
                    </td>
                    <td className="p-3.5 font-semibold text-foreground max-w-xs">{l.action}</td>
                    <td className="p-3.5 font-mono text-primary">{l.module}</td>
                    <td className="p-3.5 font-mono text-muted-foreground">{l.date} ({l.time})</td>
                    <td className="p-3.5 text-right">
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        ✓ {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-2xl mx-auto shadow-xs">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Settings className="h-4 w-4 text-primary" /> MediQ Platform Governance & Security Policy
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Platform Network Name</Label>
                <Input defaultValue="MediQ Global Healthcare Network" className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Emergency Dispatch Auto-Routing</Label>
                <Input defaultValue="Nearest Trauma Center Priority Enabled" className="mt-1 rounded-xl text-xs" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Session Inactivity Timeout (Minutes)</Label>
                <Input type="number" defaultValue="30" className="mt-1 rounded-xl text-xs font-bold" />
              </div>
            </div>

            <Button
              onClick={() => toast.success("Saved Platform Settings")}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-4 shadow-md"
            >
              <Save className="mr-1.5 h-4 w-4" /> Save Governance Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
