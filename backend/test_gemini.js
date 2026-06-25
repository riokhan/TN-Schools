const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Using API Key:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 5)}...` : "UNDEFINED");

if (!GEMINI_API_KEY) {
  console.error("No API key found in .env");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const prompt = `
You are an expert curriculum developer for Tamil Nadu (TN) Schools. 
Generate a comprehensive, syllabus-aligned lesson plan in JSON format for:
Syllabus: TN State Board (Samacheer Kalvi)
Grade/Class: Grade 8
Subject: Science
Topic/Chapter: அண்டம் மற்றும் விண்வெளி அறிவியல்
Duration: 45 Minutes

CONSTRAINTS FOR COMPACT RESPONSE (to prevent truncation):
- objectives: generate exactly 3 items.
- timeline: generate exactly 4 stages.
- bilingual: generate exactly 3 items (English/Tamil technical terms side-by-side).
- exitTickets: generate exactly 1 item.
- slides: generate exactly 2 slides.
- podcast script: generate exactly 4 turns of dialogue (2 for each speaker, alternating English and Tamil).
- videoStoryboard: generate exactly 2 scenes.
- infographic: keep explanations clear and concise.

You MUST output ONLY a valid JSON object matching the exact structure below, without any markdown backticks or extra text:
{
  "syllabus": "TN State Board (Samacheer Kalvi)",
  "grade": "Grade 8",
  "subject": "Science",
  "topic": "அண்டம் மற்றும் விண்வெளி அறிவியல்",
  "duration": "45 Minutes",
  "planData": {
    "objectives": [
      "Specific learning objective 1 aligned with TN syllabus standards",
      "Specific learning objective 2",
      "Specific learning objective 3"
    ],
    "timeline": [
      { "time": "00-05 Mins", "activity": "The Hook (Introduction)", "description": "A creative hook/demonstration to engage students." },
      { "time": "05-25 Mins", "activity": "Core Instruction & Theory", "description": "Step-by-step breakdown of theory, formula, and conceptual diagram outline." },
      { "time": "25-40 Mins", "activity": "Guided Pair Practice", "description": "Collaborative exercises where students apply concepts." },
      { "time": "40-45 Mins", "activity": "Exit Ticket Check", "description": "A short exit ticket MCQ to evaluate student understanding." }
    ],
    "bilingual": [
      { "english": "English Technical Term", "tamil": "தமிழ்க் கலைச்சொல்", "pronunciation": "Pronunciation in English script" }
    ],
    "exitTickets": [
      {
        "question": "A conceptual multiple choice question on the topic",
        "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        "answer": "B) Option 2",
        "rationale": "Brief explanation of why Option 2 is correct"
      }
    ],
    "slides": [
      {
        "title": "Core Concept of topic",
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
      }
    ],
    "podcast": {
      "hosts": ["Aravind (AI Teacher)", "Meera (AI Expert)"],
      "script": [
        { "speaker": "Aravind", "text": "Welcome everyone!", "lang": "en" },
        { "speaker": "Meera", "text": "வணக்கம்!", "lang": "ta" }
      ]
    },
    "videoStoryboard": [
      {
        "sceneNumber": 1,
        "visualDescription": "A clear animated diagram showing the hook concept with highlighted lines.",
        "narrationText": "Let's begin by visualizing how this concept operates in nature.",
        "subtitles": "இயற்கையில் இந்த கருத்து எவ்வாறு செயல்படுகிறது என்பதை காட்சிப்படுத்துவதன் மூலம் தொடங்குவோம்."
      }
    ],
    "infographic": {
      "title": "அண்டம் மற்றும் விண்வெளி அறிவியல் (Universe and Space Science)",
      "subtitle": "Class 8 Science: Astronomy & Rocketry",
      "measurementSection": {
        "title": "ராக்கெட்டின் பாகங்கள் (Parts of a Rocket)",
        "intro": "A rocket consists of four major systems working together to carry payloads into space.",
        "table": [
          { "quantity": "Quantity Name (அளவு)", "unit": "Unit Name (அலகு)", "symbol": "Symbol (குறியீடு)" }
        ],
        "thermometerText": "Bilingual explanation relating to secondary parameters/variables",
        "moleText": "Bilingual explanation relating to a fundamental quantity or constant",
        "moleValue": "A short numerical constant or limit"
      },
      "pressureSection": {
        "title": "Forces/Applications Section Header (Bilingual)",
        "formula": "Primary Formula representing the topic",
        "calculationText": "Bilingual explanation of the primary formula and how to calculate it.",
        "pascalLaw": {
          "title": "Primary Law / Rule Header (Bilingual)",
          "description": "Bilingual statement of the law/rule."
        },
        "atmosphericPressure": {
          "title": "Boundary / Environment Condition Header (Bilingual)",
          "description": "Bilingual explanation of a boundary/limiting factor."
        }
      }
    }
  }
}
`;

const payload = {
  contents: [
    {
      parts: [
        { text: prompt }
      ]
    }
  ],
  generationConfig: {
    maxOutputTokens: 8192,
    responseMimeType: "application/json"
  }
};

const postData = JSON.stringify(payload);
const urlObj = new URL(url);

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

console.log("Sending request to Gemini API...");
const req = https.request(options, (res) => {
  console.log("Response status code:", res.statusCode);
  console.log("Response headers:", res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log("Response ended. Total length:", body.length);
    fs.writeFileSync('gemini_response_raw.json', body);
    console.log("Saved raw response to gemini_response_raw.json");
    
    try {
      const parsed = JSON.parse(body);
      console.log("Successfully parsed outer JSON!");
      const candidates = parsed.candidates;
      if (candidates && candidates.length > 0) {
        console.log("Finish Reason:", candidates[0].finishReason);
        const text = candidates[0].content?.parts?.[0]?.text;
        console.log("Text length:", text ? text.length : 0);
        if (text) {
          try {
            const innerParsed = JSON.parse(text.trim());
            console.log("Successfully parsed inner JSON!");
            console.log("Inner keys:", Object.keys(innerParsed));
          } catch (innerErr) {
            console.error("Failed to parse inner JSON:", innerErr.message);
            console.log("Snippet of inner text:\n", text.substring(text.length - 200));
          }
        } else {
          console.log("No text content returned inside candidates[0].content.parts[0]");
        }
      } else {
        console.log("No candidates found in the response. Full body:", body);
      }
    } catch (err) {
      console.error("Failed to parse outer JSON:", err.message);
    }
  });
});

req.on('error', (err) => {
  console.error("Request error:", err);
});

req.write(postData);
req.end();
