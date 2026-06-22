import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';

const router = Router();

// GET /api/headmaster/students — List all watchlist students
router.get('/students', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const students = await prisma.watchlistStudent.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/students — Add single student to watchlist
router.post('/students', async (req: Request, res: Response) => {
  try {
    const { name, rollNumber, class: cls, phone, parentName, district, state, city, pincode, risk, schoolId } = req.body;
    if (!name || !rollNumber) {
      return res.status(400).json({ success: false, error: 'name and rollNumber are required' });
    }
    const student = await prisma.watchlistStudent.create({
      data: { name, rollNumber, class: cls || 'N/A', phone: phone || 'N/A', parentName: parentName || 'N/A', district: district || 'N/A', state: state || 'N/A', city: city || 'N/A', pincode: pincode || 'N/A', risk: risk || 'Medium', schoolId: schoolId || null },
    });
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/students/bulk — Bulk import from Excel
router.post('/students/bulk', async (req: Request, res: Response) => {
  try {
    const { students } = req.body as { students: any[] };
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, error: 'students array is required' });
    }
    const records = students
      .filter((s) => s.name && s.rollNumber)
      .map((s) => ({
        name: s.name,
        rollNumber: s.rollNumber,
        class: s.class || 'N/A',
        phone: s.phone || 'N/A',
        parentName: s.parentName || 'N/A',
        district: s.district || 'N/A',
        state: s.state || 'N/A',
        city: s.city || 'N/A',
        pincode: s.pincode || 'N/A',
        risk: s.risk || 'Medium',
        schoolId: s.schoolId || null,
      }));
    const result = await prisma.watchlistStudent.createMany({ data: records, skipDuplicates: true });
    res.status(201).json({ success: true, created: result.count });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/headmaster/students/:id — Remove from watchlist
router.delete('/students/:id', async (req: Request, res: Response) => {
  try {
    await prisma.watchlistStudent.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Student removed from watchlist' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── Staff Endpoints ─────────────────────────────────────────────

// GET /api/headmaster/staff — List all staff
router.get('/staff', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const staff = await prisma.headmasterStaff.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/staff — Add single staff member
router.post('/staff', async (req: Request, res: Response) => {
  try {
    const { name, emisId, subject, phone, email, attendance, performance, leaveUsed, password, schoolId } = req.body;
    if (!name || !emisId) {
      return res.status(400).json({ success: false, error: 'name and emisId are required' });
    }
    const staff = await prisma.headmasterStaff.upsert({
      where: { emisId },
      update: { name, subject: subject || 'General', phone: phone || 'N/A', email: email || null, attendance: attendance ?? 100, performance: performance || 'Good', leaveUsed: leaveUsed ?? 0, password: password || '123456', schoolId: schoolId || null },
      create: { name, emisId, subject: subject || 'General', phone: phone || 'N/A', email: email || null, attendance: attendance ?? 100, performance: performance || 'Good', leaveUsed: leaveUsed ?? 0, password: password || '123456', schoolId: schoolId || null },
    });
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/staff/bulk — Bulk import from Excel
router.post('/staff/bulk', async (req: Request, res: Response) => {
  try {
    const { staff } = req.body as { staff: any[] };
    if (!Array.isArray(staff) || staff.length === 0) {
      return res.status(400).json({ success: false, error: 'staff array is required' });
    }
    let created = 0;
    for (const s of staff) {
      if (!s.name || !s.emisId) continue;
      await prisma.headmasterStaff.upsert({
        where: { emisId: s.emisId },
        update: { name: s.name, subject: s.subject || 'General', phone: s.phone || 'N/A', email: s.email || null, attendance: s.attendance ?? 100, performance: s.performance || 'Good', leaveUsed: s.leaveUsed ?? s.leave ?? 0, password: s.password || '123456', schoolId: s.schoolId || null },
        create: { name: s.name, emisId: s.emisId, subject: s.subject || 'General', phone: s.phone || 'N/A', email: s.email || null, attendance: s.attendance ?? 100, performance: s.performance || 'Good', leaveUsed: s.leaveUsed ?? s.leave ?? 0, password: s.password || '123456', schoolId: s.schoolId || null },
      });
      created++;
    }
    res.status(201).json({ success: true, created });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/headmaster/staff/:id — Remove staff member
router.delete('/staff/:id', async (req: Request, res: Response) => {
  try {
    await prisma.headmasterStaff.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Staff member removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── Temporary / Contract Staff Endpoints ────────────────────────

// GET /api/headmaster/temp-staff
router.get('/temp-staff', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const staff = await prisma.headmasterTempStaff.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/temp-staff — Add single
router.post('/temp-staff', async (req: Request, res: Response) => {
  try {
    const { name, role, agency, joined, phone, email, duration, salary, status, password, schoolId } = req.body;
    if (!name || !role) return res.status(400).json({ success: false, error: 'name and role are required' });
    const staff = await prisma.headmasterTempStaff.create({
      data: { name, role, agency: agency || 'Direct Contract', joined: joined || '', phone: phone || 'N/A', email: email || 'N/A', duration: duration || '12 Months', salary: salary || 'N/A', status: status || 'Active', password: password || '123456', schoolId: schoolId || null },
    });
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/temp-staff/bulk — Bulk import
router.post('/temp-staff/bulk', async (req: Request, res: Response) => {
  try {
    const { staff } = req.body as { staff: any[] };
    if (!Array.isArray(staff) || staff.length === 0) return res.status(400).json({ success: false, error: 'staff array required' });
    const records = staff.filter((s) => s.name && s.role).map((s) => ({
      name: s.name, role: s.role, agency: s.agency || 'Direct Contract', joined: s.joined || '',
      phone: s.phone || 'N/A', email: s.email || 'N/A', duration: s.duration || '12 Months',
      salary: s.salary || 'N/A', status: 'Active', password: s.password || '123456', schoolId: s.schoolId || null,
    }));
    const result = await prisma.headmasterTempStaff.createMany({ data: records, skipDuplicates: false });
    res.status(201).json({ success: true, created: result.count });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/headmaster/temp-staff/:id
router.delete('/temp-staff/:id', async (req: Request, res: Response) => {
  try {
    await prisma.headmasterTempStaff.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Temp staff removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── Parents / PTA Committee Endpoints ────────────────────────────

// GET /api/headmaster/parents
router.get('/parents', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const parents = await prisma.headmasterParent.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: parents.length, data: parents });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/parents — Add single parent/officer
router.post('/parents', async (req: Request, res: Response) => {
  try {
    const { name, role, phone, email, studentName, studentClass, term, password, schoolId } = req.body;
    if (!name || !role || !phone) {
      return res.status(400).json({ success: false, error: 'name, role and phone are required' });
    }
    const parent = await prisma.headmasterParent.create({
      data: {
        name,
        role,
        phone,
        email: email || null,
        studentName: studentName || 'N/A',
        studentClass: studentClass || 'N/A',
        term: term || '2025-26',
        password: password || '123456',
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: parent });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/parents/bulk — Bulk import parents from Excel
router.post('/parents/bulk', async (req: Request, res: Response) => {
  try {
    const { parents } = req.body as { parents: any[] };
    if (!Array.isArray(parents) || parents.length === 0) {
      return res.status(400).json({ success: false, error: 'parents array is required' });
    }
    const records = parents
      .filter((p) => p.name && p.role && p.phone)
      .map((p) => ({
        name: p.name,
        role: p.role,
        phone: p.phone,
        email: p.email || null,
        studentName: p.studentName || 'N/A',
        studentClass: p.studentClass || 'N/A',
        term: p.term || '2025-26',
        password: p.password || '123456',
        schoolId: p.schoolId || null,
      }));
    const result = await prisma.headmasterParent.createMany({ data: records, skipDuplicates: false });
    res.status(201).json({ success: true, created: result.count });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/headmaster/parents/:id — Remove parent officer
router.delete('/parents/:id', async (req: Request, res: Response) => {
  try {
    await prisma.headmasterParent.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'PTA Committee member removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});


// ─── Alumni Endpoints ─────────────────────────────────────────────

// GET /api/headmaster/alumni
router.get('/alumni', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;
    const alumniList = await prisma.headmasterAlumni.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, count: alumniList.length, data: alumniList });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/alumni — Add single alumni contribution
router.post('/alumni', async (req: Request, res: Response) => {
  try {
    const { name, batch, contribution, role, phone, email, location, value, schoolId } = req.body;
    if (!name || !contribution) {
      return res.status(400).json({ success: false, error: 'name and contribution details are required' });
    }
    const record = await prisma.headmasterAlumni.create({
      data: {
        name,
        batch: batch || 'N/A',
        contribution,
        role: role || 'Alumni Member',
        phone: phone || 'N/A',
        email: email || 'N/A',
        location: location || 'N/A',
        value: value || 'N/A',
        schoolId: schoolId || null,
      },
    });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/headmaster/alumni/bulk — Bulk import alumni from Excel
router.post('/alumni/bulk', async (req: Request, res: Response) => {
  try {
    const { alumni } = req.body as { alumni: any[] };
    if (!Array.isArray(alumni) || alumni.length === 0) {
      return res.status(400).json({ success: false, error: 'alumni array is required' });
    }
    const records = alumni
      .filter((a) => a.name && a.contribution)
      .map((a) => ({
        name: a.name,
        batch: a.batch || 'N/A',
        contribution: a.contribution,
        role: a.role || 'Alumni Member',
        phone: a.phone || 'N/A',
        email: a.email || 'N/A',
        location: a.location || 'N/A',
        value: a.value || 'N/A',
        schoolId: a.schoolId || null,
      }));
    const result = await prisma.headmasterAlumni.createMany({ data: records, skipDuplicates: false });
    res.status(201).json({ success: true, created: result.count });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// DELETE /api/headmaster/alumni/:id — Remove alumni contribution
router.delete('/alumni/:id', async (req: Request, res: Response) => {
  try {
    await prisma.headmasterAlumni.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Alumni contribution record removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;


