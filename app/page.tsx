"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Plus,
  Trash2,
  LogIn,
  LayoutDashboard,
  MonitorPlay,
  X,
  Film,
  Youtube,
  Loader2,
  ArrowRight,
  Sparkles,
  Wand2,
  BarChart3,
  Eye,
} from "lucide-react";

// --- TYPES & INTERFACES ---
interface Video {
  _id: string;
  youtubeId: string;
  url: string;
  title: string;
  category: string;
  views: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function App() {
  // --- STATE ---
  const [view, setView] = useState<"login" | "dashboard" | "portfolio">(
    "login",
  );
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);

  // Form State
  const [newUrl, setNewUrl] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Cinematic");
  const [newViews, setNewViews] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // AI State
  const [isEnhancingTitle, setIsEnhancingTitle] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");

  // Player & UI State
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHoveringVideo, setIsHoveringVideo] = useState<boolean>(false);

  // --- MOUSE CURSOR EFFECT ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    if (view === "portfolio") {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [view]);

  // --- MONGODB DATA FETCHING ---
  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch("/api/videos");
      const data: Video[] = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos from MongoDB", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (view !== "login") {
      fetchVideos();
    }
  }, [view]);

  // --- GEMINI API (AI Features) ---
  const callGeminiWithBackoff = async (
    prompt: string,
    retries = 3,
  ): Promise<string> => {
    // In production, move this key to your .env file and call an API route to protect it!
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) return "Please add your Gemini API Key";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const handleEnhanceTitle = async () => {
    if (!newTitle) return;
    setIsEnhancingTitle(true);
    const prompt = `Rewrite this YouTube video title to be highly engaging, cinematic, and click-worthy. Keep it under 60 characters, no quotes. Original: "${newTitle}"`;
    try {
      const enhanced = await callGeminiWithBackoff(prompt);
      if (enhanced) setNewTitle(enhanced.replace(/^["']|["']$/g, "").trim());
    } catch (err) {
      setError("Failed to enhance title with AI.");
    } finally {
      setIsEnhancingTitle(false);
    }
  };

  const handleAnalyzeChannel = async () => {
    if (videos.length === 0) return;
    setIsAnalyzing(true);
    const titlesList = videos.map((v) => v.title).join(" | ");
    const prompt = `You are a creative director. Based ONLY on these video titles: [${titlesList}], write a 2-sentence creative bio summarizing my specific niche and cinematic style.`;
    try {
      const analysis = await callGeminiWithBackoff(prompt);
      if (analysis) setAiAnalysis(analysis.trim());
    } catch (err) {
      setAiAnalysis("Oops, our AI director is currently busy on set.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- UTILS ---
  const extractYtId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    );
    return match ? match[1] : null;
  };

  const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // --- CRUD OPERATIONS (MONGODB) ---
  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const videoId = extractYtId(newUrl);
    if (!videoId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    const finalViews = newViews
      ? parseInt(newViews, 10)
      : Math.floor(Math.random() * (500000 - 10000 + 1)) + 10000;

    setAdding(true);
    try {
      await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeId: videoId,
          url: newUrl,
          title: newTitle || "Untitled Video",
          category: newCategory,
          views: finalViews,
        }),
      });

      setNewUrl("");
      setNewTitle("");
      setNewViews("");
      fetchVideos(); // Refresh the list from MongoDB
    } catch (err) {
      setError("Failed to save video to MongoDB.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      fetchVideos(); // Refresh list
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // Grid layout helper
  const getGridSpan = (index: number): string => {
    const pattern = index % 6;
    if (pattern === 0) return "md:col-span-2 md:row-span-2";
    if (pattern === 3) return "md:col-span-2 md:row-span-1";
    return "md:col-span-1 md:row-span-1";
  };

  const totalViews = videos.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const topVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 3);

  if (view === "login") {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-md w-full bg-stone-900/50 backdrop-blur-xl border border-stone-800 p-8 rounded-3xl shadow-2xl z-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            LUMIA Studio
          </h1>
          <p className="text-stone-400 mb-8">Connected to MongoDB.</p>
          <button
            onClick={() => setView("dashboard")}
            className="w-full bg-white text-black py-4 px-4 rounded-2xl font-semibold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 group"
          >
            Enter Studio
            <ArrowRight className="w-5 h-5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-6 flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">LUMINA.</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setView("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              view === "dashboard"
                ? "bg-stone-900 text-white shadow-md"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard & DB
          </button>
          <button
            onClick={() => setView("portfolio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              view === "portfolio"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <MonitorPlay className="w-5 h-5" /> Live Showcase
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-stone-100">
          <button
            onClick={() => setView("login")}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <LogIn className="w-4 h-4 rotate-180" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-stone-50">
        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in space-y-8">
            <header>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Creator Dashboard
              </h2>
              <p className="text-stone-500">
                Manage your cinematic portfolio stored in MongoDB.
              </p>
            </header>

            {/* Top Row: AI + Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Analytics Card */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 text-stone-500 mb-6">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="font-semibold text-stone-900">
                    Channel Performance
                  </h3>
                </div>
                <div className="flex items-end gap-4 mb-8">
                  <div className="text-5xl font-bold tracking-tighter text-stone-900">
                    {formatNumber(totalViews)}
                  </div>
                  <div className="text-sm text-stone-500 pb-1 uppercase tracking-widest font-medium">
                    Total Views
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-2">
                    Top Performing Media
                  </p>
                  {topVideos.map((v, i) => {
                    const percentage = Math.max(
                      10,
                      (v.views / (topVideos[0]?.views || 1)) * 100,
                    );
                    return (
                      <div key={v._id} className="relative">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-stone-700 truncate pr-4">
                            {v.title}
                          </span>
                          <span className="text-stone-500">
                            {formatNumber(v.views)}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              i === 0 ? "bg-orange-500" : "bg-stone-300"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Persona */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 z-10">
                  <h3 className="text-lg font-semibold text-orange-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" /> AI Persona
                    Generator
                  </h3>
                </div>
                <p className="text-sm text-orange-900/70 mb-6 z-10">
                  Generate a creative bio based on your MongoDB database
                  entries.
                </p>
                <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-200/50 p-5 text-orange-950 text-sm leading-relaxed mb-6 flex items-center justify-center text-center italic min-h-[100px] z-10">
                  {aiAnalysis
                    ? `"${aiAnalysis}"`
                    : "Click generate to create your creative identity."}
                </div>
                <button
                  onClick={handleAnalyzeChannel}
                  disabled={isAnalyzing || videos.length === 0}
                  className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 z-10"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}{" "}
                  Generate Identity
                </button>
              </div>
            </div>

            {/* Add Content Form */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" /> Upload to MongoDB
              </h3>

              <form onSubmit={handleAddVideo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-12">
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-stone-700">
                        Video Title
                      </label>
                      <button
                        type="button"
                        onClick={handleEnhanceTitle}
                        disabled={!newTitle || isEnhancingTitle}
                        className="text-xs font-bold text-orange-600 hover:bg-orange-100 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md"
                      >
                        {isEnhancingTitle ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}{" "}
                        AI Enhance
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Cinematic Vlog"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    >
                      <option>Cinematic</option>
                      <option>Vlog</option>
                      <option>Tech/Dev</option>
                      <option>Short Film</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Views
                    </label>
                    <input
                      type="number"
                      value={newViews}
                      onChange={(e) => setNewViews(e.target.value)}
                      placeholder="Auto-generate"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={adding}
                    className="bg-stone-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-stone-800 transition-all flex items-center gap-2"
                  >
                    {adding ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}{" "}
                    Save to MongoDB
                  </button>
                </div>
              </form>
            </div>

            {/* Video List */}
            {loadingVideos ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
              </div>
            ) : (
              videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video._id}
                      className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center gap-4"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt="thumb"
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {video.title}
                        </h4>
                        <div className="flex gap-3 text-xs text-stone-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />{" "}
                            {formatNumber(video.views)}
                          </span>
                          <span className="text-orange-500 font-medium">
                            {video.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* VIEW: PORTFOLIO SHOWCASE */}
        {view === "portfolio" && (
          <div className="bg-[#0a0a0a] min-h-full p-4 md:p-12 cursor-none relative overflow-hidden">
            {/* Custom Cursor */}
            <div
              className="hidden md:block fixed pointer-events-none z-50 rounded-full mix-blend-difference transition-transform duration-100 ease-out"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                width: isHoveringVideo ? "80px" : "20px",
                height: isHoveringVideo ? "80px" : "20px",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                opacity: isHoveringVideo ? 0.2 : 1,
              }}
            />
            <div
              className="hidden md:flex fixed pointer-events-none z-50 items-center justify-center mix-blend-difference transition-opacity duration-300"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: "translate(-50%, -50%)",
                opacity: isHoveringVideo ? 1 : 0,
              }}
            >
              <span className="text-white text-xs font-bold tracking-widest uppercase">
                Play
              </span>
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10 animate-in fade-in duration-1000">
              <header className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase">
                    Selected <br />
                    <span className="text-orange-600 italic font-serif lowercase pr-4">
                      visual
                    </span>{" "}
                    Works.
                  </h1>
                  <p className="text-stone-400 max-w-md text-lg leading-relaxed">
                    {aiAnalysis ||
                      "A collection of cinematic moments, technological explorations, and visual storytelling."}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-light text-white">
                    {videos.length}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-stone-500 font-semibold mt-1">
                    MongoDB Records
                  </div>
                </div>
              </header>

              {videos.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/20 rounded-3xl">
                  <p className="text-xl text-stone-400 mb-4">
                    No data in MongoDB.
                  </p>
                  <button
                    onClick={() => setView("dashboard")}
                    className="text-orange-500 hover:text-white transition-colors border-b border-orange-500 pb-1 uppercase tracking-widest text-sm font-bold"
                  >
                    Return to Studio
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] group/grid">
                  {videos.map((video, index) => (
                    <div
                      key={video._id}
                      className={`relative overflow-hidden bg-stone-900 rounded-2xl cursor-none transition-all duration-700 ease-out group/card hover:!opacity-100 group-hover/grid:opacity-30 ${getGridSpan(
                        index,
                      )}`}
                      onClick={() => setPlayingVideo(video)}
                      onMouseEnter={() => setIsHoveringVideo(true)}
                      onMouseLeave={() => setIsHoveringVideo(false)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>,
                        ) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                        }}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 opacity-80 group-hover/card:opacity-60 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider uppercase border border-white/10">
                            {video.category}
                          </span>
                          <span className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <Eye className="w-4 h-4" />{" "}
                            {formatNumber(video.views)}
                          </span>
                        </div>
                        <div className="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.1] mb-2 drop-shadow-lg">
                            {video.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CINEMATIC VIDEO MODAL */}
        {playingVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-6 right-6 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-7xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-500">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={playingVideo.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
