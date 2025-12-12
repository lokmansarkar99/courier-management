import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/dbConnect.js';


dotenv.config();

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Socket.IO connection handler (will be expanded later)
io.on('connection', (socket) => {
  console.log(' Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log(' Socket disconnected:', socket.id);
  });
});

// Attach io to app for use in controllers
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n Server running in ${process.env.NODE_ENV} mode`);
  console.log(` Port: ${PORT}`);

});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(' UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
