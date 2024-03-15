const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileName: {
    type: String,
  },
  filePath: {
    type: String,
  },
  // Add other file properties if needed
});

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  file: FileSchema, // Use the FileSchema for the file field
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
