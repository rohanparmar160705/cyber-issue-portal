"use client";

import {
  Save,
  UserCircle,
  Mail,
  User,
  ShieldCheck,
  LogOut,
  Info,
  AlertCircle,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { UserAPI } from "@/api/api";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address format"),
});

type ProfileErrors = {
  name?: string;
  email?: string;
};

export default function ProfilePage() {
  const { user, refreshUser, logout, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: ProfileErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ProfileErrors;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSaving(true);
    try {
      await UserAPI.updateProfile({ name, email });
      await refreshUser();
      toast.success("Digital identity synchronized successfully");
    } catch (error: any) {
      toast.error(
        error.message || "Central identity server rejected the update"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] -z-10"></div>

        <main className="container mx-auto px-6 max-w-5xl">
          <header className="mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Secure Profile Management
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase italic leading-none">
              Account <span className="text-primary not-italic">Settings</span>
            </h1>
            <p className="text-neutral-500 text-sm font-medium">
              Manage your digital identity and security preferences within the
              ShieldVault ecosystem.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-[#0A0A0A]/80 backdrop-blur-sm border border-white/5 p-8 rounded-2xl shadow-2xl relative group">
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-500 rounded-l-2xl"></div>

                <div className="flex items-center space-x-4 mb-10">
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                    <UserCircle className="text-primary w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Profile Information</h2>
                    <p className="text-neutral-500 text-[10px] mt-1 font-bold uppercase tracking-[0.2em]">
                      General Identity Details
                    </p>
                  </div>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center">
                        <User size={14} className="mr-2 text-primary/50" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name)
                            setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Organization Analyst"
                        className={`w-full bg-black/50 border ${
                          errors.name ? "border-red-500/50" : "border-white/10"
                        } p-4 rounded-xl focus:border-primary outline-none transition-all placeholder:text-neutral-800 font-medium`}
                      />
                      {errors.name && (
                        <div className="flex items-center space-x-1 text-red-500 text-[10px] font-bold uppercase tracking-wide">
                          <AlertCircle size={10} />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center">
                        <Mail size={14} className="mr-2 text-primary/50" />
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
                        className={`w-full bg-black/50 border ${
                          errors.email ? "border-red-500/50" : "border-white/10"
                        } p-4 rounded-xl focus:border-primary outline-none transition-all placeholder:text-neutral-800 font-medium`}
                      />
                      {errors.email && (
                        <div className="flex items-center space-x-1 text-red-500 text-[10px] font-bold uppercase tracking-wide">
                          <AlertCircle size={10} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-white/5">
                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                      Last Updated:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Never"}
                    </p>
                    <button
                      type="submit"
                      disabled={isSaving || authLoading}
                      className="bg-primary text-black px-10 py-4 rounded-xl font-bold text-sm hover:bg-white transition-all flex items-center shadow-[0_0_30px_rgba(0,255,178,0.15)] active:scale-95 disabled:opacity-50 group"
                    >
                      <Save className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                      {isSaving ? "Synchronizing..." : "Save Identity"}
                    </button>
                  </div>
                </form>
              </section>

              <section className="bg-primary/5 border border-primary/10 p-8 rounded-2xl group transition-colors hover:bg-primary/10">
                <div className="flex items-center space-x-3 text-primary mb-6 font-bold uppercase tracking-widest text-xs">
                  <LogOut size={18} />
                  <span>Session Security</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-md">
                    <h3 className="text-lg font-bold mb-1">
                      Active Session Management
                    </h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                      You are currently managing the ShieldVault portal. Securely
                      terminate your session to clear persistent authorization
                      tokens.
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-8 py-3 bg-black border border-primary/20 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-black transition-all text-nowrap flex items-center shadow-sm"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout Securely
                  </button>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0A0A0A]/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 flex items-center">
                  <Info size={14} className="mr-2" />
                  Security Overview
                </h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">
                      Account Type
                    </span>
                    <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-tighter">
                      Analyst
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">
                      Auth Status
                    </span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">
                      Environment
                    </span>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-tighter">
                      Production
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6 rounded-2xl group">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center">
                  <ShieldCheck size={14} className="mr-2" />
                  Secure Workspace
                </p>
                <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                  Always use the encrypted portal environment for logging any
                  new security findings or managing sensitive organization data.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

