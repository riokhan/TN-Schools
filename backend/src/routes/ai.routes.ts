import { Router, Request, Response } from 'express';
import { AIChat, Portfolio, LearningPath, Wellness } from '../models/mongo';
import https from 'https';

const router = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---------------------------------------------------------------------------
// Robust multi-stage JSON repair (handles Gemini quirks)
// ---------------------------------------------------------------------------
function fixUnescapedControlChars(s: string): string {
  let result = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escaped) { result += ch; escaped = false; continue; }
    if (ch === '\\') { result += ch; escaped = true; continue; }
    if (ch === '"') { result += ch; inString = !inString; continue; }
    if (inString) {
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { result += '\\r'; continue; }
      if (ch === '\t') { result += '\\t'; continue; }
    }
    result += ch;
  }
  return result;
}

function attemptRepair(s: string): string {
  let inString = false;
  let escaped = false;
  const stack: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (!inString) {
      if (ch === '{') stack.push('}');
      else if (ch === '[') stack.push(']');
      else if ((ch === '}' || ch === ']') && stack.length > 0) stack.pop();
    }
  }
  if (inString) s += '"';
  s += stack.reverse().join('');
  return s;
}

function robustParseJSON(text: string): any {
  let s = text.trim();
  // Stage 1: strip markdown fences
  if (s.startsWith('```json')) s = s.slice(7).trim();
  else if (s.startsWith('```')) s = s.slice(3).trim();
  if (s.endsWith('```')) s = s.slice(0, s.length - 3).trim();
  // Stage 2: extract outer {}
  const firstBrace = s.indexOf('{');
  const lastBrace = s.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) s = s.substring(firstBrace, lastBrace + 1);
  // Stage 3: remove trailing commas
  s = s.replace(/,\s*([\]}])/g, '$1');
  // Stage 4: fix unescaped control chars
  s = fixUnescapedControlChars(s);
  // Stage 5: try parse; if fails, repair truncated JSON
  try {
    return JSON.parse(s);
  } catch (e1) {
    const repaired = attemptRepair(s);
    try {
      return JSON.parse(repaired);
    } catch (e2) {
      throw new Error(`JSON parse failed. Error: ${String(e1)}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Gemini API helper
// ---------------------------------------------------------------------------
async function callGemini(prompt: string, jsonMode: boolean = false): Promise<any> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    throw new Error('GEMINI_API_KEY is missing. Please add it to backend/.env');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 8192 },
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  if (jsonMode) {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(payload);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          reject(new Error(`Gemini API error ${res.statusCode}: ${body.substring(0, 500)}`));
          return;
        }
        let parsed: any = null;
        let text: string | undefined;
        try {
          parsed = JSON.parse(body);
          text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            const finishReason = parsed?.candidates?.[0]?.finishReason;
            reject(new Error(`Empty content from Gemini. Finish reason: ${finishReason || 'UNKNOWN'}`));
            return;
          }
          resolve(jsonMode ? robustParseJSON(text) : text);
        } catch (e) {
          const finishReason = parsed?.candidates?.[0]?.finishReason;
          reject(new Error(`Failed to parse response. Finish: ${finishReason || 'UNKNOWN'}. Error: ${String(e)}. Snippet: ${text ? text.substring(0, 300) : body.substring(0, 300)}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(90000, () => req.destroy(new Error('Gemini API timed out after 90 seconds')));
    req.write(postData);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Extract most-relevant 15,000 char window from a large textbook PDF
// ---------------------------------------------------------------------------
function limitContext(context: string | undefined, topic: string): string {
  if (!context) return '';
  const cleaned = context.trim();
  if (cleaned.length <= 15000) return cleaned;
  const keywords = topic.toLowerCase().split(/\s+/).filter((k) => k.length > 2);
  if (keywords.length === 0) return cleaned.substring(0, 15000);
  let bestIndex = 0;
  let maxMatches = 0;
  for (let i = 0; i < cleaned.length - 15000; i += 1000) {
    const chunk = cleaned.substring(i, i + 15000).toLowerCase();
    let matches = 0;
    for (const kw of keywords) { if (chunk.includes(kw)) matches++; }
    if (matches > maxMatches) { maxMatches = matches; bestIndex = i; }
  }
  return cleaned.substring(bestIndex, bestIndex + 15000);
}

// ===========================================================================
// POST /api/ai/generate-lesson-plan
// ===========================================================================
router.post('/generate-lesson-plan', async (req: Request, res: Response) => {
  try {
    const { syllabus, grade, subject, topic, duration, textbookContext } = req.body;
    const truncatedContext = limitContext(textbookContext, topic);

    const prompt = `
You are an expert curriculum developer for Tamil Nadu (TN) Schools.
Generate a comprehensive, syllabus-aligned lesson plan in JSON format for:
Syllabus: ${syllabus}
Grade/Class: ${grade}
Subject: ${subject}
Topic/Chapter: ${topic}
Duration: ${duration}
${truncatedContext ? `Textbook extract context:\n${truncatedContext}` : ''}

CRITICAL INSTRUCTION: If textbook context is provided, ONLY extract content about "${topic}". Ignore all other chapters.
If "${topic}" is not found in the context, generate from standard TN Board curriculum.

CONSTRAINTS: objectives=3, timeline=4, bilingual=3, exitTickets=1, slides=2, podcast=4 turns, videoStoryboard=2 scenes.

INFOGRAPHIC RULES — MOST IMPORTANT:
ALL infographic content MUST be about "${topic}" specifically. Do NOT use generic placeholders.
Use REAL educational data from the PDF context or standard curriculum.
- heroTitle: Tamil + English bilingual title for ${topic}
- heroSubtitle: Grade ${grade} ${subject}
- heroIcon: pick best emoji (🔬 science, 📐 math, 🌿 biology, ⚡ physics, 🌍 geography, 💻 computer, 🎨 arts)
- conceptColor: one of emerald/sky/indigo/amber/rose/teal/violet
- modules: 4 real concept modules about ${topic} (NOT generic Module 1/2/3/4)
- stats: 3 real quantitative facts/formulas from ${topic}
- workflow: 4 real sequential steps to understand ${topic}
- formulaBox: the actual primary formula or law for ${topic}
- formulaExplain: bilingual explanation of the formula
- lawTitle: name of the main law/theorem (bilingual)
- lawDesc: statement of the law (bilingual)
- termTable: 3 real technical terms from ${topic} (english, tamil, definition)
- constantName: a real key constant for ${topic}
- constantValue: the actual numeric value
- constantExplain: bilingual 1-sentence meaning

Output ONLY valid JSON (no markdown, no backticks):
{
  "syllabus": "${syllabus}",
  "grade": "${grade}",
  "subject": "${subject}",
  "topic": "${topic}",
  "duration": "${duration}",
  "planData": {
    "objectives": ["objective 1", "objective 2", "objective 3"],
    "timeline": [
      {"time": "00-05 Mins", "activity": "The Hook", "description": "hook for ${topic}"},
      {"time": "05-25 Mins", "activity": "Core Instruction", "description": "theory"},
      {"time": "25-40 Mins", "activity": "Guided Practice", "description": "exercises"},
      {"time": "40-45 Mins", "activity": "Exit Ticket", "description": "MCQ check"}
    ],
    "bilingual": [
      {"english": "term1", "tamil": "சொல்1", "pronunciation": "pron1"},
      {"english": "term2", "tamil": "சொல்2", "pronunciation": "pron2"},
      {"english": "term3", "tamil": "சொல்3", "pronunciation": "pron3"}
    ],
    "exitTickets": [{"question": "mcq?", "options": ["A) a","B) b","C) c","D) d"], "answer": "B) b", "rationale": "because"}],
    "slides": [
      {"title": "slide1", "subtitle": "sub1", "bullets": ["b1","b2","b3"], "graphicType": "concept", "graphicData": {"label": "l", "values": ["v1","v2"]}},
      {"title": "slide2", "subtitle": "sub2", "bullets": ["b1","b2","b3"], "graphicType": "application", "graphicData": {"label": "l", "values": ["v1","v2"]}}
    ],
    "podcast": {
      "hosts": ["Aravind (AI Teacher)", "Meera (AI Expert)"],
      "script": [
        {"speaker": "Aravind", "text": "intro about ${topic}", "lang": "en"},
        {"speaker": "Meera", "text": "வணக்கம்! explanation in Tamil", "lang": "ta"},
        {"speaker": "Aravind", "text": "key concept explanation", "lang": "en"},
        {"speaker": "Meera", "text": "summary in Tamil", "lang": "ta"}
      ]
    },
    "videoStoryboard": [
      {"sceneNumber": 1, "visualDescription": "animation for ${topic}", "narrationText": "narration", "subtitles": "தமிழ் subtitle"},
      {"sceneNumber": 2, "visualDescription": "problem solving animation", "narrationText": "narration 2", "subtitles": "தமிழ் subtitle 2"}
    ],
    "infographic": {
      "heroTitle": "REAL BILINGUAL TITLE FOR ${topic}",
      "heroSubtitle": "Grade ${grade} ${subject}",
      "heroIcon": "🔬",
      "conceptColor": "emerald",
      "modules": [
        {"id": "m1", "title": "REAL CONCEPT 1 (தமிழ்)", "desc": "Real explanation from ${topic}. தமிழில் விளக்கம்.", "icon": "📌"},
        {"id": "m2", "title": "REAL CONCEPT 2 (தமிழ்)", "desc": "Real explanation from ${topic}. தமிழில் விளக்கம்.", "icon": "🔍"},
        {"id": "m3", "title": "REAL CONCEPT 3 (தமிழ்)", "desc": "Real explanation from ${topic}. தமிழில் விளக்கம்.", "icon": "⚡"},
        {"id": "m4", "title": "REAL CONCEPT 4 (தமிழ்)", "desc": "Real explanation from ${topic}. தமிழில் விளக்கம்.", "icon": "🌟"}
      ],
      "stats": [
        {"label": "REAL KPI 1 (அளவீடு)", "value": "REAL VALUE", "desc": "what this means for ${topic}"},
        {"label": "REAL KPI 2 (சூத்திரம்)", "value": "FORMULA", "desc": "formula explanation"},
        {"label": "REAL KPI 3 (அலகு)", "value": "UNIT", "desc": "unit explanation"}
      ],
      "workflow": [
        {"step": "REAL STEP 1 (படிநிலை)", "desc": "Real step explanation for ${topic}. தமிழ்.", "icon": "1️⃣"},
        {"step": "REAL STEP 2 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "2️⃣"},
        {"step": "REAL STEP 3 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "3️⃣"},
        {"step": "REAL STEP 4 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "4️⃣"}
      ],
      "formulaBox": "REAL PRIMARY FORMULA",
      "formulaExplain": "Bilingual formula explanation. சூத்திர விளக்கம்.",
      "lawTitle": "REAL LAW NAME (விதி அல்லது தேற்றம்)",
      "lawDesc": "Real law statement. விதி கூற்று.",
      "termTable": [
        {"english": "term1", "tamil": "சொல்1", "definition": "definition1"},
        {"english": "term2", "tamil": "சொல்2", "definition": "definition2"},
        {"english": "term3", "tamil": "சொல்3", "definition": "definition3"}
      ],
      "constantName": "REAL CONSTANT NAME",
      "constantValue": "REAL NUMERIC VALUE",
      "constantExplain": "Bilingual constant explanation. தமிழில் விளக்கம்."
    }
  }
}
`;

    const result = await callGemini(prompt, true);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ===========================================================================
// POST /api/ai/generate-study-plan
// ===========================================================================
router.post('/generate-study-plan', async (req: Request, res: Response) => {
  try {
    const { subject, topic, grade, textbookContext } = req.body;
    const truncatedContext = limitContext(textbookContext, topic);

    const prompt = `
You are an expert AI Study Buddy for Tamil Nadu State Board students.
Create a personalized, 4-unit self-study plan in JSON format for:
Grade: ${grade}
Subject: ${subject}
Topic/Chapter: ${topic}
${truncatedContext ? `Textbook extract context:\n${truncatedContext}` : ''}

CRITICAL INSTRUCTION: If textbook context is provided, ONLY extract content about "${topic}". Ignore all other chapters.

CONSTRAINTS: goals=3, units=4, each unit: infographicCard (2 formulas, 2 keyConcepts, 1 illustration), audioGuide=2 turns, quiz=1 question.

INFOGRAPHIC RULES — MOST IMPORTANT:
ALL infographic content MUST be about "${topic}" specifically. Use REAL educational data from the context.
- heroTitle: Tamil + English bilingual title for ${topic}
- heroSubtitle: Grade ${grade} ${subject} self-study guide
- heroIcon: pick best emoji for ${topic}
- conceptColor: one of emerald/sky/indigo/amber/rose/teal/violet
- modules: 4 real concept modules about ${topic}
- stats: 3 real quantitative facts/formulas from ${topic}
- workflow: 4 real steps to master ${topic}
- formulaBox, formulaExplain, lawTitle, lawDesc, termTable (3 terms), constantName, constantValue, constantExplain

Output ONLY valid JSON (no markdown, no backticks):
{
  "subject": "${subject}",
  "topic": "${topic}",
  "grade": "${grade}",
  "goals": ["goal1", "goal2", "goal3"],
  "units": [
    {
      "id": "u1",
      "title": "Unit 1: Fundamentals of ${topic}",
      "status": "In Progress",
      "summary": "Introduction",
      "studyTime": "30 Minutes",
      "infographicCard": {
        "title": "Cheat Sheet",
        "formulas": ["formula1", "formula2"],
        "keyConcepts": ["concept1", "concept2"],
        "illustrations": ["visual description"]
      },
      "audioGuide": [
        {"speaker": "Karthik (AI Buddy)", "text": "explanation in English", "lang": "en"},
        {"speaker": "Priya (AI Buddy)", "text": "தமிழ் விளக்கம்", "lang": "ta"}
      ],
      "quiz": [{"question": "mcq?", "options": ["A) a","B) b","C) c","D) d"], "answer": "A) a", "rationale": "because"}]
    },
    {
      "id": "u2",
      "title": "Unit 2: Key Concepts of ${topic}",
      "status": "Pending",
      "summary": "Core concepts",
      "studyTime": "35 Minutes",
      "infographicCard": {"title": "Concepts", "formulas": ["f1","f2"], "keyConcepts": ["c1","c2"], "illustrations": ["visual"]},
      "audioGuide": [
        {"speaker": "Karthik (AI Buddy)", "text": "English explanation unit 2", "lang": "en"},
        {"speaker": "Priya (AI Buddy)", "text": "தமிழ் unit 2", "lang": "ta"}
      ],
      "quiz": [{"question": "unit2 mcq?", "options": ["A) a","B) b","C) c","D) d"], "answer": "B) b", "rationale": "because"}]
    },
    {
      "id": "u3",
      "title": "Unit 3: Problem Solving for ${topic}",
      "status": "Pending",
      "summary": "Practice and problems",
      "studyTime": "40 Minutes",
      "infographicCard": {"title": "Practice", "formulas": ["f1","f2"], "keyConcepts": ["c1","c2"], "illustrations": ["visual"]},
      "audioGuide": [
        {"speaker": "Karthik (AI Buddy)", "text": "English explanation unit 3", "lang": "en"},
        {"speaker": "Priya (AI Buddy)", "text": "தமிழ் unit 3", "lang": "ta"}
      ],
      "quiz": [{"question": "unit3 mcq?", "options": ["A) a","B) b","C) c","D) d"], "answer": "C) c", "rationale": "because"}]
    },
    {
      "id": "u4",
      "title": "Unit 4: Exam Preparation for ${topic}",
      "status": "Pending",
      "summary": "Revision and exam tips",
      "studyTime": "25 Minutes",
      "infographicCard": {"title": "Revision", "formulas": ["f1","f2"], "keyConcepts": ["c1","c2"], "illustrations": ["visual"]},
      "audioGuide": [
        {"speaker": "Karthik (AI Buddy)", "text": "English explanation unit 4", "lang": "en"},
        {"speaker": "Priya (AI Buddy)", "text": "தமிழ் unit 4", "lang": "ta"}
      ],
      "quiz": [{"question": "unit4 mcq?", "options": ["A) a","B) b","C) c","D) d"], "answer": "D) d", "rationale": "because"}]
    }
  ],
  "infographic": {
    "heroTitle": "REAL BILINGUAL TITLE FOR ${topic}",
    "heroSubtitle": "Grade ${grade} ${subject} Self-Study",
    "heroIcon": "📚",
    "conceptColor": "sky",
    "modules": [
      {"id": "m1", "title": "REAL CONCEPT 1 (தமிழ்)", "desc": "Real bilingual explanation.", "icon": "📌"},
      {"id": "m2", "title": "REAL CONCEPT 2 (தமிழ்)", "desc": "Real bilingual explanation.", "icon": "🔍"},
      {"id": "m3", "title": "REAL CONCEPT 3 (தமிழ்)", "desc": "Real bilingual explanation.", "icon": "⚡"},
      {"id": "m4", "title": "REAL CONCEPT 4 (தமிழ்)", "desc": "Real bilingual explanation.", "icon": "🌟"}
    ],
    "stats": [
      {"label": "REAL STAT 1", "value": "VALUE1", "desc": "explanation"},
      {"label": "REAL STAT 2", "value": "VALUE2", "desc": "explanation"},
      {"label": "REAL STAT 3", "value": "VALUE3", "desc": "explanation"}
    ],
    "workflow": [
      {"step": "REAL STEP 1 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "1️⃣"},
      {"step": "REAL STEP 2 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "2️⃣"},
      {"step": "REAL STEP 3 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "3️⃣"},
      {"step": "REAL STEP 4 (படிநிலை)", "desc": "Real step explanation. தமிழ்.", "icon": "4️⃣"}
    ],
    "formulaBox": "REAL PRIMARY FORMULA FOR ${topic}",
    "formulaExplain": "Bilingual formula explanation. சூத்திர விளக்கம்.",
    "lawTitle": "REAL LAW NAME (விதி)",
    "lawDesc": "Real bilingual law statement.",
    "termTable": [
      {"english": "term1", "tamil": "சொல்1", "definition": "definition1"},
      {"english": "term2", "tamil": "சொல்2", "definition": "definition2"},
      {"english": "term3", "tamil": "சொல்3", "definition": "definition3"}
    ],
    "constantName": "REAL CONSTANT",
    "constantValue": "REAL VALUE",
    "constantExplain": "Bilingual constant explanation."
  }
}
`;

    const result = await callGemini(prompt, true);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ===========================================================================
// POST /api/ai/chat-tutor
// ===========================================================================
router.post('/chat-tutor', async (req: Request, res: Response) => {
  try {
    const { subject, grade, messages, currentMessage, language } = req.body;

    const historyText = (messages || [])
      .map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');

    const prompt = `
You are a helpful, bilingual AI Tutor for Tamil Nadu school students.
You speak both Tamil (தமிழ்) and English (Tanglish is also allowed).
The student is studying: Subject = ${subject}, Grade = ${grade}.
Language mode: ${language}.

Conversation history:
${historyText}
Student: ${currentMessage}

Answer clearly with bullet points, bold text, and numbered lists where helpful.
Keep the tone encouraging and pedagogical. Alternate English/Tamil sentences in bilingual mode.
`;

    const result = await callGemini(prompt, false);
    res.json({ success: true, text: result });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ===========================================================================
// POST /api/ai/chat — Save AI chat session
// ===========================================================================
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { studentId, sessionId, messages, subject, language } = req.body;
    const chat = await AIChat.create({ studentId, sessionId, messages, subject, language });
    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/ai/chat/:studentId — Get chat history
router.get('/chat/:studentId', async (req: Request, res: Response) => {
  try {
    const chats = await AIChat.find({ studentId: req.params.studentId }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: chats });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/ai/learning-path/:studentId
router.get('/learning-path/:studentId', async (req: Request, res: Response) => {
  try {
    const path = await LearningPath.findOne({ studentId: req.params.studentId });
    res.json({ success: true, data: path });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/ai/learning-path
router.post('/learning-path', async (req: Request, res: Response) => {
  try {
    const lp = await LearningPath.findOneAndUpdate(
      { studentId: req.body.studentId },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ success: true, data: lp });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
