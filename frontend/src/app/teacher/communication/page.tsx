"use client";
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";


interface Parent {
  id: string;
  name: string;
  studentName: string;
  studentRoll: string;
  unreadCount: number;
  lastMessage: string;
}

interface Message {
  sender: "teacher" | "parent";
  text: string;
  time: string;
}

const initialParents: Parent[] = [
  { id: "parent-1", name: "Ramesh R.", studentName: "Kavitha R.", studentRoll: "10A03", unreadCount: 1, lastMessage: "Yes teacher, I will help her tonight." },
  { id: "parent-2", name: "Selvam S.", studentName: "Murugan S.", studentRoll: "10B02", unreadCount: 0, lastMessage: "Will he have exams next week?" },
  { id: "parent-3", name: "Kuppusamy K.", studentName: "Senthil K.", studentRoll: "10B04", unreadCount: 2, lastMessage: "Please advise on algebra worksheets." },
  { id: "parent-4", name: "Mani M.", studentName: "Deepa M.", studentRoll: "9A01", unreadCount: 0, lastMessage: "Thank you for the update." },
];

const initialChats: Record<string, Message[]> = {
  "parent-1": [
    { sender: "teacher", text: "Hello Mr. Ramesh, Kavitha missed the algebra worksheet submission yesterday. Please ensure she completes it.", time: "Yesterday, 3:30 PM" },
    { sender: "parent", text: "Yes teacher, I will check with her and help her tonight.", time: "Yesterday, 6:10 PM" },
  ],
  "parent-2": [
    { sender: "parent", text: "Greetings, Murugan told me about the test. Will he have exams next week?", time: "2 days ago" },
    { sender: "teacher", text: "Yes, the maths unit test is scheduled for Wednesday.", time: "2 days ago" },
  ],
  "parent-3": [
    { sender: "teacher", text: "Hello, Senthil is showing declining scores in mathematical equations. I suggest remedial lessons.", time: "3 days ago" },
    { sender: "parent", text: "I am worried too. Please advise on algebra worksheets.", time: "Yesterday, 8:12 AM" },
    { sender: "parent", text: "Can you provide additional problems?", time: "Yesterday, 8:15 AM" },
  ],
  "parent-4": [
    { sender: "teacher", text: "Deepa did exceptionally well in the geometry pop-quiz. Keep up the encouragement!", time: "June 14, 2026" },
    { sender: "parent", text: "Thank you for the update.", time: "June 14, 2026" },
  ]
};

