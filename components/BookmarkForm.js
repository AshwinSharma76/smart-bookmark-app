"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PlusCircle } from "lucide-react";

export default function BookmarkForm({ user, bookmarks, setBookmarks }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url) return;
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    const tempBookmark = {
      id: tempId,
      title,
      url,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    setBookmarks((prev) => [tempBookmark, ...prev]);

    const savedTitle = title;
    const savedUrl = url;
    setTitle("");
    setUrl("");

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({ title: savedTitle, url: savedUrl, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      setBookmarks((prev) => prev.map((b) => (b.id === tempId ? data : b)));
    } catch (err) {
      setBookmarks((prev) => prev.filter((b) => b.id !== tempId));
      setTitle(savedTitle);
      setUrl(savedUrl);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all ring-1 ring-black/5 dark:ring-white/5"
    >
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Search engine..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>

        <div className="w-full">
          <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2">
            URL
          </label>
          <input
            type="url"
            placeholder="https://google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2"
        >
          <PlusCircle
            size={22}
            className="group-hover:rotate-90 transition-transform"
          />
          <span className="text-lg whitespace-nowrap">
            {loading ? "Saving..." : "Save Bookmark"}
          </span>
        </button>
      </div>
    </form>
  );
}
