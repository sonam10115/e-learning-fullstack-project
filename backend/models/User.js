const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    password: String,
    role: { type: String, default: "student" },
    lastActive: { type: Date, default: Date.now },
});

module.exports =
    mongoose.models.User || mongoose.model("User", UserSchema);