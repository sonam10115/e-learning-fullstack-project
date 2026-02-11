import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth-context/index.jsx";
import { motion } from "motion/react";

const QuizPage = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  // Fetch courses and their quizzes
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/student/courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        },
      );
      setQuizzes(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizStarted && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, showResults]);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(quiz.duration * 60 || 600); // Convert minutes to seconds
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (optionIndex, isCorrect) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: selectedQuiz.questions[currentQuestion]._id,
      selectedOption: optionIndex,
      isCorrect: isCorrect,
    };
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Auto-move to next question
    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setShowResults(true);
    setQuizStarted(false);

    // Save quiz attempt to backend
    try {
      await axios.post(
        "http://localhost:8000/quiz/submit",
        {
          quizId: selectedQuiz._id,
          courseId: selectedCourse?._id,
          score: score,
          totalQuestions: selectedQuiz.questions.length,
          answers: answers,
          timeSpent: selectedQuiz.duration * 60 - timeLeft || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(selectedQuiz.duration * 60 || 600);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
    setSelectedCourse(null);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071426] to-[#142C52] flex flex-col items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mb-5"></div>
        <p className="text-white text-lg font-medium">Loading quizzes...</p>
      </div>
    );
  }

  // Quiz List View
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071426] to-[#142C52] py-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            📚 Quiz Master
          </h1>
          <p className="text-lg sm:text-xl opacity-90">
            Test your knowledge and track your progress
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {quizzes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {quizzes.map((course) =>
                course.quizzes?.map((quiz) => (
                  <motion.div
                    key={quiz._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col"
                  >
                    <div className="bg-gradient-to-r from-[#1B9AAA] to-[#142C52] text-white p-5 flex justify-between items-center">
                      <span className="text-3xl">📝</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        {quiz.difficulty || "Medium"}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col gap-4 flex-grow">
                      <h3 className="text-xl font-bold text-[#071426]">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 text-sm flex-grow">
                        {quiz.description}
                      </p>
                      <div className="space-y-2 py-4 border-t border-gray-200 border-b">
                        <div className="flex items-center gap-3 text-gray-700 font-medium">
                          <span>❓</span>
                          <span>{quiz.questions?.length || 0} Questions</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 font-medium">
                          <span>⏱️</span>
                          <span>{quiz.duration || 10} min</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 font-medium">
                          <span>⭐</span>
                          <span>{quiz.passingScore || 60}% pass</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          handleSelectQuiz(quiz);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-[#1B9AAA] to-[#142C52] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        Start Quiz
                      </button>
                    </div>
                  </motion.div>
                )),
              )}
            </motion.div>
          ) : (
            <div className="text-center text-white py-20">
              <div className="text-6xl mb-5">📚</div>
              <h2 className="text-3xl font-bold mb-3">No Quizzes Available</h2>
              <p className="text-lg opacity-90 mb-6">
                Check back soon for more quizzes!
              </p>
              <button
                onClick={fetchQuizzes}
                className="px-8 py-3 bg-white text-[#1B9AAA] font-bold rounded-lg hover:bg-[#1B9AAA] hover:text-white transition-all duration-300"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Quiz Preparation View
  if (!quizStarted && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071426] to-[#142C52] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl"
        >
          <button
            onClick={handleBackToQuizzes}
            className="border-2 border-[#1B9AAA] text-[#1B9AAA] px-5 py-2 rounded-lg font-bold mb-6 hover:bg-[#1B9AAA] hover:text-white transition-all duration-300"
          >
            ← Back to Quizzes
          </button>

          <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-3xl font-bold text-[#071426] mb-3">
              {selectedQuiz.title}
            </h2>
            <p className="text-gray-600 text-lg">{selectedQuiz.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div
              className="bg-gray-50 p-4 rounded-lg border-l-4"
              style={{ borderColor: "#1B9AAA" }}
            >
              <p className="text-gray-600 text-sm font-medium mb-2">
                Number of Questions
              </p>
              <p className="text-2xl font-bold text-[#1B9AAA]">
                {selectedQuiz.questions?.length || 0}
              </p>
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg border-l-4"
              style={{ borderColor: "#1B9AAA" }}
            >
              <p className="text-gray-600 text-sm font-medium mb-2">
                Time Limit
              </p>
              <p className="text-2xl font-bold text-[#1B9AAA]">
                {selectedQuiz.duration || 10} min
              </p>
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg border-l-4"
              style={{ borderColor: "#1B9AAA" }}
            >
              <p className="text-gray-600 text-sm font-medium mb-2">
                Passing Score
              </p>
              <p className="text-2xl font-bold text-[#1B9AAA]">
                {selectedQuiz.passingScore || 60}%
              </p>
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg border-l-4"
              style={{ borderColor: "#1B9AAA" }}
            >
              <p className="text-gray-600 text-sm font-medium mb-2">
                Difficulty
              </p>
              <p className="text-2xl font-bold text-[#1B9AAA]">
                {selectedQuiz.difficulty || "Medium"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#071426] mb-4">
              📋 Instructions
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                ✓ You will have {selectedQuiz.duration || 10} minutes to
                complete this quiz
              </li>
              <li>✓ Each question has only one correct answer</li>
              <li>✓ You cannot go back to previous questions</li>
              <li>✓ Your score will be saved automatically</li>
              <li>
                ✓ You need to score at least {selectedQuiz.passingScore || 60}%
                to pass
              </li>
            </ul>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 bg-gradient-to-r from-[#1B9AAA] to-[#142C52] text-white text-lg font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Start Quiz Now
          </button>
        </motion.div>
      </div>
    );
  }

  // Active Quiz View
  if (selectedQuiz && quizStarted && !showResults) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;
    const timeWarning = timeLeft < 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071426] to-[#142C52] py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#071426]">
                {selectedQuiz.title}
              </h2>
              <span className="inline-block bg-[#E8F5F5] text-[#1B9AAA] px-3 py-1 rounded-full text-sm font-bold mt-2">
                Question {currentQuestion + 1} / {selectedQuiz.questions.length}
              </span>
            </div>
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all ${timeWarning ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}
            >
              <span className="text-2xl">⏱️</span>
              <span
                className={`text-xl font-bold font-mono min-w-[50px] ${timeWarning ? "text-red-600 animate-pulse" : "text-[#071426]"}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1B9AAA] to-[#142C52] transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-600 mt-2 font-semibold">
              {Math.round(progress)}%
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto bg-white rounded-xl p-6 sm:p-8 shadow-lg"
        >
          <div className="mb-6">
            <p className="text-sm font-bold text-[#1B9AAA] uppercase tracking-wide mb-3">
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#071426] leading-relaxed">
              {question.question}
            </h3>
          </div>

          {question.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden max-h-96">
              <img
                src={question.imageUrl}
                alt="Question"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index, option.isCorrect)}
                className="flex items-center gap-4 p-5 border-2 border-gray-300 rounded-xl bg-gray-50 hover:border-[#1B9AAA] hover:bg-[#E8F5F5] transition-all duration-300 text-left group transform hover:translate-x-1"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1B9AAA] text-white font-bold text-lg flex-shrink-0 group-active:bg-white group-active:text-[#1B9AAA]">
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="flex-grow">
                  <span className="text-base sm:text-lg font-medium text-gray-800">
                    {option.text}
                  </span>
                </div>
                <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity text-[#1B9AAA]">
                  →
                </span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-300 text-center">
            <p className="text-gray-600 text-sm font-medium">
              💡 Click on an option to select your answer and move to the next
              question
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Results View
  if (showResults) {
    const percentage = Math.round(
      (score / selectedQuiz.questions.length) * 100,
    );
    const passed = percentage >= (selectedQuiz.passingScore || 60);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071426] to-[#142C52] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white rounded-2xl p-8 sm:p-10 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
              style={{
                background: passed
                  ? "linear-gradient(135deg, #1B9AAA, #142C52)"
                  : "linear-gradient(135deg, #FF6B6B, #C92A2A)",
              }}
            >
              {passed ? "🎉" : percentage >= 40 ? "👍" : "📚"}
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#071426] mb-2">
            Quiz Completed!
          </h1>

          <div
            className="bg-gradient-to-r from-[#E8F5F5] to-[#F0F4FF] rounded-lg p-8 my-8 border-2"
            style={{ borderColor: "#1B9AAA" }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-5xl font-bold text-[#1B9AAA] border-4"
                style={{ borderColor: "#1B9AAA" }}
              >
                {percentage}%
              </div>
              <div className="text-left">
                <p className="text-gray-600 text-sm font-semibold uppercase mb-2">
                  Your Score
                </p>
                <p className="text-3xl font-bold text-[#071426]">
                  {score} out of {selectedQuiz.questions.length}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`inline-block px-6 py-3 rounded-full font-bold text-lg mb-8 ${passed ? "bg-green-100 text-green-700 border-2 border-green-500" : "bg-red-100 text-red-700 border-2 border-red-500"}`}
          >
            {passed ? "✓ PASSED" : "✗ NOT PASSED"}
          </div>

          <div
            className="bg-gray-50 rounded-lg p-6 mb-8 border-l-4"
            style={{ borderColor: "#1B9AAA" }}
          >
            {passed && (
              <p className="text-gray-700 text-lg font-medium">
                🌟 Excellent work! You have successfully passed this quiz.
              </p>
            )}
            {percentage >= 40 && !passed && (
              <p className="text-gray-700 text-lg font-medium">
                🙌 Good effort! Review the material and try again to improve
                your score.
              </p>
            )}
            {percentage < 40 && (
              <p className="text-gray-700 text-lg font-medium">
                💪 Keep learning! Review the course material and retake the
                quiz.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div
              className="bg-gray-50 rounded-lg p-6 border-b-4"
              style={{ borderColor: "#1B9AAA" }}
            >
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">
                Passing Score
              </p>
              <p className="text-3xl font-bold text-[#071426]">
                {selectedQuiz.passingScore || 60}%
              </p>
            </div>
            <div
              className="bg-gray-50 rounded-lg p-6 border-b-4"
              style={{ borderColor: "#142C52" }}
            >
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">
                Your Score
              </p>
              <p className="text-3xl font-bold text-[#071426]">{percentage}%</p>
            </div>
            <div
              className="bg-gray-50 rounded-lg p-6 border-b-4"
              style={{ borderColor: "#1B9AAA" }}
            >
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">
                Correct Answers
              </p>
              <p className="text-3xl font-bold text-[#071426]">
                {score}/{selectedQuiz.questions.length}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetakeQuiz}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[#1B9AAA] to-[#142C52] text-white font-bold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span className="text-sm sm:text-base">Retake Quiz</span>
            </button>
            <button
              onClick={handleBackToQuizzes}
              className="flex-1 py-3 px-6 bg-gray-200 text-[#071426] font-bold rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span className="text-sm sm:text-base">Back to Quizzes</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
};

export default QuizPage;
