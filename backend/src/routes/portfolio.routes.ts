import { Router, Request, Response } from 'express';
import { Portfolio } from '../models/mongo';

const router = Router();

// GET /api/portfolio/:studentId
router.get('/:studentId', async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOne({ studentId: req.params.studentId });
    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/portfolio — Create or update portfolio
router.post('/', async (req: Request, res: Response) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { studentId: req.body.studentId },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
