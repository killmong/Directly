"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Terminal,
  Brush,
  Layout,
  Monitor,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const themes = [
  {
    id: "developer",
    name: "Terminal",
    description:
      "Dark, neon green accents. Perfect for showcasing complex full-stack architecture and backend systems.",
    icon: Terminal,
    gradient: "from-green-500/20 to-emerald-900/40",
    border: "border-green-500",
    color: "text-green-400",
  },
  {
    id: "creator",
    name: "Creator",
    description:
      "Vibrant and high-energy. Designed to highlight video editing, vlogs, and visual content creation.",
    icon: Brush,
    gradient: "from-purple-500/20 to-pink-600/40",
    border: "border-pink-500",
    color: "text-pink-400",
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Clean, corporate, and typography-focused. Let your experience speak for itself without distractions.",
    icon: Layout,
    gradient: "from-gray-200/10 to-gray-400/20",
    border: "border-white",
    color: "text-white",
  },
  {
    id: "bold",
    name: "Bold",
    description:
      "Heavy contrast and UI/UX focused. Ideal for modern frontend web development and animation libraries.",
    icon: Monitor,
    gradient: "from-blue-600/20 to-violet-600/40",
    border: "border-blue-500",
    color: "text-blue-400",
  },
];

export default function ThemePicker() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 🎬 GSAP Entrance Animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".theme-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      );
    },
    { scope: containerRef },
  );

  const handleSaveTheme = async () => {
    if (!selectedTheme) return;
    setIsSaving(true);

    try {
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId: selectedTheme }),
      });

      if (response.ok) {
        // Redirect to the final generated portfolio!
        router.push("/portfolio");
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0f172a] text-white p-8 md:p-20"
      ref={containerRef}
    >
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Aesthetic
        </h1>
        <p className="text-gray-400 text-lg">
          We&apos;ve extracted your data. Now, select the visual direction for
          your AI-generated portfolio.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`theme-card relative text-left p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                isSelected
                  ? `${theme.border} scale-[1.02] shadow-2xl`
                  : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              {/* Background Gradient for selected state */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${theme.gradient} opacity-0 transition-opacity duration-500 ${isSelected ? "opacity-100" : "group-hover:opacity-50"}`}
              />

              <div className="relative z-10 flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 ${theme.color}`}
                  >
                    <Icon size={24} />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                      <Sparkles size={14} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">{theme.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full p-6 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/10 transform transition-transform duration-500 flex justify-center ${selectedTheme ? "translate-y-0" : "translate-y-full"}`}
      >
        <button
          onClick={handleSaveTheme}
          disabled={isSaving}
          className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
        >
          {isSaving ? "Generating Portfolio..." : "Generate My Portfolio"}
          {!isSaving && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
}
