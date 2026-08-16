import { useEffect, useState } from "react";
import { ArrowRight, Stethoscope, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchSupabaseFeaturedDoctors } from "@/services/supabase-service";

import { Reveal, Section, SectionHeading } from "./primitives";
import { useMediQActions } from "./actions-context";

type FeaturedDoctor = {
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

export function OurDoctors() {
  const { openAppointmentWithDoctor, openAllDoctors } = useMediQActions();
  const [doctors, setDoctors] = useState<FeaturedDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchSupabaseFeaturedDoctors(4);
      setDoctors(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Section id="doctors">
      <div className="flex flex-col items-center gap-3 text-center">
        <SectionHeading
          eyebrow="Our Specialists"
          title="Meet Our Doctors"
          subtitle="Hand-picked specialists across our network, ready to see you."
        />
      </div>

      {!loading && doctors.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Featured doctors will appear here once an admin highlights them from the doctor
          directory.
        </p>
      )}

      {doctors.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc, i) => (
            <Reveal key={doc.id} delay={i * 0.06}>
              <div className="card-lift group flex h-full flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
                {doc.avatarUrl ? (
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-teal/10"
                  />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-teal/10 text-xl font-bold text-teal-foreground dark:text-teal ring-4 ring-teal/10">
                    {initials(doc.name) || <User className="h-8 w-8" />}
                  </div>
                )}

                <div>
                  <p className="text-base font-bold">{doc.name}</p>
                  <p className="mt-0.5 flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5" />
                    {doc.specialty || "General Physician"}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="mt-2 w-full rounded-xl font-semibold"
                  onClick={() => openAppointmentWithDoctor(doc.id)}
                >
                  Book Appointment
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          onClick={openAllDoctors}
          className="gap-2 rounded-xl font-semibold"
        >
          See All Doctors
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}
