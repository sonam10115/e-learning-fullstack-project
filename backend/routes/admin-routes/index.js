const express = require("express");
const router = express.Router();
const authenticateMiddleware = require("../../middleware/auth-middleware");
const adminMiddleware = require("../../middleware/admin-middleware");
const {
    getDashboardStats,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
    getAllCourses,
    getCourseById,
    deleteCourse,
    getAllOrders,
    getAnalytics,
} = require("../../controller/admin-controller/index.js");

router.use(authenticateMiddleware);
router.use(adminMiddleware);

// Dashboard & Stats
router.get("/dashboard/stats", getDashboardStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.delete("/users/:userId", deleteUser);
router.put("/users/:userId/role", updateUserRole);

// Course Management
router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourseById);
router.delete("/courses/:courseId", deleteCourse);

// Order Management
router.get("/orders", getAllOrders);

// Analytics
router.get("/analytics", getAnalytics);

module.exports = router;
