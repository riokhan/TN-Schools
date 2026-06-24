import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// GET /api/activities — Fetch all clubs and events
router.get('/', async (req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { name: 'asc' }
    });

    const events = await prisma.clubEvent.findMany({
      orderBy: { eventDate: 'asc' },
      take: 5
    });

    // For demo purposes, fetch the first student's joined clubs
    const demoStudent = await prisma.student.findFirst();
    let formattedMyClubs = [];
    if (demoStudent) {
      const myClubs = await prisma.clubMember.findMany({
        where: { studentId: demoStudent.id },
        include: { club: true }
      });
      formattedMyClubs = myClubs.map(member => ({
        name: member.club.name,
        role: member.role,
        icon: member.club.icon,
        color: member.club.themeColor,
        nextEvent: "See details in club page" 
      }));
    }

    res.json({ success: true, data: { discoverClubs: clubs, upcomingEvents: events, myClubs: formattedMyClubs } });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/activities/student/:studentId — Fetch clubs for a specific student
router.get('/student/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;

    const myClubs = await prisma.clubMember.findMany({
      where: { studentId },
      include: {
        club: true
      }
    });

    // Transform the data to match the frontend shape
    const formattedMyClubs = myClubs.map(member => ({
      name: member.club.name,
      role: member.role,
      icon: member.club.icon,
      color: member.club.themeColor,
      nextEvent: "See details in club page" // Placeholder since we didn't add events per club yet
    }));

    res.json({ success: true, data: { myClubs: formattedMyClubs } });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
