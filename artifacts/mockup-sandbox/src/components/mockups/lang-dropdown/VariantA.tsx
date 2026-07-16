import { useState } from "react";

const US = () => (
  <svg viewBox="0 0 60 30" width="22" height="16" style={{ borderRadius: 3, display: "block", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>
    <rect width="60" height="30" fill="#B22234"/>
    <rect y="0" width="60" height="4.6" fill="#B22234"/>
    <rect y="4.6" width="60" height="4.6" fill="#fff"/>
    <rect y="9.2" width="60" height="4.6" fill="#B22234"/>
    <rect y="13.8" width="60" height="4.6" fill="#fff"/>
    <rect y="18.4" width="60" height="4.6" fill="#B22234"/>
    <rect y="23" width="60" height="4.6" fill="#fff"/>
    <rect y="27.6" width="60" height="4.6" fill="#B22234"/>
    <rect width="24" height="16.2" fill="#3C3B6E"/>
    <g fill="#fff" fontSize="3">
      {[...Array(9)].map((_, i) => (
        <text key={i} x={3 + (i % 6) * 3.6} y={3 + Math.floor(i / 6) * 3.2}>★</text>
      ))}
    </g>
  </svg>
);

const DE = () => (
  <svg viewBox="0 0 60 36" width="22" height="16" style={{ borderRadius: 3, display: "block", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>
    <rect width="60" height="12" fill="#000"/>
    <rect y="12" width="60" height="12" fill="#D00"/>
    <rect y="24" width="60" height="12" fill="#FFCE00"/>
  </svg>
);

const ES = () => (
  <svg viewBox="0 0 60 36" width="22" height="16" style={{ borderRadius: 3, display: "block", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>
    <rect width="60" height="36" fill="#c60b1e"/>
    <rect y="9" width="60" height="18" fill="#ffc400"/>
  </svg>
);

const LANGS = [
  { code: "en", Flag: US, name: "English", label: "EN" },
  { code: "de", Flag: DE, name: "Deutsch", label: "DE" },
  { code: "es", Flag: ES, name: "Español", label: "ES" },
];

export function VariantA() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("en");
  const current = LANGS.find(l => l.code === active)!;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-start justify-center pt-16 px-8">
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Variant A — Minimal Float</p>

        {/* Trigger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all"
          style={{ borderRadius: 0 }}
        >
          <current.Flag />
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-800">{current.label}</span>
          <svg
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", width: 12, height: 12, color: "#9ca3af" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 overflow-hidden"
            style={{ minWidth: 200, boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)", borderRadius: 0 }}
          >
            {LANGS.map(({ code, Flag, name, label }) => (
              <button
                key={code}
                onClick={() => { setActive(code); setOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors border-b border-gray-50 last:border-0"
                style={{ background: code === active ? "rgba(0,53,122,0.05)" : "white" }}
                onMouseEnter={e => { if (code !== active) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = code === active ? "rgba(0,53,122,0.05)" : "white"; }}
              >
                <Flag />
                <div>
                  <p className="text-[12px] font-bold text-gray-800 leading-none">{name}</p>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5 font-mono">{label}</p>
                </div>
                {code === active && (
                  <svg className="ml-auto shrink-0" width="14" height="14" fill="none" stroke="#00357a" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
