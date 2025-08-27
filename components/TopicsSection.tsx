"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  FileText,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const topics = [
  {
    id: 1,
    title: "Luật giao thông",
    questions: 100,
    completed: 35,
    icon: "👮",
    estimatedTime: "2 giờ",
  },
  {
    id: 6,
    title: "Biển báo giao thông",
    questions: 65,
    completed: 20,
    icon: "🚸",
    estimatedTime: "2 giờ",
  },
  {
    id: 2,
    title: "Giải sa hình",
    questions: 35,
    completed: 60,
    icon: "🚛",
    estimatedTime: "1.5 giờ",
  },
];

export function TopicsSection() {
  return (
    <section className="py-20 relative px-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              Tổng hợp lý thuyết
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            3 chủ đề
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {" "}
              trọng tâm
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <Card
              key={topic.id}
              className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-[2px] bg-slate-800/40 backdrop-blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-white text-lg font-bold group-hover:text-blue-400 transition-colors leading-tight uppercase">
                    {topic.title}
                  </CardTitle>
                  <div
                    className="text-4xl mb-2 animate-bounce-gentle"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {topic.icon}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{topic.questions} câu hỏi</span>
                    </span>
                    <span className="text-white font-bold">
                      {topic.completed}%
                    </span>
                  </div>

                  <div className="relative">
                    <Progress
                      value={topic.completed}
                      className="h-3 bg-slate-700 animate-progress-fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-shimmer"></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-slate-400">
                        {Math.round((topic.questions * topic.completed) / 100)}{" "}
                        câu đã hoàn thành
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
