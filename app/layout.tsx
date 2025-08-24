import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/common/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Toaster } from "react-hot-toast";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drive Theory",
  description: "A website for learning driving theory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <Toaster />
          <ParticleBackground mousePosition={{ x: 0, y: 0 }} />
          {children}
          <Footer />
          <FloatingActionButton />
        </div>
      </body>
    </html>
  );
}
