import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { Eye, EyeOff, Lock, User, PhoneCall } from "lucide-react";

const TOKEN_KEY = "b2bvoice_admin_token";

const ORBIT_LABELS = ["NLP Engine", "Voice AI", "CRM Sync", "Call Router", "Analytics", "Auto-Schedule"];

const OrbitViz = () => {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const tRef = useRef(0);

  useAnimationFrame((_, delta) => {
    tRef.current += delta * 0.00025;
    nodeRefs.current.forEach((node, i) => {
      if (!node) return;
      const a = tRef.current + (i * Math.PI * 2) / ORBIT_LABELS.length;
      const x = 50 + 38 * Math.cos(a);
      const y = 50 + 30 * Math.sin(a);
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
    });
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const a = tRef.current + (i * Math.PI * 2) / ORBIT_LABELS.length;
      const x = 50 + 38 * Math.cos(a);
      const y = 50 + 30 * Math.sin(a);
      line.setAttribute("x2", `${x}%`);
      line.setAttribute("y2", `${y}%`);
    });
  });

  return (
    <div className="relative w-full select-none" style={{ height: 340 }}>
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        <ellipse cx="50%" cy="50%" rx="38%" ry="30%" fill="none"
          stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="5 10" />
        {ORBIT_LABELS.map((_, i) => (
          <line
            key={i}
            ref={el => { lineRefs.current[i] = el; }}
            x1="50%" y1="50%"
            x2="50%" y2="50%"
            stroke="rgba(79,142,247,0.25)"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        {[0, 0.9, 1.8].map((delay, i) => (
          <motion.div key={i} className="absolute"
            style={{ width: 76, height: 76, border: "1.5px solid rgba(79,142,247,0.3)", borderRadius: "50%" }}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay }}
          />
        ))}
        <motion.div
          className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #00357a 0%, #0066ff 100%)", boxShadow: "0 0 40px rgba(79,142,247,0.45)" }}
          animate={{ boxShadow: ["0 0 30px rgba(0,53,122,0.4)", "0 0 60px rgba(79,142,247,0.6)", "0 0 30px rgba(0,53,122,0.4)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneCall className="w-7 h-7 text-white" />
        </motion.div>
        <div className="mt-3 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/90">B2BVoice</p>
          <p className="text-[9px] text-white/40 font-semibold mt-0.5 uppercase tracking-wider">AI Hub</p>
        </div>
      </div>

      {ORBIT_LABELS.map((label, i) => (
        <motion.div
          key={i}
          ref={el => { nodeRefs.current[i] = el; }}
          className="absolute z-10"
          style={{ transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="px-2.5 py-1 bg-white/8 border border-white/15 text-[9px] font-bold text-white/80 whitespace-nowrap backdrop-blur-sm"
            style={{ borderRadius: 4 }}>
            {label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AnimatedWave = () => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef(0);

  useAnimationFrame((_, delta) => {
    phaseRef.current += delta * 0.0025;
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const h = 0.3 + 0.7 * Math.abs(Math.sin(phaseRef.current + i * 0.55));
      bar.style.height = `${Math.max(4, h * 28)}px`;
    });
  });

  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          ref={el => { barsRef.current[i] = el; }}
          className="w-1 rounded-full"
          style={{ height: 4, background: "rgba(79,142,247,0.7)", transition: "height 0.05s" }}
        />
      ))}
    </div>
  );
};

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }
      const { token } = await res.json();
      localStorage.setItem(TOKEN_KEY, token);
      setLocation("/admin");
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>

      {/* Left — AI visual */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #010c1e 0%, #001f5b 60%, #00357a 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#0066ff]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#00357a]/30 to-transparent" />
        </div>

        <div className="relative z-10 p-10">
          <img
            src="/logo-transparent.webp"
            alt="B2BVoice"
            className="brightness-0 invert drop-shadow-lg"
            style={{ width: 180, height: "auto" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-10">
          <OrbitViz />
          <div className="mt-6 text-center">
            <AnimatedWave />
          </div>
        </div>

        <div className="relative z-10 p-10">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">
            B2BVoice Admin Panel
          </p>
          <p className="text-white/15 text-xs mt-1">
            AI-powered voice assistant management
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img src="/logo-new.jpg" alt="B2BVoice" style={{ width: 160, height: "auto" }} />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Login</h1>
            <p className="text-gray-400 text-sm">Sign in to manage demo requests</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#00357a] transition-colors"
                  style={{ borderRadius: 0 }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 bg-white text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#00357a] transition-colors"
                  style={{ borderRadius: 0 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#00357a] text-white font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#002d6b] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ borderRadius: 0 }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-300">
            B2BVoice Admin · Restricted Access
          </p>
        </motion.div>
      </div>
    </div>
  );
}
