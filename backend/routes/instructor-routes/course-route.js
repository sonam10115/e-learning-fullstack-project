const express = require("express");
const {
    addNewCourse,
    getAllCourses,
    getCourseDetailsByID,
    updateCourseByID,
} = require("../../controller/instructor-controller/course-controller");
const router = express.Router();

router.post("/course/add", addNewCourse);
router.get("/course/get", getAllCourses);
router.get("/course/get/details/:id", getCourseDetailsByID);
router.put("/course/update/:id", updateCourseByID);

module.exports = router;