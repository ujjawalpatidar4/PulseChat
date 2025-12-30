import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import uploadRoutes from './routes/uploads.js';
import { Message } from './models/Message.js';
import { Room } from './models/Room.js';
import { authRequired } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', 'uploads');

console.log('Upload directory path:', uploadDir);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadDir));
console.log('Static files being served from /uploads at:', uploadDir);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/uploads', uploadRoutes);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    // reuse auth middleware to validate token
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: () => ({ json: () => null }) };
    await new Promise((resolve, reject) => authRequired(req, res, (err) => (err ? reject(err) : resolve())));
    socket.user = req.user;
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.user.email);
  
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.user.email} joined room ${roomId}`);
  });

  socket.on('message', async ({ roomId, content, mediaUrl, mediaType }) => {
    console.log('Message received:', { roomId, content, user: socket.user.email });
    if (!roomId || (!content && !mediaUrl)) return;
    
    try {
      const message = await Message.create({
        room: roomId,
        sender: socket.user._id,
        content,
        mediaUrl,
        mediaType
      });
      await Room.findByIdAndUpdate(roomId, { lastMessageAt: new Date() });
      const populated = await message.populate('sender', 'name email avatarColor');
      
      console.log('Emitting message to room:', roomId, populated);
      io.to(roomId).emit('message', populated);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.user.email);
  });
});

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDb(process.env.MONGODB_URI);
  server.listen(PORT, () => console.log(`API listening on ${PORT}`));
};

start();
