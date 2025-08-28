"use client";
import { Bike } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  scrollY: number;
}

const titleDefault = [
  {
    name: "Học lý thuyết",
    href: "/theory",
  },
  {
    name: "Thi thử",
    href: "/trial",
  },
];

const titleLogin = [
  {
    name: "Lịch sử thi",
    href: "/exam",
  },
  {
    name: "Các câu bạn hay sai",
    href: "/frequently-wrong",
  },
  {
    name: "Thống kê",
    href: "/statistic",
  }
];

export function Header({ scrollY, user }: HeaderProps | any,) {
  return (
    <header
      className={`fixed top-0 w-[100%] z-50 transition-all duration-300 px-16 py-1 ${
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

          <nav className="hidden md:flex items-center space-x-10 pe-72">
            {titleDefault.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-300 hover:text-white transition-all duration-300 relative group font-medium"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            {user &&
              titleLogin.map((item) => (
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
        </div>
      </div>
    </header>
  );
}
