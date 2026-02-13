"use client";

import { supabase } from "@/lib/supabaseClient";
import { BookmarkCheck, Chrome, ArrowRight } from "lucide-react";

export default function Login() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-md w-full z-10">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-2xl shadow-blue-500/40 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <BookmarkCheck size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white">
            MarkVault
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Your digital library, organized.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold dark:text-white">Welcome Back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in to access your bookmarks
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="group relative w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-blue-500/20"
          >
            <Chrome
              size={20}
              className="group-hover:rotate-[360deg] transition-transform duration-500"
            />
            <span>Continue with Google</span>
            <ArrowRight
              size={18}
              className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </button>

          {/* Social Proof/Footer inside card */}
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-center gap-8 text-gray-400 dark:text-gray-600 text-xs font-black uppercase tracking-widest">
              <span>Secure</span>
              <span>•</span>
              <span>Fast</span>
              <span>•</span>
              <span>Realtime</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-sm text-gray-400 dark:text-gray-600">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}
