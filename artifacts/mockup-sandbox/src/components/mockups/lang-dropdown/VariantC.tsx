import { useState } from "react";

const US = () => (
  <svg viewBox="0 0 60 30" width="22" height="15" style={{ borderRadius: 3, display: "block", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
    <rect width="60" height="30" fill="#B22234"/>
    <rect y="4.6" width="60" height="4.6" fill="#fff"/>
    <rect y="13.8" width="60" height="4.6" fill="#fff"/>
    <rect y="23" width="60" height="4.6" fill="#fff"/>
    <rect width="24" height="16.2" fill="#3C3B6E"/>
  </svg>
);
const DE = () => (
  <svg viewBox="0 0 60 36" width="22" height="15" style={{ borderRadius: 3, display: "block", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
    <rect width="60" height="12" fill="#000"/>
    <rect y="12" width="60" height="12" fill="#D00"/>
    <rect y="24" width="60" height="12" fill="#FFCE00"/>
  </svg>
);
const ES = () => (
  <svg viewBox="0 0 60 36" width="22" height="15" style={{ borderRadius: 3, display: "block", flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
    <rect width="60" height="36" fill="#c60b1e"/>
    <rect y="9" width="60" height="18" fill="#ffc400"/>
  </svg>
);

const LANGS = [
  { code: "en", Flag: US, name: "English", label: "EN" },
  { code: "de", Flag: DE, name: "Deutsch", label: "DE" },
  { code: "es", Flag: ES, name: "Español", label: "ES" },
];

export function VariantC() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("en");
  const current = LANGS.find(l => l.code === active)!;

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 px-8" style={{ background: "#f8f9fc" }}>
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Variant C — Pill + Icon Strip</p>

        {/* Trigger pill */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2.5 transition-all"
          style={{
            borderRadius: 999,
            padding: "8px 16px 8px 10px",
            border: open ? "1.5px solid rgba(0,53,122,0.4)" : "1.5px solid #e2e8f0",
            background: open ? "rgba(0,53,122,0.04)" : "white",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
          }}
        >
          <current.Flag />
          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: open ? "#00357a" : "#374151" }}>{current.label}</span>
          <svg
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", width: 11, height: 11, color: "#9ca3af" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute left-0 mt-2 bg-white overflow-hidden"
            style={{
              minWidth: 190,
              top: "100%",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)"
            }}
          >
            <div className="p-1.5">
              {LANGS.map(({ code, Flag, name, label }) => (
                <button
                  key={code}
                  onClick={() => { setActive(code); setOpen(false); }}
                  className="flex items-center gap-3 w-full text-left transition-all"
                  style={{
                    borderRadius: 8,
                    padding: "10px 12px",
                    background: code === active ? "rgba(0,53,122,0.06)" : "transparent",
                    marginBottom: 1
                  }}
                  onMouseEnter={e => { if (code !== active) (e.currentTarget as HTMLElement).style.background = "#f8fafc"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = code === active ? "rgba(0,53,122,0.06)" : "transparent"; }}
                >
                  <div style={{ borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <Flag />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold leading-none" style={{ color: code === active ? "#00357a" : "#111827" }}>{name}</p>
                    <p className="text-[9px] font-mono uppercase tracking-widest mt-0.5" style={{ color: "#9ca3af" }}>{label}</p>
                  </div>
                  {code === active && (
                    <svg width="14" height="14" fill="none" stroke="#00357a" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Bottom divider + hint */}
            <div className="px-4 py-2" style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
              <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest text-center">Display language</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
