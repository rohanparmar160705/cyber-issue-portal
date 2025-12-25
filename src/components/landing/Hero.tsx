"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Hero = () => {
  const { user, loading } = useAuth();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background - Minimalist Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Advanced Security Management Portal
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-8 text-white">
            Vulnerability <br />
            <span className="text-primary">Orchestration</span> Platform
          </h1>

          <p className="max-w-2xl mx-auto text-neutral-400 text-lg md:text-xl font-medium mb-12">
            Comprehensive security auditing, real-time VAPT tracking, and
            automated compliance monitoring for modern engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-4 bg-primary text-black font-bold rounded hover:bg-white transition-all duration-300 flex items-center justify-center group shadow-[0_0_30px_rgba(0,255,178,0.3)]"
              >
                Enter Command Center
                <LayoutDashboard className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold rounded hover:bg-white transition-all duration-300 flex items-center justify-center group"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white font-bold rounded hover:bg-white/5 transition-all duration-300"
                >
                  Access Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
