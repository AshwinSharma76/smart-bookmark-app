// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "A simple bookmark manager built with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
