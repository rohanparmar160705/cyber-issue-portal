import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ApniSec | Advanced Cybersecurity & VAPT Management",
  description:
    "Next-gen vulnerability management and real-time security auditing portal.",
};

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { Navbar } from "@/components/landing/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${montserrat.variable} font-sans antialiased bg-black text-white`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}
