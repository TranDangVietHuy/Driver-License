"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronRight,
  CornerUpLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@radix-ui/react-progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const page = () => {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  // Get user from localStorage
  const getUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
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
      setQuestions(data.questions || []);
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
    
    return Math.round((completedQuestions / totalQuestions) * 100);
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

  // Define topics with category mapping
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
  const topics = topicsConfig.map(topic => ({
    ...topic,
    questions: getQuestionCount(topic.category),
    completed: calculateCompletion(topic.category),
    completedCount: getCompletedCount(topic.category)
  }));
  return (
    <div>
      <Button className="text-white group cursor-pointer border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mt-8 ms-12">
        <Link href="/" className="group-hover:scale-90 flex items-center">
          <CornerUpLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-24 py-24">
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
                        {topic.completedCount} / {topic.questions} câu đã hoàn thành
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
      
      {/* Loading state */}
      {questions.length === 0 && (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-white">Loading progress data...</p>
        </div>
      )}
    </div>
  );
};

export default page;
