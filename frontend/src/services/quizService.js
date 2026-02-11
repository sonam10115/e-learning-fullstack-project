import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const quizService = {
    // Get all quizzes for a course
    getQuizzes: async (courseId, token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/quiz/course/${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            throw error;
        }
    },

    // Get single quiz with questions
    getQuizById: async (quizId, token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/quiz/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching quiz:", error);
            throw error;
        }
    },

    // Submit quiz answers
    submitQuiz: async (quizData, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/quiz/submit`,
                quizData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error submitting quiz:", error);
            throw error;
        }
    },

    // Get user's quiz attempts
    getQuizAttempts: async (quizId, token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/quiz/${quizId}/attempts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching quiz attempts:", error);
            throw error;
        }
    },

    // Get quiz leaderboard
    getQuizLeaderboard: async (quizId, token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/quiz/${quizId}/leaderboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            throw error;
        }
    },

    // Get all quizzes for student courses
    getStudentQuizzes: async (token) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/student/quizzes`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching student quizzes:", error);
            throw error;
        }
    },

    // Calculate quiz score
    calculateScore: (answers, questions) => {
        let correctCount = 0;
        answers.forEach((answer) => {
            if (answer.isCorrect) {
                correctCount++;
            }
        });
        return {
            correct: correctCount,
            total: questions.length,
            percentage: Math.round((correctCount / questions.length) * 100),
        };
    },
};

export default quizService;
