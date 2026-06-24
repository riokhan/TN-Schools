import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// GET /api/sports/:studentId
router.get('/:studentId', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    let profile = await prisma.sportsProfile.findUnique({
      where: { studentId },
      include: {
        teams: true,
        stats: true,
        events: true,
        logs: true,
      }
    });

    // Fallback to first student if not found
    if (!profile) {
      const demoStudent = await prisma.student.findFirst();
      if (demoStudent) {
        profile = await prisma.sportsProfile.findUnique({
          where: { studentId: demoStudent.id },
          include: {
            teams: true,
            stats: true,
            events: true,
            logs: true,
          }
        });
      }
    }

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Sports profile not found' });
    }

    const formattedData = {
      teams: profile.teams,
      stats: profile.stats,
      events: profile.events,
      logs: profile.logs,
    };

    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('Error fetching sports profile:', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
