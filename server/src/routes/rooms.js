import express from 'express';
import { Room } from '../models/Room.js';
import { User } from '../models/User.js';
import { Message } from '../models/Message.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const rooms = await Room.find({ $or: [{ isDirect: false }, { members: req.user._id }] })
    .sort({ lastMessageAt: -1 })
    .lean();
  res.json({ rooms });
});

router.post('/', authRequired, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });
  const room = await Room.create({ name, isDirect: false, members: [req.user._id] });
  res.status(201).json({ room });
});

router.post('/direct', authRequired, async (req, res) => {
  const { email } = req.body;
  const other = await User.findOne({ email });
  if (!other) return res.status(404).json({ message: 'User not found' });
  const existing = await Room.findOne({
    isDirect: true,
    members: { $all: [req.user._id, other._id] }
  });
  if (existing) return res.json({ room: existing });
  const room = await Room.create({ name: `${req.user.name} ↔ ${other.name}`.slice(0, 80), isDirect: true, members: [req.user._id, other._id] });
  res.status(201).json({ room });
});

router.get('/:roomId/messages', authRequired, async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ room: roomId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email avatarColor')
    .lean();
  res.json({ messages });
});

router.post('/:roomId/messages', authRequired, async (req, res) => {
  const { roomId } = req.params;
  const { content, mediaUrl, mediaType } = req.body;
  const message = await Message.create({ room: roomId, sender: req.user._id, content, mediaUrl, mediaType });
  await Room.findByIdAndUpdate(roomId, { lastMessageAt: new Date() });
  const populated = await message.populate('sender', 'name email avatarColor');
  res.status(201).json({ message: populated });
});

router.post('/:roomId/clear', authRequired, async (req, res) => {
  const { roomId } = req.params;
  await Message.deleteMany({ room: roomId });
  res.json({ message: 'Chat cleared' });
});

router.post('/:roomId/delete', authRequired, async (req, res) => {
  const { roomId } = req.params;
  await Message.deleteMany({ room: roomId });
  await Room.findByIdAndDelete(roomId);
  res.json({ message: 'Room deleted' });
});

export default router;
