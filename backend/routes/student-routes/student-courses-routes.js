const express = require("express");
const {
    getCoursesByStudentId,
} = require("../../controller/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);

module.exports = router;