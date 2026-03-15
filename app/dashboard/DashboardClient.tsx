"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function DashboardClient({ user }: { user: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  // 🎬 GSAP Entrance Animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".stagger-animate",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    },
    { scope: containerRef },
  );

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false); // Add this state at the top

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      console.log("Gemini Output:", data);
      router.push("/theme-picker");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-[#0f172a] text-white p-8 md:p-20"
      ref={containerRef}
    >
      {/* Header */}
      <header className="stagger-animate mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back,{" "}
            <span className="text-blue-400">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-gray-400">
            Let&apos;s build your AI-generated portfolio.
          </p>
        </div>

        {/* User Avatar */}
        {user?.image && (
          <Image
            src={user.image}
            width={500}
            height={500}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-white/10 shadow-lg"
          />
        )}
      </header>

      {/* Main Action Area */}
      <main className="max-w-3xl mx-auto mt-20">
        {/* Step 1 Indicator */}
        <div className="stagger-animate flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-bold text-gray-200 tracking-widest uppercase">
            Upload Resume
          </h2>
        </div>

        {/* 📥 The Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`stagger-animate relative w-full aspect-video md:aspect-21/9 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 group ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
              : file
                ? "border-green-500/50 bg-green-500/5"
                : "border-white/20 bg-white/5 hover:border-blue-500/50 hover:bg-white/10"
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center gap-3 text-green-400">
              <FileText size={48} />
              <p className="font-bold tracking-wide">{file.name}</p>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-gray-500 hover:text-white transition-colors underline mt-2"
              >
                Remove and upload another
              </button>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
                <UploadCloud size={36} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">Drag and drop your PDF here</p>
                <p className="text-sm text-gray-400 mt-1">
                  or click to browse files
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>

        {/* 🚀 AI Trigger Button */}
        {file && (
          <div className="stagger-animate flex justify-center mt-10">
            <button
              onClick={handleAnalyze}
              className="group relative px-10 py-5 bg-linear-to-r from-blue-600 to-violet-600 rounded-full font-bold text-lg tracking-wide shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-105 transition-all flex items-center gap-3"
            >
              <Sparkles className="group-hover:animate-pulse" />
              Analyze with Gemini AI
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
