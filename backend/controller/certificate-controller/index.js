const StudentCourse = require("../../models/StudentCourse");
const User = require("../../models/User");
const Course = require("../../models/Course");
const { generateCertificate } = require("../../utils/generateCertificate");
const path = require("path");
const fs = require("fs");

// Generate certificate for a student who completed a course
exports.generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - Please login" });
        }

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        console.log(` Generating certificate for user: ${userId}, course: ${courseId}`);

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if student purchased the course
        const studentCourse = await StudentCourse.findOne({
            userId,
            "courses.courseId": courseId,
        });

        if (!studentCourse) {
            return res.status(403).json({
                message: "You haven't purchased this course or don't have access",
            });
        }

        // Generate the certificate
        try {
            const { filename, filePath } = await generateCertificate(
                user.userName || user.name || "Student",
                course.title || "Unknown Course",
                new Date()
            );

            console.log("✅ Certificate generated successfully:", filename);

            // Return certificate info
            res.json({
                success: true,
                message: "Certificate generated successfully",
                certificateName: filename,
                downloadUrl: `/certificates/${filename}`,
            });
        } catch (certError) {
            console.error(" Error generating PDF:", certError);
            return res.status(500).json({
                message: "Failed to generate certificate",
                error: certError.message,
            });
        }
    } catch (error) {
        console.error(" Certificate generation error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Download generated certificate
exports.downloadCertificate = async (req, res) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).json({ message: "Filename is required" });
        }

        const certificatesDir = path.join(__dirname, "../../certificates");
        const filePath = path.join(certificatesDir, filename);

        // Security check - prevent directory traversal
        if (!filePath.startsWith(certificatesDir)) {
            return res.status(403).json({ message: "Invalid file path" });
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Certificate file not found" });
        }

        console.log(" Downloading certificate:", filename);

        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Download error:", err);
            }
        });
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({
            message: "Error downloading certificate",
            error: error.message,
        });
    }
};
