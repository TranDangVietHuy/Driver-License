"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Question = ({ 
  questions,fetchQuestions,answers, setAnswers, getAnswers }
  : { questions: any;
      fetchQuestions?:() => void; 
      answers:any;
      setAnswers:any;
      getAnswers?:() => void;
  }) => {
  type ShowAnswersType = {
      id:string,
      show:boolean
    }
  useEffect(() => {
    const answeredList = questions.map((q:any) => q.selectedAnswer)
  })

  
    const onSubmitClick = (questionId:string) =>{
      const selectedAnswer = answers[questionId];
      const answered = true;
      // let selectedQuestion = questions.find((q:any) => q.id === questionId);  

      // const filteredQuestions = questions.filter((q:any) => q.id !== questionId)


      fetch(`http://localhost:9999/questions/${questionId}`, {
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          selectedAnswer,
          answered
        })
      })

      if (fetchQuestions) {
        fetchQuestions();
      }
    }

  const handleSelectOption = (questionId:string, selectedId:string) => {
    setAnswers((prev: Record<string, any>) => ({...prev, [questionId]:selectedId}));
      fetch(`http://localhost:9999/questions/${questionId}`, {
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          selectedAnswer: selectedId
        })
      })

      if (fetchQuestions) {
        fetchQuestions();
      }
  }
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
                  const userAnswer = q.selectedAnswer;
                  const correctAnswer = q.answer.find(
                    (ans: any) => ans.correct
                  );
                  
                      let answerColor = "text-slate-300";
                      if (q.answered) {
                        if (a.id.toString() === correctAnswer.id.toString()) {
                          answerColor = "text-green-500 font-semibold";
                        } else if (userAnswer === a.id) {
                          answerColor = "text-red-500 font-semibold";
                        }
                      }

                  return (
                    <label key={a.id} className={`block mb-1 ${answerColor}`}>
                      <input
                        type="radio"
                        checked={q.selectedAnswer == a.id}
                        name={`question-${q.id}`}
                        value={a.id}
                        className="mr-2"
                        onChange={() => handleSelectOption(q.id, a.id)}
                      />
                      {a.content}
                    </label>
                  );
                })}
              </div>
              {!q.answered &&(
                <div className="relative w-full mb-6">
                      <button onClick={() => onSubmitClick(q.id)} className='absolute right-0 top- bg-red-500 py-2 px-4 mb-4 border rounded-full text-white hover:bg-red-700'>Show Answer</button>
                    </div>
              )}
              
            </Card>
          ))}
      </div>
    </>
  );
};

export default Question;
