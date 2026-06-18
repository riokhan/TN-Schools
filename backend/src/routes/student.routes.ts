import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// GET /api/students/:id — Get student profile with marks & attendance
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true, mobile: true } },
        school: { select: { name: true, district: true } },
        marks: { orderBy: { createdAt: 'desc' }, take: 20 },
        attendance: { orderBy: { date: 'desc' }, take: 30 },
        scholarships: true,
      },
    });
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/students — List with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { schoolId, class: cls, section } = req.query;
    const students = await prisma.student.findMany({
      where: {
        ...(schoolId ? { schoolId: String(schoolId) } : {}),
        ...(cls ? { class: String(cls) } : {}),
        ...(section ? { section: String(section) } : {}),
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/students — Create student
router.post('/', async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.create({ data: req.body });
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
