const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const { ChatRoom, Message } = require("./models/ChatRoom");
require('dotenv').config();

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room ${roomId}`);
  });

  socket.on('chatMessage', async (msg, participants, senderEmail, roomId) => {
    try {
      let chatroom = await ChatRoom.findOne({ participants: { $all: participants } });
      if (!chatroom) {
        chatroom = new ChatRoom({ participants: participants });
      }

      const newMessage = new Message({
        sender: senderEmail,
        message: msg,
      });

      chatroom.messages.push(newMessage);
      await chatroom.save();

      // Emit the new message as an object to the specific room
      io.to(roomId).emit('message', { sender: senderEmail, message: msg, timestamp: new Date() });
    } catch (error) {
      console.error('An error occurred while posting the message:', error);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
