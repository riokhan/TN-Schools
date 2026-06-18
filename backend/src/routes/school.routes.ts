import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// GET /api/schools — List all schools
router.get('/', async (req: Request, res: Response) => {
  try {
    const { district, block } = req.query;
    const schools = await prisma.school.findMany({
      where: {
        ...(district ? { district: String(district) } : {}),
        ...(block ? { block: String(block) } : {}),
      },
      include: {
        _count: { select: { students: true, teachers: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, count: schools.length, data: schools });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/schools/:id — Single school with full details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { students: true, teachers: true } },
      },
    });
    if (!school) return res.status(404).json({ success: false, error: 'School not found' });
    res.json({ success: true, data: school });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/schools — Create school
router.post('/', async (req: Request, res: Response) => {
  try {
    const school = await prisma.school.create({ data: req.body });
    res.status(201).json({ success: true, data: school });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/schools/analytics/district/:district — District-level school analytics
router.get('/analytics/district/:district', async (req: Request, res: Response) => {
  try {
    const schools = await prisma.school.findMany({
      where: { district: req.params.district },
      include: {
        _count: { select: { students: true, teachers: true } },
      },
    });
    const totalStudents = schools.reduce((acc, s) => acc + s._count.students, 0);
    const totalTeachers = schools.reduce((acc, s) => acc + s._count.teachers, 0);
    res.json({
      success: true,
      data: {
        totalSchools: schools.length,
        totalStudents,
        totalTeachers,
        schools,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
