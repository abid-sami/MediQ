import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Actions = {
  sosOpen: boolean;
  appointmentOpen: boolean;
  loginOpen: boolean;
  registerOpen: boolean;
  openSos: () => void;
  closeSos: () => void;
  openAppointment: () => void;
  closeAppointment: () => void;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
};

const ActionsContext = createContext<Actions | null>(null);

export function MediQActionsProvider({ children }: { children: ReactNode }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const value = useMemo<Actions>(
    () => ({
      sosOpen,
      appointmentOpen,
      loginOpen,
      registerOpen,
      openSos: () => setSosOpen(true),
      closeSos: () => setSosOpen(false),
      openAppointment: () => setAppointmentOpen(true),
      closeAppointment: () => setAppointmentOpen(false),
      openLogin: () => {
        setRegisterOpen(false);
        setLoginOpen(true);
      },
      closeLogin: () => setLoginOpen(false),
      openRegister: () => {
        setLoginOpen(false);
        setRegisterOpen(true);
      },
      closeRegister: () => setRegisterOpen(false),
    }),
    [sosOpen, appointmentOpen, loginOpen, registerOpen],
  );

  return <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>;
}

export function useMediQActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error("useMediQActions must be used inside MediQActionsProvider");
  return ctx;
}
