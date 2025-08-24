"use client";

import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CornerUpLeft } from "lucide-react";

interface ExamRecord {
  id: number;
  userId: number;
  examId: number;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  details: {
    questionId: number;
    selectedAnswerId: string;
    correctAnswerId: string;
    isCorrect: boolean;
  }[];
}

const ExamHistory = () => {
  const [examHistory, setExamHistory] = useState<ExamRecord[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:9999/exam?userId=1");
        const data = await res.json();
        setExamHistory(data.reverse());
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử thi:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <Button className="text-white group cursor-pointer border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mt-8 ms-12">
        <Link href="/" className="group-hover:scale-90 flex items-center">
          <CornerUpLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </Button>
      <div className="p-10 text-white flex flex-col items-center">
        <CardTitle className="text-2xl mb-6 text-center">
          Lịch sử các lần thi
        </CardTitle>
        <div className="space-y-6 w-[50%]">
          {examHistory.length === 0 ? (
            <p>Không có dữ liệu.</p>
          ) : (
            examHistory.map((exam) => (
              <Card
                key={exam.id}
                className="p-6 bg-slate-800/40 border border-slate-600"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>Đề:</strong> {exam.examId}
                    </p>
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      {new Date(exam.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Kết quả:</strong> {exam.correctAnswers}/
                      {exam.totalQuestions}
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push(`/exam/${exam.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ExamHistory;
