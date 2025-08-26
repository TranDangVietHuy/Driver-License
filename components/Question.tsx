"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Question = ({
  questions, answers, setAnswers, setQuestions }
  : {
    questions: any;
    answers: any;
    setAnswers: any;
    setQuestions?: any;
  }) => {
  
  const [progress,setProgress] = useState<any[]>([]);
  /*{
    userId:number,
    questionId:number,
    selectedAnswer:number,
    answered:boolean
  }*/
  const [user,setUser] = useState<any>(null);
  const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>({});

  const getUser = () => {
    const userData = localStorage.getItem('user');
    if (userData){
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log("User loaded from localStorage:", parsedUser);
      return parsedUser; // Return the user immediately
    }
    else{
      console.log("No user data found in localStorage");
      return null;
    }
  }

  const getProgress = async (userId:number) => {
    try{
      const res = await fetch(`http://localhost:9999/progress?userId=${userId}`); // Fixed query param
      const data = await res.json();
      setProgress(data);
      console.log("Progress loaded:", data);
    }catch(error){
      console.error("Error fetching progress data:", error);
    }
  }

  useEffect(() => {
    const loadedUser = getUser(); // Get user synchronously
    console.log("Loaded user:", loadedUser);
    if(loadedUser && loadedUser.id){
      getProgress(loadedUser.id); // Use the returned user directly
    }
  },[]);

  // Separate useEffect to handle user state changes
  useEffect(() => {
    if(user && user.id) {
      console.log("User state updated:", user);
    }
  }, [user]);

  const onSubmitClick = async (questionId: string) => {
    // If user exists, save to database
    if (user && user.id) {
      const url = `http://localhost:9999/progress?userId=${user.id}&questionId=${questionId}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();

      const selectedAnswer = answers[questionId];
      const answered = true;

      if(data.length>0){
        const progressId = data[0].id;
        await fetch(`http://localhost:9999/progress/${progressId}`,{
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            selectedAnswer,
            answered
          })
        });

      }else{
        await fetch(`http://localhost:9999/progress`,{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            userId: user.id,
            questionId: questionId,
            selectedAnswer,
            answered
          })
        });
      }
      
      // Refresh progress after updating
      getProgress(user.id);
    }
    
    // Always show answer (for both logged in and guest users)
    setShowAnswers(prev => ({ ...prev, [questionId]: true }));
  }
  const handleSelectOption = async (questionId: string, selectedId: string) => {
    // Always update local answers state
    setAnswers((prev: Record<string, any>) => ({ ...prev, [questionId]: selectedId }));

    // If user exists, save to database
    if (user && user.id) {
      const url = `http://localhost:9999/progress?userId=${user.id}&questionId=${questionId}`;
      const res = await fetch(url);
      const data = await res.json();

       if(data.length>0){
        const progressId = data[0].id;
        await fetch(`http://localhost:9999/progress/${progressId}`,{
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            selectedAnswer: selectedId
          })
        });
        
        getProgress(user.id);
      }else{
        await fetch(`http://localhost:9999/progress`,{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            userId: user.id,
            questionId:questionId,
            selectedAnswer: selectedId
          })
        });

        getProgress(user.id);
      }
    }
    // If no user, just update local state (guest mode)
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
                  const userAnswer = progress.find(p => p.questionId === q.id);
                  const correctAnswer = q.answer.find(
                    (ans: any) => ans.correct
                  );
                  
                  // For logged in users: use progress data
                  // For guest users: use showAnswers state
                  const isAnswerShown = user ? userAnswer?.answered : showAnswers[q.id];
                  const selectedAnswerId = user ? userAnswer?.selectedAnswer : answers[q.id];

                  let answerColor = "text-slate-300";
                  if (isAnswerShown) {
                    if (a.id.toString() === correctAnswer.id.toString()) {
                      answerColor = "text-green-500 font-semibold";
                    } else if (selectedAnswerId == a.id) {
                      answerColor = "text-red-500 font-semibold";
                    }
                  }

                  return (
                    <label key={a.id} className={`block mb-1 ${answerColor}`}>
                      <input
                        type="radio"
                        checked={selectedAnswerId == a.id}
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
              {!(user ? progress.find(p => p.questionId === q.id)?.answered : showAnswers[q.id]) && (
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
