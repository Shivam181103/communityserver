const Chat = require('../models/Chat.js');

// Controller function for creating a chat message
const createChatMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Create a new chat message
    const chatMessage = new Chat({ sender, receiver, message });
    await chatMessage.save();

    res.status(201).json({ message: 'Chat message created successfully', chatMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat message' });
  }
};

// Controller function for retrieving all chat messages between two users
const getChatMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    // Find all chat messages between the sender and receiver
    const chatMessages = await Chat.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    res.status(200).json({ chatMessages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat messages' });
  }
};

// Controller function for deleting all chat messages between two users
const deleteChatMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    // Delete all chat messages between the sender and receiver
    await Chat.deleteMany({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    res.status(200).json({ message: 'Chat messages deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat messages' });
  }
};
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
};
const getChatContacts = async (req, res) => {
  try {
    // Assuming the "Chat" model has a "participants" field with an array of participant IDs
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .select('-messages') // Exclude messages from the response

    // Extract participant details from each chat
    const contacts = chats.map(chat => ({
      id: chat._id,
      participants: chat.participants
    }));

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat contacts' });
  }
};

module.exports = {
  createChatMessage,
  getChatMessages,
  deleteChatMessages,
  getAllChats,
  getChatContacts
};
