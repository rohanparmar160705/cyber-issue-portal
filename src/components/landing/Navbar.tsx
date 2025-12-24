"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          {/* <div className="relative w-8 h-8">
            <Image
              src="https://assets.apnisec.com/public/apnisec-ui/logo.svg"
              alt="ApniSec"
              fill
              className="object-contain"
            />
          </div> */}
          <span className="text-xl font-bold tracking-tight text-white uppercase italic">
            Apni<span className="text-primary not-italic">Sec</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-neutral-400">
          <Link
            href="/#services"
            className="hover:text-white transition-colors"
          >
            Services
          </Link>
          <Link href="/#about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/#contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
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

          <button
            className="md:hidden text-white ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-white/5 py-8 px-6 flex flex-col space-y-6 text-lg font-medium">
          <Link href="/#services" onClick={() => setMobileMenuOpen(false)}>
            Services
          </Link>
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <div className="h-[1px] bg-white/10"></div>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-primary"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};
