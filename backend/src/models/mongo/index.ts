import mongoose, { Schema, Document } from 'mongoose';

// AI Tutor Chat Log
export interface IAIChat extends Document {
  studentId: string;
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  subject?: string;
  language: 'tamil' | 'english' | 'bilingual';
  createdAt: Date;
}

const AIChatSchema = new Schema<IAIChat>({
  studentId:  { type: String, required: true, index: true },
  sessionId:  { type: String, required: true },
  messages: [{
    role:      { type: String, enum: ['user', 'assistant'], required: true },
    content:   { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  subject:   { type: String },
  language:  { type: String, enum: ['tamil', 'english', 'bilingual'], default: 'bilingual' },
}, { timestamps: true });

export const AIChat = mongoose.models.AIChat || mongoose.model<IAIChat>('AIChat', AIChatSchema);

// Digital Portfolio
export interface IPortfolio extends Document {
  studentId:  string;
  academics:  Array<{ title: string; grade: string; year: number; }>;
  projects:   Array<{ title: string; description: string; url?: string; }>;
  certificates: Array<{ name: string; issuedBy: string; date: Date; fileUrl?: string; }>;
  achievements: Array<{ title: string; description: string; date: Date; }>;
  digiLockerLinked: boolean;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>({
  studentId:        { type: String, required: true, unique: true },
  academics:        [{ title: String, grade: String, year: Number }],
  projects:         [{ title: String, description: String, url: String }],
  certificates:     [{ name: String, issuedBy: String, date: Date, fileUrl: String }],
  achievements:     [{ title: String, description: String, date: Date }],
  digiLockerLinked: { type: Boolean, default: false },
}, { timestamps: true });

export const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

// Wellness / Mood Tracking
export interface IWellness extends Document {
  studentId: string;
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'tired';
  stressScore: number;
  notes?: string;
  counselingReferred: boolean;
  date: Date;
}
const WellnessSchema = new Schema<IWellness>({
  studentId: { type: String, required: true, index: true },

  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'stressed', 'tired'],
    required: true
  },

  stressScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },

  notes: {
    type: String
  },

  counselingReferred: {
    type: Boolean,
    default: false
  },

  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Wellness = mongoose.models.Wellness || mongoose.model<IWellness>('Wellness', WellnessSchema);

// Learning Path
export interface ILearningPath extends Document {
  studentId:      string;
  weakSubjects:   string[];
  weakChapters:   Array<{ subject: string; chapter: string; score: number; }>;
  studyPlan:      Array<{ day: string; tasks: string[]; }>;
  weeklyGoals:    string[];
  updatedAt:      Date;
}

const LearningPathSchema = new Schema<ILearningPath>({
  studentId:    { type: String, required: true, unique: true },
  weakSubjects: [String],
  weakChapters: [{ subject: String, chapter: String, score: Number }],
  studyPlan:    [{ day: String, tasks: [String] }],
  weeklyGoals:  [String],
}, { timestamps: true });

export const LearningPath = mongoose.models.LearningPath || mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);

// ─── Super Admin Dynamic Page Management ──────────────────────

export interface IManagedPage extends Document {
  title: string;
  route: string;
  icon: string;
  roles: string[];
  portal: string;
  isEnabled: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ManagedPageSchema = new Schema<IManagedPage>({
  title: { type: String, required: true },
  route: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  roles: { type: [String], default: [] },
  portal: { type: String, default: 'STUDENT' },
  isEnabled: { type: Boolean, default: true },
  description: { type: String },
}, { timestamps: true });

export const ManagedPage = mongoose.models.ManagedPage || mongoose.model<IManagedPage>('ManagedPage', ManagedPageSchema);

