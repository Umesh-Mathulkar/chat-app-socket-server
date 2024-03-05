const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoomSchema = new mongoose.Schema({
  messages: [MessageSchema],
  participants: [{
    type: String,
    required: true,
  }],
});

module.exports = {
  ChatRoom: mongoose.model('ChatRoom', ChatRoomSchema),
  Message: mongoose.model('Message', MessageSchema),
};
