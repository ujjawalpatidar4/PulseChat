import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isDirect: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Room = mongoose.model('Room', roomSchema);
