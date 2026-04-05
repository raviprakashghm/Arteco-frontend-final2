import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logUserAction } from "@/lib/logger";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const { signup, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const validatePassword = (pass: string) => {
    const rx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
    return rx.test(pass);
  };

  const setupRecaptcha = () => {
    // Clear any existing verifier
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
    });
    return recaptchaVerifierRef.current;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) { toast.error("Please enter your full name."); return; }
    if (!email.trim() || !email.includes("@")) { toast.error("Please enter a valid email."); return; }
    if (!validatePassword(password)) {
      toast.error("Password must be 8+ chars with 1 uppercase, 1 lowercase & 1 special character/number.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      // Format to E.164 with India code (+91)
      const digits = phone.replace(/\D/g, "").slice(-10);
      const formattedPhone = `+91${digits}`;

      const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(result);
      setStep("otp");
      setResendCooldown(60);
      toast.success(`OTP sent to +91 ${digits}! Check your SMS.`);
    } catch (err: any) {
      console.error("OTP send error:", err);
      if (err.code === "auth/invalid-phone-number") {
        toast.error("Invalid phone number. Enter a valid 10-digit Indian mobile number.");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please wait a few minutes and try again.");
      } else {
        toast.error(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    if (!confirmationResult) {
      toast.error("OTP session expired. Please go back and resend.");
      return;
    }

    setLoading(true);
    try {
      // Verify the OTP with Firebase — this will throw if wrong
      await confirmationResult.confirm(otp);

      // OTP verified! Now create the email/password account
      await signup(name, email, password);
      toast.success("✅ Mobile verified & account created!");
      logUserAction(email, "SIGNUP", `Account created. Phone: +91${phone.replace(/\D/g, "").slice(-10)}`);

      // Sync user to Supabase
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: email,
            email,
            name,
            phone: `+91${phone.replace(/\D/g, "").slice(-10)}`
          })
        });
      } catch (_) {}

      navigate("/profile", { replace: true });
    } catch (err: any) {
      console.error("OTP verify error:", err);
      if (err.code === "auth/invalid-verification-code") {
        toast.error("Incorrect OTP. Please check and try again.");
      } else if (err.code === "auth/code-expired") {
        toast.error("OTP has expired. Please go back and resend.");
      } else {
        toast.error(err.message || "Verification failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      const digits = phone.replace(/\D/g, "").slice(-10);
      const result = await signInWithPhoneNumber(auth, `+91${digits}`, verifier);
      setConfirmationResult(result);
      setResendCooldown(60);
      toast.success("New OTP sent!");
    } catch (err: any) {
      toast.error("Could not resend OTP. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate("/profile", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed.");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        <div className="hero-bg min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="auth-card">

              {step === "form" ? (
                <>
                  <div className="text-center mb-8">
                    <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-1">Join us today</p>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Create Account on <span className="text-primary">Arteco</span>
                    </h1>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="auth-input"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                        Mobile Number * <span className="text-muted-foreground font-normal normal-case">(Indian number, 10 digits)</span>
                      </label>
                      <div className="flex">
                        <span className="flex items-center px-3 bg-secondary border border-r-0 border-border rounded-l-lg text-sm text-muted-foreground">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          className="auth-input rounded-l-none flex-1"
                          placeholder="9999999999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-muted-foreground mt-1">8+ chars, uppercase, lowercase & special character</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending OTP…" : "Send OTP to Mobile"}
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 text-xs text-muted-foreground" style={{ background: "hsl(0 0% 8%)" }}>
                        or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-semibold transition-colors"
                    style={{ background: "hsl(0 0% 12%)", border: "1px solid hsl(0 0% 22%)", color: "hsl(0 0% 88%)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "hsl(46 93% 54% / 0.5)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(0 0% 22%)")}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <p className="text-center text-xs text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                  </p>
                </>
              ) : (
                /* ── OTP VERIFICATION STEP ── */
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h2 className="text-xl font-bold">Verify Your Mobile</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      We sent a 6-digit OTP to
                    </p>
                    <p className="font-semibold text-primary">
                      +91 {phone.replace(/\D/g, "").slice(-10)}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2 block text-center">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="auth-input text-center text-2xl tracking-[0.5em] font-bold"
                        placeholder="——————"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying…" : "Verify & Create Account"}
                    </button>
                  </form>

                  <div className="text-center space-y-3">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                    <br />
                    <button
                      type="button"
                      onClick={() => { setStep("form"); setOtp(""); setConfirmationResult(null); }}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      ← Change phone number
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Signup;
