const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./config/db');
const cors = require('cors'); 
require('dotenv').config(); 
const app = express();
app.use(cors());


connectDB()
// Middleware
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

module.exports = app;
