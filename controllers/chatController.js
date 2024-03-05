const { mongoose } = require("mongoose");
const { ChatRoom, Message } = require("../models/ChatRoom");

exports.postMessage = async (req, res) => {
    try {
      const { chatroomId, message } = req.body;
  
      let chatroom = await ChatRoom.findById(chatroomId);
      if (!chatroom) {
        chatroom = new ChatRoom({ _id: chatroomId });
      }
  
      const newMessage = new Message({
        sender: req.user.id,
        message,
      });
  
      chatroom.messages.push(newMessage);
      await chatroom.save();
  
      res.status(200).json({ message: 'Message posted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while posting the message' });
    }
  };
  
  exports.getChatroomMessages = async (req, res) => {
    try {
      const { chatroomId } = req.params;
  
      // 1. Validate chatroomId
      if (!mongoose.Types.ObjectId.isValid(chatroomId)) {
        return res.status(400).json({ error: 'Invalid chatroom ID' });
      }
  
      // 2. Find ChatRoom
      const chatroom = await ChatRoom.findById(chatroomId)
      if (!chatroom) {
        return res.status(404).json({ error: 'Chatroom not found' });
      }
  
      // 3. Success Response
      res.status(200).json(chatroom.messages);
  
    } catch (error) {
      // 4. Handle Specific Errors
      if (error.name === 'CastError') { 
        res.status(400).json({ error: 'Invalid chatroom ID' });
      } else { 
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'An error occurred while fetching the messages' });
      }
    }
  };
  
