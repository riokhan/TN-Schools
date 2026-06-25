import { Router, Request, Response } from 'express';
import { AIChat, Portfolio, LearningPath, Wellness } from '../models/mongo';
import https from 'https';

const router = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCdcc6PqKE6SCbTIBNde3hj8FDEwKf024c";

// Helper function to call Gemini API via HTTPS POST
async function callGemini(prompt: string, jsonMode: boolean = false): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload: any = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  if (jsonMode) {
    payload.generationConfig = {
      responseMimeType: "application/json"
    };
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
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          reject(new Error(`Gemini HTTPS status ${res.statusCode}: ${body}`));
        } else {
          try {
            const parsed = JSON.parse(body);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
              reject(new Error('Empty content returned from Gemini'));
              return;
            }
            if (jsonMode) {
              // Sometimes Gemini wraps output in ```json ... ``` despite configuration, clean it up
              let cleanedText = text.trim();
              if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
              } else if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
              }
              resolve(JSON.parse(cleanedText));
            } else {
              resolve(text);
            }
          } catch (e) {
            reject(new Error(`Failed to parse Gemini response: ${body}. Error: ${String(e)}`));
          }
        }
      });
    });
    
    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// POST /api/ai/generate-lesson-plan
router.post('/generate-lesson-plan', async (req: Request, res: Response) => {
  try {
    const { syllabus, grade, subject, topic, duration, textbookContext } = req.body;
    
    const prompt = `
You are an expert curriculum developer for Tamil Nadu (TN) Schools. 
Generate a comprehensive, syllabus-aligned lesson plan in JSON format for:
Syllabus: ${syllabus}
Grade/Class: ${grade}
Subject: ${subject}
Topic/Chapter: ${topic}
Duration: ${duration}
${textbookContext ? `Textbook extract context:\n${textbookContext}` : ""}

You MUST output ONLY a valid JSON object matching the exact structure below, without any markdown backticks or extra text:
{
  "syllabus": "${syllabus}",
  "grade": "${grade}",
  "subject": "${subject}",
  "topic": "${topic}",
  "duration": "${duration}",
  "planData": {
    "objectives": [
      "Specific learning objective 1 aligned with TN syllabus standards",
      "Specific learning objective 2",
      "Specific learning objective 3"
    ],
    "timeline": [
      { "time": "00-05 Mins", "activity": "The Hook (Introduction)", "description": "A creative hook/demonstration to engage students with ${topic}." },
      { "time": "05-25 Mins", "activity": "Core Instruction & Theory", "description": "Step-by-step breakdown of theory, formula, and conceptual diagram outline." },
      { "time": "25-40 Mins", "activity": "Guided Pair Practice", "description": "Collaborative exercises where students apply concepts." },
      { "time": "40-45 Mins", "activity": "Exit Ticket Check", "description": "A short exit ticket MCQ to evaluate student understanding." }
    ],
    "bilingual": [
      { "english": "English Technical Term", "tamil": "தமிழ்க் கலைச்சொல்", "pronunciation": "Pronunciation in English script" }
    ],
    "exitTickets": [
      {
        "question": "A conceptual multiple choice question on ${topic}",
        "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        "answer": "B) Option 2",
        "rationale": "Brief explanation of why Option 2 is correct"
      }
    ],
    "slides": [
      {
        "title": "Core Concept of ${topic}",
        "subtitle": "Essential definitions and ideas",
        "bullets": [
          "Key point explaining the core concept clearly",
          "A practical application of this concept",
          "Important equations or definitions to remember"
        ],
        "graphicType": "concept",
        "graphicData": {
          "label": "Main Components",
          "values": ["Component A", "Component B", "Component C"]
        }
      },
      {
        "title": "Formulas & Equations",
        "subtitle": "Mathematical and scientific representations",
        "bullets": [
          "Definition of terms in equations",
          "How to apply these formulas in exams",
          "Common mistakes to avoid"
        ],
        "graphicType": "diagram",
        "graphicData": {
          "label": "Variables",
          "values": ["Variable X", "Variable Y"]
        }
      }
    ],
    "podcast": {
      "hosts": ["Aravind (AI Teacher)", "Meera (AI Expert)"],
      "script": [
        { "speaker": "Aravind", "text": "Welcome everyone! Today Meera and I are breaking down ${topic} for Grade ${grade}.", "lang": "en" },
        { "speaker": "Meera", "text": "வணக்கம்! This topic is very interesting. Let us start by looking at how it works in our daily lives.", "lang": "ta" },
        { "speaker": "Aravind", "text": "Exactly. Let's look at the core formula first. How do we explain it simply?", "lang": "en" },
        { "speaker": "Meera", "text": "இதை எளிமையாகப் புரிந்துகொள்ள, நாம் ஒரு எளிய உதாரணத்தைப் பார்ப்போம்...", "lang": "ta" }
      ]
    },
    "videoStoryboard": [
      {
        "sceneNumber": 1,
        "visualDescription": "A clear animated diagram showing the hook concept with highlighted lines.",
        "narrationText": "Let's begin by visualizing how this concept operates in nature.",
        "subtitles": "இயற்கையில் இந்த கருத்து எவ்வாறு செயல்படுகிறது என்பதை காட்சிப்படுத்துவதன் மூலம் தொடங்குவோம்."
      },
      {
        "sceneNumber": 2,
        "visualDescription": "The main formula writing out on a digital chalkboard piece by piece.",
        "narrationText": "Now, let's write down the mathematical relationship.",
        "subtitles": "இப்போது, ​​அதன் கணிதத் தொடர்பை எழுதுவோம்."
      }
    ]
  }
}
`;

    const result = await callGemini(prompt, true);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/ai/generate-study-plan
router.post('/generate-study-plan', async (req: Request, res: Response) => {
  try {
    const { subject, topic, grade, textbookContext } = req.body;
    
    const prompt = `
You are an expert AI Study Buddy for Tamil Nadu State Board students.
Create a personalized, 4-unit comprehensive self-study plan in JSON format for:
Grade: ${grade}
Subject: ${subject}
Topic/Chapter: ${topic}
${textbookContext ? `Textbook extract context:\n${textbookContext}` : ""}

You MUST output ONLY a valid JSON object matching the exact structure below, without any markdown backticks or extra text:
{
  "subject": "${subject}",
  "topic": "${topic}",
  "grade": "${grade}",
  "goals": [
    "Understand the basic definitions of ${topic}",
    "Solve school textbook exercises",
    "Prepare for exam questions and test scenarios"
  ],
  "units": [
    {
      "id": "u1",
      "title": "Unit 1: Fundamentals of ${topic}",
      "status": "In Progress",
      "summary": "Introduction and basic concepts of this topic.",
      "studyTime": "30 Minutes",
      "infographicCard": {
        "title": "Basic Concepts Cheat Sheet",
        "formulas": ["Equation/Formula 1", "Equation/Formula 2"],
        "keyConcepts": ["Key definitions explained clearly", "Core idea summary"],
        "illustrations": ["Description of a simple visual/diagram to remember"]
      },
      "audioGuide": [
        { "speaker": "Karthik (AI Buddy)", "text": "Hi Priya! Let's explore the fundamentals of ${topic} today.", "lang": "en" },
        { "speaker": "Priya (AI Buddy)", "text": "ஆமாம் கார்த்திக்! This unit is very simple if you remember the basic definitions.", "lang": "ta" }
      ],
      "quiz": [
        {
          "question": "A simple multiple choice question for Unit 1",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "answer": "A) Option 1",
          "rationale": "Explanation for the correct answer"
        }
      ]
    },
    {
      "id": "u2",
      "title": "Unit  unit 2: Advanced applications",
      "status": "Not Started",
      "summary": "Diving deeper into solving problems and analyzing equations.",
      "studyTime": "45 Minutes",
      "infographicCard": {
        "title": "Advanced Application Guide",
        "formulas": ["Complex Formula", "Application Rule"],
        "keyConcepts": ["Important concepts for higher score"],
        "illustrations": ["Step-by-step problem diagram"]
      },
      "audioGuide": [
        { "speaker": "Karthik (AI Buddy)", "text": "Next up is Unit 2. Here, we apply what we learned.", "lang": "en" },
        { "speaker": "Priya (AI Buddy)", "text": "சரியாக சொன்னாய்! Let's look at a sample problem.", "lang": "ta" }
      ],
      "quiz": [
        {
          "question": "A problem solving question for Unit 2",
          "options": ["A) Val 1", "B) Val 2", "C) Val 3", "D) Val 4"],
          "answer": "C) Val 3",
          "rationale": "Detailed steps to solve the equation"
        }
      ]
    }
  ]
}
`;

    const result = await callGemini(prompt, true);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/ai/chat-tutor
router.post('/chat-tutor', async (req: Request, res: Response) => {
  try {
    const { subject, grade, messages, currentMessage, language } = req.body;
    
    const prompt = `
You are a helpful, bilingual AI Tutor for Tamil Nadu school students. 
You speak both Tamil (தமிழ்) and English (Tanglish is also allowed for easy explanation).
The student is studying: Subject = ${subject}, Grade = ${grade}.
Student is talking to you in ${language} mode.

Current conversation history:
${(messages || []).map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n')}
Student: ${currentMessage}

Answer the student's question clearly. Use formatting like bullet points, bold text, and numbered lists where appropriate. Keep the tone encouraging, supportive, and pedagogical. If in bilingual mode, alternate sentences or phrases between English and Tamil so it acts as a friendly classroom explanation.
`;

    const result = await callGemini(prompt, false);
    res.json({ success: true, text: result });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/ai/chat — Save AI chat session
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
