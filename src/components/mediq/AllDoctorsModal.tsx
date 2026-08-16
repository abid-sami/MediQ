import { useEffect, useMemo, useState } from "react";
import { Search, Stethoscope, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchSupabaseProfiles } from "@/services/supabase-service";

import { useMediQActions } from "./actions-context";

type DirectoryDoctor = {
  id: string;
  name: string;
  specialty?: string;
  avatarUrl?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function AllDoctorsModal() {
  const { allDoctorsOpen, closeAllDoctors, openAppointmentWithDoctor } = useMediQActions();
  const [doctors, setDoctors] = useState<DirectoryDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!allDoctorsOpen) return;
    const load = async () => {
      setLoading(true);
      const data = await fetchSupabaseProfiles("Doctor");
      setDoctors(data);
      setLoading(false);
    };
    load();
  }, [allDoctorsOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (d) => d.name.toLowerCase().includes(q) || (d.specialty || "").toLowerCase().includes(q)
    );
  }, [doctors, query]);

  return (
    <Dialog open={allDoctorsOpen} onOpenChange={(open) => !open && closeAllDoctors()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border p-6 pb-4">
          <DialogTitle className="text-xl font-bold">All Doctors</DialogTitle>
          <DialogDescription>Browse every doctor in our network and book directly.</DialogDescription>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or specialty..."
              className="rounded-xl pl-9"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto p-6 pt-4">
          {loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading doctors...</p>
          )}

          {!loading && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {doctors.length === 0
                ? "No doctors are registered yet."
                : "No doctors match your search."}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
              >
                {doc.avatarUrl ? (
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal/10 text-sm font-bold text-teal-foreground dark:text-teal">
                    {initials(doc.name) || <User className="h-5 w-5" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{doc.name}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Stethoscope className="h-3 w-3 shrink-0" />
                    {doc.specialty || "General Physician"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 rounded-lg text-xs font-semibold"
                  onClick={() => openAppointmentWithDoctor(doc.id)}
                >
                  Book
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
