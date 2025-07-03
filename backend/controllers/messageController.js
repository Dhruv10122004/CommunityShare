const messageModel = require('../models/messageModel');

exports.sendMessage = async (req, res) => {
    try {
        const { receiver_id, item_id, message } = req.body;
        const newMessage = await messageModel.sendMessage(req.user.id, receiver_id, item_id, message);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        // Use req.params to get values from the URL path.
        // Use req.body for data sent in the request body (like POST/PUT).
        // Use req.query for query string parameters (like ?search=abc).
        const messages = await messageModel.getConversation(req.user.id, userId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllThreadsForUser = async(req, res) => {
    try {
        const userId = req.user.id;
        const threads = await messageModel.getThreadsForUser(userId);
        res.json(threads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};