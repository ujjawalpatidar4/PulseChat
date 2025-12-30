import express from 'express';
import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { authRequired } from '../middleware/auth.js';

const uploadDir = path.join(process.cwd(), 'server', 'uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid(12)}${ext}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

router.post('/', authRequired, upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${file.filename}`;
  res.status(201).json({ url, type: file.mimetype });
});

export default router;
