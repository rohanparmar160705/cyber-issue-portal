"use client";

import Link from "next/link";
import { ChevronLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
import { GuestRoute } from "@/components/auth/GuestRoute";

const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation using Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Welcome back to ShieldVault!");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GuestRoute>
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>

        <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs md:text-sm font-bold text-neutral-400 hover:text-white transition-all group backdrop-blur-md shadow-2xl"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-2xl shadow-2xl text-center">
            <div className="mb-8">
              <span className="text-3xl font-bold tracking-tight text-white uppercase italic">
                Shield<span className="text-primary not-italic">Vault</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-2">Portal Access</h1>
            <p className="text-neutral-500 text-sm mb-10 font-medium text-center">
              Please enter your credentials to safely access the portal
            </p>

            <form className="space-y-6 text-left" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="analyst@ShieldVault.com"
                  className={`w-full bg-black border ${
                    errors.email ? "border-red-500/50" : "border-white/10"
                  } p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700 font-medium`}
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={12} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-neutral-300">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="••••••••••••"
                    className={`w-full bg-black border ${
                      errors.password ? "border-red-500/50" : "border-white/10"
                    } p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center space-x-1 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={12} />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <button
                disabled={isSubmitting}
                className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Authenticating..." : "Login to Account"}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-neutral-500 text-sm font-medium text-center">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-bold"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-10 text-center text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em]">
            This is a private security system. Authorized access only.
          </p>
        </div>
      </main>
    </GuestRoute>
  );
}

