"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronRight,
  CornerUpLeft,
  FileText,
  ArchiveX
} from "lucide-react";
import Link from "next/link";
// import { Progress } from "@radix-ui/react-progress";
import * as Progress from "@radix-ui/react-progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // useEffect(() => {
  //   console.log("=== STATE DEBUG ===");
  //   console.log("Questions state:", questions);
  //   console.log("Questions length:", questions.length);
  //   console.log("First question:", questions[0]);
  //   console.log("Progress state:", progress);
  //   console.log("User state:", user);
  // }, [questions, progress, user]);

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
  const topics = topicsConfig.map(topic => {
    const questionCount = getQuestionCount(topic.category);
    const completion = calculateCompletion(topic.category);
    const completedCount = getCompletedCount(topic.category);

    console.log(`${topic.title} stats:`, {
      category: topic.category,
      questionCount,
      completion,
      completedCount
    });

    return {
      ...topic,
      questions: questionCount,
      completed: Math.round(completion),
      completedCount: completedCount
    };
  });

  const deleteProgress = async () => {
    try {
      const res = await fetch(`http://localhost:9999/progress?userId=${user?.id}`);
      if (!res.ok) {
        console.error("Error fetching progress for deletion:", res.statusText);
        return;
      }
      const data = await res.json();

      for (const item of data) {
        await fetch(`http://localhost:9999/progress/${item.id}`, {
          method: "DELETE"
        });
      }

      await fetchProgress(user.id);
      setShowDeleteConfirm(false);
      toast.success("Đã xóa tất cả tiến độ thành công!");
    } catch (error) {
      console.error("Error deleting progress:", error);
      toast.error("Có lỗi xảy ra khi xóa tiến độ!");
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  }

  return (
    <div>
      <Button className="text-white group cursor-pointer border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mt-8 ms-12">
        <Link href="/" className="group-hover:scale-90 flex items-center">
          <CornerUpLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </Button>
      {user && user.id && (
        <Button onClick={handleDeleteClick} className="text-white group cursor-pointer border border-red-500 bg-red-500/20 hover:bg-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mt-8 ms-12">
          <ArchiveX className="w-4 h-4 mr-2" />
          Xoá tiến độ ôn tập
        </Button>
      )}
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
                    <Progress.Root
                      className="relative overflow-hidden bg-slate-700  w-full h-3"
                      value={topic.completed || 0}
                      max={100}
                    >
                      <Progress.Indicator
                      
                        className={`bg-gradient-to-r ${topic.completed < 20? 'from-blue-500 from-[0%] via-purple-500 via-[95%] to-pink-500 to-[100%]' : 'from-blue-500 from-[0%] via-purple-500 via-[80%] to-pink-500 to-[100%]' } w-full h-full transition-transform duration-500 ease-out`}
                        style={{ transform: `translateX(-${100 - (topic.completed || 0)}%)` }}
                      />
                    </Progress.Root>

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-lg p-8 max-w-md w-mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-4">
                Xác nhận xóa tiến độ
              </h3>
              <p className="text-slate-300 mb-6">
                Bạn có chắc chắn muốn xóa tất cả tiến độ ôn tập không? 
                <br />
                <span className="text-red-400 font-semibold">Hành động này không thể hoàn tác!</span>
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleCancelDelete}
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white border border-slate-500 transition-all duration-200"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={deleteProgress}
                  className="px-6 py-2 bg-gradient-to-r from-rose-400 via-red-400 to-red-500 hover:from-rose-500 hover:via-red-500 hover:to-red-600 text-white border border-red-400 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Xóa tiến độ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
