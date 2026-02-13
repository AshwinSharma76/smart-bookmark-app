"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { Moon, Sun, LayoutGrid } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const getUserAndBookmarks = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUser(data.user);

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      setBookmarks(bookmarkData || []);

      if (channelRef.current) return;
      channelRef.current = supabase
        .channel("bookmarks-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${data.user.id}`,
          },
          (payload) => {
            setBookmarks((prev) => {
              if (payload.eventType === "INSERT") {
                if (prev.find((b) => b.id === payload.new.id)) return prev;
                return [payload.new, ...prev];
              } else if (payload.eventType === "DELETE") {
                return prev.filter((b) => b.id !== payload.old.id);
              } else if (payload.eventType === "UPDATE") {
                return prev.map((b) =>
                  b.id === payload.new.id ? payload.new : b
                );
              }
              return prev;
            });
          }
        )
        .subscribe();
    };

    getUserAndBookmarks();
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors">
        <div className="animate-pulse text-blue-500 font-bold italic">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar user={user} />

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 z-50 hover:scale-110 active:scale-95 transition-all"
      >
        {darkMode ? (
          <Sun className="text-yellow-400" size={24} />
        ) : (
          <Moon className="text-blue-600" size={24} />
        )}
      </button>

      {/* Main Content: Max-width and mx-auto fix the left-alignment issue */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Left Column: Form Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="mb-10">
                <h1 className="text-4xl xl:text-5xl font-black tracking-tighter dark:text-white">
                  Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium">
                  Keep your links organized.
                </p>
              </div>
              {/* Force minimum width for the form container */}
              <div className="w-full min-w-[300px]">
                <BookmarkForm
                  user={user}
                  bookmarks={bookmarks}
                  setBookmarks={setBookmarks}
                />
              </div>
            </div>
          </div>

          {/* Right Column: List Section */}
          <div className="lg:col-span-7 xl:col-span-8 mt-12 lg:mt-0">
            <div className="flex items-center justify-start mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <LayoutGrid size={24} className="text-blue-500" />
                Your Library
              </h2>
              <div className="ml-[80px] px-5 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
                {bookmarks.length} {bookmarks.length === 1 ? "Link" : "Links"}
              </div>
            </div>
            <BookmarkList bookmarks={bookmarks} setBookmarks={setBookmarks} />
          </div>
        </div>
      </main>
    </div>
  );
}
