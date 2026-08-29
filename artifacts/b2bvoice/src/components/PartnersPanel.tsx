import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Upload, ChevronUp, ChevronDown, Link as LinkIcon, Handshake } from "lucide-react";

interface PartnerRow {
  id: number;
  name: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  createdAt: string | null;
}

const TOKEN_KEY = "b2bvoice_admin_token";
const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const jsonHeaders = (): Record<string, string> => ({ "Content-Type": "application/json", ...authHeaders() });

function PartnerModal({ partner, sortOrder, onClose, onSaved }: {
  partner: PartnerRow | null;
  sortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(partner?.name ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(partner?.websiteUrl ?? "");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [existingImage, setExistingImage] = useState(partner?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const preview = imageDataUrl || existingImage;

  const handleSave = async () => {
    if (!name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { name: name.trim(), websiteUrl: websiteUrl.trim(), sortOrder };
      if (imageDataUrl) body.imageUrl = imageDataUrl;
      const url = partner ? `/api/partners/${partner.id}` : "/api/partners";
      const method = partner ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: jsonHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      onSaved();
    } catch {
      setError("Could not save the partner.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            {partner ? "Edit Partner" : "New Partner"}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && <div className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">{error}</div>}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" /> Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Logo</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 py-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-colors text-xs text-gray-400"
            >
              <Upload className="w-4 h-4" />
              {preview ? "Replace logo" : "Upload logo"}
            </button>
            {preview && (
              <div className="mt-3 flex items-center gap-2">
                <img src={preview} alt="Preview" className="h-14 w-auto max-w-[140px] object-contain border border-gray-100 bg-gray-50 p-1" />
                <button type="button" onClick={() => { setImageDataUrl(""); setExistingImage(""); }} className="text-gray-400 hover:text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnersPanel() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<PartnerRow | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/partners", { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setPartners(await res.json());
      setError(null);
    } catch {
      setError("Could not load partners. Make sure the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const sorted = [...partners].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDelete = async (p: PartnerRow) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    await fetch(`/api/partners/${p.id}`, { method: "DELETE", headers: authHeaders() });
    fetchPartners();
  };

  const moveOrder = async (id: number, direction: "up" | "down") => {
    const idx = sorted.findIndex((p) => p.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    await Promise.all([
      fetch(`/api/partners/${a.id}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ sortOrder: b.sortOrder }) }),
      fetch(`/api/partners/${b.id}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ sortOrder: a.sortOrder }) }),
    ]);
    fetchPartners();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Handshake className="w-3.5 h-3.5" /> Partners ({partners.length})
        </p>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Partner
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-400">Loading…</div>
      ) : error ? (
        <div className="bg-white border border-red-200 p-8 text-center text-sm text-red-500">{error}</div>
      ) : sorted.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-400 mb-1">No partners yet.</p>
          <p className="text-xs text-gray-300">Click "New Partner" to add the first one.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {sorted.map((p, idx) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="h-10 w-auto max-w-[100px] object-contain border border-gray-100 bg-gray-50 p-1 shrink-0" />
              ) : (
                <div className="h-10 w-16 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 shrink-0">No logo</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                {p.websiteUrl && (
                  <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline truncate block">
                    {p.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => moveOrder(p.id, "up")} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveOrder(p.id, "down")} disabled={idx === sorted.length - 1} className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setEditing(p)} className="p-2 text-gray-400 hover:text-primary shrink-0" title="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p)} className="p-2 text-gray-400 hover:text-red-500 shrink-0" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <PartnerModal
          partner={editing}
          sortOrder={editing ? editing.sortOrder : sorted.length}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); fetchPartners(); }}
        />
      )}
    </div>
  );
}
