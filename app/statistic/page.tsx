"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  Brain,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  CornerUpLeft,
  Trophy,
  Zap,
  BookOpen,
  Star
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatisticData {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  categoryStats: CategoryStat[];
  examStats: ExamStat;
  improvementData: ImprovementData;
  streakData: StreakData;
}

interface CategoryStat {
  category: string;
  name: string;
  icon: string;
  total: number;
  answered: number;
  correct: number;
  accuracy: number;
  completion: number;
}

interface ExamStat {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  passRate: number;
  recentTrend: "up" | "down" | "stable";
}

interface ImprovementData {
  questionsImproved: number;
  weeklyProgress: number;
  learningVelocity: number;
  strongestCategory: string;
  weakestCategory: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  averageSessionTime: number;
}

const StatisticPage = () => {
  const [user, setUser] = useState<any>(null);
  const [statistics, setStatistics] = useState<StatisticData | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch and calculate statistics
  const fetchStatistics = async (userId: number) => {
    try {
      setLoading(true);

      // Fetch all data
      const [questionsRes, progressRes, examRes] = await Promise.all([
        fetch("http://localhost:9999/questions"),
        fetch(`http://localhost:9999/progress?userId=${userId}`),
        fetch(`http://localhost:9999/exam?userId=${userId}`)
      ]);

      const questions = await questionsRes.json();
      const progress = await progressRes.json();
      const exams = await examRes.json();

      // Calculate statistics
      const stats = calculateStatistics(questions, progress, exams);
      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const isCorrect = (question: any, progress: any) => {
  // find the answer option in this question that matches user's choice
  const chosen = question.answer.find((a: any) => a.id === progress.selectedAnswer);
  if (!chosen) return false; // invalid answer id
  return chosen.correct === true;
  }
  const calculateStatistics = (questions: any[], progress: any[], exams: any[]): StatisticData => {
    const totalQuestions = questions.length;
    const answeredQuestions = progress.filter(p => p.answered).length;
    const correctAnswers = progress.filter(p => p.answered && isCorrect(questions.find(q => q.id === p.questionId), p)).length;
    const incorrectAnswers = answeredQuestions - correctAnswers;

    // Category statistics
    const categories = [
      { category: "law", name: "Luật giao thông", icon: "👮" },
      { category: "traffic-sign", name: "Biển báo", icon: "🚸" },
      { category: "situation", name: "Sa hình", icon: "🚛" }
    ];

    const categoryStats: CategoryStat[] = categories.map(cat => {
      const categoryQuestions = questions.filter(q =>
        Array.isArray(q.categories) ? q.categories.includes(cat.category) : q.categories === cat.category
      );
      const categoryProgress = progress.filter(p =>
        p.answered && categoryQuestions.some(q => q.id === p.questionId)
      );
      const correctInCategory = categoryProgress.filter(p => p.isCorrect).length;
      
      return {
        category: cat.category,
        name: cat.name,
        icon: cat.icon,
        total: categoryQuestions.length,
        answered: categoryProgress.length,
        correct: correctInCategory,
        accuracy: categoryProgress.length > 0 ? (correctInCategory / categoryProgress.length) * 100 : 0,
        completion: categoryQuestions.length > 0 ? (categoryProgress.length / categoryQuestions.length) * 100 : 0
      };
    });

    // Exam statistics
    const examScores = exams.map(e => e.score || 0);
    const passedExams = exams.filter(e => (e.score || 0) >= 80).length;
    
    const examStats: ExamStat = {
      totalExams: exams.length,
      averageScore: examScores.length > 0 ? examScores.reduce((a, b) => a + b, 0) / examScores.length : 0,
      bestScore: examScores.length > 0 ? Math.max(...examScores) : 0,
      passRate: exams.length > 0 ? (passedExams / exams.length) * 100 : 0,
      recentTrend: calculateTrend(examScores)
    };

    // Improvement data
    const improvementData: ImprovementData = {
      questionsImproved: calculateImprovedQuestions(progress),
      weeklyProgress: calculateWeeklyProgress(progress),
      learningVelocity: calculateLearningVelocity(progress),
      strongestCategory: categoryStats.reduce((a, b) => a.accuracy > b.accuracy ? a : b).name,
      weakestCategory: categoryStats.reduce((a, b) => a.accuracy < b.accuracy ? a : b).name
    };

    // Streak data
    const streakData: StreakData = {
      currentStreak: calculateCurrentStreak(progress),
      longestStreak: calculateLongestStreak(progress),
      totalStudyDays: calculateTotalStudyDays(progress),
      averageSessionTime: calculateAverageSessionTime(progress)
    };

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      categoryStats,
      examStats,
      improvementData,
      streakData
    };
  };

  // Helper functions for calculations
  const calculateTrend = (scores: number[]): "up" | "down" | "stable" => {
    if (scores.length < 2) return "stable";
    const recent = scores.slice(-3);
    const older = scores.slice(-6, -3);
    if (recent.length === 0 || older.length === 0) return "stable";
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) return "up";
    if (recentAvg < olderAvg - 5) return "down";
    return "stable";
  };

  const calculateImprovedQuestions = (progress: any[]): number => {
    // This would need more complex logic to track question improvement over time
    // For now, we'll estimate based on recent correct answers
    return progress.filter(p => p.answered && p.isCorrect).length;
  };

  const calculateWeeklyProgress = (progress: any[]): number => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentProgress = progress.filter(p => {
      const progressDate = new Date(p.answeredAt || p.createdAt || Date.now());
      return progressDate >= weekAgo;
    });
    
    return recentProgress.length;
  };

  const calculateLearningVelocity = (progress: any[]): number => {
    const last7Days = progress.filter(p => {
      const progressDate = new Date(p.answeredAt || p.createdAt || Date.now());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return progressDate >= weekAgo;
    });
    
    return Math.round(last7Days.length / 7);
  };

  const calculateCurrentStreak = (progress: any[]): number => {
    // Simplified streak calculation
    const recentDays = 7;
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < recentDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasProgress = progress.some(p => {
        const progressDate = new Date(p.answeredAt || p.createdAt || Date.now());
        return progressDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasProgress) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (progress: any[]): number => {
    // Simplified - return current streak for now
    return calculateCurrentStreak(progress);
  };

  const calculateTotalStudyDays = (progress: any[]): number => {
    const uniqueDays = new Set();
    progress.forEach(p => {
      const date = new Date(p.answeredAt || p.createdAt || Date.now());
      uniqueDays.add(date.toDateString());
    });
    return uniqueDays.size;
  };

  const calculateAverageSessionTime = (progress: any[]): number => {
    // Simplified calculation - estimate 2 minutes per question
    return progress.length * 2;
  };

  useEffect(() => {
    const loadedUser = getUser();
    if (loadedUser && loadedUser.id) {
      fetchStatistics(loadedUser.id);
    }
  }, []);

  // Memoize chart data to prevent unnecessary re-renders
  // This must be called before any conditional returns to follow Rules of Hooks
  const overallAccuracy = (statistics?.answeredQuestions && statistics.answeredQuestions > 0)
    ? (statistics.correctAnswers / statistics.answeredQuestions) * 100 
    : 0;

  const overallCompletion = (statistics?.totalQuestions && statistics.totalQuestions > 0)
    ? (statistics.answeredQuestions / statistics.totalQuestions) * 100 
    : 0;

  const chartData = useMemo(() => {
    if (!statistics) return {
      passRate: 0,
      categoryCompletion: [],
      categoryAccuracy: [],
      progressData: [0, 0, 0, 0, 0],
      donutData: [0, 0, 0]
    };
    
    return {
      passRate: Math.round(statistics.examStats.passRate) || 0,
      categoryCompletion: statistics.categoryStats.map(cat => Math.round(cat.completion) || 0),
      categoryAccuracy: statistics.categoryStats.map(cat => Math.round(cat.accuracy) || 0),
      progressData: [
        Math.max(0, overallCompletion - 40),
        Math.max(0, overallCompletion - 30),
        Math.max(0, overallCompletion - 20),
        Math.max(0, overallCompletion - 10),
        overallCompletion
      ],
      donutData: [
        statistics.correctAnswers || 0,
        statistics.incorrectAnswers || 0,
        Math.max(0, statistics.totalQuestions - statistics.answeredQuestions) || 0
      ]
    };
  }, [statistics, overallCompletion]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải thống kê...</div>
      </div>
    );
  }

  if (!user || !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Vui lòng đăng nhập để xem thống kê</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button className="text-white group cursor-pointer border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <Link href="/" className="group-hover:scale-90 flex items-center">
            <CornerUpLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Thống Kê Học Tập</h1>
          <p className="text-slate-300">Theo dõi tiến độ và cải thiện kết quả học tập</p>
        </div>
        
        <div className="w-32"></div> {/* Spacer for balance */}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overall Progress */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tiến độ tổng</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(overallCompletion)}%</div>
            <p className="text-xs text-slate-400">
              {statistics.answeredQuestions}/{statistics.totalQuestions} câu hỏi
            </p>
            <Progress value={overallCompletion} className="mt-2" />
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Độ chính xác</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(overallAccuracy)}%</div>
            <p className="text-xs text-slate-400">
              {statistics.correctAnswers}/{statistics.answeredQuestions} câu đúng
            </p>
            <Progress value={overallAccuracy} className="mt-2" />
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Chuỗi học tập</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.streakData.currentStreak}</div>
            <p className="text-xs text-slate-400">
              ngày liên tiếp
            </p>
            <div className="flex items-center mt-2">
              <Trophy className="h-3 w-3 text-yellow-400 mr-1" />
              <span className="text-xs text-slate-400">Kỷ lục: {statistics.streakData.longestStreak} ngày</span>
            </div>
          </CardContent>
        </Card>

        {/* Learning Velocity */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tốc độ học</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.improvementData.learningVelocity}</div>
            <p className="text-xs text-slate-400">
              câu/ngày (7 ngày qua)
            </p>
            <div className="flex items-center mt-2">
              <Star className="h-3 w-3 text-purple-400 mr-1" />
              <span className="text-xs text-slate-400">{statistics.improvementData.weeklyProgress} câu tuần này</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Stats with Chart */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Thống kê theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ApexChart for Category Performance */}
            <div className="mb-6">
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    background: 'transparent',
                    toolbar: { show: false },
                  },
                  theme: { mode: 'dark' },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '55%',
                      borderRadius: 4,
                    },
                  },
                  dataLabels: { enabled: false },
                  stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                  },
                  xaxis: {
                    categories: statistics.categoryStats.map(cat => cat.name),
                    labels: { style: { colors: '#94a3b8' } }
                  },
                  yaxis: {
                    labels: { style: { colors: '#94a3b8' } }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'dark',
                      type: "vertical",
                      shadeIntensity: 0.3,
                      gradientToColors: ['#8b5cf6', '#06b6d4'],
                      inverseColors: false,
                      opacityFrom: 1,
                      opacityTo: 0.8,
                    }
                  },
                  tooltip: {
                    theme: 'dark',
                    y: {
                      formatter: function (val: number) {
                        return val + "%"
                      }
                    }
                  },
                  legend: {
                    labels: { colors: '#94a3b8' }
                  },
                  grid: {
                    borderColor: '#374151',
                    strokeDashArray: 3,
                  }
                }}
                series={[
                  {
                    name: 'Hoàn thành',
                    data: chartData?.categoryCompletion || [],
                    color: '#3b82f6'
                  },
                  {
                    name: 'Độ chính xác',
                    data: chartData?.categoryAccuracy || [],
                    color: '#8b5cf6'
                  }
                ]}
                type="bar"
                height={250}
                width="100%"
              />
            </div>
            
            {/* Category Details */}
            {statistics.categoryStats.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{Math.round(category.completion)}%</div>
                    <div className="text-xs text-slate-400">{Math.round(category.accuracy)}% chính xác</div>
                  </div>
                </div>
                <Progress value={category.completion} className="h-2" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{category.answered}/{category.total} câu</span>
                  <span>{category.correct} câu đúng</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exam Performance with Chart */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Kết quả thi thử
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exam Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{statistics.examStats.totalExams}</div>
                <div className="text-sm text-slate-400">Bài thi đã làm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{Math.round(statistics.examStats.averageScore)}</div>
                <div className="text-sm text-slate-400">Điểm trung bình</div>
              </div>
            </div>

            {/* Radial Chart for Pass Rate */}
            <div className="flex justify-center">
              <Chart
                options={{
                  chart: {
                    type: 'radialBar',
                    background: 'transparent',
                    animations: {
                      enabled: true,
                      speed: 800,
                      animateGradually: {
                        enabled: true,
                        delay: 150
                      },
                      dynamicAnimation: {
                        enabled: false // Disable dynamic animation to prevent shaking
                      }
                    }
                  },
                  theme: { mode: 'dark' },
                  plotOptions: {
                    radialBar: {
                      startAngle: -90,
                      endAngle: 90,
                      hollow: {
                        size: '60%',
                        background: 'transparent',
                      },
                      track: {
                        background: '#374151',
                        strokeWidth: '97%',
                        margin: 5,
                      },
                      dataLabels: {
                        name: {
                          show: true,
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#e2e8f0',
                          offsetY: -10,
                        },
                        value: {
                          fontSize: '24px',
                          fontWeight: 700,
                          color: '#10b981',
                          offsetY: 16,
                          formatter: function (val: number) {
                            return (val || 0) + "%";
                          }
                        }
                      }
                    }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'dark',
                      shadeIntensity: 0.4,
                      inverseColors: false,
                      opacityFrom: 1,
                      opacityTo: 1,
                      stops: [0, 50, 100],
                      colorStops: [
                        {
                          offset: 0,
                          color: "#10b981",
                          opacity: 1
                        },
                        {
                          offset: 100,
                          color: "#3b82f6",
                          opacity: 1
                        }
                      ]
                    }
                  },
                  stroke: {
                    dashArray: 0
                  },
                  labels: ['Tỷ lệ đậu'],
                }}
                series={[chartData?.passRate || 0]}
                type="radialBar"
                height={200}
                width="100%"
                key={`radial-${chartData?.passRate || 0}`} // Add key to force re-render only when data actually changes
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Điểm cao nhất:</span>
                <span className="text-white font-bold">{statistics.examStats.bestScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Tỷ lệ đậu:</span>
                <span className="text-white font-bold">{Math.round(statistics.examStats.passRate)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Xu hướng:</span>
                <div className="flex items-center">
                  {statistics.examStats.recentTrend === "up" && <TrendingUp className="h-4 w-4 text-green-400" />}
                  {statistics.examStats.recentTrend === "down" && <TrendingDown className="h-4 w-4 text-red-400" />}
                  {statistics.examStats.recentTrend === "stable" && <span className="text-slate-400">Ổn định</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Overall Progress Donut Chart */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Phân tích tổng quan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                chart: {
                  type: 'donut',
                  background: 'transparent',
                },
                theme: { mode: 'dark' },
                plotOptions: {
                  pie: {
                    donut: {
                      size: '65%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Tổng cộng',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#e2e8f0',
                          formatter: function () {
                            return statistics.totalQuestions + ' câu';
                          }
                        }
                      }
                    }
                  }
                },
                labels: ['Đã trả lời đúng', 'Đã trả lời sai', 'Chưa trả lời'],
                colors: ['#10b981', '#ef4444', '#6b7280'],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    colors: ['#ffffff']
                  },
                  formatter: function (val: number) {
                    return Math.round(val) + "%";
                  }
                },
                legend: {
                  position: 'bottom',
                  labels: { colors: '#94a3b8' }
                },
                responsive: [{
                  breakpoint: 480,
                  options: {
                    chart: { width: 300 },
                    legend: { position: 'bottom' }
                  }
                }]
              }}
              series={chartData?.donutData || [0, 0, 0]}
              type="donut"
              height={300}
              width="100%"
            />
          </CardContent>
        </Card>

        {/* Learning Progress Line Chart */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Tiến độ học tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={{
                chart: {
                  type: 'area',
                  background: 'transparent',
                  toolbar: { show: false },
                  zoom: { enabled: false }
                },
                theme: { mode: 'dark' },
                stroke: {
                  curve: 'smooth',
                  width: 3
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shade: 'dark',
                    gradientToColors: ['#8b5cf6'],
                    shadeIntensity: 1,
                    type: 'vertical',
                    opacityFrom: 0.7,
                    opacityTo: 0.1,
                  }
                },
                dataLabels: { enabled: false },
                xaxis: {
                  categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Hiện tại'],
                  labels: { style: { colors: '#94a3b8' } }
                },
                yaxis: {
                  labels: { 
                    style: { colors: '#94a3b8' },
                    formatter: function (val: number) {
                      return val + "%";
                    }
                  }
                },
                tooltip: {
                  theme: 'dark',
                  y: {
                    formatter: function (val: number) {
                      return val + "% hoàn thành"
                    }
                  }
                },
                grid: {
                  borderColor: '#374151',
                  strokeDashArray: 3,
                }
              }}
              series={[
                {
                  name: 'Tiến độ',
                  data: chartData?.progressData || [0, 0, 0, 0, 0],
                  color: '#3b82f6'
                }
              ]}
              type="area"
              height={300}
              width="100%"
            />
          </CardContent>
        </Card>
      </div>

      {/* Improvement Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strengths */}
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-xl border border-green-700/50">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Điểm mạnh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-white">
              <div className="font-semibold">Danh mục xuất sắc:</div>
              <div className="text-green-300">{statistics.improvementData.strongestCategory}</div>
            </div>
            <div className="text-white">
              <div className="font-semibold">Câu hỏi đã cải thiện:</div>
              <div className="text-green-300">{statistics.improvementData.questionsImproved} câu</div>
            </div>
            <div className="text-white">
              <div className="font-semibold">Thời gian học tổng:</div>
              <div className="text-green-300">{Math.round(statistics.streakData.averageSessionTime / 60)} giờ</div>
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 backdrop-blur-xl border border-orange-700/50">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Cần cải thiện
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-white">
              <div className="font-semibold">Danh mục cần luyện:</div>
              <div className="text-orange-300">{statistics.improvementData.weakestCategory}</div>
            </div>
            <div className="text-white">
              <div className="font-semibold">Câu sai:</div>
              <div className="text-orange-300">{statistics.incorrectAnswers} câu</div>
            </div>
            <div className="text-white">
              <div className="font-semibold">Gợi ý:</div>
              <div className="text-orange-300 text-sm">Tập trung vào {statistics.improvementData.weakestCategory}</div>
            </div>
          </CardContent>
        </Card>

        {/* Study Habits */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-xl border border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Thói quen học tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-white">
              <div className="font-semibold">Tổng ngày học:</div>
              <div className="text-purple-300">{statistics.streakData.totalStudyDays} ngày</div>
            </div>
            <div className="text-white">
              <div className="font-semibold">Chuỗi hiện tại:</div>
              <div className="text-purple-300">{statistics.streakData.currentStreak} ngày</div>
            </div>
            <div className="text-white">
            
              <div className="text-white text-sm font-medium">
                {statistics.streakData.currentStreak > 0 
                  ? statistics.streakData.currentStreak > 5 
                    ? statistics.streakData.currentStreak > 10
                        ? statistics.streakData.currentStreak > 15
                            ? statistics.streakData.currentStreak > 20
                                ? " Quả thật là một thành tích đáng ngưỡng mộ, bạn đã tiên tục cố gắng trong hơn 20 ngày!"
                                :  "Bạn đã học hơn 15 ngày liên tiếp, Hãy tiếp tục kiên trì nhé, bạn đang làm rất tốt!"
                            :  "Tuyệt vời, bạn đang vô cùng kiên trì và cố gắng! Hãy tiếp tục cố gắng bạn nhé"
                        :'Bạn đã học  hơn 10 ngày liên tiếp, Hãy tiếp tục kiên trì nhé, bạn đang làm rất tốt!'
                    : "Vạn sự khởi đầu nan, hãy cố gắng tiếp tục bạn nhé!"
                  : "Hãy bắt đầu chuỗi mới!"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticPage;
