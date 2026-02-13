"use client";

import { supabase } from "@/lib/supabaseClient";
import { Trash2, ExternalLink } from "lucide-react";

export default function BookmarkList({ bookmarks, setBookmarks }) {
  const deleteBookmark = async (id) => {
    const previousBookmarks = [...bookmarks];
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    try {
      const { error } = await supabase.from("bookmarks").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      setBookmarks(previousBookmarks);
      alert("Error deleting.");
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] text-gray-400 text-center">
        <p className="text-lg italic">Your library is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group flex flex-col justify-between p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-700 shadow-sm transition-all"
        >
          <div className="flex flex-col min-w-0 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl truncate mb-1">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline truncate block"
            >
              {bookmark.url}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 rounded-2xl font-bold text-sm transition-all"
            >
              <ExternalLink size={18} /> Open
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 rounded-2xl font-bold text-sm transition-all"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
