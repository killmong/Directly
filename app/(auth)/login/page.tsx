"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Redirects to the dashboard after a successful login
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
        {/* Logo/Icon */}
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <Sparkles className="text-blue-400" size={32} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Welcome to Builder.
        </h1>
        <p className="text-gray-400 text-sm mb-8 px-4">
          Log in to upload your resume and generate your AI-powered
          scrollytelling portfolio.
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full relative flex items-center justify-center gap-3 bg-white text-gray-900 py-3.5 px-4 rounded-xl font-bold text-sm transition-all hover:bg-gray-100 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
          ) : (
            <>
              {/* Standard Google SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-white/10 w-full flex items-center justify-center group cursor-pointer">
          <span className="text-xs text-gray-500 font-medium group-hover:text-gray-300 transition-colors flex items-center gap-1">
            View Live Examples{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
