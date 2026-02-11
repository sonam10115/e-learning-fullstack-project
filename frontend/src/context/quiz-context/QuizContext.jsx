import React, { createContext, useState, useCallback } from "react";
import quizService from "../../services/quizService";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);

  // Fetch quizzes
  const fetchQuizzes = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getStudentQuizzes(token);
      setQuizzes(response?.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch quizzes");
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single quiz
  const fetchQuiz = useCallback(async (quizId, token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizById(quizId, token);
      setCurrentQuiz(response?.data);
      setCurrentQuestion(0);
      setAnswers([]);
      setScore(0);
    } catch (err) {
      setError(err.message || "Failed to fetch quiz");
      console.error("Error fetching quiz:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Record answer
  const recordAnswer = useCallback((questionIndex, answer) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  }, []);

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, currentQuiz]);

  // Move to previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  // Jump to specific question
  const jumpToQuestion = useCallback(
    (questionIndex) => {
      if (questionIndex >= 0 && questionIndex < currentQuiz.questions.length) {
        setCurrentQuestion(questionIndex);
      }
    },
    [currentQuiz],
  );

  // Submit quiz
  const submitQuiz = useCallback(async (quizData, token) => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.submitQuiz(quizData, token);
      setScore(response?.data?.score || 0);
      return response?.data;
    } catch (err) {
      setError(err.message || "Failed to submit quiz");
      console.error("Error submitting quiz:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quiz attempts
  const fetchAttempts = useCallback(async (quizId, token) => {
    try {
      setLoading(true);
      const response = await quizService.getQuizAttempts(quizId, token);
      setQuizAttempts(response?.data || []);
    } catch (err) {
      console.error("Error fetching attempts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setError(null);
  }, []);

  const value = {
    // State
    quizzes,
    currentQuiz,
    currentQuestion,
    answers,
    score,
    loading,
    error,
    quizAttempts,

    // Actions
    fetchQuizzes,
    fetchQuiz,
    recordAnswer,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    submitQuiz,
    fetchAttempts,
    resetQuiz,
    setCurrentQuiz,
    setQuizzes,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
