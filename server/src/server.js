import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { registerWorkspaceSockets } from './sockets/workspace.socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Register Socket events
registerWorkspaceSockets(io);

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`
==================================================
  🚀 SESSIONVAULT ENTERPRISE BACKEND ONLINE
  📡 PORT: ${PORT}
  🌐 MODE: ${process.env.NODE_ENV || 'development'}
  🔗 CLIENT: ${CLIENT_URL}
  ❤️  HEALTH: /api/v1/health
==================================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();