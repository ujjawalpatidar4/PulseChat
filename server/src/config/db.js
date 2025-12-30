import mongoose from 'mongoose';

export const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri, { dbName: 'realtime_chat' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};