export default function CommunicationPage() {
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [selectedParentId, setSelectedParentId] = useState("parent-1");
  const [chats, setChats] = useState<Record<string, Message[]>>(initialChats);
  const [chatInput, setChatInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI draft selector states
  const [draftType, setDraftType] = useState<"performance" | "attendance" | "general">("performance");
  const [draftTone, setDraftTone] = useState<"supportive" | "urgent" | "encouraging">("supportive");

  const selectedParent = parents.find((p) => p.id === selectedParentId) || parents[0];
  const messages = chats[selectedParent.id] || [];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMsg: Message = {
      sender: "teacher",
      text: chatInput,
      time: "Just now",
    };

    setChats({
      ...chats,
      [selectedParent.id]: [...messages, newMsg],
    });

    setParents(
      parents.map((p) => (p.id === selectedParent.id ? { ...p, lastMessage: chatInput, unreadCount: 0 } : p))
    );

    setChatInput("");
  };

  const handleGenerateAIDraft = () => {
    let text = "";
    if (draftType === "performance") {
      if (draftTone === "urgent") {
        text = `வணக்கம், ${selectedParent.name}. ${selectedParent.studentName}-ன் கணிதத் தேர்வு மதிப்பெண்கள் மிகவும் குறைவாக உள்ளன. அவரது முன்னேற்றத்திற்கு உதவ, Remediations-ஐப் பின்பற்றவும். (Hello ${selectedParent.name}, ${selectedParent.studentName}'s maths exam marks have dropped significantly. Please ensure they practice remedial questions immediately.)`;
      } else if (draftTone === "encouraging") {
        text = `வணக்கம், ${selectedParent.name}. ${selectedParent.studentName} படிப்படியாக முன்னேறி வருகிறார். உங்கள் ஆதரவுக்கு நன்றி! (Hello ${selectedParent.name}, ${selectedParent.studentName} is showing steady progress in mathematical reasoning. Thank you for supporting their work!)`;
      } else {
        text = `வணக்கம், ${selectedParent.name}. ${selectedParent.studentName} சமன்பாடுகளைத் தீர்ப்பதில் கூடுதல் பயிற்சி தேவை. நாங்கள் சில பயிற்சித் தாள்களை வழங்குகிறோம். (Hello ${selectedParent.name}, ${selectedParent.studentName} needs practice in solving basic algebra worksheets. We are providing supportive practice sheets.)`;
      }
    } else if (draftType === "attendance") {
      text = `வணக்கம், ${selectedParent.name}. ${selectedParent.studentName} கடந்த சில வகுப்புகளுக்கு வரவில்லை. வழக்கமான வருகை அவசியமானது. (Hello ${selectedParent.name}, ${selectedParent.studentName} has missed multiple classes recently. Regular attendance is critical for syllabus mastery.)`;
    } else {
      text = `வணக்கம், ${selectedParent.name}. பள்ளி பெற்றோர்-ஆசிரியர் கூட்டம் சனிக்கிழமை காலை 10 மணிக்கு நடைபெறும். (Hello ${selectedParent.name}, please note that our Parent-Teacher Meet is scheduled for Saturday at 10 AM. Looking forward to meeting you.)`;
    }

    setChatInput(text);
    setToastMessage("AI Draft loaded into input text area!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <PortalLayout
      title="Parent Communication"
      subtitle="Bilingual direct messaging and AI-assisted updates to parents and guardians"
    >
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-500 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2">
          <span>✅</span> {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-190px)]">
        {/* Chat sidebar contacts */}
        <div className="lg:col-span-1 glass rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider">💬 Inbox Chats</h3>
            <span className="badge badge-yellow">
              {parents.reduce((sum, p) => sum + p.unreadCount, 0)} New
            </span>
          </div>

          <div className="space-y-2">
            {parents.map((p) => {
              const isSelected = p.id === selectedParentId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedParentId(p.id);
                    // Reset unread count for active chat
                    setParents(parents.map((item) => (item.id === p.id ? { ...item, unreadCount: 0 } : item)));
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs relative ${
                    isSelected
                      ? "border-amber-500/80 bg-amber-500/5"
                      : "border-slate-800 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-semibold text-white truncate max-w-[120px]">{p.name}</span>
                    <span className="text-[9px] text-slate-500 font-medium">({p.studentName})</span>
                  </div>

                  <p className="text-[10px] text-slate-450 truncate">{p.lastMessage}</p>

                  {p.unreadCount > 0 && (
                    <span className="absolute top-3.5 right-3.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                      {p.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Messaging Box */}
        <div className="lg:col-span-2 flex flex-col glass rounded-2xl overflow-hidden border border-slate-800">
          {/* Active parent header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-850 bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-500">
                {selectedParent.name[0]}
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs">{selectedParent.name}</h4>
                <p className="text-[9px] text-slate-500">Parent of {selectedParent.studentName} ({selectedParent.studentRoll})</p>
              </div>
            </div>
            <span className="badge badge-green text-[9px]">Active chat</span>
          </div>

          {/* Conversation history list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => {
              const isTeacher = msg.sender === "teacher";
              return (
                <div key={i} className={`flex ${isTeacher ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isTeacher
                        ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className={`text-[8px] text-right mt-1.5 ${isTeacher ? "text-slate-900" : "text-slate-500"}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message input controls */}
          <div className="p-4 border-t border-slate-850 bg-slate-950/20 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your reply here..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* AI Helper Column */}
        <div className="lg:col-span-1 glass rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-850 pb-3 mb-4">
              <h3 className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>🤖</span> AI Smart Composer
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Generate translation-ready bilingual updates</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Update Topic</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["performance", "attendance", "general"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDraftType(type)}
                      className={`py-1.5 rounded-lg text-[9px] font-bold capitalize transition-all border ${
                        draftType === type ? "bg-amber-500 border-amber-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Message Tone</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["supportive", "urgent", "encouraging"] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setDraftTone(tone)}
                      className={`py-1.5 rounded-lg text-[9px] font-bold capitalize transition-all border ${
                        draftTone === tone ? "bg-amber-500 border-amber-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={handleGenerateAIDraft}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white border border-slate-700/50 flex items-center justify-center gap-1"
            >
              ⚡ Insert AI Draft
            </button>
            <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl text-[10px] text-slate-500 leading-relaxed italic">
              📢 AI generates messages both in **Tamil** and **English** so parents can select their preferred reading medium.
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
