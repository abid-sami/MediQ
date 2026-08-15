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
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useMediQActions } from "./actions-context";
import { useAuth, getRouteForRole, mapRole } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export function AuthModal() {
  const { loginOpen, registerOpen, closeLogin, closeRegister, openLogin, openRegister } =
    useMediQActions();
  const { signIn, signUp, setLocalRole } = useAuth();

  const isOpen = loginOpen || registerOpen;
  const isLogin = loginOpen;

  // Login state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

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
  
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegRePassword, setShowRegRePassword] = useState(false);

  const handleClose = () => {
    closeLogin();
    closeRegister();
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
      // 1. Sign in with Supabase & resolve role automatically from profile/metadata
      const { error, role: resolvedRole } = await signIn(identifier, password);

      if (error) {
        toast.error(error.message || "Invalid credentials. Please check your email/phone and password.");
        setIsLoggingIn(false);
        return;
      }

      const activeRole = resolvedRole || "Patient";
      setLocalRole(activeRole);

      const targetRoute = getRouteForRole(activeRole);

      toast.success(`Login Successful! Entering ${activeRole} Dashboard...`);
      handleClose();

      // Immediate redirection to the detected role dashboard
      window.location.href = targetRoute;
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
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

    setIsRegistering(true);

    try {
      const mapped = mapRole(regRole) || "Patient";
      setLocalRole(mapped);

      const { error, role: registeredRole } = await signUp({
        name: regName,
        email: regEmail,
        phone: regNumber,
        role: mapped,
        password: regPassword,
        bloodGroup: regBloodGroup,
        address: regAddress,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        setIsRegistering(false);
        return;
      }

      const finalRole = registeredRole || mapped;
      toast.success(`Account Registered Successfully for ${regName} (${finalRole})!`);
      handleClose();
      window.location.href = getRouteForRole(finalRole);
    } catch (err: any) {
      toast.error(err?.message || "Registration encountered an error.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 border-border bg-card rounded-3xl overflow-hidden shadow-2xl">
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
            {isLogin ? "Welcome Back to MediQ" : "Join MediQ Healthcare"}
          </h2>
          <p className="text-xs opacity-90">
            {isLogin
              ? "Sign in with your registered Email/Phone and Password to access your portal."
              : "Register your profile for instant access across all MediQ services."}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {isLogin ? (
            /* Login Form (Clean with Auto Role Detection) */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Email or Phone Number</Label>
                  <Input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="patient@gmail.com or 017xxxxxxxxx"
                    className="mt-1.5 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground">Password </Label>
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
                  <div className="relative mt-1.5">
                    <Input
                      type={showLoginPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="rounded-xl text-xs font-semibold pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full gradient-primary text-primary-foreground font-bold rounded-2xl py-6 text-sm shadow-md disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoggingIn ? "AUTHENTICATING..." : "SIGN IN TO YOUR PORTAL"}
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
                      placeholder="Your Name"
                      className="mt-1 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  {/* <div>
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
                  </div> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">Phone Number *</Label>
                    <Input
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      required
                      placeholder="017xxxxxxxxx"
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
                    <Label className="text-xs font-bold text-muted-foreground">Password *</Label>
                    <div className="relative mt-1">
                      <Input
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="rounded-xl text-xs pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showRegPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground">RePassword * </Label>
                    <div className="relative mt-1">
                      <Input
                        type={showRegRePassword ? "text" : "password"}
                        value={regRePassword}
                        onChange={(e) => setRegRePassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="rounded-xl text-xs pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegRePassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showRegRePassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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
                {isRegistering ? "REGISTERING..." : "REGISTER ACCOUNT"}
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
