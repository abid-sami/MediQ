import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorCategories, doctors, timeSlots } from "@/data/mediq";
import { cn } from "@/lib/utils";

import { useMediQActions } from "./actions-context";

type Booking = {
  id: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
};

export function AppointmentModal() {
  const { appointmentOpen, closeAppointment } = useMediQActions();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const availableDoctors = useMemo(
    () => doctors.filter((d) => d.category === category),
    [category],
  );

  const reset = () => {
    setBooking(null);
    setName("");
    setPhone("");
    setCategory("");
    setDoctorId("");
    setDate(undefined);
    setTime("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!name || !phone || !category || !doctor || !date || !time) {
      toast.error("Please complete every step to confirm your appointment.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setBooking({
        id: `APT-${Math.floor(10000 + Math.random() * 89999)}`,
        doctor: doctor.name,
        department: category,
        date: format(date, "EEEE, d MMMM yyyy"),
        time,
      });
      setSubmitting(false);
      toast.success("Appointment confirmed");
    }, 1200);
  };

  return (
    <Dialog
      open={appointmentOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAppointment();
          window.setTimeout(reset, 250);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          {!booking ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <DialogHeader>
                <div className="mb-2 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground">
                    <CalendarCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <DialogTitle className="text-xl">Book Appointment</DialogTitle>
                    <DialogDescription>
                      Choose a specialist, date and time that fits you.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={submit} className="mt-2 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="apt-name">Name</Label>
                    <Input
                      id="apt-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apt-phone">Phone Number</Label>
                    <Input
                      id="apt-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1XXX XXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apt-category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setDoctorId("");
                    }}
                  >
                    <SelectTrigger id="apt-category">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apt-doctor">Doctor</Label>
                  <Select value={doctorId} onValueChange={setDoctorId} disabled={!category}>
                    <SelectTrigger id="apt-doctor">
                      <SelectValue
                        placeholder={category ? "Select doctor" : "Select a category first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} — {d.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <div className="rounded-2xl border border-border bg-surface p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={{ before: new Date() }}
                      className="mx-auto"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                          time === slot
                            ? "border-transparent gradient-primary text-primary-foreground shadow-soft"
                            : "border-border bg-card text-muted-foreground hover:border-teal/50 hover:text-foreground",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl gradient-primary py-6 text-base font-bold tracking-wide text-primary-foreground hover:opacity-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> CONFIRMING
                    </>
                  ) : (
                    "CONFIRM APPOINTMENT"
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="items-center">
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal/15 text-teal-foreground dark:text-teal"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.span>
                <DialogTitle className="mt-3 text-center text-xl">Appointment Confirmed</DialogTitle>
                <DialogDescription className="text-center">
                  We&apos;ve sent the details to your phone number.
                </DialogDescription>
              </DialogHeader>

              <dl className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
                {[
                  ["Doctor", booking.doctor],
                  ["Department", booking.department],
                  ["Date", booking.date],
                  ["Time", booking.time],
                  ["Appointment ID", booking.id],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 px-4 py-3">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="min-w-0 truncate text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>

              <Button
                className="mt-5 w-full rounded-xl font-semibold"
                variant="outline"
                onClick={() => {
                  closeAppointment();
                  window.setTimeout(reset, 250);
                }}
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
