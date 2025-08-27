"use client";

import { useState, useEffect } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Header } from "@/components/common/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TopicsSection } from "@/components/TopicsSection";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.refresh();
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ParticleBackground mousePosition={mousePosition} />

      <div className="relative">
        <Header scrollY={scrollY} user={isLoggedIn} />
        <div className="fixed right-8 top-6 flex items-center space-x-4 z-100">
          <Button
            variant="ghost"
            className="justify-start text-slate-300 hover:text-white"
          >
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className="border border-slate-500 bg-slate-800 text-white cursor-pointer hover:scale-110 transition-all duration-300"
              >
                Đăng xuất
              </Button>
            ) : (
              <Button
                onClick={handleLoginRedirect}
                className="border border-slate-500 bg-slate-800 text-white cursor-pointer hover:scale-110 transition-all duration-300"
              >
                Đăng nhập
              </Button>
            )}
          </Button>
          <Button className="group cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link href="/trial">Bắt đầu ngay</Link>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
      <HeroSection />
      <FeaturesSection />
      <TopicsSection />
    </>
  );
}
