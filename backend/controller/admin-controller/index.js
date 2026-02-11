const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Order = require("../../models/Order");
const mongoose = require("mongoose");

/* ==================== DASHBOARD STATS ==================== */
exports.getDashboardStats = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalInstructors = await User.countDocuments({ role: "teacher" });
        const totalStudents = await User.countDocuments({ role: "user" });
        const totalCourses = await Course.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalInstructors,
                totalStudents,
                totalCourses,
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==================== USER MANAGEMENT ==================== */
exports.getAllUsers = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        const { page = 1, limit = 10, role = "" } = req.query;
        const skip = (page - 1) * limit;

        const filter = role ? { role } : {};
        const users = await User.find(filter)
            .select("-password")
            .limit(limit * 1)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const admin = req.user;
        const { userId } = req.params;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const admin = req.user;
        const { userId } = req.params;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const admin = req.user;
        const { userId } = req.params;
        const { role } = req.body;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (!["user", "teacher", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==================== COURSE MANAGEMENT ==================== */
exports.getAllCourses = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const courses = await Course.find()
            .populate("instructorId", "userName userEmail")
            .limit(limit * 1)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments();

        res.status(200).json({
            success: true,
            data: courses,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const admin = req.user;
        const { courseId } = req.params;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(courseId).populate("instructorId", "userName userEmail");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        console.error("Get course error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const admin = req.user;
        const { courseId } = req.params;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==================== ORDER MANAGEMENT ==================== */
exports.getAllOrders = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments();

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ==================== ANALYTICS ==================== */
exports.getAnalytics = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        // Monthly revenue
        const monthlyRevenue = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    total: { $sum: "$totalPrice" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            { $limit: 12 },
        ]);

        // Top courses
        const topCourses = await Order.aggregate([
            {
                $group: {
                    _id: "$courseId",
                    enrollments: { $sum: 1 },
                },
            },
            { $sort: { enrollments: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
        ]);

        // User growth
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                monthlyRevenue,
                topCourses,
                userGrowth,
            },
        });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
