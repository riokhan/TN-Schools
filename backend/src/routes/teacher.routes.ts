import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// =========================================================================
// 1. Study Materials
// =========================================================================

// GET /api/teacher/materials
router.get('/materials', async (req: Request, res: Response) => {
  try {
    const { schoolId, category } = req.query;
    const materials = await prisma.studyMaterial.findMany({
      where: {
        ...(schoolId ? { schoolId: String(schoolId) } : {}),
        ...(category && category !== 'All' ? { category: String(category) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/materials
router.post('/materials', async (req: Request, res: Response) => {
  try {
    const { title, category, classSection, format, size, schoolId } = req.body;
    if (!title || !category || !classSection) {
      return res.status(400).json({ success: false, error: 'title, category, and classSection are required' });
    }
    const material = await prisma.studyMaterial.create({
      data: {
        title,
        category,
        classSection,
        format: format || 'PDF',
        size: size || '1.5 MB',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: material });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/teacher/materials/:id
router.delete('/materials/:id', async (req: Request, res: Response) => {
  try {
    await prisma.studyMaterial.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 2. Announcements
// =========================================================================

// GET /api/teacher/announcements
router.get('/announcements', async (req: Request, res: Response) => {
  try {
    const { schoolId, pinned } = req.query;
    const announcements = await prisma.announcement.findMany({
      where: {
        ...(schoolId ? { schoolId: String(schoolId) } : {}),
        ...(pinned !== undefined ? { pinned: pinned === 'true' } : {}),
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/announcements
router.post('/announcements', async (req: Request, res: Response) => {
  try {
    const { title, body, target, sender, pinned, schoolId } = req.body;
    if (!title || !body || !target) {
      return res.status(400).json({ success: false, error: 'title, body, and target are required' });
    }
    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        target,
        sender: sender || 'You (Teacher)',
        pinned: !!pinned,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/teacher/announcements/:id
router.delete('/announcements/:id', async (req: Request, res: Response) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 3. Homework & Submissions
// =========================================================================

// GET /api/teacher/homework
router.get('/homework', async (req: Request, res: Response) => {
  try {
    const { schoolId, status } = req.query;
    const homeworkList = await prisma.homework.findMany({
      where: {
        ...(schoolId ? { schoolId: String(schoolId) } : {}),
        ...(status ? { status: String(status) } : {}),
      },
      include: {
        submissions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: homeworkList });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/homework
router.post('/homework', async (req: Request, res: Response) => {
  try {
    const { title, className, dueDate, status, description, schoolId } = req.body;
    if (!title || !className || !dueDate) {
      return res.status(400).json({ success: false, error: 'title, className, and dueDate are required' });
    }

    const homework = await prisma.homework.create({
      data: {
        title,
        className,
        dueDate,
        status: status || 'active',
        description: description || '',
        schoolId: schoolId || null,
      },
    });

    // Automatically seed submissions for all students in the class
    // We parse class number from className, e.g. "10A - Mathematics" -> class "10", section "A"
    const classMatch = className.match(/(\d+)\s*([A-Za-z])/);
    if (classMatch && schoolId) {
      const clsNum = classMatch[1];
      const secLetter = classMatch[2].toUpperCase();

      const students = await prisma.student.findMany({
        where: {
          schoolId: String(schoolId),
          class: clsNum,
          section: secLetter,
        },
        include: { user: true },
      });

      if (students.length > 0) {
        const subRecords = students.map((s, index) => ({
          homeworkId: homework.id,
          rollNo: s.rollNumber || `${clsNum}${secLetter}${String(index + 1).padStart(2, '0')}`,
          name: s.user.name,
          status: index % 4 === 0 ? 'pending' : 'submitted', // mock some pending/submitted
          score: index % 4 === 0 ? '—' : `${8 + (index % 3)}/10`,
          date: index % 4 === 0 ? '—' : 'Yesterday, ' + (4 + (index % 5)) + ':00 PM',
        }));

        await prisma.homeworkSubmission.createMany({
          data: subRecords,
        });
      }
    }

    const updatedHw = await prisma.homework.findUnique({
      where: { id: homework.id },
      include: { submissions: true },
    });

    res.status(201).json({ success: true, data: updatedHw });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/teacher/homework/:id/submissions
router.get('/homework/:id/submissions', async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.homeworkSubmission.findMany({
      where: { homeworkId: req.params.id },
      orderBy: { rollNo: 'asc' },
    });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PUT /api/teacher/homework/submissions/:subId
router.put('/homework/submissions/:subId', async (req: Request, res: Response) => {
  try {
    const { score, status } = req.body;
    const submission = await prisma.homeworkSubmission.update({
      where: { id: req.params.subId },
      data: {
        score,
        status,
        date: status === 'submitted' ? 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—',
      },
    });
    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/teacher/homework/:id
router.delete('/homework/:id', async (req: Request, res: Response) => {
  try {
    await prisma.homework.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Homework deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 4. AI Evaluations
// =========================================================================

// GET /api/teacher/evaluations
router.get('/evaluations', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const evaluations = await prisma.evaluationSubmission.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: evaluations });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PUT /api/teacher/evaluations/:id
router.put('/evaluations/:id', async (req: Request, res: Response) => {
  try {
    const { score, status, ocrContent } = req.body;
    const updated = await prisma.evaluationSubmission.update({
      where: { id: req.params.id },
      data: {
        score,
        status,
        ocrContent: ocrContent || undefined,
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 5. Science Labs Manager
// =========================================================================

// GET /api/teacher/labs
router.get('/labs', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const labs = await prisma.labEquipment.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: labs });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/labs
router.post('/labs', async (req: Request, res: Response) => {
  try {
    const { name, classSection, status, date, safetyCheck, schoolId } = req.body;
    const lab = await prisma.labEquipment.create({
      data: {
        name,
        classSection,
        status: status || 'scheduled',
        date,
        safetyCheck: safetyCheck !== undefined ? !!safetyCheck : true,
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: lab });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PUT /api/teacher/labs/:id
router.put('/labs/:id', async (req: Request, res: Response) => {
  try {
    const lab = await prisma.labEquipment.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: lab });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 6. Leave Requests
// =========================================================================

// GET /api/teacher/leave
router.get('/leave', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const leaves = await prisma.leaveRequest.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/leave
router.post('/leave', async (req: Request, res: Response) => {
  try {
    const { type, duration, reason, proxy, schoolId } = req.body;
    const leave = await prisma.leaveRequest.create({
      data: {
        type,
        duration,
        reason,
        proxy,
        status: 'Pending',
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 7. AI Lesson Planner
// =========================================================================

// GET /api/teacher/lessons
router.get('/lessons', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const lessons = await prisma.lessonPlan.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: lessons });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/lessons
router.post('/lessons', async (req: Request, res: Response) => {
  try {
    const { syllabus, grade, subject, topic, duration, planData, schoolId } = req.body;
    const lesson = await prisma.lessonPlan.create({
      data: {
        syllabus,
        grade,
        subject,
        topic,
        duration,
        planData,
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PUT /api/teacher/lessons/:id
router.put('/lessons/:id', async (req: Request, res: Response) => {
  try {
    const { syllabus, grade, subject, topic, duration, planData } = req.body;
    const lesson = await prisma.lessonPlan.update({
      where: { id: req.params.id },
      data: {
        ...(syllabus !== undefined ? { syllabus } : {}),
        ...(grade !== undefined ? { grade } : {}),
        ...(subject !== undefined ? { subject } : {}),
        ...(topic !== undefined ? { topic } : {}),
        ...(duration !== undefined ? { duration } : {}),
        ...(planData !== undefined ? { planData } : {}),
      },
    });
    res.json({ success: true, data: lesson });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/teacher/lessons/:id
router.delete('/lessons/:id', async (req: Request, res: Response) => {
  try {
    await prisma.lessonPlan.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Lesson plan deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 8. Question Bank CRUD
// =========================================================================

// GET /api/teacher/questions
router.get('/questions', async (req: Request, res: Response) => {
  try {
    const { grade, subject, topic, difficulty, schoolId } = req.query;
    const questions = await prisma.question.findMany({
      where: {
        ...(schoolId ? { schoolId: String(schoolId) } : {}),
        ...(grade ? { grade: String(grade) } : {}),
        ...(subject ? { subject: String(subject) } : {}),
        ...(topic ? { topic: { contains: String(topic), mode: 'insensitive' } } : {}),
        ...(difficulty ? { difficulty: String(difficulty) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/questions
router.post('/questions', async (req: Request, res: Response) => {
  try {
    const { questions, schoolId } = req.body; // Array of questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'questions array is required' });
    }

    const records = questions.map((q: any) => ({
      grade: q.grade || 'Grade 10',
      subject: q.subject || 'Mathematics',
      topic: q.topic || 'Pythagoras Theorem',
      difficulty: q.difficulty || 'medium',
      type: q.type,
      text: q.text,
      options: q.options || [],
      answer: q.answer,
      marks: q.marks || 1,
      schoolId: schoolId || null,
    }));

    await prisma.question.createMany({ data: records });
    res.status(201).json({ success: true, count: records.length });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PUT /api/teacher/questions/:id
router.put('/questions/:id', async (req: Request, res: Response) => {
  try {
    const question = await prisma.question.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/teacher/questions/:id
router.delete('/questions/:id', async (req: Request, res: Response) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 9. Student Badges (Engagement)
// =========================================================================

// GET /api/teacher/badges
router.get('/badges', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    let where: any = undefined;
    if (schoolId) {
      const students = await prisma.student.findMany({
        where: { schoolId: String(schoolId) },
        select: { id: true },
      });
      where = { studentId: { in: students.map(s => s.id) } };
    }
    const badges = await prisma.studentBadge.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: badges });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/badges
router.post('/badges', async (req: Request, res: Response) => {
  try {
    const { studentId, studentName, classSection, badge, remark } = req.body;
    if (!studentId || !studentName || !badge) {
      return res.status(400).json({ success: false, error: 'studentId, studentName, and badge are required' });
    }
    const record = await prisma.studentBadge.create({
      data: {
        studentId,
        studentName,
        classSection,
        badge,
        remark,
      },
    });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// =========================================================================
// 10. Scholarships verification
// =========================================================================

// GET /api/teacher/scholarships
router.get('/scholarships', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const scholarships = await prisma.scholarship.findMany({
      where: schoolId ? { student: { schoolId: String(schoolId) } } : undefined,
      include: {
        student: {
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: scholarships });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PUT /api/teacher/scholarships/:id
router.put('/scholarships/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await prisma.scholarship.update({
      where: { id: req.params.id },
      data: {
        status,
        approvedDate: status === 'APPROVED' ? new Date() : undefined,
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 11. Parent-Teacher Messages (in-memory store; replace with DB model when available)
// =========================================================================
const messageStore: Record<string, Array<{ sender: string; text: string; time: string }>> = {};

// GET /api/teacher/messages/:parentId
router.get('/messages/:parentId', async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const msgs = messageStore[parentId] || [];
    res.json({ success: true, data: msgs });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/teacher/messages
router.post('/messages', async (req: Request, res: Response) => {
  try {
    const { parentId, sender, text } = req.body;
    if (!parentId || !sender || !text) {
      return res.status(400).json({ success: false, error: 'parentId, sender, and text are required' });
    }
    if (!messageStore[parentId]) {
      messageStore[parentId] = [];
    }
    const newMsg = { sender, text, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    messageStore[parentId].push(newMsg);
    res.status(201).json({ success: true, data: newMsg });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/teacher/analytics/class
router.get('/analytics/class', async (req: Request, res: Response) => {
  try {
    const { schoolId, class: cls, section } = req.query;
    const students = await prisma.student.findMany({
      where: {
        ...(schoolId ? { schoolId: String(schoolId) } : {}),
        ...(cls ? { class: String(cls) } : {}),
        ...(section ? { section: String(section) } : {}),
      },
      include: {
        user: { select: { name: true } },
        marks: true,
        attendance: true,
      },
      orderBy: { rollNumber: 'asc' },
    });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
