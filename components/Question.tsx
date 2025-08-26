"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";

const Question = ({ questions }: { questions: any }) => {
  return (
    <>
      <Button className="text-white group cursor-pointer border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mt-8 ms-12">
        <Link href="/theory" className="group-hover:scale-90 flex items-center">
          <CornerUpLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </Button>
      <div className="flex flex-col justify-center items-center space-y-8">
        {questions &&
          questions.map((q: any, index: number) => (
            <Card
              key={q.id}
              className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 overflow-hidden w-[50%] py-6 px-8"
            >
              <div>
                <p className="text-white font-semibold mb-2">
                  Câu {index + 1}: {q.question}
                </p>
                {q.img_url !== null && (
                  <div className="flex justify-center py-4">
                    <img src={q.img_url} alt="" className="" />
                  </div>
                )}
                {q.answer.map((a: any) => {
                  const correctAnswer = q.answer.find(
                    (ans: any) => ans.correct
                  );
                  const answerColor =
                    a.id === correctAnswer.id
                      ? "text-green-400"
                      : "text-slate-300";

                  return (
                    <label key={a.id} className={`block mb-1 ${answerColor}`}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={a.id}
                        className="mr-2"
                      />
                      {a.content}
                    </label>
                  );
                })}
              </div>
              <div className="relative w-full mb-6">
                      <button onClick={() => onSubmitClick(q.id)} className='absolute right-0 top- bg-red-500 py-2 px-4 mb-4 border rounded-full text-white hover:bg-red-700'>Show Answer</button>
                    </div>
            </Card>
          ))}
      </div>
    </>
  );
};

export default Question;
