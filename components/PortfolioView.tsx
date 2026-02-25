"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { motion,Variants } from "motion/react";
import { Video, MousePosition } from "@/lib/types";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants : Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function PortfolioView({ videos, setPlayingVideo }: { videos: Video[], setPlayingVideo: (v: Video) => void }) {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-[#0a0a0a] min-h-full p-4 md:p-12 cursor-none relative overflow-hidden"
    >
      {/* Motion Custom Cursor */}
      <motion.div
        className="hidden md:block fixed pointer-events-none z-50 rounded-full mix-blend-difference bg-white"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          width: isHoveringVideo ? 80 : 20,
          height: isHoveringVideo ? 80 : 20,
          opacity: isHoveringVideo ? 0.2 : 1,
          // x: "-50%", y: "-50%" 
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      
      {/* Motion Text inside cursor */}
      <motion.div
        className="hidden md:flex fixed pointer-events-none z-50 items-center justify-center mix-blend-difference text-white text-xs font-bold tracking-widest uppercase"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          opacity: isHoveringVideo ? 1 : 0,
          // x: "-50%", y: "-50%"
        }}
      >
        Play
      </motion.div>

      <div className="max-w-350 mx-auto relative z-10">
        <header className="mb-16 md:mb-24 flex justify-between items-end border-b border-white/10 pb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white uppercase">Selected Works.</h1>
        </header>

        {/* Staggered Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px]"
        >
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              variants={itemVariants}
              onClick={() => setPlayingVideo(video)}
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
              className="relative overflow-hidden bg-stone-900 rounded-2xl group cursor-none"
            >
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/10 opacity-80 group-hover:opacity-60 transition-opacity" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{video.title}</h3>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}