"use client";

import { useRef } from "react";
import {
  Github,
  Linkedin,
  Youtube,
  Mail,
  ExternalLink,
  Terminal,
  Code2,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger so animations happen as you scroll down
gsap.registerPlugin(ScrollTrigger);

export default function LivePortfolio({
  data,
  theme,
}: {
  data: any;
  theme: any;
}) {
  const mainRef = useRef<HTMLElement>(null);

  // Apply dynamic theme colors based on what they picked!
  const isDeveloper = theme.templateName === "developer";
  const isCreator = theme.templateName === "creator";
  const isBold = theme.templateName === "bold";

  const accentColor = isDeveloper
    ? "text-green-400"
    : isCreator
      ? "text-pink-500"
      : isBold
        ? "text-blue-500"
        : "text-white";
  const borderAccent = isDeveloper
    ? "border-green-500/30"
    : isCreator
      ? "border-pink-500/30"
      : isBold
        ? "border-blue-500/30"
        : "border-white/20";
  const bgAccent = isDeveloper
    ? "bg-green-500/10"
    : isCreator
      ? "bg-pink-500/10"
      : isBold
        ? "bg-blue-500/10"
        : "bg-white/5";

  useGSAP(
    () => {
      // Hero Entrance Animation
      gsap.fromTo(
        ".hero-elem",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
      );

      // Scroll Animations for Projects
      gsap.utils.toArray(".project-card").forEach((card: any) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // Triggers when the top of the card hits 85% down the viewport
              toggleActions: "play none none reverse",
            },
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
        );
      });
    },
    { scope: mainRef },
  );

  return (
    <main
      ref={mainRef}
      className={`min-h-screen bg-[#0f172a] text-gray-200 selection:bg-white/20 ${isDeveloper ? "font-mono" : "font-sans"}`}
    >
      {/* 🚀 HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col justify-center px-8 md:px-24 pt-20 relative">
        <div
          className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none ${isDeveloper ? "bg-green-600" : isCreator ? "bg-pink-600" : "bg-blue-600"}`}
        />

        <div className="max-w-4xl relative z-10">
          <p
            className={`hero-elem font-bold tracking-widest uppercase mb-4 ${accentColor}`}
          >
            {data.role || "Digital Professional"}
          </p>
          <h1 className="hero-elem text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {data.bio || "Building digital experiences."}
          </h1>
          <p className="hero-elem text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mb-10">
            {data.aboutText}
          </p>

          <div className="hero-elem flex gap-4">
            {data.socialLinks?.github && (
              <a
                href={`https://github.com/${data.socialLinks.github}`}
                target="_blank"
                className={`p-3 rounded-full ${bgAccent} hover:bg-white/20 transition-colors`}
              >
                <Github size={24} className="text-white" />
              </a>
            )}
            {data.socialLinks?.youtube && (
              <a
                href={`https://youtube.com/${data.socialLinks.youtube}`}
                target="_blank"
                className={`p-3 rounded-full ${bgAccent} hover:bg-white/20 transition-colors`}
              >
                <Youtube size={24} className="text-white" />
              </a>
            )}
            {data.contactEmail && (
              <a
                href={`mailto:${data.contactEmail}`}
                className={`p-3 rounded-full ${bgAccent} hover:bg-white/20 transition-colors`}
              >
                <Mail size={24} className="text-white" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 🛠️ SKILLS SECTION */}
      {data.skills && data.skills.length > 0 && (
        <section className="px-8 md:px-24 py-20 border-t border-white/5">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-8 flex items-center gap-2">
            <Code2 size={16} /> Technical Arsenal
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className={`px-4 py-2 rounded-lg border ${borderAccent} ${bgAccent} text-sm font-medium`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 💻 PROJECTS SECTION */}
      {data.projects && data.projects.length > 0 && (
        <section className="px-8 md:px-24 py-20 bg-black/20">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-12 flex items-center gap-2">
            <Terminal size={16} /> Featured Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((proj: any, idx: number) => (
              <div
                key={idx}
                className={`project-card p-8 rounded-2xl border ${borderAccent} bg-[#0f172a] hover:-translate-y-2 transition-transform duration-300`}
              >
                <h3 className={`text-2xl font-bold mb-3 text-white`}>
                  {proj.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 h-12">
                  {proj.description}
                </p>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed border-l-2 pl-4 border-white/10">
                  {proj.deepContent}
                </p>
                <div className="flex gap-4 mt-auto">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      className={`flex items-center gap-2 text-sm font-bold ${accentColor} hover:text-white transition-colors`}
                    >
                      <Github size={16} /> Code
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      className={`flex items-center gap-2 text-sm font-bold ${accentColor} hover:text-white transition-colors`}
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
