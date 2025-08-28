"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Allerta } from 'next/font/google';
import { CornerUpLeft } from 'lucide-react';

export default function page() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  
  type QuestionStat = {
    id:string,
    wrongAttempts:number,
    correctAttempts:number
  }

  type ShowAnswersType = {
    id:string,
    show:boolean
  }
  const [showAnswers, setShowAnswers] = useState<ShowAnswersType[]>([]);

  const [questionStat, setQuestionStat] = useState<QuestionStat[]>([]);
  const [filteredQuestionStat, setFilteredQuestionStat] = useState<QuestionStat[]>([]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:9999/questions");
      const data = await response.json(); 
      return data;
    }

    catch(error){
      console.error("Error fetching questions:", error);
      return [];
    }
  }

  

  const fetchHistory = async (id:number) =>{
    try{
      const response = await fetch(`http://localhost:9999/exam?userId=${id}`);
      const data = await response.json();
      setHistory(data);
      console.log('History fetched:', data);
    }
    catch(error){
      console.error("Error fetching history:", error);
    }
  }


   const caculateQuestionStat = () => {
      const allDetails = history.flatMap((attempt: any) => attempt.details);
    console.log('All details extracted:', allDetails);
      const stats = allDetails.reduce((acc:QuestionStat[], currentValue:any) =>{
      let question = acc.find(q => q.id == currentValue?.questionId);
      if(question){
        if(currentValue?.isCorrect)
          question.correctAttempts +=1;
        else
          question.wrongAttempts +=1;
      }
      else{
          acc.push({
            id:currentValue?.questionId,
            wrongAttempts: currentValue?.isCorrect ? 0 : 1,
            correctAttempts: currentValue?.isCorrect ? 1 : 0

        });
      }
      return acc;
    },[]) ;

    console.log('Stats before setting state:', stats);
    setQuestionStat(stats);
    // Don't log questionStat here - it won't be updated yet!
   
  }

  const filterFrequentlyWrongQuestions = async (percentage: number) => {
    console.log('Question stats before filtering:', questionStat);
    const filtered = questionStat.filter(q => 
      (q.wrongAttempts + q.correctAttempts) > 0 && 
      (q.wrongAttempts / (q.wrongAttempts + q.correctAttempts)) >= percentage
    );
    console.log('Frequently wrong questions filtered:', filtered);
    
    // Store filtered data in separate state instead of overwriting original
    setFilteredQuestionStat(filtered);
  }

  const loadFilteredQuestions = async () => {
    if (filteredQuestionStat.length > 0) {
      const allQuestions = await fetchQuestions();
      const filteredQuestions = allQuestions.filter((q: any) => 
        filteredQuestionStat.some(fs => fs.id == q.id)
      );
      setQuestions(filteredQuestions);
      console.log('Filtered question bank set:', filteredQuestions);
    }
  }

  const getUser = () => {
    const userData = localStorage.getItem("user");
    if(userData){
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchHistory(parsedUser.id);
    }
  }


  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      console.log('History updated:', history);
      caculateQuestionStat();
    }
  }, [history]);

  // When questionStat is calculated, filter them
  useEffect(() => {
    if (questionStat.length > 0) {
      console.log('Question stats updated:', questionStat);
      filterFrequentlyWrongQuestions(0.5);
    }
  }, [questionStat]);

  // When filtered stats change, load the corresponding questions
  useEffect(() => {
    if (filteredQuestionStat.length > 0) {
      loadFilteredQuestions();
    }
  }, [filteredQuestionStat]);


  const handleChange = (questionId: number, selectedId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedId }));
  };

  const onSubmitClick = (questionId:string) =>{
    const currentSubmit = showAnswers.find(s => s.id === questionId);
    if(currentSubmit){
      const updatedShowAns = showAnswers.filter(s => s.id !== questionId);
      setShowAnswers([...updatedShowAns]);
    }
    else{
      setShowAnswers([...showAnswers, {id:questionId, show:true}]);
    }
  }
  return (
    <div className="relative z-10 text-sm text-slate-400 px-14">
      <div className="flex items-center justify-between py-6 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 fixed top-0 left-0 right-0 px-14 z-10">
        
        <div className="flex items-center bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 px-4 py-2 rounded-full shadow-lg">
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => { window.location.href = "/"; }}
            className="text-white border border-white"
          >
            <CornerUpLeft className="w-4 h-4 mr-2" />
            Trở về
          </Button>
        </div>
      </div>
      <div className="space-y-8 flex flex-col justify-center items-center mt-40">
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
                      if (showAnswers.find(s => s.id === q.id)?.show) {
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
                            disabled={showAnswers.find(s => s.id === q.id)?.show === true}
                            onChange={() => handleChange(q.id, a.id.toString())}
                            className="mr-2"
                          />
                          {a.content}
                        </label>
                      );
                    })}
                    <div className="relative w-full mb-6">
                      <button onClick={() => onSubmitClick(q.id)} className='absolute right-0 top- bg-red-500 py-2 px-4 mb-4 border rounded-full text-white hover:bg-red-700'>Show Answer</button>
                    </div>
                  </Card>
                ))}
          </div>
    </div>
  )
}
