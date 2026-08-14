import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Droplet,
  CheckCircle2,
  Stethoscope,
  Activity,
  Pill,
  Siren,
  Microscope,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useMediQActions } from "./actions-context";
import { useAuth, getRouteForRole } from "@/hooks/use-auth";

type RoleOption = {
  label: string;
  role: string;
  route: string;
  icon: any;
  emailDemo: string;
};

const ROLES: RoleOption[] = [
  { label: "Doctor", role: "Doctor", route: "/doctor", icon: Stethoscope, emailDemo: "sarah.rahman@mediq.health" },
  { label: "Patient", role: "Patient", route: "/patient", icon: User, emailDemo: "sami@mediq.health" },
  { label: "Nurse", role: "Nurse", route: "/nurse", icon: Activity, emailDemo: "elena.vance@mediq.health" },
  { label: "Pharmacist", role: "Pharmacist", route: "/pharmacy", icon: Pill, emailDemo: "tariq.anwar@mediq.health" },
  { label: "Blood Bank Staff", role: "Blood Bank Staff", route: "/blood-bank-staff", icon: Droplet, emailDemo: "rafiqul.islam@mediq.health" },
  { label: "Ambulance Driver", role: "Ambulance Driver", route: "/ambulance-driver", icon: Siren, emailDemo: "tariqul.driver@mediq.health" },
  { label: "Lab Staff", role: "Lab Staff", route: "/laboratory-staff", icon: Microscope, emailDemo: "mahmudul.hasan@mediq.health" },
  { label: "Receptionist", role: "Receptionist", route: "/receptionist", icon: UserCheck, emailDemo: "sadia.islam@mediq.health" },
  { label: "Super Admin", role: "Super Admin", route: "/admin", icon: ShieldCheck, emailDemo: "alex.vance@mediq.health" },
];

