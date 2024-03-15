const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const { ChatRoom, Message } = require("./models/ChatRoom");
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const uploadDir = path.join(__dirname, 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('chatMessage', async (msg, participants, senderEmail, room, fileData, fileName) => {
    try {
      let chatroom = await ChatRoom.findOne({ participants: { $all: participants } });
      if (!chatroom) {
        chatroom = new ChatRoom({ participants: participants });
      }

      const newMessage = new Message({
        sender: senderEmail,
        message: msg || null, // set to null if no message
        file: fileData ? { fileName: fileName, filePath: `/uploads/${fileName}` } : null, // set to null if no file
      });

      // Only add the message to the chatroom if a message or file is present
      if (msg || fileData) {
        chatroom.messages.push(newMessage);
        await chatroom.save();
      }

      // Save the file data to a file if present
      if (fileData) {
        const filePath = path.join(uploadDir, fileName);
        fs.writeFile(filePath, new Buffer.from(fileData), (err) => {
          if (err) throw err;
          console.log('File saved.');
        });
      }

      // Emit the new message as an object to the specific room
      io.to(room).emit('message', { sender: senderEmail, message: msg, file: newMessage.file, timestamp: new Date() });
    } catch (error) {
      console.error('An error occurred while posting the message:', error);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
