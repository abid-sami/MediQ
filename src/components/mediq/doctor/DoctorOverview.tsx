import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Pill,
  RotateCcw,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  FlaskConical,
  Activity,
  ArrowUpRight,
  Play,
  User,
  Settings,
  Save,
  Check,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import {
  Appointment,
  Patient,
  DigitalPrescription,
  FollowUpItem,
  LabRequest,
} from "@/data/doctor-data";
import {
  getDoctorSchedules,
  updateDoctorSchedule,
  syncDoctorSchedulesFromProfiles,
  DoctorScheduleConfig,
} from "@/data/doctor-schedule-store";
import { useAuth } from "@/hooks/use-auth";

interface DoctorOverviewProps {
  appointments: Appointment[];
  patients: Patient[];
  prescriptions: DigitalPrescription[];
  followUps: FollowUpItem[];
  labRequests: LabRequest[];
  onNavigateTab: (tab: string) => void;
  onStartConsultation: (appointment: Appointment) => void;
  onOpenPatientProfile: (patient: Patient) => void;
}

export function DoctorOverview({
  appointments,
  patients,
  prescriptions,
  followUps,
  labRequests,
  onNavigateTab,
  onStartConsultation,
  onOpenPatientProfile,
}: DoctorOverviewProps) {
  const { user, profile: authProfile } = useAuth();
  const doctorId = user?.id || "";

  const defaultSchedule = (): DoctorScheduleConfig => ({
    doctorId,
    doctorName: authProfile?.name || "Doctor",
    specialization: authProfile?.specialty || "General Physician",
    department: authProfile?.specialty || "General Medicine",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    dailyPatientLimit: 20,
    currentBookedCount: 0,
    isAcceptingBookings: true,
    workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    consultationFee: 0,
    onVacation: false,
  });

  // Doctor Consultation Schedule & Daily Patient Capacity State
  const [schedule, setSchedule] = useState<DoctorScheduleConfig>(() => {
    const all = getDoctorSchedules();
    return (doctorId && all[doctorId]) || defaultSchedule();
  });

  // If this doctor doesn't have a schedule saved locally yet (e.g. first
  // login on a new device), pull it in from Supabase instead of falling
  // back to another doctor's hardcoded data.
  useEffect(() => {
    if (!doctorId) return;
    const existing = getDoctorSchedules()[doctorId];
    if (!existing) {
      syncDoctorSchedulesFromProfiles().then((all) => {
        if (all[doctorId]) setSchedule(all[doctorId]);
      });
    }
  }, [doctorId]);

  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);
  const [patientLimit, setPatientLimit] = useState(schedule.dailyPatientLimit);
  const [accepting, setAccepting] = useState(schedule.isAcceptingBookings);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DoctorScheduleConfig = {
      ...schedule,
      doctorId,
      startTime,
      endTime,
      dailyPatientLimit: Number(patientLimit),
      isAcceptingBookings: accepting,
    };
    updateDoctorSchedule(updated);
    setSchedule(updated);
    toast.success("Consultation Schedule & Patient Capacity Saved", {
      description: `Hours: ${startTime} - ${endTime} | Daily Limit: ${patientLimit} Patients`,
    });
  };

  // Counts
  const todayCount = appointments.length;
  const waitingCount = appointments.filter((a) => a.status === "Waiting" || a.status === "Checked In").length;
  const upcomingCount = appointments.filter((a) => a.status === "Waiting" || a.status === "Checked In").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const rxCount = prescriptions.length;
  const followUpCount = followUps.length;

  const kpis = [
    {
      title: "Today's Appointments",
      value: todayCount,
      sub: "14 scheduled for today",
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      tab: "appointments",
    },
    {
      title: "Waiting Patients",
      value: waitingCount,
      sub: "In clinic waiting room",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "appointments",
    },
    {
      title: "Upcoming Appointments",
      value: upcomingCount,
      sub: "Next 4 hours schedule",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      tab: "appointments",
    },
    {
      title: "Completed Consultations",
      value: completedCount,
      sub: "Finished sessions today",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "appointments",
    },
    {
      title: "Prescriptions Issued",
      value: rxCount,
      sub: "E-prescriptions generated",
      icon: Pill,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "prescriptions",
    },
    {
      title: "Follow-ups",
      value: followUpCount,
      sub: "Scheduled return visits",
      icon: RotateCcw,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "followups",
    },
  ];

  const waitingAppointments = appointments.filter((a) => a.status === "Waiting" || a.status === "Checked In");

  return (
    <div className="space-y-6">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(kpi.tab)}
              className={`p-4 rounded-2xl border ${kpi.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <IconComponent className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div>
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {kpi.value}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Patient Queue & Schedule Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule & Daily Patient Limit Card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-primary" /> Consultation Schedule & Daily Patient Capacity
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure your working hours and maximum patient limit. Visitors book appointments & receive serial numbers based on this.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={
                    accepting
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                  }
                >
                  {accepting ? "Booking Open" : "Booking Closed"}
                </Badge>
              </div>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Start Time</Label>
                  <Input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="mt-1 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-muted-foreground">End Time</Label>
                  <Input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 05:00 PM"
                    className="mt-1 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Total Patient Limit / Day</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={patientLimit}
                    onChange={(e) => setPatientLimit(Number(e.target.value))}
                    className="mt-1 rounded-xl text-xs font-bold text-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 bg-muted/20 p-3.5 rounded-xl border border-border">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Booked Today</span>
                    <span className="font-extrabold text-sm text-foreground">{schedule.currentBookedCount} / {patientLimit}</span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Next Serial Token</span>
                    <span className="font-extrabold text-sm text-teal font-mono">Serial #{String(schedule.currentBookedCount + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="h-6 w-px bg-border hidden sm:block" />
                  <div className="hidden sm:block">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Slots Remaining</span>
                    <span className="font-extrabold text-sm text-emerald-600">{Math.max(0, patientLimit - schedule.currentBookedCount)} Available</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAccepting((prev) => !prev)}
                    className="h-9 text-xs rounded-xl font-semibold"
                  >
                    {accepting ? "Close Bookings" : "Open Bookings"}
                  </Button>

                  <Button type="submit" className="h-9 gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs">
                    <Save className="mr-1.5 h-3.5 w-3.5" /> Save Schedule
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Waiting Room Queue ({waitingAppointments.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Patients currently waiting in the clinic for consultation.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("appointments")}
                className="text-xs font-semibold text-primary"
              >
                View Timeline <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-3">
              {waitingAppointments.length > 0 ? (
                waitingAppointments.slice(0, 4).map((apt) => {
                  const patientObj = patients.find((p) => p.id === apt.patientId);
                  return (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              onClick={() => patientObj && onOpenPatientProfile(patientObj)}
                              className="font-bold text-sm text-foreground hover:text-primary cursor-pointer"
                            >
                              {apt.patientName}
                            </h4>
                            <Badge variant="outline" className="text-[10px]">
                              {apt.patientGender}, {apt.patientAge}y
                            </Badge>
                            <Badge
                              className={
                                apt.status === "Checked In"
                                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px]"
                                  : "bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]"
                              }
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span>Time: <strong className="text-foreground">{apt.appointmentTime}</strong></span>
                            <span>•</span>
                            <span>{apt.reason}</span>
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => onStartConsultation(apt)}
                        className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs shrink-0"
                      >
                        <Play className="mr-1 h-3 w-3 fill-current" /> Start Consultation
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No patients currently in waiting room.
                </div>
              )}
            </div>
          </div>

          {/* Pending Laboratory & Diagnostic Alerts */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-teal" /> Recent Clinical Test Requisitions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Track ongoing laboratory processing and ready reports.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("laboratory")}
                className="text-xs font-semibold text-teal"
              >
                All Lab Tests <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {labRequests.slice(0, 4).map((lab) => (
                <div
                  key={lab.id}
                  className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-primary">{lab.requestNo}</span>
                    <Badge
                      className={
                        lab.status === "Report Ready"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]"
                      }
                    >
                      {lab.status}
                    </Badge>
                  </div>
                  <h5 className="font-bold text-xs truncate">{lab.testName}</h5>
                  <p className="text-[11px] text-muted-foreground">Patient: {lab.patientName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Action Hub & Return Follow-ups */}
        <div className="space-y-6">
          {/* Quick Action Hub */}
          <div className="gradient-primary p-5 rounded-2xl text-primary-foreground space-y-3 shadow-soft">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Stethoscope className="h-4 w-4" /> Doctor Clinical Toolbar
            </h3>
            <p className="text-xs opacity-90">
              Quick shortcuts to create prescriptions, order tests, or update schedule.
            </p>

            <div className="space-y-2 pt-1">
              <Button
                onClick={() => onNavigateTab("prescriptions")}
                className="w-full justify-start rounded-xl bg-white text-primary hover:bg-white/90 font-bold text-xs py-4 shadow-xs"
              >
                <Pill className="mr-2 h-4 w-4" /> Issue Digital Prescription
              </Button>

              <Button
                onClick={() => onNavigateTab("laboratory")}
                className="w-full justify-start rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold text-xs py-4 border border-white/20"
              >
                <FlaskConical className="mr-2 h-4 w-4" /> Order Laboratory Test
              </Button>

              <Button
                onClick={() => onNavigateTab("diagnostics")}
                className="w-full justify-start rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold text-xs py-4 border border-white/20"
              >
                <Activity className="mr-2 h-4 w-4" /> Order Radiology Imaging
              </Button>
            </div>
          </div>

          {/* Upcoming Return Follow-ups */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-purple-500" /> Return Follow-ups
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("followups")}
                className="text-[11px] font-semibold text-purple-500 p-0 h-auto"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {followUps.slice(0, 3).map((fup) => (
                <div key={fup.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{fup.patientName}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {fup.followUpDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{fup.previousDiagnosis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
