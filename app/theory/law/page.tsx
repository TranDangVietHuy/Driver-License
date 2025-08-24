"use client";
import Question from "@/components/Question";
import { useEffect, useState } from "react";

const Law = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:9999/questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  });
  return (
    <>
      <Question
        questions={questions.filter((q: any) => q.categories == "law")}
      />
    </>
  );
};

export default Law;
