import { useContext } from "react";
import { QuizContext } from "../context/quiz-context/QuizContext";

/**
 * Custom hook to use Quiz Context
 * Provides access to quiz state and actions
 */
export const useQuiz = () => {
    const context = useContext(QuizContext);

    if (!context) {
        throw new Error("useQuiz must be used within QuizProvider");
    }

    return context;
};

/**
 * Hook to calculate quiz score
 */
export const useQuizScore = (answers, questions) => {
    if (!answers || !questions) {
        return { correct: 0, total: 0, percentage: 0 };
    }

    const correct = answers.filter((answer) => answer?.isCorrect).length;
    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);

    return {
        correct,
        total,
        percentage,
        passed: percentage >= 60,
    };
};

/**
 * Hook for timer functionality
 */
export const useQuizTimer = (initialSeconds, onTimeUp) => {
    const [timeLeft, setTimeLeft] = React.useState(initialSeconds);
    const [isActive, setIsActive] = React.useState(false);

    React.useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsActive(false);
                        onTimeUp?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, onTimeUp]);

    return {
        timeLeft,
        setTimeLeft,
        isActive,
        setIsActive,
        formatTime: (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`;
        },
    };
};

/**
 * Hook for quiz attempt history
 */
export const useQuizHistory = () => {
    const [history, setHistory] = React.useState([]);

    const addAttempt = React.useCallback((attempt) => {
        setHistory((prev) => [...prev, attempt]);
    }, []);

    const clearHistory = React.useCallback(() => {
        setHistory([]);
    }, []);

    const getAverageScore = React.useCallback(() => {
        if (history.length === 0) return 0;
        const sum = history.reduce((acc, attempt) => acc + attempt.score, 0);
        return Math.round(sum / history.length);
    }, [history]);

    return {
        history,
        addAttempt,
        clearHistory,
        getAverageScore,
        attemptCount: history.length,
    };
};
