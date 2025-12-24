import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Shield, Lock, Terminal, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
              Our Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
              Security Solutions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Terminal className="w-10 h-10 text-primary" />,
                title: "VAPT Assessment",
                desc: "Full-spectrum Vulnerability Assessment and Penetration Testing with detailed remediation blueprints.",
              },
              {
                icon: <Shield className="w-10 h-10 text-primary" />,
                title: "Cloud Security",
                desc: "Proactive security posture management and automated compliance for AWS, Azure, and GCP.",
              },
              {
                icon: <Lock className="w-10 h-10 text-primary" />,
                title: "Red Teaming",
                desc: "Sophisticated attack simulations to identify operational gaps and improve incident response.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="p-8 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="mb-6">{service.icon}</div>
                <h4 className="text-2xl font-bold mb-4">{service.title}</h4>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <Link
                  href="/register"
                  className="text-primary font-semibold flex items-center hover:opacity-80 transition-opacity"
                >
                  Learn more <CheckCircle2 className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold italic uppercase tracking-tighter">
              Apni<span className="text-primary not-italic">Sec</span>
            </span>
            <span className="text-neutral-600 text-xs font-medium ml-4">
              © 2024 ApniSec Portal
            </span>
          </div>

          <div className="flex items-center space-x-8 text-neutral-400 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">
              Portal
            </Link>
            <Link
              href="/register"
              className="hover:text-white transition-colors"
            >
              Register
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
