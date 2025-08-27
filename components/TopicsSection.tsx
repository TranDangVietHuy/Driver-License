"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BookOpen,
  FileText,
  CheckCircle,
  ChevronRight,
  CornerUpLeft,
} from "lucide-react";
import Link from "next/link";
// import { Progress } from "@radix-ui/react-progress";
import * as Progress from "@radix-ui/react-progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function TopicsSection() {
  const [progress, setProgress] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const getUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);

      return parsedUser;
    }
    return null;
  };

  // Fetch user progress
  const fetchProgress = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:9999/progress?userId=${userId}`);
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  // Fetch all questions to count by category
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:9999/questions");
      const data = await response.json();

      // Handle different response structures
      if (Array.isArray(data)) {
        // console.log("Setting questions from array:", data.length);
        setQuestions(data);
      } else if (data && Array.isArray(data.questions)) {
        // console.log("Setting questions from data.questions:", data.questions.length);
        setQuestions(data.questions);
      } else {
        console.error("Unexpected response structure:", data);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Calculate completion percentage for a category
  const calculateCompletion = (category: string) => {

    const categoryQuestions = questions.filter(q =>
      Array.isArray(q.categories) ? q.categories.includes(category) : q.categories === category
    );
    const totalQuestions = categoryQuestions.length;

    if (totalQuestions === 0) return 0;

    const completedQuestions = progress.filter(p =>
      p.answered && categoryQuestions.some(q => q.id === p.questionId)
    ).length;

    return (completedQuestions * 100 / totalQuestions);
  };




  // Get question count for a category
  const getQuestionCount = (category: string) => {
    const categoryQuestions = questions.filter(q =>
      Array.isArray(q.categories) ? q.categories.includes(category) : q.categories === category
    );
    return categoryQuestions.length;
  };




  // Get completed question count for a category
  const getCompletedCount = (category: string) => {
    const categoryQuestions = questions.filter(q =>
      Array.isArray(q.categories) ? q.categories.includes(category) : q.categories === category
    );

    const completedQuestions = progress.filter(p =>
      p.answered && categoryQuestions.some(q => q.id === p.questionId)
    ).length;

    return completedQuestions;
  };

  useEffect(() => {
    const loadedUser = getUser();
    fetchQuestions();

    if (loadedUser && loadedUser.id) {
      fetchProgress(loadedUser.id);
    }
  }, []);
  const topicsConfig = [
    {
      id: 1,
      title: "Luật giao thông",
      category: "law",
      icon: "👮",
      estimatedTime: "2 giờ",
      href: "/theory/law",
    },
    {
      id: 6,
      title: "Biển báo giao thông",
      category: "traffic-sign",
      icon: "🚸",
      estimatedTime: "2 giờ",
      href: "/theory/sign",
    },
    {
      id: 2,
      title: "Giải sa hình",
      category: "situation",
      icon: "🚛",
      estimatedTime: "1.5 giờ",
      href: "/theory/situation",
    },
  ];

  // Generate topics with dynamic data
  const topics = topicsConfig.map(topic => {
    const questionCount = getQuestionCount(topic.category);
    const completion = calculateCompletion(topic.category);
    const completedCount = getCompletedCount(topic.category);


    return {
      ...topic,
      questions: questionCount,
      completed: Math.round(completion),
      completedCount: completedCount
    };
  });
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
          <Link href={topic.href} key={topic.id}>
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
                    <Progress.Root
                      className="relative overflow-hidden bg-slate-700  w-full h-3"
                      value={topic.completed || 0}
                      max={100}
                    >
                      <Progress.Indicator

                        className={`bg-gradient-to-r ${topic.completed < 20 ? 'from-blue-500 from-[0%] via-purple-500 via-[95%] to-pink-500 to-[100%]' : 'from-blue-500 from-[0%] via-purple-500 via-[80%] to-pink-500 to-[100%]'} w-full h-full transition-transform duration-500 ease-out`}
                        style={{ transform: `translateX(-${100 - (topic.completed || 0)}%)` }}
                      />
                    </Progress.Root>

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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
