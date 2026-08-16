import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Actions = {
  sosOpen: boolean;
  appointmentOpen: boolean;
  loginOpen: boolean;
  registerOpen: boolean;
  allDoctorsOpen: boolean;
  preselectedDoctorId: string | null;
  openSos: () => void;
  closeSos: () => void;
  openAppointment: () => void;
  closeAppointment: () => void;
  openAppointmentWithDoctor: (doctorId: string) => void;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  openAllDoctors: () => void;
  closeAllDoctors: () => void;
};

const ActionsContext = createContext<Actions | null>(null);

export function MediQActionsProvider({ children }: { children: ReactNode }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [allDoctorsOpen, setAllDoctorsOpen] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);

  const value = useMemo<Actions>(
    () => ({
      sosOpen,
      appointmentOpen,
      loginOpen,
      registerOpen,
      allDoctorsOpen,
      preselectedDoctorId,
      openSos: () => setSosOpen(true),
      closeSos: () => setSosOpen(false),
      openAppointment: () => {
        setPreselectedDoctorId(null);
        setAppointmentOpen(true);
      },
      closeAppointment: () => setAppointmentOpen(false),
      openAppointmentWithDoctor: (doctorId: string) => {
        setPreselectedDoctorId(doctorId);
        setAllDoctorsOpen(false);
        setAppointmentOpen(true);
      },
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
      openAllDoctors: () => setAllDoctorsOpen(true),
      closeAllDoctors: () => setAllDoctorsOpen(false),
    }),
    [sosOpen, appointmentOpen, loginOpen, registerOpen, allDoctorsOpen, preselectedDoctorId],
  );

  return <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>;
}

export function useMediQActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error("useMediQActions must be used inside MediQActionsProvider");
  return ctx;
}
