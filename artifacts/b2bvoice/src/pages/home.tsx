import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/translations";
import DemoRequestModal from "@/components/DemoRequestModal";
import { motion, useInView, useAnimationFrame, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Menu, X, ChevronRight, ArrowRight,
  ChevronLeft,
  PhoneCall, Clock, Calendar, CheckCircle2,
  PhoneMissed, Briefcase, FileText, Share2,
  Stethoscope, Cross, Smile, Globe, Building2,
  ShoppingCart, Scale, Hotel, BarChart3, Users,
  Activity, Star, Quote, Plus, Minus, Twitter, Linkedin, Instagram,
  Play, Pause, Check, HeartPulse, Building, MessageSquare, Database, Mic, Mail, ChevronUp,
  Scissors, Home as HomeIcon, Car, Shield, UtensilsCrossed, Sparkles, Truck, PawPrint, BookOpen, Wrench
} from "lucide-react";
import logoPath from "@assets/b2b_voice_logo_last.jpg_1779447736303.jpeg";
import { AGENTS } from "@/lib/agentData";
import type { AgentInfo } from "@/lib/agentData";
import TR from "country-flag-icons/react/3x2/TR";
import GB from "country-flag-icons/react/3x2/GB";
import US from "country-flag-icons/react/3x2/US";
import DE from "country-flag-icons/react/3x2/DE";
import CN from "country-flag-icons/react/3x2/CN";
import KR from "country-flag-icons/react/3x2/KR";
import FR from "country-flag-icons/react/3x2/FR";
import ES from "country-flag-icons/react/3x2/ES";
import SA from "country-flag-icons/react/3x2/SA";
import RU from "country-flag-icons/react/3x2/RU";
import JP from "country-flag-icons/react/3x2/JP";
import IT from "country-flag-icons/react/3x2/IT";
import PT from "country-flag-icons/react/3x2/PT";

