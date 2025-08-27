"use client";
import { Button } from "@/components/ui/button";
import { Bike, ArrowRight } from "lucide-react";
import Link from "next/link";
import Auth from "../Auth";

interface HeaderProps {
  scrollY: number;
}

const titles = [
  {
    name: "Học lý thuyết",
    href: "/theory",
  },
  {
    name: "Thi thử",
    href: "/trial",
  },
  {
    name: "Lịch sử thi",
    href: "/exam",
  },
  {
    name: "Các câu bạn hay sai",
    href: "/frequently-wrong",
  },
];

export function Header({ scrollY }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-16 py-1 ${
        scrollY > 50
          ? "bg-slate-900/95 backdrop-blur-xl shadow-[#1e2d3a6d] border-slate-700/50 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Bike className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Drive Master
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-10">
            {titles.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-300 hover:text-white transition-all duration-300 relative group font-medium"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="justify-start text-slate-300 hover:text-white"
            >
              <Auth />
            </Button>
            <Button className="group cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/trial">Bắt đầu ngay</Link>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
