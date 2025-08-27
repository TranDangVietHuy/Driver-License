"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-[15%] pb-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-white block mb-2 animate-slide-up">
              Học lý thuyết
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              bằng lái xe máy A1
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-lg px-10 py-6 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              <Link href="/theory" className="mr-2">
                Bộ câu hỏi lý thuyết
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer border-2 border-slate-600 text-slate-200 hover:text-white hover:bg-slate-800/50 hover:border-slate-500 text-lg px-10 py-6 rounded-2xl font-semibold bg-slate-800/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 group"
            >
              <Link href="/trial" className="ml-2">
                Thi thử ngay
              </Link>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
