import { Router, Request, Response } from 'express';
import { AIChat, Portfolio, LearningPath, Wellness } from '../models/mongo';

const router = Router();

// POST /api/ai/chat — Save AI chat session
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { studentId, sessionId, messages, subject, language } = req.body;
    const chat = await AIChat.create({ studentId, sessionId, messages, subject, language });
    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/ai/chat/:studentId — Get chat history
router.get('/chat/:studentId', async (req: Request, res: Response) => {
  try {
    const chats = await AIChat.find({ studentId: req.params.studentId }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/ai/learning-path/:studentId
router.get('/learning-path/:studentId', async (req: Request, res: Response) => {
  try {
    const path = await LearningPath.findOne({ studentId: req.params.studentId });
    res.json({ success: true, data: path });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/ai/learning-path
router.post('/learning-path', async (req: Request, res: Response) => {
  try {
    const lp = await LearningPath.findOneAndUpdate(
      { studentId: req.body.studentId },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ success: true, data: lp });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
