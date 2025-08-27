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
import { ArrowRight, MessageSquare, X, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    subject: "",
    message: "",
    questionContent: "", // đổi từ questionId thành questionContent
    type: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.refresh();
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleSubmitFeedback = async () => {
    if (
      !feedbackData.subject.trim() ||
      !feedbackData.message.trim() ||
      !feedbackData.questionContent.trim()
    ) {
      toast.error(
        "Vui lòng nhập đầy đủ tiêu đề, nội dung câu hỏi và nội dung phản hồi!"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackId = Date.now().toString();

      const newFeedback = {
        id: feedbackId,
        userId: user.id,
        username: user.username,
        subject: feedbackData.subject.trim(),
        message: feedbackData.message.trim(),
        questionContent: feedbackData.questionContent.trim(),
        type: feedbackData.type,
        createdAt: new Date().toISOString(),
        isRead: false,
        readAt: null,
      };

      const response = await fetch("http://localhost:9999/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFeedback),
      });

      if (response.ok) {
        toast.success("Gửi phản hồi thành công! Cảm ơn bạn đã đóng góp.");
        setShowFeedbackModal(false);
        setFeedbackData({
          subject: "",
          message: "",
          questionContent: "",
          type: "general",
        });
      } else {
        toast.error("Không thể gửi phản hồi. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Có lỗi xảy ra khi gửi phản hồi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

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

      {/* Feedback Button */}
      {isLoggedIn && user && user.role === "user" && (
        <Button
          onClick={() => setShowFeedbackModal(true)}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Gửi phản hồi
                </CardTitle>
                <Button
                  onClick={() => setShowFeedbackModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2 text-sm">
                  Loại phản hồi
                </label>
                <select
                  value={feedbackData.type}
                  onChange={(e) =>
                    setFeedbackData({ ...feedbackData, type: e.target.value })
                  }
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white text-sm"
                >
                  <option value="general">Phản hồi chung</option>
                  <option value="wrong-answer">Đáp án sai</option>
                  <option value="wrong-question">Câu hỏi sai</option>
                  <option value="wrong-image">Hình ảnh sai</option>
                  <option value="typo">Lỗi chính tả</option>
                  <option value="suggestion">Đề xuất cải thiện</option>
                  <option value="bug">Báo lỗi</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 text-sm">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={feedbackData.subject}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Nhập tiêu đề phản hồi..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white text-sm placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2 text-sm">
                  Nội dung câu hỏi *
                </label>
                <textarea
                  value={feedbackData.questionContent}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      questionContent: e.target.value,
                    })
                  }
                  placeholder="Nhập nội dung câu hỏi liên quan..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white text-sm placeholder-slate-400 h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2 text-sm">
                  Nội dung phản hồi *
                </label>
                <textarea
                  value={feedbackData.message}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-2 text-white text-sm placeholder-slate-400 h-24 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting ? (
                    "Đang gửi..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Gửi phản hồi
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowFeedbackModal(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
