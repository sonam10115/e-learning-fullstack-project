const openai = require('../config/openai.js');
const Course = require('../models/Course.js');

const getAIReply = async (question, courseId) => {
    try {
        // Fetch course details to get title for context
        let courseTitle = "General Course";
        try {
            const course = await Course.findById(courseId);
            if (course) {
                courseTitle = course.title || courseTitle;
            }
        } catch (courseError) {
            console.warn("Could not fetch course title, using default");
        }

        const prompt = `You are a helpful assistant teacher for an e-learning platform.

Course: ${courseTitle}
Provide a clear, concise answer with examples if helpful.
Keep response brief and focused on the student's question.

Student Question:
${question}`;

        console.log("Attempting OpenAI call with model: gpt-3.5-turbo");

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful teaching assistant on an e-learning platform. Answer student questions accurately and concisely."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        console.log("✅ OpenAI response received successfully");
        return response.choices[0].message.content;
    } catch (error) {
        console.error(" OpenAI Error:", error.message);
        console.error("Error Code:", error.code || error.status);

        // QUOTA EXCEEDED - Use fallback response
        if (error.code === 'insufficient_quota' || error.status === 429) {
            console.warn(" Quota exceeded - using fallback intelligent response");
            return generateFallbackResponse(question);
        }

        // API KEY ERROR - Check configuration
        if (error.code === 'invalid_api_key' || error.status === 401) {
            return "AI service is not configured properly. Please check API key.";
        }

        // NETWORK ERROR
        if (error.message?.includes("ECONNREFUSED") || error.message?.includes("Network")) {
            return "Network error connecting to AI service. Please try again.";
        }

        // Generic fallback
        return generateFallbackResponse(question);
    }
};

// Fallback intelligent response generator (doesn't use OpenAI quota)
const generateFallbackResponse = (question) => {
    const q = question.toLowerCase().trim();

    // Course-related questions
    if (q.includes('assignment') || q.includes('homework')) {
        return "For assignments, please submit your work before the deadline. If you need help, contact your instructor or review the course materials for guidance.";
    }
    if (q.includes('deadline') || q.includes('due date')) {
        return "Deadlines are typically listed in the course syllabus and on each assignment. Check your course dashboard for specific dates.";
    }
    if (q.includes('certificate') || q.includes('proof')) {
        return "Upon successful completion of the course, you'll receive a certificate. Check your profile or the course completion page.";
    }
    if (q.includes('refund') || q.includes('payment')) {
        return "For payment and refund inquiries, please contact our support team through the Help section.";
    }

    // Learning-related questions
    if (q.includes('how') || q.includes('what') || q.includes('why')) {
        return "Great question! For detailed explanations, refer to the lesson materials or video lectures. If you need more help, reach out to your instructor.";
    }
    if (q.includes('help') || q.includes('stuck')) {
        return "I'm here to help! Try reviewing the lesson materials again, and if you're still stuck, consider asking in the course forum or messaging your instructor.";
    }
    if (q.includes('project') || q.includes('final')) {
        return "For project details, check the course outline and instructions. Start early and reach out to your instructor if you have specific questions.";
    }

    // General helpful response
    return `Thanks for your question! I'd recommend:\n1. Checking the course materials and lectures\n2. Reviewing the FAQ section\n3. Asking your instructor for clarification\n\nYour instructor will provide the best guidance for your specific question.`;
};

module.exports = { getAIReply };
