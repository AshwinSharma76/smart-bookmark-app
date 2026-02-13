"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogOut, BookmarkCheck } from "lucide-react";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <BookmarkCheck size={26} />
            </div>
            <span className="text-2xl font-black tracking-tighter dark:text-white">
              MarkVault
            </span>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Session Active
              </p>
              <p className="text-sm font-semibold dark:text-gray-200">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-red-100 dark:border-red-900/50 shadow-sm active:scale-95"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
