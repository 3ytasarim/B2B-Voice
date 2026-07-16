import { useState } from "react";

const US = () => (
  <svg viewBox="0 0 60 30" width="24" height="17" style={{ borderRadius: 4, display: "block", flexShrink: 0, boxShadow: "0 1px 5px rgba(0,0,0,0.22)" }}>
    <rect width="60" height="30" fill="#B22234"/>
    <rect y="4.6" width="60" height="4.6" fill="#fff"/>
    <rect y="13.8" width="60" height="4.6" fill="#fff"/>
    <rect y="23" width="60" height="4.6" fill="#fff"/>
    <rect width="24" height="16.2" fill="#3C3B6E"/>
  </svg>
);
const DE = () => (
  <svg viewBox="0 0 60 36" width="24" height="17" style={{ borderRadius: 4, display: "block", flexShrink: 0, boxShadow: "0 1px 5px rgba(0,0,0,0.22)" }}>
    <rect width="60" height="12" fill="#000"/>
    <rect y="12" width="60" height="12" fill="#D00"/>
    <rect y="24" width="60" height="12" fill="#FFCE00"/>
  </svg>
);
const ES = () => (
  <svg viewBox="0 0 60 36" width="24" height="17" style={{ borderRadius: 4, display: "block", flexShrink: 0, boxShadow: "0 1px 5px rgba(0,0,0,0.22)" }}>
    <rect width="60" height="36" fill="#c60b1e"/>
    <rect y="9" width="60" height="18" fill="#ffc400"/>
  </svg>
);

const LANGS = [
  { code: "en", Flag: US, name: "English", label: "EN", region: "United States" },
  { code: "de", Flag: DE, name: "Deutsch", label: "DE", region: "Germany" },
  { code: "es", Flag: ES, name: "Español", label: "ES", region: "Spain / LATAM" },
];

export function VariantB() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("en");
  const current = LANGS.find(l => l.code === active)!;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-start justify-center pt-16 px-8">
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Variant B — Premium Card</p>

        {/* Trigger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-3 px-4 py-2.5 bg-white transition-all"
          style={{
            borderRadius: 0,
            border: open ? "1.5px solid rgba(0,53,122,0.35)" : "1.5px solid #e5e7eb",
            boxShadow: open ? "0 0 0 3px rgba(0,53,122,0.07)" : "0 1px 4px rgba(0,0,0,0.07)"
          }}
        >
          <current.Flag />
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-900 leading-none">{current.name}</p>
            <p className="text-[8.5px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">{current.label}</p>
          </div>
          <svg
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", width: 12, height: 12, color: "#9ca3af", marginLeft: 4 }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute top-full left-0 mt-2 bg-white overflow-hidden"
            style={{ minWidth: 220, border: "1px solid rgba(0,0,0,0.09)", boxShadow: "0 12px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)", borderRadius: 0 }}
          >
            {/* Top label */}
            <div className="px-4 py-2.5 border-b" style={{ background: "#f8fafc", borderColor: "#f1f5f9" }}>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">Select Language</p>
            </div>

            {LANGS.map(({ code, Flag, name, label, region }) => (
              <button
                key={code}
                onClick={() => { setActive(code); setOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors"
                style={{
                  background: code === active ? "rgba(0,53,122,0.04)" : "white",
                  borderBottom: "1px solid #f8fafc"
                }}
                onMouseEnter={e => { if (code !== active) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = code === active ? "rgba(0,53,122,0.04)" : "white"; }}
              >
                <Flag />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold leading-none" style={{ color: code === active ? "#00357a" : "#1f2937" }}>{name}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-mono uppercase tracking-wider">{region}</p>
                </div>
                {code === active ? (
                  <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ background: "#00357a" }}>
                    <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-200" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
