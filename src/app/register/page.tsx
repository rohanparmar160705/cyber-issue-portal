"use client";

import Link from "next/link";
import { ChevronLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
import { GuestRoute } from "@/components/auth/GuestRoute";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation using Zod
    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: RegisterErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof RegisterErrors;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(
        error.message || "Registration failed. User may already exist."
      );
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

        <div className="w-full max-w-md relative z-10 text-center">
          <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-2xl shadow-2xl">
            <div className="mb-8">
              <span className="text-3xl font-bold tracking-tight text-white uppercase italic">
                Apni<span className="text-primary not-italic">Sec</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-center">
              Create Account
            </h1>
            <p className="text-neutral-500 text-center text-sm mb-10 font-medium">
              Join the security orchestration platform
            </p>

            <form className="space-y-6 text-left" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="John Doe"
                  className={`w-full bg-black border ${
                    errors.name ? "border-red-500/50" : "border-white/10"
                  } p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700 font-medium`}
                />
                {errors.name && (
                  <div className="flex items-center space-x-1 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={12} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

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
                  placeholder="analyst@apnisec.com"
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
                <label className="text-sm font-semibold text-neutral-300">
                  Password
                </label>
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
                    } p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700 font-medium`}
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
                {isSubmitting ? "Provisioning..." : "Register Account"}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-neutral-500 text-sm font-medium text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-bold"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </GuestRoute>
  );
}
