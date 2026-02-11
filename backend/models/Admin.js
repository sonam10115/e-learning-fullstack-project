const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        adminName: {
            type: String,
            required: true,
        },
        adminEmail: {
            type: String,
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: ["manage_users", "manage_courses", "manage_orders", "view_analytics", "manage_instructors", "manage_students"],
            default: ["manage_users", "manage_courses", "view_analytics"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