// --- Helpers ---
function FadeInWhenVisible({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "", prefix = "" }: { from?: number; to: number; duration?: number; suffix?: string; prefix?: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);
  useEffect(() => {
    if (!isInView) return;
    let start = from;
    const end = to;
    if (start === end) return;
    const totalMs = duration * 1000;
    const incrementTime = Math.max(totalMs / end, 20);
    const timer = setInterval(() => {
      start += Math.ceil((end - from) / (totalMs / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [isInView, from, to, duration]);
  return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
};

// --- Waveform (CSS-only — no JS animation loops) ---
const WAVE_DURS = [0.80,0.95,0.85,1.05,0.90,0.75,1.00,0.88,0.82,1.10,0.78,0.93,0.87,1.03,0.92,0.76,1.08,0.84,0.97,0.81,1.02,0.89,0.74,0.96,0.83,1.06,0.91,0.79,1.01,0.86,0.94,0.77];
const Waveform = () => (
  <div className="flex items-center justify-center gap-[3px] h-12 w-full overflow-hidden">
    {WAVE_DURS.map((dur, i) => (
      <div
        key={i}
        className="waveform-bar"
        style={{ "--dur": `${dur}s`, animationDelay: `${i * 0.045}s` } as React.CSSProperties}
      />
    ))}
  </div>
);

const DemoModalCtx = React.createContext<{ open: () => void }>({ open: () => {} });
const useDemoModal = () => useContext(DemoModalCtx);

const GOOGLE_MEET_LINK = "https://calendar.app.google/aKu2n5KzGBrMMvBL8";

const DemoChoiceModal = ({ open, onClose, onOpenForm }: { open: boolean; onClose: () => void; onOpenForm: () => void }) => {
  if (!open) return null;
  const handleEmail = () => {
    window.location.href = "mailto:hello@b2b-voice.com?subject=Demo%20Request&body=Hi%20B2BVoice%20team%2C%0A%0AI%27d%20like%20to%20request%20a%20free%20custom%20demo.%0A%0ABusiness%20name%3A%20%0AIndustry%3A%20%0APhone%3A%20%0A%0AThank%20you";
    onClose();
  };
  const handleMeet = () => {
    window.open(GOOGLE_MEET_LINK, "_blank");
    onClose();
  };
  const handleForm = () => {
    onClose();
    setTimeout(onOpenForm, 80);
  };

  const options = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>
        </svg>
      ),
      label: "Request Demo",
      desc: "Fill out a quick form and we'll prepare your custom demo.",
      action: handleForm,
      accent: "#00357a",
      bg: "bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40",
      text: "text-primary",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
        </svg>
      ),
      label: "Request via E-Mail",
      desc: "Send us an email directly — we'll reply within 24 hours.",
      action: handleEmail,
      accent: "#059669",
      bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-400",
      text: "text-emerald-700",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
        </svg>
      ),
      label: "Book a Demo Call",
      desc: "Pick a time that works for you — book a live demo via Google Calendar.",
      action: handleMeet,
      accent: "#4f8ef7",
      bg: "bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400",
      text: "text-blue-700",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="bg-white w-full max-w-md shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

            {/* Header */}
            <div className="px-8 pt-7 pb-5">
              <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/8 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                FREE DEMO
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">How would you like to connect?</h2>
              <p className="text-gray-500 text-sm mt-1">Choose the option that works best for you.</p>
            </div>

            {/* Options */}
            <div className="px-8 pb-8 space-y-3">
              {options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={opt.action}
                  className={`w-full flex items-center gap-4 px-5 py-4 border text-left transition-all ${opt.bg}`}
                >
                  <div className={`flex-shrink-0 ${opt.text}`}>{opt.icon}</div>
                  <div className="min-w-0">
                    <div className={`font-bold text-sm ${opt.text}`}>{opt.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 flex-shrink-0 ml-auto ${opt.text} opacity-50`} fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NAV_LANG_OPTIONS = [
  { code: "en" as Lang, Flag: US, label: "EN", name: "English" },
  { code: "de" as Lang, Flag: DE, label: "DE", name: "Deutsch" },
  { code: "es" as Lang, Flag: ES, label: "ES", name: "Español" },
];

// --- Navbar ---
const Navbar = () => {
  const { open } = useDemoModal();
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ["/logo-de.webp"].forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = NAV_LANG_OPTIONS.find((o) => o.code === lang)!;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled ? "border-b border-gray-200 shadow-[0_2px_24px_rgba(0,0,0,0.07)]" : "border-b border-transparent"
      }`}
    >
      <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent w-full absolute top-0 left-0" />

      <div className="w-full px-4 sm:px-6 flex items-center justify-between" style={{ height: "72px" }}>
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src={lang === "de" ? "/logo-de.webp" : "/logo-clean.webp"}
            alt="B2BVoice"
            className="w-[168px] sm:w-52"
            style={{ height: "auto", opacity: 0.95, mixBlendMode: lang === "de" ? "multiply" : "normal" }}
            fetchPriority="high"
          />
        </Link>

        {/* Right: Language + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-4 h-10 sm:h-auto sm:py-2.5 bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all rounded-none"
            >
              <active.Flag className="w-5 h-auto sm:w-[22px] shrink-0" style={{ display: "block", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
              <span className="hidden sm:inline text-[11px] font-black uppercase tracking-widest text-gray-800">{active.label}</span>
              <motion.svg
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 bg-white border border-gray-200 z-50 overflow-hidden rounded-none"
                  style={{ minWidth: 190, boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  {NAV_LANG_OPTIONS.map(({ code, Flag, label, name }) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code); setLangOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all border-b border-gray-50 last:border-0
                        ${code === lang ? "bg-primary/5" : "hover:bg-gray-50"}`}
                    >
                      <Flag className="w-5 h-auto shrink-0" style={{ display: "block", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-gray-800 leading-none">{name}</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5 font-mono">{label}</p>
                      </div>
                      {code === lang && (
                        <svg className="w-3.5 h-3.5 text-primary ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA — "FOR DEMO" on mobile, full text on sm+ */}
          <button
            onClick={open}
            data-testid="nav-cta"
            className="flex items-center justify-center bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,53,122,0.3)] transition-all rounded-none
              h-10 min-w-[72px] px-2 sm:min-w-0 sm:px-5 sm:py-2.5 sm:text-sm sm:uppercase sm:tracking-wide"
          >
            <span className="text-[9px] font-black uppercase tracking-widest sm:hidden whitespace-nowrap">FOR DEMO</span>
            <span className="hidden sm:inline whitespace-nowrap">{t.nav.requestDemo}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- Hero Dashboard Mockup ---
const DASH_BARS = [38, 52, 44, 71, 63, 82, 55];
const DASH_DAYS = ["S","M","T","W","T","F","S"];

const OverviewTab = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      {[
        { label: "TOTAL CALLS", value: "1,284" },
        { label: "ANSWERED",    value: "1,271" },
        { label: "APPOINTMENTS",value: "342"   },
        { label: "NEW CUSTOMERS",value: "89"   },
      ].map(s => (
        <div key={s.label} className="bg-white border border-gray-100 rounded-lg p-2.5 shadow-sm">
          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{s.label}</div>
          <div className="text-lg font-bold text-gray-900">{s.value}</div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
      <div className="text-[11px] font-bold text-gray-700 mb-2">Weekly Call Summary</div>
      <div className="flex items-end gap-1 h-12">
        {DASH_BARS.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <motion.div
              className="w-full rounded-sm"
              style={{ background: i === 5 ? "#00357a" : "#00357a33" }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            />
            <span className="text-[7px] text-gray-400">{DASH_DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
      <div className="text-[11px] font-bold text-gray-700 mb-2">Recent Calls</div>
      {[
        { name: "John Smith",   time: "2 min ago",  badge: "APPOINTMENT MADE", color: "green" },
        { name: "Emma Johnson", time: "18 min ago", badge: "INFO PROVIDED",     color: "blue"  },
      ].map((c, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-3 h-3 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-gray-800 truncate">{c.name}</div>
            <div className="text-[9px] text-gray-400">{c.time}</div>
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 border rounded ${
            c.color === "green"
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>{c.badge}</span>
        </div>
      ))}
    </div>
  </div>
);

const CallsTab = () => (
  <div>
    <div className="text-[11px] font-bold text-gray-700 mb-2">All Calls — Today</div>
    {[
      { name: "John Smith",    time: "2 min ago",  dur: "3:42", badge: "APPOINTMENT", color: "green"  },
      { name: "Emma Johnson",  time: "18 min ago", dur: "2:15", badge: "INFO",        color: "blue"   },
      { name: "David Park",    time: "34 min ago", dur: "1:58", badge: "CALLBACK",    color: "orange" },
      { name: "Lisa Martinez", time: "1h ago",     dur: "4:20", badge: "APPOINTMENT", color: "green"  },
      { name: "Tom Wilson",    time: "2h ago",     dur: "0:48", badge: "MISSED",      color: "red"    },
    ].map((c, i) => (
      <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
          <Users className="w-3 h-3 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-gray-800 truncate">{c.name}</div>
          <div className="text-[9px] text-gray-400">{c.time} · {c.dur}</div>
        </div>
        <span className={`text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 border rounded ${
          c.color === "green"  ? "bg-green-50 text-green-600 border-green-200" :
          c.color === "blue"   ? "bg-blue-50 text-blue-600 border-blue-200"   :
          c.color === "orange" ? "bg-orange-50 text-orange-500 border-orange-200" :
                                 "bg-red-50 text-red-500 border-red-200"
        }`}>{c.badge}</span>
      </div>
    ))}
  </div>
);

const AppointmentsTab = () => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="text-[11px] font-bold text-gray-700">Today's Appointments</div>
      <div className="text-[9px] text-gray-400 font-medium">4 scheduled</div>
    </div>
    {[
      { time: "14:30", name: "Michael T.", type: "Checkup",      status: "upcoming" },
      { time: "15:00", name: "Sarah K.",   type: "Follow-up",    status: "upcoming" },
      { time: "16:30", name: "James B.",   type: "First Visit",  status: "upcoming" },
      { time: "17:15", name: "Ana Costa",  type: "Consultation", status: "upcoming" },
    ].map((a, i) => (
      <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
        <div className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-1 rounded shrink-0 min-w-[40px] text-center">{a.time}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-gray-800">{a.name}</div>
          <div className="text-[9px] text-gray-400">{a.type}</div>
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
      </div>
    ))}
  </div>
);

const DASH_MENU = ["Overview", "Calls", "Appointments", "Customers", "Settings"];

const HeroDashboard = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative"
    >
      <motion.div
        animate={{ scale: [1, 1.012, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="bg-white border border-gray-200 shadow-2xl overflow-hidden"
        style={{ borderRadius: 14 }}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="flex" style={{ minHeight: 420 }}>
          {/* Sidebar */}
          <div className="w-32 border-r border-gray-100 bg-gray-50 p-3 shrink-0 flex flex-col">
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">MENU</div>
            {DASH_MENU.map((item, i) => (
              <button
                key={item}
                onClick={() => i < 3 ? setActive(i) : undefined}
                className={`w-full text-left px-2.5 py-1.5 text-[11px] font-medium rounded-md mb-0.5 transition-colors ${
                  i === active
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                } ${i >= 3 ? "cursor-default" : "cursor-pointer"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
              >
                {active === 0 && <OverviewTab />}
                {active === 1 && <CallsTab />}
                {active === 2 && <AppointmentsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Tab progress indicator */}
        <div className="flex border-t border-gray-100">
          {["Overview", "Calls", "Appointments"].map((label, i) => (
            <button
              key={label}
              onClick={() => setActive(i)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                i === active ? "text-primary border-t-2 border-primary -mt-px bg-primary/5" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Hero ---
const DEMO_PHONE_DISPLAY = "+1 (XXX) XXX-XXXX";
const DEMO_PHONE_TEL = "+1XXXXXXXXXX";
const CUSTOM_DEMO_PHONE_TEL = "+19297305505";

const Hero = () => {
  const { open } = useDemoModal();
  const { t } = useLanguage();

  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-hidden flex items-center min-h-screen bg-gray-50">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] hero-blob-1"
          style={{ background: "radial-gradient(circle, rgba(0,53,122,0.1) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] hero-blob-2"
          style={{ background: "radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 mb-8 text-xs font-semibold tracking-wider text-primary uppercase rounded-none shadow-sm">
              <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
              {t.hero.badge}
            </div>
            
            <h1 className="text-[2rem] sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-gray-900 leading-[1.1]">
              {t.hero.h1}<br /><span className="text-primary">{t.hero.h2}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {t.hero.sub}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={open}
                data-testid="hero-primary-cta"
                className="px-8 py-4 bg-primary text-white font-bold text-lg transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,53,122,0.2)] flex items-center justify-center gap-2 rounded-none"
              >
                {t.hero.cta1}
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#demo"
                data-testid="hero-secondary-cta"
                className="px-8 py-4 border border-gray-200 text-gray-900 bg-white font-semibold text-lg transition-all hover:bg-gray-50 flex items-center justify-center gap-2 rounded-none shadow-sm"
              >
                <Play className="w-5 h-5" />
                {t.hero.cta2}
              </a>
            </div>

            <motion.a
              href="mailto:hello@b2b-voice.com"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="mt-6 inline-flex items-center gap-3.5 group"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="flex items-center justify-center w-11 h-11 bg-primary/10 text-primary shrink-0"
              >
                <Mail className="w-5 h-5" />
              </motion.div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold leading-none mb-1">or email us at</p>
                <p className="text-xl font-black text-primary group-hover:underline underline-offset-2 leading-none">
                  hello@b2b-voice.com
                </p>
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: [0, 0, -1, 1, -1, 1, 0, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl relative overflow-hidden rounded-none"
              data-testid="hero-call-card"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

              <div className="flex items-center gap-2.5 px-6 sm:px-8 py-4 border-b border-gray-100">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-gray-700 uppercase">{t.hero.demoBadge}</span>
              </div>

              <div className="px-6 sm:px-8 pt-8 pb-6">
                <div className="relative w-24 h-24 mb-6 group/phone">
                  <motion.span
                    animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-accent/25"
                  />
                  <motion.span
                    animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0.3, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="absolute inset-2 rounded-full bg-accent/35"
                  />
                  <span className="absolute inset-4 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/phone:scale-105">
                    <PhoneCall className="w-8 h-8 text-white" />
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{t.hero.talkTitle}</h3>
                <p className="text-2xl sm:text-3xl italic text-gray-400 font-serif mb-5">{t.hero.talkNow}</p>

                <a
                  href={`tel:${DEMO_PHONE_TEL}`}
                  data-testid="hero-phone-number"
                  className="block text-3xl sm:text-4xl font-black text-primary tracking-tight hover:underline underline-offset-4 mb-6"
                >
                  {DEMO_PHONE_DISPLAY}
                </a>

                <div className="border-t border-gray-100 pt-5">
                  <p className="text-sm italic text-gray-500 leading-relaxed">{t.hero.talkDesc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t-2 border-primary px-6 sm:px-8 py-4">
                <a
                  href={`tel:${DEMO_PHONE_TEL}`}
                  data-testid="hero-tap-to-call"
                  className="text-xs font-bold tracking-[0.2em] text-gray-700 uppercase hover:text-primary transition-colors"
                >
                  {t.hero.tapToCall}
                </a>
                <a
                  href={`tel:${DEMO_PHONE_TEL}`}
                  data-testid="hero-dial-now"
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-primary uppercase hover:underline underline-offset-4"
                >
                  {t.hero.dialNow}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Trust Strip ---
const TrustStrip = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 border-y border-gray-200 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl font-bold text-gray-900 mb-2"><AnimatedCounter to={24} prefix="7/" /></div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">{t.trust.alwaysOn}</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl font-bold text-gray-900 mb-2"><AnimatedCounter to={100} suffix="+" /></div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">{t.trust.languages}</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl font-bold text-gray-900 mb-2">0.5s</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">{t.trust.responseTime}</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl font-bold text-gray-900 mb-2">Custom Build</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">{t.trust.integration}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Problems ---
const ProblemSection = () => {
  const { t } = useLanguage();
  const PROBLEM_ICONS = [PhoneMissed, Clock, Calendar, Share2];
  const problems = t.problem.items.map((item, i) => ({ icon: PROBLEM_ICONS[i], ...item }));

  return (
    <section className="py-14 md:py-20 bg-gray-50 relative z-10 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <FadeInWhenVisible className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-200 bg-red-50 text-xs font-bold uppercase tracking-widest text-red-600 mb-4 rounded-none">
            {t.problem.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">{t.problem.heading}</h2>
        </FadeInWhenVisible>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((prob, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.1}>
              <motion.div
                className="bg-white border border-gray-200 shadow-sm p-8 h-full relative group transition-colors hover:border-red-300 hover:shadow-md rounded-none"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-red-50 flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors rounded-none">
                  <prob.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{prob.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prob.desc}</p>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Solution ---
const SolutionSection = () => {
  const { t } = useLanguage();
  const STEP_ICONS = [PhoneCall, Activity, Calendar, FileText, PhoneCall];
  const steps = t.solution.steps.map((step, i) => ({ num: String(i + 1), icon: STEP_ICONS[i], ...step }));

  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden border-b border-gray-200">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[500px] bg-primary/5 blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <FadeInWhenVisible className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-4 rounded-none">
            {t.solution.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{t.solution.heading}</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{t.solution.sub}</p>
        </FadeInWhenVisible>

        <div className="max-w-3xl mx-auto relative">
          {/* Connecting line — visible on all screens */}
          <div className="absolute left-[23px] top-[48px] bottom-[48px] w-px bg-gray-200" />

          <div className="space-y-6 md:space-y-10">
            {steps.map((step, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.12}>
                <div className="relative flex flex-row gap-4 md:gap-8 group">
                  {/* Number circle */}
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 shadow-sm relative z-10 group-hover:border-primary transition-colors rounded-none">
                    <span className="text-gray-900 font-mono font-bold text-sm">{step.num}</span>
                  </div>
                  {/* Content card */}
                  <div className="bg-gray-50 border border-gray-200 px-4 py-4 md:p-6 flex-1 group-hover:border-primary/30 group-hover:bg-white transition-all group-hover:shadow-md rounded-none min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1.5 md:p-2 bg-white text-primary border border-gray-100 shadow-sm rounded-none shrink-0">
                        <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <h3 className="text-base md:text-xl font-bold text-gray-900 leading-snug">{step.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Multi-Language Animation ---
const LANG_LINES = [
  { code: "EN", greeting: "Hello, how can I help you today?",  color: "#00357a" },
  { code: "DE", greeting: "Hallo, wie kann ich Ihnen helfen?", color: "#4f8ef7" },
  { code: "ES", greeting: "Hola, ¿en qué puedo ayudarle hoy?", color: "#6366f1" },
  { code: "FR", greeting: "Bonjour, comment puis-je vous aider?", color: "#0891b2" },
  { code: "TR", greeting: "Merhaba, size nasıl yardımcı olabilirim?", color: "#7c3aed" },
  { code: "AR", greeting: "مرحباً، كيف يمكنني مساعدتك اليوم؟",   color: "#059669" },
];

const MultiLangAnimation = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % LANG_LINES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const active = LANG_LINES[activeIdx];

  return (
    <div className="my-5 flex flex-col gap-2">
      {/* Cycling greeting bubble */}
      <div className="relative h-[68px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
          >
            <span
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white"
              style={{ background: active.color }}
            >
              {active.code}
            </span>
            <span className="text-gray-700 text-sm leading-snug font-medium line-clamp-2">
              {active.greeting}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Language dots */}
      <div className="flex items-center gap-1.5 pl-1 pt-1">
        {LANG_LINES.map((l, i) => (
          <button
            key={l.code}
            onClick={() => setActiveIdx(i)}
            title={l.code}
            className="transition-all duration-300"
            style={{
              width: i === activeIdx ? 20 : 8,
              height: 8,
              borderRadius: 99,
              background: i === activeIdx ? active.color : "#e5e7eb",
            }}
          />
        ))}
        <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">100+ languages</span>
      </div>
    </div>
  );
};

// --- Features Grid (Bento) ---
const FeaturesSection = () => {
  const { t } = useLanguage();
  return (
    <section id="ozellikler" className="py-14 md:py-20 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary mb-4 rounded-none">
              {t.features.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-2xl mb-4">
              {t.features.heading}
            </h2>
            <p className="text-gray-600 max-w-xl text-lg">
              {t.features.sub}
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <a href="#demo" className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors">
              {t.features.seeAll} <ArrowRight className="w-4 h-4" />
            </a>
          </FadeInWhenVisible>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Row 1 */}
          <FadeInWhenVisible delay={0.1} className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 h-full flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.features.api.title}</h3>
                <p className="text-gray-600 text-lg">
                  {t.features.api.desc}
                </p>
              </div>
              <div className="w-full md:w-1/2 h-44 rounded-xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden flex flex-col justify-center gap-3 py-3">
                {/* Ticker row 1 — left */}
                {(() => {
                  const row1 = ["HubSpot", "Salesforce", "Google Calendar", "Slack"];
                  const row1Acc = ["#FF7A59", "#00A1E0", "#4285F4", "#E01E5A"];
                  return (
                    <div className="overflow-hidden flex items-center">
                      <motion.div
                        className="flex items-center gap-3 min-w-max"
                        animate={{ x: [0, -230] }}
                        transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                      >
                        {[...row1, ...row1].map((name, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm"
                            style={{ boxShadow: `0 2px 10px ${row1Acc[i % row1.length]}22` }}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: `${row1Acc[i % row1.length]}18`, border: `1.5px solid ${row1Acc[i % row1.length]}40` }}
                            >
                              <BrandIcon name={name} size={16} />
                            </div>
                            <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">{name}</span>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  );
                })()}
                {/* Ticker row 2 — right */}
                {(() => {
                  const row2 = ["Gmail", "WhatsApp", "Zapier", "Microsoft Teams"];
                  const row2Acc = ["#EA4335", "#25D366", "#FF4A00", "#5059C9"];
                  return (
                    <div className="overflow-hidden flex items-center">
                      <motion.div
                        className="flex items-center gap-3 min-w-max"
                        animate={{ x: [-230, 0] }}
                        transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                      >
                        {[...row2, ...row2].map((name, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm"
                            style={{ boxShadow: `0 2px 10px ${row2Acc[i % row2.length]}22` }}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: `${row2Acc[i % row2.length]}18`, border: `1.5px solid ${row2Acc[i % row2.length]}40` }}
                            >
                              <BrandIcon name={name} size={16} />
                            </div>
                            <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">{name}</span>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 h-full relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors" />
              <div className="absolute -top-12 -right-8 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-colors" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.reporting.title}</h3>
                <p className="text-gray-600 mt-auto">
                  {t.features.reporting.desc}
                </p>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Row 2 */}
          <FadeInWhenVisible delay={0.3}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 h-full relative overflow-hidden group">
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors" />
              <div className="absolute -bottom-12 -left-8 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-colors" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.multilang.title}</h3>

                {/* Language animation */}
                <MultiLangAnimation />

                <p className="text-gray-600 mt-auto">
                  {t.features.multilang.desc}
                </p>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.4}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 h-full relative overflow-hidden flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.appointment.title}</h3>
              <p className="text-gray-600 mb-6">
                {t.features.appointment.desc}
              </p>
              <div className="mt-auto bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-inner mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">{t.features.drAppt}</div>
                    <div className="text-[10px] text-gray-500">{t.features.confirmed}</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
                </div>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-none text-sm hover:bg-gray-800 transition-colors">
                {t.features.getStarted}
              </button>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.5} className="md:col-span-1 space-y-6 flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.features.smartRouting.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{t.features.smartRouting.desc}</p>
              <div className="flex items-center gap-1 h-8 mt-auto opacity-70 group-hover:opacity-100 transition-opacity">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <motion.div 
                    key={i} 
                    className="w-1.5 bg-primary rounded-full"
                    animate={{ height: ["20%", `${30 + Math.random() * 70}%`, "20%"] }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1 flex flex-col justify-center">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mb-3">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.features.gdpr.title}</h3>
              <p className="text-sm text-gray-600">
                {t.features.gdpr.desc}
              </p>
            </div>
          </FadeInWhenVisible>

        </div>
      </div>
    </section>
  );
};

// --- Languages Section ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlagComponent = React.ComponentType<any>;
const FLAG_COMPONENTS: Record<string, FlagComponent> = {
  TR, GB, DE, CN, KR, FR, ES, SA, RU, JP, IT, PT,
};

const languages = [
  { code: "TR", name: "Turkish" },
  { code: "GB", name: "English" },
  { code: "DE", name: "German" },
  { code: "CN", name: "Chinese" },
  { code: "KR", name: "Korean" },
  { code: "FR", name: "French" },
  { code: "ES", name: "Spanish" },
  { code: "SA", name: "Arabic" },
  { code: "RU", name: "Russian" },
  { code: "JP", name: "Japanese" },
  { code: "IT", name: "Italian" },
  { code: "PT", name: "Portuguese" },
];

const FlagCircle = ({ code, size = 32 }: { code: string; size?: number }) => {
  const Flag = FLAG_COMPONENTS[code];
  if (!Flag) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", flexShrink: 0,
      border: "1.5px solid rgba(0,0,0,0.08)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
      background: "#f8fafc",
    }}>
      <Flag style={{ width: size * 1.5, height: size * 1.5, objectFit: "cover" }} />
    </span>
  );
};

const LanguagesSection = () => {
  const { t: tl } = useLanguage();
  const [active, setActive] = useState(0);
  const localizedLanguages = languages.map((lang, i) => ({ ...lang, name: tl.languages.names[i] }));

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % languages.length), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-14 md:py-20 bg-white border-b border-gray-200 overflow-hidden w-full">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Header — centered on mobile, left on lg */}
        <FadeInWhenVisible>
          <div className="text-center lg:text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-5 rounded-none">
              {tl.languages.badge}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold sm:font-bold text-gray-900 mb-4 leading-tight">
              {tl.languages.heading}
            </h2>
            <p className="text-base sm:text-lg font-medium text-gray-600 mb-4 max-w-xl mx-auto lg:mx-0">
              {tl.languages.sub}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {tl.languages.desc}
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Mobile-only card — shown above carousel, no FadeIn to avoid blank-space bug */}
        <div className="lg:hidden mb-3">
          <div className="border border-gray-200 bg-white p-4 shadow-sm rounded-none overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">{tl.languages.activeLanguage}</p>
                <div className="flex items-center gap-2">
                  <FlagCircle code={localizedLanguages[active].code} size={24} />
                  <span className="text-base font-bold text-gray-900 truncate">{localizedLanguages[active].name}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-600 text-[9px] font-mono rounded-none shrink-0">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {tl.languages.active}
              </div>
            </div>
            {/* Language grid — 2 cols on mobile */}
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">{tl.languages.languagesLabel}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {localizedLanguages.map((lang, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 border text-xs font-medium transition-all rounded-none min-w-0 ${
                    active === i
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <FlagCircle code={lang.code} size={14} />
                  <span className="truncate text-[11px] leading-none">{lang.name}</span>
                </button>
              ))}
            </div>
            {/* Stats row */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
              {[
                { label: tl.languages.totalLanguages, value: "30+" },
                { label: tl.languages.responseTime, value: "<0.5s" },
                { label: tl.languages.availability, value: "24/7" },
              ].map((s) => (
                <div key={s.label} className="flex-1 min-w-0 text-center">
                  <p className="text-base font-bold text-primary leading-none">{s.value}</p>
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5 font-mono truncate">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left: stats + carousel */}
          <FadeInWhenVisible>
            {/* Stat pills — hidden on mobile (already in the card above) */}
            <div className="hidden lg:flex flex-wrap justify-start gap-3 mb-8">
              {[
                { label: tl.languages.totalLanguages, value: "30+" },
                { label: tl.languages.responseTime, value: "<0.5s" },
                { label: tl.languages.availability, value: "24/7" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center px-5 py-3 border border-gray-200 bg-gray-50">
                  <span className="text-2xl font-bold text-primary leading-none">{s.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-mono">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Infinite flag carousels — row 1 left, row 2 right */}
            <div className="space-y-3">
              {/* Row 1: → left */}
              <div className="overflow-hidden relative" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
                <div className="flex gap-3 animate-marquee" style={{ width: "max-content" }}>
                  {[...localizedLanguages, ...localizedLanguages].map((lang, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white shadow-sm text-xs text-gray-700 font-semibold whitespace-nowrap"
                      style={{ borderRadius: 999 }}
                    >
                      <FlagCircle code={lang.code} size={24} />
                      {lang.name}
                    </div>
                  ))}
                </div>
              </div>
              {/* Row 2: → right (reversed) */}
              <div className="overflow-hidden relative" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
                <div className="flex gap-3 animate-marquee-reverse" style={{ width: "max-content" }}>
                  {[...[...localizedLanguages].reverse(), ...[...localizedLanguages].reverse()].map((lang, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white shadow-sm text-xs text-gray-700 font-semibold whitespace-nowrap"
                      style={{ borderRadius: 999 }}
                    >
                      <FlagCircle code={lang.code} size={24} />
                      {lang.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Right: animated language card — desktop only */}
          <FadeInWhenVisible delay={0.2} className="hidden lg:block">
            <div className="relative">
              {/* Glow — desktop only to avoid mobile overflow */}
              <div className="hidden lg:block absolute -inset-8 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

              <div className="relative border border-gray-200 bg-white p-4 shadow-lg lg:shadow-xl rounded-none overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">{tl.languages.activeLanguage}</p>
                    <div className="flex items-center gap-2">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="shrink-0"
                      >
                        <FlagCircle code={localizedLanguages[active].code} size={28} />
                      </motion.div>
                      <motion.span
                        key={`name-${active}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-base sm:text-xl font-bold text-gray-900 truncate"
                      >
                        {localizedLanguages[active].name}
                      </motion.span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-600 text-[9px] font-mono rounded-none shrink-0">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {tl.languages.active}
                  </div>
                </div>

                {/* Language grid */}
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">{tl.languages.languagesLabel}</p>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-2 sm:gap-2">
                  {localizedLanguages.map((lang, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 border text-sm font-medium transition-all rounded-none min-w-0 ${
                        active === i
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <FlagCircle code={lang.code} size={16} />
                      <span className="truncate text-[11px] sm:text-xs leading-none">{lang.name}</span>
                    </button>
                  ))}
                </div>

                {/* Bottom stat */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-gray-100 flex items-center gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mb-0.5 font-mono uppercase tracking-wider truncate">{tl.languages.totalLanguages}</p>
                    <p className="text-lg sm:text-2xl font-bold text-primary">30+</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mb-0.5 font-mono uppercase tracking-wider truncate">{tl.languages.responseTime}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">&lt;0.5s</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mb-0.5 font-mono uppercase tracking-wider truncate">{tl.languages.availability}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

// --- Industries ---
const SECTOR_IMAGES = [
  "/sector-health.webp",
  "/sector-property-management.webp",
  "/sector-home-field-services.webp",
  "/sector-automotive-groups.webp",
  "/sector-law-firms.webp",
  "/sector-staffing-recruiting.webp",
  "/sector-logistics-transportation.webp",
  "/sector-insurance-providers.webp",
  "/sector-hospitality-groups.webp",
  "/sector-senior-care.webp",
  "/sector-multi-location.webp",
  "/sector-financial-services.webp",
  "/sector-facilities-management.webp",
  "/sector-manufacturing-distribution.webp",
];
/*
const IND_CONFIG: { icon: React.ElementType; gradient: string; image?: string; imageBg?: string }[] = [
  { icon: Building,          gradient: "from-emerald-500 via-emerald-600 to-emerald-700" },
  { icon: Cross,             gradient: "from-sky-500 via-sky-600 to-sky-700",   image: "/industry-dental-clinics.png", imageBg: "#0b1e4a" },
  { icon: Scissors,          gradient: "from-violet-500 via-violet-600 to-violet-700" },
  { icon: Smile,             gradient: "from-pink-500 via-pink-600 to-pink-700" },
  { icon: Scale,             gradient: "from-slate-600 via-slate-700 to-slate-800", image: "/industry-law-firms.webp", imageBg: "#0b1e4a" },
  { icon: HeartPulse,        gradient: "from-red-500 via-red-600 to-red-700", image: "/industry-medical-clinics.webp", imageBg: "#0b1e4a" },
  { icon: HomeIcon,          gradient: "from-orange-500 via-orange-600 to-orange-700", image: "/industry-home-services-new.webp", imageBg: "#1a1535" },
  { icon: Car,               gradient: "from-zinc-600 via-zinc-700 to-zinc-800", image: "/industry-automotive.webp", imageBg: "#0b1e4a" },
  { icon: Building2,         gradient: "from-teal-500 via-teal-600 to-teal-700", image: "/industry-property-management.webp", imageBg: "#0b1e4a" },
  { icon: Shield,            gradient: "from-indigo-500 via-indigo-600 to-indigo-700", image: "/industry-insurance.webp", imageBg: "#0b1e4a" },
  { icon: BarChart3,         gradient: "from-amber-500 via-amber-600 to-amber-700", image: "/industry-accounting.webp", imageBg: "#0b1e4a" },
  { icon: Activity,          gradient: "from-lime-500 via-lime-600 to-lime-700" },
  { icon: UtensilsCrossed,   gradient: "from-rose-500 via-rose-600 to-rose-700" },
  { icon: Hotel,             gradient: "from-cyan-500 via-cyan-600 to-cyan-700", image: "/industry-hospitality.webp", imageBg: "#0b1e4a" },
  { icon: ShoppingCart,      gradient: "from-purple-500 via-purple-600 to-purple-700" },
  { icon: Sparkles,          gradient: "from-green-500 via-green-600 to-green-700", image: "/industry-cleaning.webp", imageBg: "#0b1e4a" },
  { icon: Truck,             gradient: "from-yellow-500 via-yellow-600 to-yellow-700", image: "/industry-moving.webp", imageBg: "#0b1e4a" },
  { icon: PawPrint,          gradient: "from-fuchsia-500 via-fuchsia-600 to-fuchsia-700" },
  { icon: Users,             gradient: "from-blue-600 via-blue-700 to-indigo-700", image: "/industry-recruitment.webp", imageBg: "#0b1e4a" },
  { icon: BookOpen,          gradient: "from-violet-600 via-purple-600 to-purple-700" },
]; */

const IndustriesSection = () => {
  const { t } = useLanguage();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeSector, setActiveSector] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const industries = t.industries.items.map((item, i) => ({
    ...item,
    image: SECTOR_IMAGES[i],
  }));

  const scrollToSector = (index: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cards = gallery.children;
    const target = cards[index] as HTMLElement | undefined;
    if (!target) return;

    gallery.scrollTo({
      left: Math.max(0, target.offsetLeft - 24),
      behavior: "smooth",
    });
    setActiveSector(index);
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || industries.length < 2) return;

    const updateActiveSector = () => {
      const cards = Array.from(gallery.children) as HTMLElement[];
      if (!cards.length) return;

      const closestIndex = cards.reduce((closest, card, index) => {
        const closestDistance = Math.abs(cards[closest].offsetLeft - gallery.scrollLeft - 24);
        const cardDistance = Math.abs(card.offsetLeft - gallery.scrollLeft - 24);
        return cardDistance < closestDistance ? index : closest;
      }, 0);
      setActiveSector(closestIndex);
    };

    gallery.addEventListener("scroll", updateActiveSector, { passive: true });
    return () => gallery.removeEventListener("scroll", updateActiveSector);
  }, [industries.length]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || isCarouselPaused || industries.length < 2) return;

    const timer = window.setInterval(() => {
      const nextIndex = activeSector >= industries.length - 1 ? 0 : activeSector + 1;
      scrollToSector(nextIndex);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [activeSector, industries.length, isCarouselPaused]);

  return (
    <section id="sektorler" className="py-16 md:py-24 bg-[#f8fafc] overflow-hidden">
      <div className="container mx-auto px-6">
        <FadeInWhenVisible className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-white text-xs font-bold uppercase tracking-widest text-primary mb-5">
            {t.industries.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.05] mb-4">
            {t.industries.heading}{" "}
            <span style={{ color: "#00357a" }}>{t.industries.span}</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl">{t.industries.sub}</p>
        </FadeInWhenVisible>
      </div>

      {/* Auto-playing sector carousel — pauses during user interaction. */}
      <div
        className="relative"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onFocus={() => setIsCarouselPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsCarouselPaused(false);
          }
        }}
        onTouchStart={() => setIsCarouselPaused(true)}
        onTouchEnd={() => setIsCarouselPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none z-10" />
        <button
          type="button"
          aria-label="Previous sector"
          onClick={() => scrollToSector(activeSector === 0 ? industries.length - 1 : activeSector - 1)}
          className="absolute left-3 md:left-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-primary shadow-lg transition hover:bg-primary hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next sector"
          onClick={() => scrollToSector(activeSector === industries.length - 1 ? 0 : activeSector + 1)}
          className="absolute right-3 md:right-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-primary shadow-lg transition hover:bg-primary hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div
          ref={galleryRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-6 md:px-[max(4.5rem,calc((100vw-1200px)/2))] pb-5 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {industries.map((ind, i) => (
            <motion.article
              key={`${ind.title}-${i}`}
              className="group shrink-0 w-[min(86vw,440px)] bg-white border border-slate-200 shadow-sm snap-start overflow-hidden"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                <img
                  src={ind.image}
                  alt={`${ind.title} — B2BVoice AI voice assistant`}
                  loading={i < 3 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03132f]/45 via-transparent to-transparent pointer-events-none" />
                <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-primary shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold leading-tight text-slate-900">
                  {ind.title}
                </h3>
                <div className="mt-4 space-y-2.5">
                  {ind.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-sm text-slate-500">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-6 mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <ArrowRight className="h-4 w-4 text-primary" />
          <span>{t.industries.items.length} {t.industries.badge}</span>
          <span className="h-px w-12 bg-slate-300" />
          <span>{t.industries.scrollLabel}</span>
        </div>
        <div className="flex items-center gap-1.5" aria-label="Sector carousel navigation">
          {industries.map((ind, index) => (
            <button
              key={`${ind.title}-dot`}
              type="button"
              aria-label={`Go to sector ${index + 1}`}
              aria-current={activeSector === index ? "true" : undefined}
              onClick={() => scrollToSector(index)}
              className={`h-1.5 rounded-full transition-all ${
                activeSector === index ? "w-7 bg-primary" : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Orbital Integrations ---
// Inline brand SVG logos (simple-icons paths, reliable offline)
const BrandIcon = ({ name, size = 26 }: { name: string; size?: number }) => {
  const icons: Record<string, { path: string; fill?: string; viewBox?: string; extra?: React.ReactNode }> = {
    HubSpot: {
      fill: "#FF7A59",
      path: "M18.164 7.93V5.084a2.198 2.198 0 0 0 1.268-1.978V3.07A2.198 2.198 0 0 0 17.234.872h-.036a2.198 2.198 0 0 0-2.198 2.198v.036a2.198 2.198 0 0 0 1.268 1.978V7.93a6.232 6.232 0 0 0-2.963 1.301L5.64 3.752a2.44 2.44 0 1 0-1.247 1.494l7.483 5.35a6.232 6.232 0 0 0 .047 7.077l-2.272 2.272a1.83 1.83 0 1 0 1.27 1.27l2.27-2.27a6.232 6.232 0 1 0 5-11.015zm-.93 9.418a3.465 3.465 0 1 1 0-6.93 3.465 3.465 0 0 1 0 6.93z",
    },
    WhatsApp: {
      fill: "#25D366",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
    },
    Salesforce: {
      fill: "#00A1E0",
      path: "M10.136 6.116c.707-1.147 1.97-1.92 3.418-1.92 1.79 0 3.31 1.079 4.047 2.65a4.5 4.5 0 0 1 1.576-.285c2.494 0 4.517 2.023 4.517 4.517 0 2.494-2.023 4.517-4.517 4.517a4.5 4.5 0 0 1-.688-.054 3.6 3.6 0 0 1-3.206 1.956 3.57 3.57 0 0 1-1.44-.3A4.046 4.046 0 0 1 10.1 19.2a4.04 4.04 0 0 1-3.76-2.572 3.57 3.57 0 0 1-.722.074C3.411 16.702 2 15.29 2 13.584s1.411-3.118 3.118-3.118c.156 0 .308.013.458.036A4.5 4.5 0 0 1 5.5 9.7a4.519 4.519 0 0 1 4.636-3.584z",
    },
    "Zoho CRM": {
      fill: "#E42527",
      path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5h-7v-1.5l4.5-5H8.5V7.5h7v1.5l-4.5 5h4.5v1.5z",
    },
    "Google Calendar": {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <path fill="#4285F4" d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
          <path fill="#EA4335" d="M7 10h2v2H7zm0 4h2v2H7z"/>
          <path fill="#34A853" d="M11 10h2v2h-2zm0 4h2v2h-2z"/>
          <path fill="#FBBC05" d="M15 10h2v2h-2zm0 4h2v2h-2z"/>
          <path fill="#4285F4" d="M5 6h14v2H5z"/>
        </>
      ),
      path: "",
    },
    Calendly: {
      fill: "#006BFF",
      path: "M19.5 3h-2V1.5h-1.5V3h-8V1.5H6.5V3h-2C3.12 3 2 4.12 2 5.5v15C2 21.88 3.12 23 4.5 23h15c1.38 0 2.5-1.12 2.5-2.5v-15C22 4.12 20.88 3 19.5 3zm1 17.5c0 .55-.45 1-1 1h-15c-.55 0-1-.45-1-1v-11h17v11zM7 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-10 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    },
    Gmail: {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <path fill="#EA4335" d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
          <path fill="#ffffff" d="M20 8l-8 5-8-5V6l8 5 8-5v2z"/>
        </>
      ),
      path: "",
    },
    Slack: {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
          <path fill="#36C5F0" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
          <path fill="#2EB67D" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
          <path fill="#ECB22E" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/>
        </>
      ),
      path: "",
    },
    "Microsoft Teams": {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <path fill="#5059C9" d="M14 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm3 1h-4.5A1.5 1.5 0 0 0 11 7.5V13a5 5 0 0 0 9 3V8.5A2.5 2.5 0 0 0 17 6z"/>
          <path fill="#7B83EB" d="M8.5 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM13 8H4a2 2 0 0 0-2 2v6a6 6 0 0 0 12 0v-6a2 2 0 0 0-2-2z"/>
          <path fill="#ffffff" d="M8.5 10.5v6M6 13h5"/>
        </>
      ),
      path: "",
    },
    "Google Sheets": {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <rect fill="#34A853" x="3" y="2" width="18" height="20" rx="1"/>
          <rect fill="#ffffff" x="6" y="7" width="5" height="2"/>
          <rect fill="#ffffff" x="13" y="7" width="5" height="2"/>
          <rect fill="#ffffff" x="6" y="11" width="5" height="2"/>
          <rect fill="#ffffff" x="13" y="11" width="5" height="2"/>
          <rect fill="#ffffff" x="6" y="15" width="5" height="2"/>
          <rect fill="#ffffff" x="13" y="15" width="5" height="2"/>
        </>
      ),
      path: "",
    },
    Excel: {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          {/* Dark green base */}
          <rect fill="#1E7145" x="2" y="2" width="20" height="20" rx="1.5"/>
          {/* Right lighter panel */}
          <rect fill="#33A65E" x="12.5" y="4.5" width="7" height="15" rx="0.5"/>
          {/* Vertical divider on right panel */}
          <line stroke="#ffffff" strokeWidth="0.7" x1="15.5" y1="4.5" x2="15.5" y2="19.5"/>
          {/* Horizontal lines on right panel */}
          <line stroke="#ffffff" strokeWidth="0.7" x1="12.5" y1="8"  x2="19.5" y2="8"/>
          <line stroke="#ffffff" strokeWidth="0.7" x1="12.5" y1="11" x2="19.5" y2="11"/>
          <line stroke="#ffffff" strokeWidth="0.7" x1="12.5" y1="14" x2="19.5" y2="14"/>
          <line stroke="#ffffff" strokeWidth="0.7" x1="12.5" y1="17" x2="19.5" y2="17"/>
          {/* White X */}
          <path fill="#ffffff" d="M4.8 7.5L7.8 12l-3 4.5H7l1.8-3 1.8 3h2.2l-3-4.5 3-4.5H10.6L8.8 11 7 7.5H4.8z"/>
        </>
      ),
      path: "",
    },
    n8n: {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <circle fill="#FF6D5A" cx="4" cy="12" r="3"/>
          <circle fill="#FF6D5A" cx="20" cy="12" r="3"/>
          <circle fill="#FF6D5A" cx="12" cy="12" r="3"/>
          <path stroke="#FF6D5A" strokeWidth="1.5" fill="none" d="M7 12h2M15 12h2"/>
          <path stroke="#FF6D5A" strokeWidth="1.5" fill="none" d="M4 9V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3"/>
          <path stroke="#FF6D5A" strokeWidth="1.5" fill="none" d="M20 15v3a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-3"/>
        </>
      ),
      path: "",
    },
    Zapier: {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <circle fill="#FF4A00" cx="12" cy="12" r="12"/>
          <path fill="#ffffff" d="M16 7.5H8.5v1.8l5.3 5.2H8.5V16H16v-1.8l-5.3-5.2H16V7.5z"/>
        </>
      ),
      path: "",
    },
    Instagram: {
      fill: "none",
      viewBox: "0 0 24 24",
      extra: (
        <>
          <defs>
            <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F58529"/>
              <stop offset="50%" stopColor="#DD2A7B"/>
              <stop offset="100%" stopColor="#8134AF"/>
            </linearGradient>
          </defs>
          <rect fill="url(#igGrad)" x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4" stroke="#ffffff" strokeWidth="1.8" fill="none"/>
          <circle cx="17" cy="7" r="1.2" fill="#ffffff"/>
        </>
      ),
      path: "",
    },
  };

  const icon = icons[name];
  if (!icon) return null;
  const vb = icon.viewBox ?? "0 0 24 24";

  return (
    <svg viewBox={vb} width={size} height={size} style={{ display: "block" }}>
      {icon.extra}
      {icon.path && <path fill={icon.fill} d={icon.path} />}
    </svg>
  );
};

const ScaledOrbit = ({ size, children }: { size: number; children: React.ReactNode }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      setScale(Math.min(1, w / size));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  return (
    <div ref={wrapRef} className="relative mx-auto select-none w-full overflow-hidden" style={{ maxWidth: size, height: size * scale }}>
      <div style={{ width: size, height: size, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
};

const ORBIT_INTEGRATIONS = [
  { label: "HubSpot",          ring: 1, initialAngle: 0,   speed: 12, darkBg: false, accent: "#FF7A59" },
  { label: "WhatsApp",         ring: 1, initialAngle: 120, speed: 12, darkBg: false, accent: "#25D366" },
  { label: "Zoho CRM",         ring: 1, initialAngle: 240, speed: 12, darkBg: false, accent: "#E42527" },
  { label: "Google Calendar",  ring: 2, initialAngle: 0,   speed: 7,  darkBg: false, accent: "#4285F4" },
  { label: "Calendly",         ring: 2, initialAngle: 51,  speed: 7,  darkBg: false, accent: "#006BFF" },
  { label: "Gmail",            ring: 2, initialAngle: 102, speed: 7,  darkBg: false, accent: "#EA4335" },
  { label: "Microsoft Teams",  ring: 2, initialAngle: 154, speed: 7,  darkBg: false, accent: "#5059C9" },
  { label: "Google Sheets",    ring: 2, initialAngle: 206, speed: 7,  darkBg: false, accent: "#34A853" },
  { label: "Excel",            ring: 2, initialAngle: 257, speed: 7,  darkBg: false, accent: "#217346" },
  { label: "Instagram",        ring: 2, initialAngle: 309, speed: 7,  darkBg: false, accent: "#DD2A7B" },
];

const RINGS = [
  { r: 130 },
  { r: 255 },
];

const OrbitalNode = ({ item, cx, cy }: {
  item: typeof ORBIT_INTEGRATIONS[0];
  cx: number; cy: number;
}) => {
  const ring = RINGS[item.ring - 1];
  const angleRef = useRef((item.initialAngle * Math.PI) / 180);
  const nodeRef = useRef<HTMLDivElement>(null);
  const ICON = 58;

  // Direct DOM mutation — zero React re-renders
  useAnimationFrame((_, delta) => {
    angleRef.current += (item.speed * Math.PI) / 180 / 1000 * delta;
    if (nodeRef.current) {
      const x = cx + ring.r * Math.cos(angleRef.current);
      const y = cy + ring.r * Math.sin(angleRef.current);
      nodeRef.current.style.transform = `translate(${x - ICON / 2}px, ${y - ICON / 2}px)`;
    }
  });

  return (
    <motion.div
      ref={nodeRef}
      className="absolute flex flex-col items-center gap-1.5"
      style={{ left: 0, top: 0, transform: `translate(${cx + ring.r * Math.cos(angleRef.current) - ICON/2}px, ${cy + ring.r * Math.sin(angleRef.current) - ICON/2}px)`, willChange: "transform", pointerEvents: "auto", zIndex: 10 }}
      whileHover={{ scale: 1.12, zIndex: 50 }}
      title={item.label}
    >
      {/* Dark circle with inline brand logo */}
      <motion.div
        style={{
          width: ICON, height: ICON,
          borderRadius: "50%",
          background: item.darkBg ? "#0f172a" : "#ffffff",
          boxShadow: `0 4px 20px ${item.accent}44, 0 2px 8px rgba(0,0,0,0.18)`,
          border: `1.5px solid ${item.accent}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}
        whileHover={{ boxShadow: `0 8px 32px ${item.accent}66, 0 4px 16px rgba(0,0,0,0.22)` }}
      >
        <BrandIcon name={item.label} size={26} />
      </motion.div>
      {/* Label badge */}
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.04em",
        color: "#1e293b", whiteSpace: "nowrap",
        background: "rgba(255,255,255,0.92)",
        border: "1px solid #e2e8f0",
        borderRadius: 4, padding: "1px 5px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}>
        {item.label}
      </div>
    </motion.div>
  );
};

const OrbitalIntegrations = () => {
  const { t } = useLanguage();
  const SIZE = 560;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  return (
    <section className="py-14 md:py-20 bg-[#f8fafc] border-y border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_55%,rgba(0,53,122,0.06),transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <FadeInWhenVisible className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-5 rounded-none">
            {t.integrations.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.integrations.heading}
          </h2>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            {t.integrations.sub}
          </p>
        </FadeInWhenVisible>

        {/* Orbital diagram — all screens, ScaledOrbit handles responsive scaling */}
        <div className="-mx-6 sm:mx-0">
        <ScaledOrbit size={SIZE}>

          {/* SVG orbit rings */}
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,53,122,0.07)" />
                <stop offset="100%" stopColor="rgba(0,53,122,0)" />
              </radialGradient>
            </defs>
            <circle cx={CX} cy={CY} r={SIZE / 2 - 10} fill="url(#orbitGlow)" />
            {RINGS.map((ring, i) => (
              <circle
                key={i}
                cx={CX} cy={CY} r={ring.r}
                stroke="rgba(15,23,42,0.10)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 12"
              />
            ))}
          </svg>

          {/* Orbiting icon nodes */}
          <div className="absolute inset-0">
            {ORBIT_INTEGRATIONS.map((item, i) => (
              <OrbitalNode key={i} item={item} cx={CX} cy={CY} />
            ))}
          </div>

          {/* Central B2BVoice hub */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex flex-col items-center z-20">
              {[0, 0.8, 1.6].map((delay, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 100, height: 100,
                    border: "1.5px solid rgba(0,53,122,0.18)",
                    borderRadius: "50%",
                  }}
                  animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay }}
                />
              ))}
              <motion.div
                style={{
                  width: 90, height: 90,
                  background: "linear-gradient(135deg, #00357a 0%, #0066ff 100%)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 40px rgba(0,53,122,0.35)",
                  position: "relative", zIndex: 10,
                }}
                animate={{
                  boxShadow: [
                    "0 8px 40px rgba(0,53,122,0.3)",
                    "0 12px 60px rgba(0,102,255,0.45)",
                    "0 8px 40px rgba(0,53,122,0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <PhoneCall className="w-10 h-10 text-white" />
              </motion.div>
              <div className="mt-3 text-center">
                <p className="text-[13px] font-black uppercase tracking-widest text-slate-800">B2BVoice</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wider">Your Tool</p>
              </div>
            </div>
          </div>
        </ScaledOrbit>
        </div>


      </div>
    </section>
  );
};

const DB_BARS = [40, 70, 45, 90, 60, 85, 30];
const DB_DAYS = ["S","M","T","W","T","F","S"];

const DB_EXTRA_CALLS = [
  { name: "David Park",    time: "34 min ago", dur: "1:58", status: "Callback",    color: "text-orange-700 bg-orange-50 border-orange-200" },
  { name: "Lisa Martinez", time: "1h ago",     dur: "4:20", status: "Appointment Made", color: "text-green-700 bg-green-50 border-green-200" },
  { name: "Tom Wilson",    time: "2h ago",     dur: "0:48", status: "Missed",      color: "text-red-700 bg-red-50 border-red-200" },
];

const DB_EXTRA_APTS = [
  { time: "09:00", title: "Ana Costa",    type: "Consultation" },
  { time: "10:30", title: "Mark Lee",     type: "Follow-up"   },
  { time: "12:00", title: "Linda Brown",  type: "First Visit"  },
];

const DashboardMockup = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveTab(i => (i + 1) % 3), 4500);
    return () => clearInterval(timer);
  }, []);

  const menuItems = t.dashboard.menu;

  return (
    <section className="py-14 md:py-20 bg-gray-50 border-y border-gray-200 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <FadeInWhenVisible className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-4 rounded-none">
            {t.dashboard.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{t.dashboard.heading}</h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.2}>
          <div className="border border-gray-200 bg-white shadow-xl flex flex-col md:flex-row min-h-[520px] rounded-none overflow-hidden">

            {/* Sidebar */}
            <div className="w-56 bg-gray-50 border-r border-gray-200 p-5 hidden md:flex flex-col gap-1 shrink-0">
              <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Menu</div>
              {menuItems.map((item, i) => (
                <button
                  key={item}
                  onClick={() => i < 3 ? setActiveTab(i) : undefined}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-none relative ${
                    i === activeTab
                      ? "bg-primary/10 text-primary font-bold border-l-2 border-primary"
                      : i < 3
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-l-2 border-transparent cursor-pointer"
                        : "text-gray-400 border-l-2 border-transparent cursor-default"
                  }`}
                >
                  {item}
                  {i === activeTab && (
                    <motion.span
                      layoutId="db-sidebar-dot"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}

              {/* Auto-cycle dots */}
              <div className="mt-auto flex gap-1.5 px-2 pt-4">
                {[0,1,2].map(i => (
                  <button key={i} onClick={() => setActiveTab(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTab ? "bg-primary w-4" : "bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top stat bar — always visible */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-b border-gray-100">
                {t.dashboard.stats.map((stat, i) => (
                  <div key={i} className={`p-5 flex flex-col justify-center ${i < 3 ? "border-r border-gray-100" : ""}`}>
                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 p-6 lg:p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >

                    {/* ── OVERVIEW ── */}
                    {activeTab === 0 && (
                      <div className="grid lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                          {/* Bar chart */}
                          <div className="border border-gray-100 p-5 bg-gray-50">
                            <h4 className="text-gray-800 font-bold text-sm mb-4">{t.dashboard.weeklySummary}</h4>
                            <div className="flex items-end justify-between h-28 border-b border-gray-200 pb-2 px-1 mb-2">
                              {DB_BARS.map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1 mx-0.5 group">
                                  <motion.div
                                    className={`w-full rounded-sm transition-colors ${i === 5 ? "bg-primary" : "bg-primary/20 group-hover:bg-primary/50"}`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
                                  />
                                  <span className="text-[9px] text-gray-400 font-bold">{DB_DAYS[i]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Recent calls */}
                          <div className="border border-gray-100 p-5 bg-gray-50 flex-1">
                            <h4 className="text-gray-800 font-bold text-sm mb-3">{t.dashboard.recentCalls}</h4>
                            {t.dashboard.calls.map((call, i) => (
                              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                  </div>
                                  <div>
                                    <div className="text-gray-900 font-medium text-sm">{call.name}</div>
                                    <div className="text-gray-400 text-xs">{call.time}</div>
                                  </div>
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${call.color}`}>{call.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Today's appts */}
                        <div className="border border-gray-100 p-5 bg-gray-50">
                          <h4 className="text-gray-800 font-bold text-sm mb-3">{t.dashboard.todayAppts}</h4>
                          <div className="flex flex-col gap-2">
                            {t.dashboard.apts.map((apt, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100">
                                <span className="text-primary font-mono text-sm font-bold shrink-0">{apt.time}</span>
                                <span className="text-gray-800 text-sm font-medium">{apt.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── CALLS ── */}
                    {activeTab === 1 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-gray-800 font-bold text-sm">All Calls — Today</h4>
                          <span className="text-xs text-gray-400 font-medium">6 total</span>
                        </div>
                        <div className="border border-gray-100 bg-gray-50 divide-y divide-gray-100">
                          {[...t.dashboard.calls, ...DB_EXTRA_CALLS].map((call, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-white transition-colors">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-gray-900 font-medium text-sm truncate">{call.name}</div>
                                <div className="text-gray-400 text-xs">{call.time}{("dur" in call) ? ` · ${(call as {dur:string}).dur}` : ""}</div>
                              </div>
                              <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${call.color}`}>{call.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── APPOINTMENTS ── */}
                    {activeTab === 2 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-gray-800 font-bold text-sm">{t.dashboard.todayAppts}</h4>
                          <span className="text-xs text-primary font-bold">6 scheduled</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[...DB_EXTRA_APTS, ...t.dashboard.apts.map(a => ({ time: a.time, title: a.title, type: "" }))].map((apt, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-white transition-all"
                            >
                              <div className="text-primary font-mono text-base font-bold shrink-0 min-w-[48px]">{apt.time}</div>
                              <div>
                                <div className="text-gray-900 text-sm font-semibold">{apt.title}</div>
                                {"type" in apt && apt.type && <div className="text-gray-400 text-xs">{apt.type}</div>}
                              </div>
                              <div className="ml-auto w-2 h-2 rounded-full bg-green-400 shrink-0" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom tab switcher */}
              <div className="flex border-t border-gray-100">
                {["Overview","Calls","Appointments"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(i)}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                      i === activeTab
                        ? "text-primary border-t-2 border-primary -mt-px bg-primary/5"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// --- How It Works ---
const HowItWorks = () => {
  const { t } = useLanguage();
  const steps = t.howItWorks.steps;

  return (
    <section id="nasil-calisir" className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <FadeInWhenVisible className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-4 rounded-none">
            {t.howItWorks.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{t.howItWorks.heading}</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{t.howItWorks.sub}</p>
        </FadeInWhenVisible>

        {/* Desktop: horizontal 5-column; Mobile: vertical timeline */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6 relative">
          <div className="absolute top-6 left-[5%] right-[5%] h-px border-t border-dashed border-gray-300 z-0" />
          {steps.map((step, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.1} className="relative z-10 text-center">
              <div className="w-12 h-12 mx-auto bg-white border-2 border-primary text-primary flex items-center justify-center font-bold text-xl mb-6 shadow-md rounded-none">
                {i + 1}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </FadeInWhenVisible>
          ))}
        </div>
        {/* Mobile/tablet: vertical timeline */}
        <div className="lg:hidden space-y-0">
          {steps.map((step, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.08} className="relative flex gap-5 pb-8 last:pb-0">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 bg-white border-2 border-primary text-primary flex items-center justify-center font-bold text-base shadow-sm rounded-none z-10 relative">
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-dashed mt-1" style={{ borderLeft: "2px dashed #e2e8f0" }} />}
              </div>
              <div className="pt-1 pb-2">
                <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonials ---
const AVATAR_COLORS = ["#00357a","#4f8ef7","#059669","#7c3aed","#dc2626","#d97706","#0891b2","#be185d"];

const EXTRA_TESTIMONIALS = [
  { quote: "Response times dropped dramatically. Our leads are handled faster than ever before.", author: "Thomas R.", role: "CEO, TechSolutions GmbH", metric: "8× faster response" },
  { quote: "We went live in 2 days. The AI now handles 70% of our inbound calls automatically.", author: "Priya N.", role: "Operations Manager", metric: "70% automated" },
  { quote: "Customer satisfaction went from 3.8 to 4.7 stars after deploying B2BVoice.", author: "Carlos M.", role: "Luxe Real Estate Owner", metric: "+0.9 satisfaction" },
  { quote: "After-hours calls were our biggest pain point. Now they're fully handled, zero staff needed.", author: "Lisa K.", role: "Aesthetic Center Director", metric: "100% coverage" },
];

function getInitials(name: string) {
  return name.replace(/Dr\.?\s*/i, "").split(" ").slice(0,2).map((w: string) => w[0] ?? "").join("").toUpperCase();
}

const TCard = ({ item, colorIdx }: { item: { quote: string; author: string; role: string; metric: string }; colorIdx: number }) => {
  const color = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 28px 56px rgba(0,53,122,0.14)" }}
      transition={{ duration: 0.22 }}
      className="flex-shrink-0 w-[320px] bg-white border border-gray-200 p-6 mx-3 relative overflow-hidden cursor-default"
    >
      <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="flex gap-0.5 mb-4">
        {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-5" style={{ minHeight: 72 }}>"{item.quote}"</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: color }}>
            {getInitials(item.author)}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 text-sm leading-tight truncate">{item.author}</div>
            <div className="text-xs text-gray-400 leading-tight truncate">{item.role}</div>
          </div>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-1 whitespace-nowrap flex-shrink-0">
          {item.metric}
        </span>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const { t: tl } = useLanguage();
  const base = tl.testimonials.items;
  const all = [...base, ...EXTRA_TESTIMONIALS];
  const row1 = [...all, ...all];
  const row2 = [...[...all].reverse(), ...[...all].reverse()];

  return (
    <section className="py-14 md:py-20 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-6">
        <FadeInWhenVisible className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-4 rounded-none">
            {tl.testimonials.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{tl.testimonials.heading}</h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto text-base">Real results from businesses using B2BVoice every day.</p>
        </FadeInWhenVisible>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #f9fafb, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #f9fafb, transparent)" }} />

        {/* Row 1 — scrolling left */}
        <div className="flex mb-4 animate-marquee" style={{ width: "max-content", animationDuration: "34s" }}>
          {row1.map((item, i) => <TCard key={i} item={item} colorIdx={i} />)}
        </div>

        {/* Row 2 — scrolling right */}
        <div className="flex" style={{ width: "max-content", animation: "marquee-left 40s linear infinite reverse" }}>
          {row2.map((item, i) => <TCard key={i} item={item} colorIdx={i + 3} />)}
        </div>
      </div>
    </section>
  );
};

// --- Pricing / Demo CTA ---
const PricingCTASection = () => {
  const { open } = useDemoModal();
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden border-b border-gray-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,53,122,0.05),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <FadeInWhenVisible>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{t.pricing.heading}</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t.pricing.sub}
          </p>
          
          <button onClick={open} className="px-10 py-5 bg-primary text-white font-bold text-lg hover:bg-primary/90 hover:shadow-lg transition-all mb-8 rounded-none">
            {t.pricing.cta}
          </button>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-gray-500">
            {t.pricing.features.map((f, i) => (
              <span key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {f}</span>
            ))}
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// --- Setup Process Section ---
const SetupProcessSection = () => {
  const { t } = useLanguage();
  const setup = t.faq.setup;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-14 md:py-20 bg-[#00357a] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.04] translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,102,255,0.12),transparent)]" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <FadeInWhenVisible className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest mb-5">
            Setup Process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            {setup.heading}
          </h2>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            {setup.sub}
          </p>
        </FadeInWhenVisible>

        {/* Sub-heading between description and cards */}
        <FadeInWhenVisible delay={0.15} className="text-center mb-10 -mt-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 bg-white/[0.06] backdrop-blur-sm">
            <div className="w-1 h-6 bg-gradient-to-b from-white/60 to-white/20 flex-shrink-0" />
            <span className="text-white/90 text-sm sm:text-base font-semibold tracking-wide leading-snug">
              Before We Build Your Agent, We Learn Your Business First
            </span>
            <div className="w-1 h-6 bg-gradient-to-b from-white/60 to-white/20 flex-shrink-0" />
          </div>
        </FadeInWhenVisible>

        {/* Analysis points grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-12">
          {setup.points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
              className="relative bg-white/[0.07] border border-white/10 p-4 group hover:bg-white/[0.11] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all">
                  <span className="text-white/60 text-[10px] font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="text-white/80 text-sm leading-snug group-hover:text-white transition-colors">{point}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Duration card */}
        <FadeInWhenVisible delay={0.5}>
          <div className="mx-auto max-w-3xl border border-white/20 bg-white/[0.06] p-6 flex gap-5 items-start">
            <div className="shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white/70" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{setup.duration}</p>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// --- FAQ ---
const FAQSection = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = t.faq.items;

  return (
    <section id="sss" className="py-14 md:py-20 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-6 max-w-3xl">
        <FadeInWhenVisible className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-4 rounded-none">
            {t.faq.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{t.faq.heading}</h2>
        </FadeInWhenVisible>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4 text-sm leading-snug">{faq.q}</span>
                {open === i
                  ? <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                  : <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Final CTA ---
const FinalCTA = () => {
  const { open } = useDemoModal();
  const { t } = useLanguage();
  return (
    <section id="demo" className="py-14 md:py-20 relative overflow-hidden bg-white border-b border-gray-200">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] hero-blob-1" />
      </div>

      <div className="container mx-auto px-5 relative z-10 text-center max-w-3xl">
        <FadeInWhenVisible>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            {t.finalCta.heading}<br/>
            <span className="text-primary">{t.finalCta.span}</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.finalCta.desc}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Custom Build For You", "Setup in 24 Hours"].map((f) => (
              <span key={f} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <button
              onClick={open}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 hover:shadow-lg transition-all rounded-none uppercase tracking-wide"
            >
              REQUEST A FREE CUSTOM DEMO →
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-1.5"
          >
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
              Prefer email? Reach us at:
            </p>
            <motion.a
              href="mailto:hello@b2b-voice.com"
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 group"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary"
              >
                <Mail className="w-4 h-4" />
              </motion.div>
              <span className="text-xl font-black text-primary group-hover:underline underline-offset-2">
                hello@b2b-voice.com
              </span>
            </motion.a>
          </motion.div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// --- FinalCTA2 (before Footer) ---
const FinalCTA2 = () => {
  const { open } = useDemoModal();
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 relative overflow-hidden bg-white border-b border-gray-200">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] hero-blob-1" />
      </div>
      <div className="container mx-auto px-5 relative z-10 text-center max-w-3xl">
        <FadeInWhenVisible>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            {t.finalCta2.heading}<br/>
            <span className="text-primary">{t.finalCta2.span}</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.finalCta2.desc}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Custom Build For You", "Setup in 24 Hours"].map((f) => (
              <span key={f} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <button
              onClick={open}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 hover:shadow-lg transition-all rounded-none uppercase tracking-wide"
            >
              REQUEST A FREE CUSTOM DEMO →
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-1.5"
          >
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
              Prefer email? Reach us at:
            </p>
            <motion.a
              href="mailto:hello@b2b-voice.com"
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 group"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary"
              >
                <Mail className="w-4 h-4" />
              </motion.div>
              <span className="text-xl font-black text-primary group-hover:underline underline-offset-2">
                hello@b2b-voice.com
              </span>
            </motion.a>
          </motion.div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => {
  const { t, lang } = useLanguage();
  const links = [
    { label: lang === "de" ? "Datenschutz" : lang === "es" ? "Privacidad" : "Privacy Policy", href: "/privacy-policy" },
    { label: lang === "de" ? "Cookie-Richtlinie" : lang === "es" ? "Política de Cookies" : "Cookie Policy", href: "/cookie-policy" },
    { label: lang === "de" ? "Nutzungsbedingungen" : lang === "es" ? "Términos de Uso" : "Terms of Service", href: "/terms-of-service" },
    { label: lang === "de" ? "Impressum" : lang === "es" ? "Aviso Legal" : "Legal Notice", href: "/legal-notice" },
    { label: "Blog", href: "/blog" },
  ];
  return (
    <footer className="footer-light-bg mx-2 md:mx-4 rounded-t-[28px] border-t border-blue-100 overflow-hidden">
      <style>{`
        @keyframes footerLightShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes footerMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .footer-light-bg {
          background: linear-gradient(135deg, #e8f0fe 0%, #dbeafe 30%, #eff6ff 60%, #e0ecff 100%);
          background-size: 300% 300%;
          animation: footerLightShift 8s ease infinite;
        }
        .footer-marquee-track {
          animation: footerMarquee 28s linear infinite;
          width: max-content;
        }
      `}</style>
      {/* Reference-style ticker */}
      <div className="border-y border-primary/15 bg-white/35 py-3.5" aria-label="B2BVoice website">
        <div className="footer-marquee-track flex items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={`${copy}-${index}`} className="flex items-center">
                  <span className="px-7 text-sm md:text-base font-black tracking-[0.2em] text-primary/75">
                    B2BVOICE.COM
                  </span>
                  <span className="text-primary/35" aria-hidden="true">—</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl border-t border-primary/15 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr_1fr] gap-10 md:gap-16">
          {/* Logo — left aligned like the reference; the area below intentionally stays empty. */}
          <div className="flex flex-col items-start">
            {lang === "de" ? (
              <img src="/logo-de-footer.webp" alt="B2BVoice" className="h-12 md:h-14 w-auto object-contain" loading="lazy" />
            ) : (
              <div className="h-10 md:h-12 w-[190px] md:w-[220px] overflow-hidden" aria-label="B2BVoice">
                <img
                  src="/logo-clean.webp"
                  alt="B2BVoice"
                  className="block w-full h-auto"
                  style={{ marginTop: "-44%" }}
                  loading="lazy"
                />
              </div>
            )}
            <div className="h-14 md:h-20" aria-hidden="true" />
          </div>

          {/* Legal links */}
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.28em] text-primary/60">Legal</p>
            <nav className="flex flex-col items-start gap-3 text-sm text-slate-600" aria-label="Legal">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-primary hover:translate-x-1 transition-all">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact links */}
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.28em] text-primary/60">Contact</p>
            <div className="flex flex-col items-start gap-4 text-sm">
              <a href="mailto:hello@b2b-voice.com" className="inline-flex items-center gap-3 text-slate-700 hover:text-primary transition-colors">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <span>hello@b2b-voice.com</span>
              </a>
              <a
                href="https://www.instagram.com/b2bvoice"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-slate-700 hover:text-primary transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Instagram className="h-4 w-4" />
                </span>
                <span>@b2bvoice</span>
              </a>
              <a href="tel:+19297305505" className="inline-flex items-center gap-3 text-slate-700 hover:text-primary transition-colors">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PhoneCall className="h-4 w-4" />
                </span>
                <span>+1 929 730 5505</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/15 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} B2BVoice. {t.footer.allRights}</p>
          <span className="font-semibold tracking-[0.16em] text-primary/50">B2BVOICE.COM</span>
        </div>
      </div>
    </footer>
  );
};


// ============================================================
// --- Powerful Features Section ---
// ============================================================

// Viz 1: Orbiting Nodes (Card 1 — Custom AI)
const OrbitViz = ({ labels }: { labels: string[] }) => {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const tRef = useRef(0);

  useAnimationFrame((_, delta) => {
    tRef.current += delta * 0.00003;
    nodeRefs.current.forEach((node, i) => {
      if (!node) return;
      const a = tRef.current + (i * Math.PI * 2) / 6;
      const x = 50 + 40 * Math.cos(a);
      const y = 50 + 28 * Math.sin(a);
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
    });
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const a = tRef.current + (i * Math.PI * 2) / 6;
      const x = 50 + 40 * Math.cos(a);
      const y = 50 + 28 * Math.sin(a);
      line.setAttribute("x2", `${x}%`);
      line.setAttribute("y2", `${y}%`);
    });
  });

  return (
    <div className="relative w-full select-none" style={{ height: 200 }}>
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
        <ellipse cx="50%" cy="50%" rx="40%" ry="28%" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="6 6" />
        {labels.map((_, i) => (
          <line
            key={i}
            ref={el => { lineRefs.current[i] = el; }}
            x1="50%" y1="50%"
            x2="50%" y2="50%"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.8"
          />
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative w-14 h-14 bg-white/10 border border-white/30 rounded-full flex items-center justify-center">
          <Mic className="w-6 h-6 text-white" />
          <motion.div
            className="absolute inset-0 rounded-full bg-white/10"
            animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
      {labels.map((label, i) => (
        <div
          key={i}
          ref={el => { nodeRefs.current[i] = el; }}
          className="absolute px-2 py-0.5 bg-white/10 border border-white/20 text-[9px] font-bold text-white whitespace-nowrap z-10 backdrop-blur-sm"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {label}
        </div>
      ))}
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 h-8 opacity-40">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/60 rounded-full"
            animate={{ height: ["4px", `${8 + Math.sin(i) * 10}px`, "4px"] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
};

// Viz 2: Demo Call Preview (Card 2)
const DemoCallViz = ({ callLabel, connected, demoReady }: { callLabel: string; connected: string; demoReady: string }) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef(0);
  const heights = [0.3, 0.5, 0.8, 1, 0.7, 0.4, 0.9, 0.6, 0.5, 0.3, 0.8, 0.4];

  useAnimationFrame((_, delta) => {
    phaseRef.current += delta * 0.003;
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const h = heights[i] * (0.5 + 0.5 * Math.sin(phaseRef.current + i * 0.7));
      bar.style.height = `${Math.max(3, h * 36)}px`;
    });
  });

  return (
    <div className="w-full max-w-[200px] mx-auto bg-white border border-gray-200 shadow-lg p-4 select-none rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <PhoneCall className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-gray-900">{callLabel}</div>
          <div className="flex items-center gap-1 text-[9px] text-green-600">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {connected}
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer">
            <Play className="w-3 h-3 text-white ml-0.5" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </div>
      <div className="flex items-center gap-0.5 h-9 mb-3">
        {heights.map((_, i) => (
          <div
            key={i}
            ref={el => { barsRef.current[i] = el; }}
            className="flex-1 bg-primary/40 rounded-full"
            style={{ height: 3 }}
          />
        ))}
      </div>
      <motion.div
        className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 text-green-700 text-[9px] font-bold rounded-full"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CheckCircle2 className="w-3 h-3" />
        {demoReady}
      </motion.div>
    </div>
  );
};

// Viz 3: Lead Flow (Card 3)
const LeadFlowViz = ({ incomingCall, leadCaptured }: { incomingCall: string; leadCaptured: string }) => (
  <div className="w-full flex items-center justify-between gap-1 select-none px-1">
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <motion.div
        className="w-10 h-10 bg-orange-100 border border-orange-200 rounded-full flex items-center justify-center"
        animate={{ rotate: [0, -6, 6, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
      >
        <PhoneCall className="w-4 h-4 text-orange-600" />
      </motion.div>
      <span className="text-[9px] text-gray-400 font-medium text-center leading-tight" style={{ whiteSpace: "pre-line" }}>{incomingCall}</span>
    </div>

    <div className="flex-1 relative h-px mx-1" style={{ background: "rgba(0,53,122,0.15)" }}>
      <motion.div
        className="absolute w-2 h-2 bg-primary rounded-full"
        style={{ top: "50%", translateY: "-50%", translateX: "-50%" }}
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
      />
    </div>

    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <motion.div
        className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md"
        animate={{ boxShadow: ["0 0 0 0 rgba(0,53,122,0.3)", "0 0 0 10px rgba(0,53,122,0)", "0 0 0 0 rgba(0,53,122,0)"] }}
        transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <Mic className="w-4 h-4 text-white" />
      </motion.div>
      <span className="text-[9px] text-primary font-bold text-center">B2BVoice</span>
    </div>

    <div className="flex-1 relative h-px mx-1" style={{ background: "rgba(16,185,129,0.25)" }}>
      <motion.div
        className="absolute w-2 h-2 bg-green-500 rounded-full"
        style={{ top: "50%", translateY: "-50%", translateX: "-50%" }}
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear", delay: 1.1, repeatDelay: 0.5 }}
      />
    </div>

    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <motion.div
        className="w-10 h-10 bg-green-100 border border-green-200 rounded-full flex items-center justify-center"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2.2, delay: 2.2 }}
      >
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      </motion.div>
      <span className="text-[9px] text-gray-400 font-medium text-center leading-tight" style={{ whiteSpace: "pre-line" }}>{leadCaptured}</span>
    </div>
  </div>
);

// Viz 4: Calendar auto-fill (Card 4)
const CalendarViz = () => {
  const slots = ["09:00", "10:30", "11:00", "14:00", "15:30", "16:00"];
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFilled(f => (f >= slots.length ? 0 : f + 1)), 650);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-[190px] mx-auto select-none">
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Calendar className="w-3 h-3" /> Today's Schedule
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            className="px-2 border text-[9px] font-semibold flex flex-col justify-center"
            style={{ height: 36 }}
            animate={{
              backgroundColor: i < filled ? "rgba(0,53,122,0.08)" : "rgba(249,250,251,1)",
              borderColor: i < filled ? "rgba(0,53,122,0.25)" : "rgba(243,244,246,1)",
              color: i < filled ? "#00357a" : "#d1d5db",
              scale: i === filled - 1 ? [1, 1.06, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div>{slot}</div>
            <div
              className="text-[8px] mt-0.5 text-primary/60"
              style={{ opacity: i < filled ? 1 : 0, transition: "opacity 0.3s" }}
            >
              Booked ✓
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Viz 5: Data Flow to integrations (Card 5) — redesigned
const DataFlowViz = () => {
  const targets = [
    { label: "Gmail",  color: "#EA4335", bg: "#FEF2F2", Icon: Mail },
    { label: "CRM",    color: "#00357a", bg: "#EFF6FF", Icon: Database },
    { label: "Sheets", color: "#0F9D58", bg: "#F0FDF4", Icon: BarChart3 },
  ];

  return (
    <div className="w-full select-none px-2 py-1">
      {/* Top row: 3 equal destination cards */}
      <div className="flex gap-2 mb-3">
        {targets.map((t, i) => (
          <motion.div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border"
            style={{ background: t.bg, borderColor: `${t.color}30` }}
            animate={{ boxShadow: [`0 0 0 0 ${t.color}00`, `0 0 0 6px ${t.color}18`, `0 0 0 0 ${t.color}00`] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${t.color}18` }}>
              <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
            </div>
            <span className="text-[9px] font-bold tracking-wide" style={{ color: t.color }}>{t.label}</span>
          </motion.div>
        ))}
      </div>

      {/* SVG connector lines with animated packets — dots flow FROM B2BVoice hub OUT to targets */}
      <svg viewBox="0 0 300 48" className="w-full" style={{ height: 48 }}>
        <defs>
          {[50, 150, 250].map((x, i) => (
            <path key={i} id={`dfpath-${i}`} d={`M 150 48 L ${x} 0`} fill="none" />
          ))}
        </defs>
        {targets.map((t, i) => {
          const x = [50, 150, 250][i];
          return (
            <g key={i}>
              <line
                x1={x} y1={0} x2={150} y2={48}
                stroke={`${t.color}35`} strokeWidth="1.5"
                strokeDasharray="4 5"
              />
              <circle r={3.5} fill={t.color} style={{ filter: `drop-shadow(0 0 4px ${t.color})` }}>
                <animateMotion dur="1.5s" repeatCount="indefinite" begin={`${i * 0.5}s`}>
                  <mpath href={`#dfpath-${i}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Central hub */}
      <div className="flex flex-col items-center mt-1">
        <div className="relative">
          {[0, 0.6].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: "1.5px solid rgba(0,53,122,0.25)" }}
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
            />
          ))}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
            style={{ background: "linear-gradient(135deg,#00357a,#0066ff)", boxShadow: "0 4px 20px rgba(0,53,122,0.35)" }}
          >
            <Mic className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="mt-1.5 text-center">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-800">B2BVoice</p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] text-green-600 font-semibold">Syncing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Section
const PowerfulFeaturesSection = () => {
  const { t } = useLanguage();
  return (
  <section className="py-14 md:py-20 bg-white border-b border-gray-200 relative overflow-hidden">
    <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-50/60 to-transparent pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">

      <FadeInWhenVisible className="max-w-4xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-6 rounded-none">
          {t.powerful.badge}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
          {t.powerful.heading1}
          <br />
          <span className="text-primary">{t.powerful.heading2}</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
          {t.powerful.sub}
        </p>
      </FadeInWhenVisible>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Card 1: Large — Orbiting Nodes */}
        <FadeInWhenVisible delay={0.1} className="lg:col-span-2">
          <div className="bg-primary text-white p-8 h-full relative overflow-hidden rounded-none min-h-[300px] flex flex-col md:flex-row gap-8 items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80 mb-4">
                {t.powerful.card1.badge}
              </div>
              <h3 className="text-2xl font-bold mb-3 leading-snug">
                {t.powerful.card1.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {t.powerful.card1.desc}
              </p>
            </div>
            <div className="w-full md:w-72 flex-shrink-0 relative z-10">
              <OrbitViz labels={t.powerful.orbitLabels} />
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Card 2: Demo Call */}
        <FadeInWhenVisible delay={0.15}>
          <div className="bg-white border border-gray-200 p-6 h-full flex flex-col rounded-none hover:border-primary/30 hover:shadow-lg transition-all min-h-[300px] group">
            <a
              href={`tel:${CUSTOM_DEMO_PHONE_TEL}`}
              aria-label={t.powerful.card2.title}
              className="flex-1 rounded-sm outline-none transition-colors hover:bg-primary/[0.03] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card2.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {t.powerful.card2.desc}
              </p>
            </a>
            <DemoCallViz callLabel={t.powerful.callLabel} connected={t.powerful.connected} demoReady={t.powerful.demoReady} />
          </div>
        </FadeInWhenVisible>

        {/* Card 3: Lead Flow */}
        <FadeInWhenVisible delay={0.2}>
          <div className="bg-white border border-gray-200 p-6 h-full flex flex-col rounded-none hover:border-primary/30 hover:shadow-lg transition-all group">
            <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card3.title}</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed flex-1">
              {t.powerful.card3.desc}
            </p>
            <LeadFlowViz incomingCall={t.powerful.incomingCall} leadCaptured={t.powerful.leadCaptured} />
          </div>
        </FadeInWhenVisible>

        {/* Card 4: Calendar */}
        <FadeInWhenVisible delay={0.25}>
          <div className="bg-white border border-gray-200 p-6 h-full flex flex-col rounded-none hover:border-primary/30 hover:shadow-lg transition-all group">
            <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card4.title}</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed flex-1">
              {t.powerful.card4.desc}
            </p>
            <CalendarViz />
          </div>
        </FadeInWhenVisible>

        {/* Card 5: Data Flow */}
        <FadeInWhenVisible delay={0.3}>
          <div className="bg-white border border-gray-200 p-6 h-full flex flex-col rounded-none hover:border-primary/30 hover:shadow-lg transition-all group">
            <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card5.title}</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed flex-1">
              {t.powerful.card5.desc}
            </p>
            <DataFlowViz />
          </div>
        </FadeInWhenVisible>

        {/* Card 6: Call Summaries */}
        <FadeInWhenVisible delay={0.2} className="hidden sm:block">
          <div className="bg-gray-50 border border-gray-100 p-6 h-full flex flex-col rounded-none hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-5 rounded-none">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card6.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t.powerful.card6.desc}
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Card 7: Industry-Specific */}
        <FadeInWhenVisible delay={0.25} className="hidden sm:block">
          <div className="bg-gray-50 border border-gray-100 p-6 h-full flex flex-col rounded-none hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-5 rounded-none">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card7.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t.powerful.card7.desc}
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Card 8: Smart Follow-Up */}
        <FadeInWhenVisible delay={0.3} className="hidden sm:block">
          <div className="bg-gray-50 border border-gray-100 p-6 h-full flex flex-col rounded-none hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-5 rounded-none">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{t.powerful.card8.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t.powerful.card8.desc}
            </p>
          </div>
        </FadeInWhenVisible>

      </div>
    </div>
  </section>
  );
};

// --- Demo Section ---
type DemoCard = {
  id: number;
  name: string;
  role: string;
  desc: string;
  industry: string;
  color: string;
  initials: string;
  audioSrc?: string;
  imageSrc?: string;
};

const DemoPremiumCard = ({
  card,
  index,
  activeId,
  setActiveId,
}: {
  card: DemoCard;
  index: number;
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef(index * 1.7);

  const isPlaying = card.id === activeId;

  const waveHeights = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) =>
        0.25 + 0.75 * Math.abs(Math.sin((i + index * 5) * 0.65))
      ),
    [index]
  );

  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useAnimationFrame((_, delta) => {
    if (!isPlaying) return;
    phaseRef.current += delta * 0.0045;
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const h =
        waveHeights[i] *
        (0.3 + 0.7 * Math.abs(Math.sin(phaseRef.current + i * 0.52)));
      bar.style.height = `${Math.max(2, h * 30)}px`;
      bar.style.opacity = `${0.5 + 0.5 * h}`;
    });
  });

  const toggle = () => {
    if (isPlaying) {
      setActiveId(null);
    } else {
      setActiveId(card.id);
      if (card.audioSrc) {
        if (!audioRef.current) audioRef.current = new Audio(card.audioSrc);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        audioRef.current.onended = () => setActiveId(null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      onClick={toggle}
      className={`relative p-5 border cursor-pointer transition-all duration-300 select-none group ${
        isPlaying
          ? "border-white/25 bg-white/[0.09]"
          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15"
      }`}
      style={
        isPlaying
          ? { boxShadow: `0 0 45px ${card.color}25, inset 0 0 0 1px ${card.color}20` }
          : {}
      }
    >
      {isPlaying && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 80% at 15% 50%, ${card.color}12, transparent 70%)`,
          }}
        />
      )}

      <div className="flex items-start gap-4 relative z-10">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-[68px] h-[68px] rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: card.color }}
          >
            {card.imageSrc ? (
              <img
                src={card.imageSrc}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              card.initials
            )}
          </div>
          {isPlaying && (
            <>
              <motion.div
                className="absolute rounded-full border-2 pointer-events-none"
                style={{ inset: -4, borderColor: card.color }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.9, 0, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute rounded-full border pointer-events-none"
                style={{ inset: -10, borderColor: `${card.color}50` }}
                animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
              />
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="font-bold text-white text-[15px] leading-tight">
                {card.name}
              </div>
              <div className="text-[12.5px] mt-0.5 leading-snug">
                <span className="font-semibold" style={{ color: card.color }}>
                  {card.role}
                </span>
                <span className="text-white/30"> — </span>
                <span className="text-white/45">{card.desc}</span>
              </div>
            </div>
            <span
              className="flex-shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-[3px] mt-0.5 whitespace-nowrap"
              style={{
                background: `${card.color}18`,
                color: card.color,
                border: `1px solid ${card.color}30`,
              }}
            >
              {card.industry}
            </span>
          </div>

          {/* Waveform */}
          <div className="flex items-center gap-[2px] h-8 mt-3">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                ref={(el) => { barsRef.current[i] = el; }}
                className="flex-1 rounded-full"
                style={{
                  height: isPlaying ? `${Math.max(2, h * 18)}px` : `${Math.max(2, h * 7)}px`,
                  background: isPlaying ? card.color : "rgba(255,255,255,0.18)",
                  transition: isPlaying ? "none" : "height 0.4s ease, background 0.4s ease",
                  opacity: isPlaying ? 1 : 0.55,
                }}
              />
            ))}
          </div>
        </div>

        {/* Play / Pause */}
        <div className="relative flex-shrink-0 mt-1">
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: `${card.color}35` }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
          )}
          <button
            className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
            style={
              isPlaying
                ? { background: card.color, color: "#fff" }
                : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }
            }
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AgentCard = ({
  agent,
  index,
  playingId,
  setPlayingId,
}: {
  agent: AgentInfo;
  index: number;
  playingId: number | null;
  setPlayingId: (id: number | null) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phaseRef = useRef(index * 1.3);
  const isPlaying = agent.id === playingId;

  const trait = agent.role.split("—")[1]?.trim() ?? agent.role;

  const waveHeights = useMemo(
    () => Array.from({ length: 14 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin((i + index * 4) * 0.75))),
    [index]
  );

  // Lazy: destroy audio when agent changes (language switch), create on first play
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [agent.audio]);

  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  useAnimationFrame((_, delta) => {
    if (!isPlaying) return;
    phaseRef.current += delta * 0.004;
    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const h = waveHeights[i] * (0.3 + 0.7 * Math.abs(Math.sin(phaseRef.current + i * 0.6)));
      bar.style.height = `${Math.max(2, h * 18)}px`;
    });
  });

  const toggle = () => {
    if (isPlaying) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      setPlayingId(null);
    } else {
      // Create audio on first click (lazy) — avoids loading all 12 on mount
      if (!audioRef.current) {
        const audio = new Audio(agent.audio);
        audio.preload = "auto";
        audio.onended = () => setPlayingId(null);
        audioRef.current = audio;
      }
      audioRef.current.currentTime = 0;
      setPlayingId(agent.id);
      audioRef.current.play().catch(() => setPlayingId(null));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: (index % 8) * 0.035 }}
      onClick={toggle}
      className={`group flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-full cursor-pointer select-none transition-all duration-200 ${
        isPlaying
          ? "bg-white/[0.11] border border-[#4f8ef7]/50"
          : "bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.08] hover:border-white/20"
      }`}
      style={isPlaying ? { boxShadow: "0 0 22px rgba(79,142,247,0.18)" } : {}}
    >
      {/* Circular avatar */}
      <div className="relative shrink-0">
        <div
          className="w-11 h-11 rounded-full overflow-hidden"
          style={
            isPlaying
              ? { boxShadow: "0 0 0 2px #4f8ef7" }
              : { boxShadow: "0 0 0 1.5px rgba(255,255,255,0.12)" }
          }
        >
          <img
            src={agent.photo}
            alt={agent.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              const p = el.parentElement;
              if (p) { p.style.background = "#1e2d50"; }
            }}
          />
        </div>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid #4f8ef7" }}
            animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>

      {/* Name + trait / waveform */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-[13px] leading-none truncate">{agent.name}</p>
        {isPlaying ? (
          <div className="flex items-end gap-[2.5px] h-3.5 mt-1">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                ref={(el) => { barsRef.current[i] = el; }}
                className="w-[2.5px] rounded-full"
                style={{ height: `${Math.max(2, h * 8)}px`, background: "#4f8ef7", opacity: 0.8 }}
              />
            ))}
          </div>
        ) : (
          <p className="text-white/38 text-[11px] mt-0.5 truncate leading-none">{trait}</p>
        )}
      </div>

      {/* Play / Pause button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
          isPlaying
            ? "bg-[#4f8ef7] text-white"
            : "bg-white/10 text-white/45 group-hover:bg-white/20 group-hover:text-white"
        }`}
      >
        {isPlaying
          ? <Pause className="w-3 h-3" />
          : <Play className="w-3 h-3 ml-[1px]" />
        }
      </button>
    </motion.div>
  );
};

const DEMO_LANG_OPTIONS = [
  { code: "en" as Lang, Flag: US, label: "EN" },
  { code: "de" as Lang, Flag: DE, label: "DE" },
  { code: "es" as Lang, Flag: ES, label: "ES" },
];

const DemoSection = () => {
  const { t, lang } = useLanguage();
  const { open } = useDemoModal();

  // Local lang: only changes agents/audio in this section, not the page
  const [demoLang, setDemoLang] = useState<Lang>(lang);
  const agents = AGENTS[demoLang];
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Sync demoLang when global lang changes
  useEffect(() => { setDemoLang(lang); }, [lang]);

  // Reset playing when demoLang changes
  useEffect(() => { setPlayingId(null); }, [demoLang]);

  const handleDemoLang = (l: Lang) => {
    setDemoLang(l);
  };

  return (
    <section id="demo" className="py-14 md:py-20 relative overflow-hidden" style={{ background: "#060d1f" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(0,53,122,0.28), transparent), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(0,53,122,0.12), transparent)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header row: centered on mobile, space-between on desktop */}
        <FadeInWhenVisible className="mb-10">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/50 mb-6 rounded-none">
                {t.demo.badge}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                {t.demo.heading}{" "}
                <span style={{ color: "#4f8ef7" }}>{t.demo.span}</span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed">
                {t.demo.sub}
              </p>
            </div>

            {/* Local language switcher — changes only agents/audio */}
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0 md:pt-1">
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                {demoLang === "en" ? "Voice Language" : demoLang === "de" ? "Sprache der Demo" : "Idioma del Demo"}
              </p>
              <div className="flex items-center gap-1">
                {DEMO_LANG_OPTIONS.map(({ code, Flag, label }) => (
                  <button
                    key={code}
                    onClick={() => handleDemoLang(code)}
                    className={`flex items-center gap-2.5 px-5 py-3.5 text-sm font-bold uppercase tracking-wider border transition-all ${
                      demoLang === code
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                    }`}
                  >
                    <Flag className="w-6 h-auto" style={{ display: "block" }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Agent Pill Grid — profession label above each card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={demoLang}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2.5 gap-y-5 mb-16"
          >
            {agents.map((agent, i) => (
              <div key={`${demoLang}-${agent.id}`} className="flex flex-col gap-1.5">
                <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest px-1.5">{agent.industry}</div>
                <AgentCard
                  agent={agent}
                  index={i}
                  playingId={playingId}
                  setPlayingId={setPlayingId}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

// --- Scroll Progress Button ---
// --- Floating Demo Cloud Button ---

const ScrollProgressButton = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(p);
      setVisible(scrollTop > 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const size = 56;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-btn"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={scrollToTop}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="fixed bottom-7 right-7 z-50 focus:outline-none"
          aria-label="Scroll to top"
          style={{ width: size, height: size }}
        >
          {/* Glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.25 : 1.0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "radial-gradient(circle, rgba(79,142,247,0.45) 0%, transparent 70%)" }}
          />

          {/* SVG ring */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
            {/* Track */}
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={3}
            />
            {/* Progress */}
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke="url(#scrollGrad)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
            <defs>
              <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f8ef7" />
                <stop offset="100%" stopColor="#00357a" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center disc */}
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            animate={{
              background: hovered
                ? "linear-gradient(135deg, #4f8ef7, #00357a)"
                : "linear-gradient(135deg, #0d1f3c, #1a3260)",
            }}
            transition={{ duration: 0.25 }}
            style={{ margin: 6 }}
          >
            <motion.div
              animate={{ y: hovered ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

function useSeoMeta() {
  const { lang } = useLanguage();
  const [seoData, setSeoData] = useState<Record<string, { title: string; description: string; keywords: string }>>({});

  useEffect(() => {
    fetch("/api/seo").then(r => r.json()).then(setSeoData).catch(() => {});
  }, []);

  useEffect(() => {
    const entry = seoData[lang];
    if (!entry) return;
    if (entry.title) document.title = entry.title;
    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", entry.description);
    setMeta("keywords", entry.keywords);
  }, [lang, seoData]);
}

export default function Home() {
  useSeoMeta();
  return (
    <DemoModalCtx.Provider value={{ open: () => { window.location.href = "/demo"; } }}>
      <div className="min-h-screen bg-white text-gray-900 selection:bg-primary selection:text-white font-sans overflow-x-hidden">
        <Navbar />
        <Hero />
        <TrustStrip />
        {/* <FeaturesSection /> */}
        <PowerfulFeaturesSection />
        <LanguagesSection />
        <DemoSection />
        <FinalCTA />
        <IndustriesSection />
        <SolutionSection />
        <OrbitalIntegrations />
        <Testimonials />
        {/* <ProblemSection /> */}
        {/* <DashboardMockup /> */}
        <SetupProcessSection />
        <FAQSection />
        <FinalCTA2 />
        <Footer />
        <ScrollProgressButton />
      </div>
    </DemoModalCtx.Provider>
  );
}
