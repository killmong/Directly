"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sparkles,
  FileText,
  Palette,
  ArrowRight,
  Terminal,
  Zap,
  Layout,
} from "lucide-react";

// Register ScrollTrigger for scroll-based animations
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Hero Section Entrance Animation (Timeline)
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-badge",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      )
        .fromTo(
          ".hero-title",
          { y: 40, opacity: 0, rotateX: 10 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-desc",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
          "-=0.2",
        );

      // 2. Continuous Floating / Parallax Orbs
      gsap.to(".float-orb-1", {
        y: "-=40",
        x: "+=20",
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(".float-orb-2", {
        y: "+=50",
        x: "-=30",
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1,
      });

      // 3. ScrollTrigger Animations for Features
      gsap.utils.toArray(".feature-card").forEach((card: any, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.15,
            ease: "power3.out",
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30 overflow-hidden relative font-sans"
    >
      {/* --- BACKGROUND EFFECTS --- */}
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Glowing Floating Orbs */}
      <div className="float-orb-1 absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="float-orb-2 absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Sparkles size={18} className="text-white" />
          </div>
          Directly<span className="text-blue-500">.</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-full transition-all hover:scale-105 backdrop-blur-md"
        >
          Sign In
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center max-w-5xl mx-auto min-h-[75vh]">
        <div className="hero-badge flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm">
          <Zap size={14} className="text-blue-400" />
          Powered by Gemini 2.5 Flash
        </div>

        <h1 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Transform your Resume into a <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-violet-400 to-purple-400">
            Stunning Portfolio
          </span>
        </h1>

        <p className="hero-desc text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Directly is an AI-driven portfolio generator. Upload your PDF resume,
          and our AI instantly extracts your skills, projects, and experience to
          build a high-quality, role-specific web presence.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/login"
            className="group relative flex items-center gap-2 bg-white text-gray-950 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            Start Building Free
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-full font-bold text-lg text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            How it works
          </a>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section
        id="how-it-works"
        className="relative z-10 py-32 px-8 md:px-20 max-w-7xl mx-auto border-t border-white/5"
      >
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From PDF to Live Site.
          </h2>
          <p className="text-gray-400 text-lg">
            Three simple steps to your new developer identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="feature-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText size={28} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Upload Resume</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Drop in your standard PDF resume. We securely process the text
              without storing the original file.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={28} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Gemini AI Analysis</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Our fine-tuned Gemini model parses your experience, writes
                engaging bios, and structures your projects perfectly.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="feature-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Palette size={28} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Choose Aesthetic</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Select from beautiful, role-specific templates (Developer,
              Creator, Minimal) and instantly get your live portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="font-bold text-gray-300">Directly.</span>
        </div>
        <p>
          © {new Date().getFullYear()} Directly. Built with Next.js, Mongoose &
          Gemini AI.
        </p>
      </footer>
    </div>
  );
}
