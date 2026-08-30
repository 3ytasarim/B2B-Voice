import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, Phone, Building2, Globe, CheckSquare,
  Video, Mic, FileText, HelpCircle, Clock, TrendingUp,
  RefreshCw, ChevronDown, ChevronUp, Search, LogOut, Search as SearchIcon,
  Tag, AlignLeft, Type, Save, CheckCircle2, Newspaper, Handshake, Star
} from "lucide-react";
import BlogPanel from "@/components/BlogPanel";
import ReferencesPanel from "@/components/ReferencesPanel";
import PartnersPanel from "@/components/PartnersPanel";

const TOKEN_KEY = "b2bvoice_admin_token";

function adminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

type Lead = {
  id: number;
  email: string;
  phone?: string | null;
  businessType?: string | null;
  businessDescription?: string | null;
  website?: string | null;
  demoNeeds?: string | null;
  demoType?: string | null;
  consentGiven?: boolean | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const DEMO_TYPE_ICONS: Record<string, React.ReactNode> = {
  "google-meet": <Video className="w-3.5 h-3.5" />,
  "demo-call": <Mic className="w-3.5 h-3.5" />,
  "voice-recording": <FileText className="w-3.5 h-3.5" />,
  "not-sure": <HelpCircle className="w-3.5 h-3.5" />,
};

const DEMO_TYPE_LABELS: Record<string, string> = {
  "google-meet": "Google Meet",
  "demo-call": "Demo Call",
  "voice-recording": "Voice Recording",
  "not-sure": "Not Sure Yet",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatusBadge({ status }: { status?: string | null }) {
  const isComplete = status === "complete";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
        isComplete
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isComplete ? "bg-emerald-500" : "bg-amber-400"}`}
      />
      {isComplete ? "Complete" : "Partial"}
    </span>
  );
}

function LeadRow({ lead, expanded, onToggle }: {
  lead: Lead;
  expanded: boolean;
  onToggle: () => void;
}) {
  const needs = lead.demoNeeds ? JSON.parse(lead.demoNeeds) as string[] : [];

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.id}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
              {lead.email[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{lead.email}</div>
              {lead.phone && (
                <div className="text-[11px] text-gray-400">{lead.phone}</div>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {lead.businessType ? (
            <span className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-sm font-medium">
              {lead.businessType}
            </span>
          ) : (
            <span className="text-xs text-gray-300">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          {lead.demoType ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
              {DEMO_TYPE_ICONS[lead.demoType]}
              {DEMO_TYPE_LABELS[lead.demoType] ?? lead.demoType}
            </span>
          ) : (
            <span className="text-xs text-gray-300">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={lead.status} />
        </td>
        <td className="px-4 py-3 text-xs text-gray-400">
          {lead.createdAt ? timeAgo(lead.createdAt) : "—"}
        </td>
        <td className="px-4 py-3 text-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={7} className="px-0 py-0 bg-gray-50 border-b border-gray-100">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Website</div>
                    <div className="text-sm text-gray-700">
                      {lead.website ? (
                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          {lead.website}
                        </a>
                      ) : "—"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Business Description</div>
                    <div className="text-sm text-gray-700 break-all">{lead.businessDescription || "—"}</div>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Demo Needs</div>
                    {needs.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {needs.map((n, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-medium border border-primary/15 max-w-full break-all">
                            {n}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Consent</div>
                    <div className="text-sm">
                      {lead.consentGiven ? (
                        <span className="text-emerald-600 font-semibold">✓ Given</span>
                      ) : (
                        <span className="text-gray-400">Not given</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Created</div>
                    <div className="text-sm text-gray-700">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

type TrackingData = { searchConsoleCode: string; analyticsId: string; adsId: string; adsConversionLabel: string };

function GooglePanel() {
  const [data, setData] = useState<TrackingData>({ searchConsoleCode: "", analyticsId: "", adsId: "", adsConversionLabel: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/tracking").then(r => r.json()).then(setData).catch(() => setLoadError(true));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await fetch("/api/tracking", { method: "PUT", headers: { "Content-Type": "application/json", ...adminAuthHeaders() }, body: JSON.stringify(data) });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const upd = (k: keyof TrackingData, v: string) => { setData(p => ({ ...p, [k]: v })); setSaved(false); };

  type Field = { key: keyof TrackingData; label: string; icon: React.ReactNode; placeholder: string; hint: string };
  const fields: Field[] = [
    {
      key: "searchConsoleCode",
      label: "Google Search Console Verification Code",
      icon: <Globe className="w-3.5 h-3.5 text-blue-500" />,
      placeholder: "e.g. abc123xyz456...",
      hint: 'Search Console → Settings → Ownership Verification → HTML tag → copy only the content="..." value',
    },
    {
      key: "analyticsId",
      label: "Google Analytics 4 Measurement ID",
      icon: <TrendingUp className="w-3.5 h-3.5 text-orange-500" />,
      placeholder: "G-XXXXXXXXXX",
      hint: "GA4 Admin → Data Streams → your stream → Measurement ID",
    },
    {
      key: "adsId",
      label: "Google Ads Conversion ID",
      icon: <Tag className="w-3.5 h-3.5 text-green-500" />,
      placeholder: "AW-XXXXXXXXXX",
      hint: "Google Ads → Tools → Conversions → Tag setup → Conversion ID",
    },
    {
      key: "adsConversionLabel",
      label: "Google Ads Conversion Label",
      icon: <Tag className="w-3.5 h-3.5 text-green-400" />,
      placeholder: "XXXXXXXXXXXXXXXXXXXX",
      hint: "Google Ads → Conversions → Tag setup → Conversion Label (optional)",
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Google Integration Settings</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Enter your Google service IDs — they'll be injected into the site automatically.</p>
        </div>

        {loadError && (
          <div className="px-5 pt-4">
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">Could not load settings — check API server.</p>
          </div>
        )}

        <div className="p-5 space-y-6">
          {fields.map(f => (
            <div key={f.key}>
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                {f.icon} {f.label}
              </label>
              <input
                type="text"
                value={data[f.key]}
                onChange={e => upd(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary/60 focus:bg-white transition-colors font-mono"
              />
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{f.hint}</p>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save All Settings"}
          </button>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </motion.span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="bg-blue-50 border border-blue-200 px-4 py-3">
          <p className="text-xs text-blue-700 font-semibold mb-1">🔍 Google Search Console</p>
          <p className="text-[11px] text-blue-600 leading-relaxed">After saving, go to Search Console → Verify. The verification meta tag is injected into every page load automatically.</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 px-4 py-3">
          <p className="text-xs text-orange-700 font-semibold mb-1">📊 Google Analytics & Ads</p>
          <p className="text-[11px] text-orange-600 leading-relaxed">gtag.js is loaded automatically when an Analytics ID or Ads ID is saved. Ads conversion tracking fires on demo form submissions.</p>
        </div>
      </div>
    </div>
  );
}

type SeoLang = "en" | "de" | "es";
type SeoEntry = { title: string; description: string; keywords: string };
type SeoData = Record<SeoLang, SeoEntry>;

const SEO_LANG_LABELS: Record<SeoLang, string> = { en: "🇬🇧 English", de: "🇩🇪 Deutsch", es: "🇪🇸 Español" };
const DEFAULT_SEO: SeoData = {
  en: { title: "", description: "", keywords: "" },
  de: { title: "", description: "", keywords: "" },
  es: { title: "", description: "", keywords: "" },
};

function SeoPanel() {
  const [data, setData] = useState<SeoData>(DEFAULT_SEO);
  const [activeLang, setActiveLang] = useState<SeoLang>("en");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/seo")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setLoadError(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...adminAuthHeaders() },
        body: JSON.stringify({ lang: activeLang, ...data[activeLang] }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof SeoEntry, value: string) => {
    setData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));
    setSaved(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-gray-200 overflow-hidden">
        {/* Lang tabs */}
        <div className="flex border-b border-gray-200">
          {(["en", "de", "es"] as SeoLang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeLang === lang
                  ? "bg-primary text-white border-b-2 border-primary"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {SEO_LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {loadError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">
              Could not load SEO settings — check API server.
            </p>
          )}

          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              <Type className="w-3 h-3" /> Page Title
            </label>
            <input
              type="text"
              value={data[activeLang].title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. B2BVoice – AI Voice Assistant for Businesses"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary/60 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1">{data[activeLang].title.length}/70 chars recommended</p>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              <AlignLeft className="w-3 h-3" /> Meta Description
            </label>
            <textarea
              rows={3}
              value={data[activeLang].description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="e.g. B2BVoice is an AI-powered voice assistant that handles calls 24/7..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary/60 focus:bg-white transition-colors resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">{data[activeLang].description.length}/160 chars recommended</p>
          </div>

          {/* Keywords */}
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              <Tag className="w-3 h-3" /> Keywords
            </label>
            <input
              type="text"
              value={data[activeLang].keywords}
              onChange={(e) => update("keywords", e.target.value)}
              placeholder="e.g. AI voice assistant, B2B automation, call handling"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary/60 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1">Comma-separated keywords</p>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saving ? "Saving..." : `Save ${SEO_LANG_LABELS[activeLang].split(" ")[1]}`}
            </button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold"
              >
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 px-4 py-3">
        <p className="text-xs text-blue-700 font-semibold mb-1">How it works</p>
        <p className="text-[11px] text-blue-600 leading-relaxed">
          Changes here update the page's &lt;title&gt;, meta description, and keywords in real-time for each language.
          Save each language separately. Changes take effect immediately after saving.
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "partial" | "complete">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "seo" | "google" | "blog" | "references" | "partners">("leads");

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setLocation("/admin/login");
  };

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/leads", { headers: adminAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeads(data);
      setError(null);
    } catch {
      setError("Could not load leads. Make sure the API server is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.businessType ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.phone ?? "").includes(search);
    const matchStatus =
      statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalComplete = leads.filter((l) => l.status === "complete").length;
  const totalPartial = leads.filter((l) => l.status === "partial").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="https://b2b-voice-media.fsn1.your-objectstorage.com/site/logo-new.jpg" alt="B2BVoice" style={{ width: 160, height: "auto" }} />
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Admin Panel</p>
            <p className="text-[11px] text-gray-400">{activeTab === "leads" ? "Demo Request Leads" : "SEO Settings"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "leads" && (
            <button
              onClick={() => fetchLeads(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-0">
        {([
          { key: "leads",  label: "Demo Leads",    icon: <Users className="w-3.5 h-3.5" /> },
          { key: "seo",    label: "SEO Settings",  icon: <Tag className="w-3.5 h-3.5" /> },
          { key: "google", label: "Google & Tracking", icon: <Globe className="w-3.5 h-3.5" /> },
          { key: "blog",   label: "Blog",           icon: <Newspaper className="w-3.5 h-3.5" /> },
          { key: "references", label: "Clients", icon: <Star className="w-3.5 h-3.5" /> },
          { key: "partners", label: "Partners",  icon: <Handshake className="w-3.5 h-3.5" /> },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "blog" ? (
          <BlogPanel />
        ) : activeTab === "references" ? (
          <ReferencesPanel />
        ) : activeTab === "partners" ? (
          <PartnersPanel />
        ) : activeTab === "google" ? (
          <GooglePanel />
        ) : activeTab === "seo" ? (
          <SeoPanel />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Leads", value: leads.length, icon: <Users className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
                { label: "Completed", value: totalComplete, icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Partial (Step 1 only)", value: totalPartial, icon: <Clock className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${s.bg} ${s.color}`}>
                      {s.icon}
                    </div>
                  </div>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, business, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-primary/50 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-1">
                {(["all", "partial", "complete"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      statusFilter === f
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="py-24 text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Loading leads...</p>
                </div>
              ) : error ? (
                <div className="py-24 text-center">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <button onClick={() => fetchLeads()} className="text-xs text-primary underline">Try again</button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-24 text-center">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No leads yet.</p>
                  <p className="text-xs text-gray-300 mt-1">Leads appear here when someone fills out the demo request form.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {["#", "Contact", "Business", "Demo Type", "Status", "Received", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        expanded={expandedId === lead.id}
                        onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
