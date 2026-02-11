const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ENV } = require('../lib/env.js');


module.exports = async (req, res, next) => {

    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (req.cookies && req.cookies.accessToken);
        console.log("AUTH HEADER:", req.headers.authorization);
        console.log("COOKIE TOKEN:", req.cookies?.accessToken);


        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const payload = jwt.verify(token, ENV.JWT_SECRET);
        req.user = payload;

        await User.findByIdAndUpdate(payload._id, {
            lastActive: new Date()
        });
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}; 