export function AuthModal() {
  const { loginOpen, registerOpen, closeLogin, closeRegister, openLogin, openRegister } =
    useMediQActions();
  const { signIn, signUp } = useAuth();

  const isOpen = loginOpen || registerOpen;
  const isLogin = loginOpen;

  // Login state
  const [identifier, setIdentifier] = useState("sami@mediq.health");
  const [password, setPassword] = useState("123456");
  const [selectedRole, setSelectedRole] = useState<RoleOption>(ROLES[1]); // Default Patient
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register state (Patient / Staff)
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regRole, setRegRole] = useState<string>("Patient");
  const [regPassword, setRegPassword] = useState("");
  const [regRePassword, setRegRePassword] = useState("");
  const [regBloodGroup, setRegBloodGroup] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleClose = () => {
    closeLogin();
    closeRegister();
  };

  const handleQuickDemoSelect = (roleOpt: RoleOption) => {
    setSelectedRole(roleOpt);
    setIdentifier(roleOpt.emailDemo);
    setPassword("123456");
    toast.info(`Selected ${roleOpt.label} Credentials`);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error("Please enter your Email or Phone Number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 digits");
      return;
    }

    setIsLoggingIn(true);

    try {
      const { error } = await signIn(identifier, password);

      if (error) {
        toast.error("Login failed", {
          description: error.message || "Invalid credentials. Please try again.",
        });
        setIsLoggingIn(false);
        return;
      }

      toast.success(`Welcome back! Redirecting to ${selectedRole.label} Portal...`);
      handleClose();
      // Use SPA navigation instead of full page reload
      setTimeout(() => {
        window.location.href = getRouteForRole(selectedRole.role as any);
      }, 1000);
    } catch (err: any) {
      toast.error("Login failed", {
        description: err.message || "An unexpected error occurred",
      });
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim()) {
      toast.error("Please enter Name");
      return;
    }

    if (!regNumber.trim()) {
      toast.error("Please enter Phone Number");
      return;
    }

    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 digits");
      return;
    }

    if (regPassword !== regRePassword) {
      toast.error("Passwords do not match. Please check RePassword");
      return;
    }

    const targetRole = ROLES.find((r) => r.label === regRole || r.role === regRole) || ROLES[1];

    setIsRegistering(true);

    try {
      const { error } = await signUp({
        name: regName,
        email: regEmail,
        phone: regNumber,
        role: targetRole.role,
        password: regPassword,
        bloodGroup: regBloodGroup,
        address: regAddress,
      });

      if (error) {
        toast.error("Registration failed", {
          description: error.message || "Unable to create account. Please try again.",
        });
        setIsRegistering(false);
        return;
      }

      toast.success(`Account Registered Successfully for ${regName} (${targetRole.label})!`);
      handleClose();

      // Check if email verification is needed
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Auto login successful - redirect to their portal
        setTimeout(() => {
          window.location.href = getRouteForRole(targetRole.role as any);
        }, 1000);
      } else {
        toast.info("Please check your email to verify your account before logging in.");
      }
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.message || "An unexpected error occurred",
      });
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 border-border bg-card rounded-3xl overflow-hidden shadow-2xl">
        {/* Top Header Banner */}
        <div className="gradient-primary p-6 text-primary-foreground space-y-2">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-white font-bold text-lg">
              Q
            </span>
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={openLogin}
                className={`px-3 py-1 rounded-lg transition-all ${
                  isLogin ? "bg-white text-primary font-bold shadow-soft" : "text-white/80 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={openRegister}
                className={`px-3 py-1 rounded-lg transition-all ${
                  !isLogin ? "bg-white text-primary font-bold shadow-soft" : "text-white/80 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isLogin ? "Welcome Back to MediQ" : "Join MediQ Patient Services"}
          </h2>
          <p className="text-xs opacity-90">
            {isLogin
              ? "Sign in with your Email/Phone and Password to access your portal."
              : "Register your patient profile for instant healthcare services."}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Email or Phone Number *</Label>
                  <Input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="Enter email or phone..."
                    className="mt-1.5 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground">Password * (Minimum 6 digits)</Label>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info("Password Reset Link Sent", {
                          description: `Reset instructions dispatched to ${identifier || "your registered email/phone"}.`,
                        })
                      }
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="mt-1.5 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Role Selection / Demo Shortcuts */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                <Label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                  <span>Select User Role for Portal Access</span>
                  <span className="text-[10px] text-primary font-normal">Click role to auto-fill demo</span>
                </Label>

                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => {
                    const IconC = r.icon;
                    const isSelected = selectedRole.role === r.role;
                    return (
                      <button
                        type="button"
                        key={r.role}
                        onClick={() => handleQuickDemoSelect(r)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center text-center gap-1 transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary font-bold ring-1 ring-primary/30"
                            : "bg-card border-border hover:border-primary/40 text-muted-foreground"
                        }`}
                      >
                        <IconC className="h-4 w-4" />
                        <span className="text-[10px] leading-tight truncate w-full">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full gradient-primary text-primary-foreground font-bold rounded-2xl py-6 text-sm shadow-md disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoggingIn ? "SIGNING IN..." : `LOGIN TO ${selectedRole.label.toUpperCase()} PORTAL`}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={openRegister}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Don't have an account? Register as Patient →
                </button>
              </div>
            </form>
          ) : (
            /* Register Form (Patients Default) */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Full Name *</Label>
                    <Input
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      placeholder="e.g. Dr. Mahmudul Hasan"
                      className="mt-1 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Account Role *</Label>
                    <Select value={regRole} onValueChange={setRegRole}>
                      <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                        <SelectValue placeholder="Select Account Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Patient">Patient</SelectItem>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                        <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="Blood Bank Staff">Blood Bank Staff</SelectItem>
                        <SelectItem value="Ambulance Driver">Ambulance Driver</SelectItem>
                        <SelectItem value="Receptionist">Receptionist</SelectItem>
                        <SelectItem value="Lab Staff">Lab Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Phone Number *</Label>
                    <Input
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      required
                      placeholder="+1 (555)..."
                      className="mt-1 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Email Address</Label>
                    <Input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="sami@example.com"
                      className="mt-1 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Password * (6 digits)</Label>
                    <Input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="mt-1 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">RePassword * (Confirm)</Label>
                    <Input
                      type="password"
                      value={regRePassword}
                      onChange={(e) => setRegRePassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="mt-1 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Blood Group</Label>
                    <Select value={regBloodGroup} onValueChange={setRegBloodGroup}>
                      <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                        <SelectValue placeholder="Select Blood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Home Address</Label>
                    <Input
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="City / Street address..."
                      className="mt-1 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full gradient-primary text-primary-foreground font-bold rounded-2xl py-6 text-sm shadow-md mt-2 disabled:opacity-50"
              >
                {isRegistering ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isRegistering ? "REGISTERING..." : "REGISTER PATIENT ACCOUNT"}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={openLogin}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Already have an account? Sign In →
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
