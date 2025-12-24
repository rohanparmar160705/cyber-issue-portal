"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, LogOut, Shield } from "lucide-react";
import Image from "next/image";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User size={18} />,
      isActive: pathname === "/profile",
    },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-white/5 flex flex-col p-6 bg-[#050505]">
      <div className="flex items-center space-x-3 mb-12">
        <div className="relative w-8 h-8">
          <Image
            src="https://assets.apnisec.com/public/apnisec-ui/logo.svg"
            alt="ApniSec"
            fill
          />
        </div>
        <div className="text-xl font-bold tracking-tighter uppercase italic text-white text-nowrap">
          Apni<span className="text-primary not-italic">Sec</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg font-bold text-sm transition-all ${
              item.isActive
                ? "bg-primary/10 text-primary"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button className="w-full flex items-center space-x-3 p-3 text-neutral-500 hover:text-red-500 transition-all font-bold text-sm group">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
