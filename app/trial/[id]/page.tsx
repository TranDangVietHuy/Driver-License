"use client";

import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CornerUpLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(19 * 60);
  const [examId, setExamId] = useState(0);

  const getRandomQuestions = (data: any[], count: number) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:9999/questions");
        const data = await response.json();
        const randomQuestions = getRandomQuestions(data, 25);
        setQuestions(randomQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (questionId: number, selectedId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedId }));
  };

  const handleSubmit = async () => {x
    if (!window.confirm("Bạn chắc chắn muốn nộp bài?")) return;

    let correct = 0;
    const detailedAnswers = questions.map((q: any) => {
      const userSelected = answers[q.id];
      const correctAnswer = q.answer.find((a: any) => a.correct);

      const isCorrect = userSelected === correctAnswer.id.toString();
      if (isCorrect) correct++;

      return {
        questionId: q.id,
        selectedAnswerId: userSelected,
        correctAnswerId: correctAnswer.id.toString(),
        isCorrect,
      };
    });

    const payload = {
      userId: 1,
      examId,
      timestamp: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers: correct,
      details: detailedAnswers,
    };

    try {
      await fetch("http://localhost:9999/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Bạn đã nộp bài thành công!");
      setScore(correct);
    } catch (err) {
      toast.error("Gửi dữ liệu thất bại!");
      console.error("Error saving exam result:", err);
    }
  };

  const handleNavigation = () => {
    const confirmed = window.confirm(
      "Bạn sẽ mất toàn bộ tiến trình hiện tại. Bạn chắc chắn muốn thoát?"
    );
    if (confirmed) {
      window.removeEventListener("beforeunload", () => {});
      window.location.href = "/trial";
    }
  };

  return (
    <div className="relative z-10 text-sm text-slate-400 px-14">
      <div className="flex items-center justify-between py-6 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 fixed top-0 left-0 right-0 px-14 z-10">
        <CardTitle className="text-white text-xl font-bold uppercase">
          Đề thi số {examId}
        </CardTitle>
        <div className="flex items-center bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 px-4 py-2 rounded-full shadow-lg">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            Thời gian làm bài:{" "}
            <span className="font-bold text-white">{formatTime(timeLeft)}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleNavigation}
            className="text-white border border-white"
          >
            <CornerUpLeft className="w-4 h-4 mr-2" />
            Chọn đề khác
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-white border border-white"
          >
            Nộp bài
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-8 flex flex-col justify-center items-center mt-40"
      >
        {score !== null && (
          <>
            <div className="mt-4 text-white font-bold">
              Số câu trả lời đúng: {score}/{questions.length}
            </div>
            <Button className="text-white border border-white">
              <Link href={`/exam`}>Xem lịch sử thi</Link>
            </Button>
          </>
        )}
        {questions.map((q: any, index: number) => (
          <Card
            key={q.id}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 w-[45%] py-6 px-8"
          >
            <p className="text-white font-semibold mb-2">
              Câu {index + 1}: {q.question}
            </p>
            {q.img_url && (
              <div className="flex justify-center py-4">
                <img src={q.img_url} alt="" />
              </div>
            )}
            {q.answer.map((a: any) => {
              const userAnswer = answers[q.id];
              const correctAnswer = q.answer.find((ans: any) => ans.correct);

              let answerColor = "text-slate-300";
              if (score !== null) {
                if (a.id.toString() === correctAnswer.id.toString()) {
                  answerColor = "text-green-500 font-semibold";
                } else if (userAnswer === a.id.toString()) {
                  answerColor = "text-red-500 font-semibold";
                }
              }

              return (
                <label key={a.id} className={`block mb-1 ${answerColor}`}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={a.id}
                    checked={answers[q.id] === a.id.toString()}
                    disabled={score !== null}
                    onChange={() => handleChange(q.id, a.id.toString())}
                    className="mr-2"
                  />
                  {a.content}
                </label>
              );
            })}
          </Card>
        ))}
      </form>
    </div>
  );
};

export default Page;
