import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/db';
import { prisma } from './config/prisma';

// Route imports
import aiRoutes        from './routes/ai.routes';
import portfolioRoutes from './routes/portfolio.routes';
import sportsRoutes from './routes/sports.routes';
import wellnessRoutes  from './routes/wellness.routes';
import studentRoutes   from './routes/student.routes';
import activitiesRoutes from './routes/activities.routes';
import attendanceRoutes from './routes/attendance.routes';
import schoolRoutes    from './routes/school.routes';
import headmasterRoutes from './routes/headmaster.routes';
import pageRoutes       from './routes/page.routes';
import userRoutes       from './routes/user.routes';
import teacherRoutes    from './routes/teacher.routes';

import parentRoutes     from './routes/parent.routes';

// Trigger nodemon restart after prisma client generation
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.NEXTAUTH_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// ─── Connect Databases ───────────────────────────────────────
connectMongoDB();  // MongoDB Atlas

// ─── Health Check ────────────────────────────────────────────
app.get('/', async (req: Request, res: Response) => {
  let pgStatus = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    pgStatus = 'connected';
  } catch {
    pgStatus = 'disconnected (check POSTGRES_URI in .env)';
  }
  res.json({
    status: 'ok',
    message: 'TN Schools AI Ecosystem API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    databases: {
      mongodb: 'connected',
      postgresql: pgStatus,
    },
  });
});

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/ai',         aiRoutes);
app.use('/api/portfolio',  portfolioRoutes);
app.use('/api/sports',     sportsRoutes);
app.use('/api/wellness',   wellnessRoutes);
app.use('/api/students',   studentRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/schools',    schoolRoutes);
app.use('/api/headmaster', headmasterRoutes);
app.use('/api/pages',      pageRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/teacher',    teacherRoutes);
app.use('/api/parent',     parentRoutes);



// ─── 404 Handler ─────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// ─── Start Server ─────────────────────────────────────────────
const server = app.listen(port, () => {
  console.log(`\n🚀  TN Schools API → http://localhost:${port}`);
  console.log(`📦  MongoDB   : Atlas Cluster`);
  console.log(`🐘  PostgreSQL: Google Cloud SQL`);
  console.log(`🌍  Env       : ${process.env.NODE_ENV || 'development'}\n`);
});

// ─── Auto-recover from port conflict ─────────────────────────────
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌  Port ${port} is still in use. Run: npm run kill\n`);
    process.exit(1);
  } else {
    throw err;
  }
});


// ─── Graceful shutdown ────────────────────────────────────────────
process.on('SIGTERM', async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

