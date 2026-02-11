const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { ENV } = require("../lib/env.js");

const socketAuthMiddleware = async (socket, next) => {
    try {
        if (!ENV.JWT_SECRET) {
            console.error("❌ CRITICAL in socket auth: JWT_SECRET not available!");
            return next(new Error("Unauthorized - Server configuration error"));
        }
        // extract token from multiple sources
        let token = null;

        // Try 1: jwt cookie
        token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];

        // Try 2: Authorization header
        if (!token) {
            const authHeader = socket.handshake.headers.authorization || '';
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        // Try 3: auth object (socket.io handshake auth)
        if (!token) {
            token = socket.handshake.auth?.token;
        }

        if (!token) {
            console.log("🔴 Socket connection rejected: No token provided");
            console.log("Available auth sources:", {
                hasCookie: !!socket.handshake.headers.cookie,
                hasAuthHeader: !!socket.handshake.headers.authorization,
                hasAuth: !!socket.handshake.auth,
            });
            return next(new Error("Unauthorized - No Token Provided"));
        }

        console.log("✅ Token found, verifying with current JWT_SECRET...");
        console.log("🔐 ENV.JWT_SECRET set:", ENV.JWT_SECRET ? "✅ yes" : "❌ NO!");
        console.log("📝 Token parts:", token.split('.').length === 3 ? "✅ 3 (valid)" : "❌ invalid structure");

        // verify the token
        let decoded;
        try {
            if (!ENV.JWT_SECRET) {
                throw new Error("JWT_SECRET environment variable is not configured");
            }
            decoded = jwt.verify(token, ENV.JWT_SECRET);
            console.log("✅ Token verified successfully for user ID:", decoded._id);
        } catch (jwtError) {
            if (jwtError.name === "JsonWebTokenError" && jwtError.message === "invalid signature") {
                console.error("❌ INVALID SIGNATURE ERROR");
                console.error("   Cause: Token was created with a DIFFERENT JWT_SECRET");
                console.error("   Solution: User should clear localStorage and login again");
                console.error("   Current JWT_SECRET:", ENV.JWT_SECRET ? ENV.JWT_SECRET.substring(0, 20) + "..." : "NOT SET");
            } else {
                console.error("❌ JWT Error:", jwtError.name, "-", jwtError.message);
            }
            return next(new Error(`Unauthorized - ${jwtError.message}`));
        }

        // find the user from db (use _id from JWT payload)
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            console.log("❌ Socket connection rejected: User not found in DB");
            return next(new Error("User not found"));
        }

        // attach user info to socket
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`✅ Socket authenticated: ${user.userName} (ID: ${user._id})`);

        next();
    } catch (error) {
        console.error("❌ Socket auth middleware caught error:", error.message);
        console.error("Stack:", error.stack);
        next(new Error("Unauthorized - Authentication failed"));
    }
};

module.exports = { socketAuthMiddleware };
