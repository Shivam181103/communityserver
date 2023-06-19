const Chat = require('../models/Chat');

// Middleware function for chat
const chatMiddleware = async (req, res, next) => {
  try {
    // Process the chat message
    const { sender, receiver, message } = req.body;

    // Create a new chat object
    const chat = new Chat({
      sender,
      receiver,
      message,
    });

    // Save the chat object to the database
    await chat.save();

    // Continue to the next middleware
    next();
  } catch (error) {
    res.status(500).send({ error: 'Failed to process chat message' });
  }
};

module.exports = chatMiddleware;
