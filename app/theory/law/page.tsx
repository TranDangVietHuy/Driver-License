"use client";
import Question from "@/components/Question";
import { useEffect, useState } from "react";

const Law = () => {
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

  const getAnswers = async () => {
    const answ = questions.map((q: any) => ({ [q.id]: q.selectedAnswer }));
    setAnswers(Object.assign({}, ...answ));
    console.log("Answers fetched:", answ);
  };

  useEffect(() => {
    fetchQuestions();
    getAnswers();
  },[]);
  return (
    <>
      <Question
        questions={questions.filter((q: any) => q.categories == "law")}
        fetchQuestions={fetchQuestions}
        answers={answers}
        setAnswers={setAnswers}
        getAnswers={getAnswers}

      />
    </>
  );
};

export default Law;
