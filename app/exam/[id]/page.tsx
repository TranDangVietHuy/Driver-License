"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CornerUpLeft } from "lucide-react";

interface AnswerDetail {
  questionId: number;
  selectedAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
}

interface ExamDetail {
  id: number;
  userId: number;
  examId: number;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  details: AnswerDetail[];
}

interface QuestionData {
  id: number;
  question: string;
  img_url: string | null;
  answer: {
    id: number;
    content: string;
    correct: boolean;
  }[];
}

const ExamHistoryDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`http://localhost:9999/exam/${id}`);
        const data = await res.json();

        setExam(data);

        const questionIds = data.details.map((d: any) => Number(d.questionId));

        const allQuestions = await fetch("http://localhost:9999/questions");
        const questionData = await allQuestions.json();

        const filtered = questionData.filter((q: any) =>
          questionIds.includes(Number(q.id))
        );

        setQuestions(filtered);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchExam();
  }, [id]);

  const getAnswerDetail = (questionId: number) =>
    exam?.details.find((d) => d.questionId === questionId);

  return (
    <div className="p-10 text-white">
      <div className="flex flex-rowe items-center justify-between">
        <CardTitle className="text-2xl mb-6">Chi tiết kết quả thi</CardTitle>
        <Button className="text-white border border-white">
          <Link href="/exam" className="flex items-center gap-2">
            <CornerUpLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>

      {exam && (
        <div className="mb-8">
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
      )}

      <div className="space-y-6">
        {questions.map((q, index) => {
          const detail = getAnswerDetail(q.id);
          const correctId = detail?.correctAnswerId;
          const selectedId = detail?.selectedAnswerId;
          

          return (
            <Card
              key={q.id}
              className="bg-slate-800/40 border border-slate-600 p-6"
            >
              <p className="text-white font-semibold mb-2">
                Câu {index + 1}: {q.question}
              </p>

              {q.img_url && (
                <div className="flex justify-center mb-4">
                  <img src={q.img_url} alt="img" className="max-w-[400px]" />
                </div>
              )}

              {q.answer.map((a) => {
                let color = "text-slate-300";
                if (a.id.toString() === correctId && selectedId) {
                  color = "text-green-500 font-semibold";
                } else if (a.id.toString() === selectedId) {
                  color = "text-red-500 font-semibold";
                }

                return (
                  <label key={a.id} className={`block mb-1 ${color}`}>
                    <input
                      type="radio"
                      disabled
                      checked={selectedId === a.id.toString()}
                      className="mr-2"
                    />
                    {a.content}
                  </label>
                );
              })}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExamHistoryDetail;
