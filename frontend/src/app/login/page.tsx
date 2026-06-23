"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const demoAccounts = [
  { label: "🎓 Student", email: "student@gmail.com", role: "STUDENT" },
  { label: "📚 Teacher", email: "teacher@gmail.com", role: "TEACHER" },
  { label: "👨‍👩‍👧 Parent", email: "parent@gmail.com", role: "PARENT" },
  { label: "🏫 Headmaster", email: "headmaster@gmail.com", role: "HEADMASTER" },
  { label: "🏢 BEO", email: "beo@gmail.com", role: "BEO" },
  { label: "🗺️ DEO", email: "deo@gmail.com", role: "DEO" },
  { label: "⚖️ Commissioner", email: "commissioner@gmail.com", role: "COMMISSIONER" },
  { label: "🏛️ Minister", email: "minister@gmail.com", role: "MINISTER" },
  { label: "🛠️ Super Admin", email: "superadmin@gmail.com", role: "SUPERADMIN" },
];

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"staff" | "student">("staff");
  
  // Staff credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  
  // Student credentials
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let payload: Record<string, string> = { loginType };

    if (loginType === "student") {
      if (!rollNumber.trim() || !phone.trim()) {
        setError("Please enter both Roll Number and Phone Number.");
        setLoading(false);
        return;
      }
      payload.rollNumber = rollNumber;
      payload.phone = phone;
    } else {
      if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
      }
      payload.email = email;
      payload.password = password;
    }

    const res = await signIn("credentials", {
      ...payload,
      redirect: false,
    });

    if (res?.error || !res?.ok) {
      setError("Invalid credentials. Try check database users or use quick logins below.");
      setLoading(false);
    } else {
      // Direct user to their respective default home dashboard based on role
      let path = "/student";
      if (loginType === "staff") {
        const lower = email.toLowerCase();
        if (lower.includes("teacher")) path = "/teacher";
        else if (lower.includes("parent")) path = "/parent";
        else if (lower.includes("headmaster")) path = "/headmaster";
        else if (lower.includes("beo")) path = "/block-education-officer";
        else if (lower.includes("deo")) path = "/district-education-officer";
        else if (lower.includes("commissioner")) path = "/commissioner";
        else if (lower.includes("minister")) path = "/minister";
        else if (lower.includes("superadmin")) path = "/super-admin";
      }

      router.push(path);
      router.refresh();
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setLoading(true);
    setError(null);

    let payload: Record<string, string> = {};

    if (demoEmail === "student@gmail.com") {
      // Use database suganya student test credentials
      payload = {
        loginType: "student",
        rollNumber: "HM10103",
        phone: "9655258556",
      };
      setLoginType("student");
      setRollNumber("HM10103");
      setPhone("9655258556");
    } else {
      payload = {
        loginType: "staff",
        email: demoEmail,
        password: "123456",
      };
      setLoginType("staff");
      setEmail(demoEmail);
      setPassword("123456");
    }

    const res = await signIn("credentials", {
      ...payload,
      redirect: false,
    });

    if (res?.error || !res?.ok) {
      setError(`Error signing in with demo account. Ensure PostgreSQL is connected.`);
      setLoading(false);
    } else {
      let path = "/student";
      if (demoEmail.includes("teacher")) path = "/teacher";
      else if (demoEmail.includes("parent")) path = "/parent";
      else if (demoEmail.includes("headmaster")) path = "/headmaster";
      else if (demoEmail.includes("beo")) path = "/block-education-officer";
      else if (demoEmail.includes("deo")) path = "/district-education-officer";
      else if (demoEmail.includes("commissioner")) path = "/commissioner";
      else if (demoEmail.includes("minister")) path = "/minister";
      else if (demoEmail.includes("superadmin")) path = "/super-admin";

      router.push(path);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl z-10 flex flex-col gap-6">
        
        {/* Header Branding */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-90">
            <span className="text-3xl">🏛️</span>
            <div className="text-left">
              <h2 className="text-sm font-black text-slate-800 dark:text-white leading-tight">TN Schools</h2>
              <p className="text-[10px] text-slate-500 font-medium">AI Smart Learning Ecosystem</p>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white">Portal Authentication</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Authenticate credentials against the State Registry</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setLoginType("staff");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              loginType === "staff"
                ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            💼 Staff & Parents
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType("student");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              loginType === "student"
                ? "bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            🎓 Student Login
          </button>
        </div>

        {/* Error flash */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs px-4 py-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {loginType === "staff" ? (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">EMIS Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. teacher@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Password / OTP</label>
                <input
                  type="password"
                  required
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Student Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HM10103"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Registered Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9655258556"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
            ) : (
              "🔒 Sign In to Account"
            )}
          </button>
        </form>

        <hr className="border-slate-200 dark:border-slate-800/80 my-2" />

        {/* Quick Demo Login Switchboard */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-3 text-center">⚡ Quick Demo Switchboard</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleQuickLogin(account.email)}
                disabled={loading}
                className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all text-center flex flex-col justify-center items-center gap-1 hover:-translate-y-0.5"
              >
                <span>{account.label.split(" ")[0]}</span>
                <span className="text-[9px] text-slate-450 dark:text-slate-500">{account.label.split(" ")[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
