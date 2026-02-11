// import openai from "../../utils/test-ai.js";
const Quiz = require("../../models/Quiz.js");

const generateQuiz = async (req, res) => {
  const { courseTitle, courseDescription, studentId, courseId } = req.body;

  const prompt = `
  Create a 5-question multiple choice quiz for a student.
  Course Title: ${courseTitle}
  Course Description: ${courseDescription}

  Format:
  [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": ""
    }
  ]
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const questions = JSON.parse(response.choices[0].message.content);

  const quiz = await Quiz.create({
    courseId,
    studentId,
    questions,
  });

  res.json(quiz);
};

module.exports = { generateQuiz };
