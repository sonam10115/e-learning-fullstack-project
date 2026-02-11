const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const connectDB = require('./utils/db.js');
const { server, app, io } = require('./lib/socket.js');
const { ENV } = require('./lib/env.js');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// ============ ROUTE IMPORTS ============
const authRoutes = require('./routes/auth-routes/index.js');
const instructorCourseRoutes = require('./routes/instructor-routes/course-route.js');
const instructorMediaRoutes = require('./routes/instructor-routes/media-route.js');
const studentCourseRoutes = require('./routes/student-routes/course-routes.js');
const studentProgressRoutes = require('./routes/student-routes/course-progress-routes.js');
const studentOrderRoutes = require('./routes/student-routes/order-routes.js');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes.js');
const chatRoutes = require('./routes/message-Routes/index.js');
const certificateRoutes = require('./routes/certificate-routes/index.js');
const adminRoutes = require('./routes/admin-routes/index.js');
const quizRoutes = require('./routes/quiz-routes/index.js');
const messageRoutes = require('./routes/message-Routes/index.js');

// ============ ROUTE MOUNTING ============
// Serve static files for certificates
app.use('/certificates', express.static('certificates'));

app.use('/chat', chatRoutes);
app.use('/certificate', certificateRoutes);
app.use('/admin', adminRoutes);

app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/api', authRoutes);

app.use('/instructor', instructorCourseRoutes);
app.use('/media', instructorMediaRoutes);

app.use('/student', studentCourseRoutes);
app.use('/student', studentProgressRoutes);
app.use('/student', studentOrderRoutes);
app.use('/student', studentCoursesRoutes);
app.use('/messages', messageRoutes);
app.use('/quiz', quizRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


// ============ SERVER START ============
server.listen(PORT, () => {
    connectDB();
    console.log(`
  Server is running on port ${PORT}                        
  WebSocket enabled for real-time chat                  
  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'} `);
});
