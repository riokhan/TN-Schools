import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// POST /api/attendance — Bulk mark attendance
router.post('/', async (req: Request, res: Response) => {
  try {
    const { records } = req.body; // Array of { studentId, schoolId, date, status, method }
    const result = await prisma.attendance.createMany({
      data: records,
      skipDuplicates: true,
    });
    res.status(201).json({ success: true, created: result.count });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/attendance/:studentId — Get student attendance
router.get('/:studentId', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: req.params.studentId,
        date: {
          ...(from ? { gte: new Date(String(from)) } : {}),
          ...(to ? { lte: new Date(String(to)) } : {}),
        },
      },
      orderBy: { date: 'desc' },
    });
    // Compute %
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    res.json({ success: true, percentage, total, present, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/attendance/school/:schoolId/today — School-level attendance for today
router.get('/school/:schoolId/today', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const records = await prisma.attendance.groupBy({
      by: ['status'],
      where: { schoolId: req.params.schoolId, date: { gte: today, lt: tomorrow } },
      _count: { status: true },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
