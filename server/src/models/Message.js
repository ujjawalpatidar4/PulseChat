import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, trim: true },
    mediaUrl: { type: String },
    mediaType: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const Message = mongoose.model('Message', messageSchema);
