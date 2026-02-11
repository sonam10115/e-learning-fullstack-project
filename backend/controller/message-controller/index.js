const cloudinary = require("../../lib/cloudinary.js");
const { getReceiverSocketId, io } = require("../../lib/socket.js");
const Message = require("../../models/Message.js");
const User = require("../../models/User.js");
const mongoose = require("mongoose");

const getCourseContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const role = req.user.role || 'student';

        if (role === 'student') {
            // return the instructor(s) for courses the student is enrolled in
            const courses = await require('../../models/Course')
                .find({ 'students.studentId': loggedInUserId })
                .select('instructorId');

            const instructorIds = [...new Set(courses.map(c => c.instructorId).filter(id => mongoose.Types.ObjectId.isValid(id)))];
            const instructorObjectIds = instructorIds.map(id => new mongoose.Types.ObjectId(id));
            const instructors = await User.find({ _id: { $in: instructorObjectIds } }).select('-password');
            return res.status(200).json(instructors);
        } else if (role === 'instructor') {
            // return students enrolled in instructor's courses
            const courses = await require('../../models/Course')
                .find({ instructorId: loggedInUserId })
                .select('students');

            const studentIds = [...new Set(courses.flatMap(c => (c.students || []).map(s => s.studentId)).filter(id => mongoose.Types.ObjectId.isValid(id)))];
            const studentObjectIds = studentIds.map(id => new mongoose.Types.ObjectId(id));
            const students = await User.find({ _id: { $in: studentObjectIds } }).select('-password');
            return res.status(200).json(students);
        }

        // default fallback: return all other users
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log('Error in getCourseContacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const Course = require('../../models/Course');
        const role = req.user.role || 'student';

        // Access control: students can only fetch messages with their course instructor
        if (role !== 'instructor') {
            const allowed = await Course.exists({ instructorId: userToChatId, 'students.studentId': myId });
            if (!allowed) {
                return res.status(403).json({ message: 'Not allowed to view messages with this user.' });
            }
        } else {
            // instructor: allow if the user is enrolled in any of the instructor's courses or if prior messages exist
            const enrolled = await Course.exists({ instructorId: myId, 'students.studentId': userToChatId });
            if (!enrolled) {
                const prior = await Message.exists({ $or: [{ senderId: userToChatId, receiverId: myId }, { senderId: myId, receiverId: userToChatId }] });
                if (!prior) return res.status(403).json({ message: 'Not allowed to view messages with this user.' });
            }
        }

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: 'Text or image is required.' });
        }
        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({ message: 'Cannot send messages to yourself.' });
        }
        const receiverExists = await User.findById(receiverId);
        if (!receiverExists) {
            return res.status(404).json({ message: 'Receiver not found.' });
        }

        // Enforce course-based access control
        const Course = require('../../models/Course');
        const senderRole = req.user.role || 'student';

        if (senderRole !== 'instructor') {
            // student -> can only message their course instructor
            const allowed = await Course.exists({ instructorId: receiverId, 'students.studentId': senderId });
            if (!allowed) {
                return res.status(403).json({ message: 'Not allowed to message this user.' });
            }
        } else {
            // instructor -> allow messaging only to students enrolled in their courses
            const enrolled = await Course.exists({ instructorId: senderId, 'students.studentId': receiverId });
            if (!enrolled) {
                // allow reply if student previously messaged this instructor
                const prior = await Message.exists({ senderId: receiverId, receiverId: senderId });
                if (!prior) {
                    return res.status(403).json({ message: 'Not allowed to message this student.' });
                }
            }
        }

        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
            console.log(`Message sent to receiver via socket: ${receiverId.toString()}`);
        } else {
            console.log(`Receiver ${receiverId.toString()} not online, message saved to DB`);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const role = req.user.role || 'student';
        const Course = require('../../models/Course');

        if (role === 'student') {
            // students see their instructor(s)
            const courses = await Course.find({ 'students.studentId': loggedInUserId }).select('instructorId');
            const instructorIds = [...new Set(courses.map(c => c.instructorId).filter(id => mongoose.Types.ObjectId.isValid(id)))];
            const instructorObjectIds = instructorIds.map(id => new mongoose.Types.ObjectId(id));
            const instructors = await User.find({ _id: { $in: instructorObjectIds } }).select('-password');
            return res.status(200).json(instructors);
        }

        if (role === 'instructor') {
            // instructors see all students in their courses + students who messaged them
            const courses = await Course.find({ instructorId: loggedInUserId }).select('students');
            const studentIds = [...new Set(courses.flatMap(c => (c.students || []).map(s => s.studentId)).filter(id => mongoose.Types.ObjectId.isValid(id)))];

            const messages = await Message.find({ $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] });
            const messagedUserIds = messages.map((msg) => (msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString())).filter(id => mongoose.Types.ObjectId.isValid(id));

            const allPartnerIds = [...new Set([...studentIds, ...messagedUserIds])];
            const partnerObjectIds = allPartnerIds.map(id => new mongoose.Types.ObjectId(id));
            const partners = await User.find({ _id: { $in: partnerObjectIds } }).select('-password');
            return res.status(200).json(partners);
        }

        // default fallback to previous behavior
        const messages = await Message.find({ $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] });
        const chatPartnerIds = [...new Set(messages.map((msg) => (msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString())).filter(id => mongoose.Types.ObjectId.isValid(id)))];
        const chatPartnerObjectIds = chatPartnerIds.map(id => new mongoose.Types.ObjectId(id));
        const chatPartners = await User.find({ _id: { $in: chatPartnerObjectIds } }).select('-password');
        res.status(200).json(chatPartners);
    } catch (error) {
        console.error('Error in getChatPartners: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCourseContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage,
};
