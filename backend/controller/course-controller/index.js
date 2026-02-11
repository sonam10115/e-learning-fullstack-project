// controllers/courseController.js
const Enrollment = require("../models/Enrollment.js");
const Course = require("../models/Course.js");

const completeLesson = async (req, res) => {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    const course = await Course.findById(enrollment.courseId);

    enrollment.completedLessons += 1;

    if (enrollment.completedLessons === course.totalLessons) {
        enrollment.isCompleted = true;
    }

    await enrollment.save();
    res.json(enrollment);
};

module.exports = { completeLesson };
