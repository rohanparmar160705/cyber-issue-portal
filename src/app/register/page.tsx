"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <Link
        href="/"
        className="absolute top-10 left-10 flex items-center text-sm font-medium text-neutral-500 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="relative w-12 h-12">
              <Image
                src="https://assets.apnisec.com/public/apnisec-ui/logo.svg"
                alt="ApniSec"
                fill
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h1>
          <p className="text-neutral-500 text-center text-sm mb-10 font-medium">
            Join the security orchestration platform
          </p>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-black border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="analyst@apnisec.com"
                className="w-full bg-black border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-black border border-white/10 p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700"
              />
            </div>

            <button className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-white transition-all duration-300 active:scale-[0.98]">
              Register Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-neutral-500 text-sm font-medium">
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
  );
}
