import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Actions = {
  sosOpen: boolean;
  appointmentOpen: boolean;
  openSos: () => void;
  closeSos: () => void;
  openAppointment: () => void;
  closeAppointment: () => void;
};

const ActionsContext = createContext<Actions | null>(null);

export function MediQActionsProvider({ children }: { children: ReactNode }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const value = useMemo<Actions>(
    () => ({
      sosOpen,
      appointmentOpen,
      openSos: () => setSosOpen(true),
      closeSos: () => setSosOpen(false),
      openAppointment: () => setAppointmentOpen(true),
      closeAppointment: () => setAppointmentOpen(false),
    }),
    [sosOpen, appointmentOpen],
  );

  return <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>;
}

export function useMediQActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error("useMediQActions must be used inside MediQActionsProvider");
  return ctx;
}
