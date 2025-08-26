"use client";
import Question from "@/components/Question";
import { useEffect, useState } from "react";

const Sign = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:9999/questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };


  useEffect(() => {
    
    fetchQuestions();

  }, []);
  return (
    <>
      <Question
        questions={questions.filter((q: any) => q.categories == "traffic-sign")}
        answers={answers}
        setAnswers={setAnswers}
        setQuestions={setQuestions}
      />
    </>
  );
};

export default Sign;
