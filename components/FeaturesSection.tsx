"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Trophy, Sparkles, Lightbulb } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "200+ câu hỏi ôn tập",
    description: "Kho đề lý thuyết cập nhật liên tục theo quy định mới nhất",
    color: "from-blue-500 via-cyan-500 to-teal-500",
    bgColor: "bg-blue-500/10",
    href: "/theory",
  },
  {
    icon: Trophy,
    title: "Thi thử theo bộ đề chuẩn",
    description: "Mô phỏng giao diện thi thực tế",
    color: "from-emerald-500 via-green-500 to-lime-500",
    bgColor: "bg-emerald-500/10",
    href: "/trial",
  },
  {
    icon: Lightbulb,
    title: "Mẹo thi lý thuyết",
    description: "Một số mẹo thi lý thuyết bổ ích và dễ nhớ",
    color: "from-orange-500 via-red-500 to-pink-500",
    bgColor: "bg-orange-500/10",
    href: "/tips",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              Đặc điểm nổi bật
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tại sao chọn
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Drive Master?
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 px-16">
          {features.map((feature, index) => (
            <Link href={feature.href} key={index}>
              <Card
                key={index}
                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden hover:shadow-2xl hover:shadow-[#324d6767]"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift"></div>

                <CardHeader className="text-center relative z-10 mt-6">
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <feature.icon className="w-10 h-10 text-white group-hover:scale-90" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-xl font-bold group-hover:text-blue-400 transition-colors animate-text-reveal">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 mb-6">
                  <CardDescription className="text-slate-400 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
