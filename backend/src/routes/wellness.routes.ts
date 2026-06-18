import { Router, Request, Response } from 'express';
import { Wellness } from '../models/mongo';

const router = Router();

// POST /api/wellness — Log mood entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const entry = await Wellness.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/wellness/:studentId — Get wellness history
router.get('/:studentId', async (req: Request, res: Response) => {
  try {
    const entries = await Wellness.find({ studentId: req.params.studentId })
      .sort({ date: -1 })
      .limit(30);
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
