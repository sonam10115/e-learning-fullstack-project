const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    courseId: String,
    studentId: String,
    questions: [
        {
            question: String,
            options: [String],
            correctAnswer: String,
        },
    ],
    score: Number,
    isSubmitted: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Quiz", QuizSchema);
