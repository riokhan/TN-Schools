# 🏛️ TN Schools AI Smart Learning Ecosystem

**State-wide digital learning, governance, and student success platform for Tamil Nadu Government Schools (Class 6–12)**

---

## 📁 Project Structure

```
tn-school/
├── frontend/        # Next.js 14 App Router + TailwindCSS + TypeScript
└── backend/         # Node.js + Express + TypeScript
```

---

## 🚀 Getting Started

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Backend (Node.js API)
```bash
cd backend
npm install
npm run dev        # http://localhost:5000
```

---

## 🗄️ Databases

| Database | Use Case | ORM/Driver |
|---|---|---|
| **MongoDB Atlas** | AI Chat logs, Digital Portfolios, Wellness tracking, Learning Paths | Mongoose |
| **PostgreSQL** | Users, Schools, Attendance, Marks, Scholarships | Prisma |

### Env Configuration (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
POSTGRES_URI=postgresql://user:pass@host:5432/db
```

---

## 🌐 Portals

| Portal | URL | Role |
|---|---|---|
| Landing Page | `/` | All |
| Student Portal | `/student` | Students (Class 6–12) |
| Parent Portal | `/parent` | Parents/Guardians |
| Teacher Portal | `/teacher` | Teaching Staff |
| Headmaster Portal | `/headmaster` | School Headmasters |
| Block Education Officer | `/block-education-officer` | BEO |
| District Education Officer | `/district-education-officer` | DEO |
| Commissioner Portal | `/commissioner` | State Commissioner |
| Minister Dashboard | `/minister` | Minister for Education |

---

## 🤖 AI Features

- AI Tutor (Text + Voice, Tamil/English/Bilingual)
- Adaptive Learning Engine
- Auto Question Generator
- AI Evaluation & Auto-grading
- AI Lesson Planner
- Career Guidance AI
- Dropout Prediction
- Pass % Prediction
- Wellness & Mood Analysis

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database 1 | MongoDB Atlas (Mongoose) |
| Database 2 | PostgreSQL (Prisma ORM) |
| Auth | NextAuth.js (planned) |
| Styling | TailwindCSS + Custom CSS |
