const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors'); 
require('dotenv').config(); 
const app = express();
app.use(cors());


connectDB()
// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/chat', chatRoutes);

module.exports = app;
