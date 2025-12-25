"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  // Hide navbar on login and register pages
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAuthPage) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-black/95 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="text-xl font-bold tracking-tight text-white uppercase italic">
            Apni<span className="text-primary not-italic">Sec</span>
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {!loading && user ? (
            <div className="hidden md:flex items-center space-x-8 mr-4">
              <Link
                href="/dashboard"
                className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/projects"
                className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <ShieldCheck size={14} />
                <span>Projects</span>
              </Link>
              <Link
                href="/profile"
                className="text-sm font-bold text-neutral-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <User size={14} />
                <span>Profile</span>
              </Link>
            </div>
          ) : null}

          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-2 rounded font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white hover:text-primary transition-colors pr-4 border-r border-white/10 hidden sm:block"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-primary text-black px-5 py-2 rounded font-bold text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,178,0.2)]"
                >
                  Get Started
                </Link>
              </>
            )}

            <button
              className="md:hidden text-white ml-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black py-8 px-6 flex flex-col space-y-6 text-lg font-medium animate-in slide-in-from-top duration-300">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white flex items-center space-x-3 p-2"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white flex items-center space-x-3 p-2"
              >
                <ShieldCheck size={20} />
                <span>Projects</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white flex items-center space-x-3 p-2"
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
              <div className="h-[1px] bg-white/5 my-2"></div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-red-500 flex items-center space-x-3 p-2 font-bold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-primary p-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
