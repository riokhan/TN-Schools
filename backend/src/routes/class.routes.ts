import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { randomUUID } from 'crypto';

const router = Router();

// ─── GET /api/classes?schoolId=&teacherId= ──────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { schoolId, teacherId } = req.query;
    if (!schoolId) {
      return res.status(400).json({ success: false, error: 'schoolId is required' });
    }

    let classRooms: any[] = [];
    if (teacherId) {
      classRooms = await prisma.$queryRaw`
        SELECT * FROM "ClassRoom"
        WHERE "schoolId" = ${String(schoolId)}
          AND "teacherId" = ${String(teacherId)}
        ORDER BY "className" ASC, section ASC
      `;
    } else {
      classRooms = await prisma.$queryRaw`
        SELECT * FROM "ClassRoom"
        WHERE "schoolId" = ${String(schoolId)}
        ORDER BY "className" ASC, section ASC
      `;
    }

    return res.json({ success: true, data: classRooms, count: classRooms.length });
  } catch (err: any) {
    console.error('[GET /api/classes]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch classes' });
  }
});

// ─── GET /api/classes/:id ────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows: any[] = await prisma.$queryRaw`
      SELECT * FROM "ClassRoom" WHERE id = ${id} LIMIT 1
    `;
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    console.error('[GET /api/classes/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch class' });
  }
});

// ─── POST /api/classes ───────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      schoolId, teacherId, className, section, subject,
      academicYear, roomNumber, schedule, totalStudents, description,
    } = req.body;

    if (!schoolId || !className || !section || !subject) {
      return res.status(400).json({
        success: false,
        error: 'schoolId, className, section, and subject are required',
      });
    }

    // Check duplicate
    const existing: any[] = await prisma.$queryRaw`
      SELECT id FROM "ClassRoom"
      WHERE "schoolId" = ${schoolId}
        AND "className" = ${String(className)}
        AND section = ${String(section).toUpperCase()}
        AND subject = ${subject}
      LIMIT 1
    `;
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Class ${className}${section} - ${subject} already exists for this school`,
      });
    }

    const id       = randomUUID();
    const now      = new Date();
    const secUp    = String(section).toUpperCase();
    const year     = academicYear || '2024-25';
    const room     = roomNumber   || null;
    const sched    = schedule     || null;
    const total    = parseInt(totalStudents) || 0;
    const desc     = description  || null;
    const teacher  = teacherId    || null;

    const rows: any[] = await prisma.$queryRaw`
      INSERT INTO "ClassRoom"
        (id, "schoolId", "teacherId", "className", section, subject, "academicYear",
         "roomNumber", schedule, "totalStudents", description, "isActive", "createdAt", "updatedAt")
      VALUES
        (${id}, ${schoolId}, ${teacher}, ${String(className)}, ${secUp}, ${subject}, ${year},
         ${room}, ${sched}, ${total}, ${desc}, true, ${now}, ${now})
      RETURNING *
    `;

    return res.status(201).json({
      success: true,
      data: rows[0],
      message: `Class ${className}${secUp} - ${subject} created successfully`,
    });
  } catch (err: any) {
    console.error('[POST /api/classes]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to create class' });
  }
});

// ─── PUT /api/classes/:id ────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing: any[] = await prisma.$queryRaw`
      SELECT * FROM "ClassRoom" WHERE id = ${id} LIMIT 1
    `;
    if (!existing.length) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    const cur = existing[0];
    const {
      className, section, subject, academicYear,
      roomNumber, schedule, totalStudents, description, isActive, teacherId,
    } = req.body;

    const now      = new Date();
    const clsName  = className     !== undefined ? String(className)                 : cur.className;
    const secUp    = section       !== undefined ? String(section).toUpperCase()     : cur.section;
    const subj     = subject       !== undefined ? subject                           : cur.subject;
    const year     = academicYear  !== undefined ? academicYear                      : cur.academicYear;
    const room     = roomNumber    !== undefined ? roomNumber                        : cur.roomNumber;
    const sched    = schedule      !== undefined ? schedule                          : cur.schedule;
    const total    = totalStudents !== undefined ? parseInt(totalStudents)           : cur.totalStudents;
    const desc     = description   !== undefined ? description                       : cur.description;
    const active   = isActive      !== undefined ? Boolean(isActive)                : cur.isActive;
    const teacher  = teacherId     !== undefined ? teacherId                        : cur.teacherId;

    const rows: any[] = await prisma.$queryRaw`
      UPDATE "ClassRoom"
      SET "className" = ${clsName}, section = ${secUp}, subject = ${subj},
          "academicYear" = ${year}, "roomNumber" = ${room}, schedule = ${sched},
          "totalStudents" = ${total}, description = ${desc}, "isActive" = ${active},
          "teacherId" = ${teacher}, "updatedAt" = ${now}
      WHERE id = ${id}
      RETURNING *
    `;

    return res.json({
      success: true,
      data: rows[0],
      message: `Class ${clsName}${secUp} updated successfully`,
    });
  } catch (err: any) {
    console.error('[PUT /api/classes/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to update class' });
  }
});

// ─── DELETE /api/classes/:id ─────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing: any[] = await prisma.$queryRaw`
      SELECT * FROM "ClassRoom" WHERE id = ${id} LIMIT 1
    `;
    if (!existing.length) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    const cur = existing[0];
    await prisma.$queryRaw`DELETE FROM "ClassRoom" WHERE id = ${id}`;

    return res.json({
      success: true,
      message: `Class ${cur.className}${cur.section} - ${cur.subject} deleted successfully`,
    });
  } catch (err: any) {
    console.error('[DELETE /api/classes/:id]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to delete class' });
  }
});

export default router;
