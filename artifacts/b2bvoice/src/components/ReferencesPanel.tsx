import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Upload, ChevronUp, ChevronDown, Link as LinkIcon, Check } from "lucide-react";

interface ReferenceRow {
  id: number;
  clientName: string;
  clientTitle: string | null;
  company: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  testimonial: string | null;
  rating: number | null;
  published: boolean;
  sortOrder: number;
  row: number;
}

const TOKEN_KEY = "b2bvoice_admin_token";
const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const jsonHeaders = (): Record<string, string> => ({ "Content-Type": "application/json", ...authHeaders() });

function ReferenceModal({ reference, defaultRow, onClose, onSaved }: {
  reference: ReferenceRow | null;
  defaultRow: 1 | 2;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [clientName, setClientName] = useState(reference?.clientName ?? "");
  const [clientTitle, setClientTitle] = useState(reference?.clientTitle ?? "");
  const [company, setCompany] = useState(reference?.company ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(reference?.websiteUrl ?? "");
  const [testimonial, setTestimonial] = useState(reference?.testimonial ?? "");
  const [rating, setRating] = useState(reference?.rating ?? 5);
  const [published, setPublished] = useState(reference?.published ?? true);
  const [row, setRow] = useState<1 | 2>((reference?.row as 1 | 2) ?? defaultRow);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [existingImage, setExistingImage] = useState(reference?.logoUrl ?? "");
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
    if (!clientName.trim() || !company.trim()) { setError("Client name and company are required."); return; }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        clientName: clientName.trim(),
        clientTitle: clientTitle.trim(),
        company: company.trim(),
        websiteUrl: websiteUrl.trim(),
        testimonial: testimonial.trim(),
        rating,
        published,
        row,
        sortOrder: reference?.sortOrder ?? 0,
      };
      if (imageDataUrl) body.logoUrl = imageDataUrl;
      const url = reference ? `/api/references/${reference.id}` : "/api/references";
      const method = reference ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: jsonHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      onSaved();
    } catch {
      setError("Could not save the reference.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
      <div className="bg-white w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
            {reference ? "Edit Reference" : "New Reference"}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && <div className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Client Name *</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Company *</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Title (optional)</label>
              <input type="text" value={clientTitle} onChange={(e) => setClientTitle(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Rating (1–5)</label>
              <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Testimonial (optional)</label>
            <textarea value={testimonial} onChange={(e) => setTestimonial(e.target.value)} rows={3}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50 resize-none" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Logo</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 py-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-colors text-xs text-gray-400">
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

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" /> Website URL (optional)
            </label>
            <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com"
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Marquee Row</label>
            <div className="flex gap-2">
              {([1, 2] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRow(r)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    row === r ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-500 hover:border-primary/40"
                  }`}>
                  Row {r} ({r === 1 ? "scrolls left" : "scrolls right"})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-4 h-4" />
              Published
            </label>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefRow({ ref, rowRefs, idx, onEdit, onDelete, onMove }: {
  ref: ReferenceRow;
  rowRefs: ReferenceRow[];
  idx: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-3">
      {ref.logoUrl ? (
        <img src={ref.logoUrl} alt={ref.company} className="h-10 w-auto max-w-[100px] object-contain border border-gray-100 bg-gray-50 p-1 shrink-0" />
      ) : (
        <div className="h-10 w-16 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 shrink-0">No logo</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{ref.clientName} <span className="text-gray-400 font-normal">— {ref.company}</span></p>
        <p className="text-[11px] text-gray-400 truncate">{"★".repeat(ref.rating || 5)}</p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={() => onMove("up")} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30">
          <ChevronUp className="w-4 h-4" />
        </button>
        <button onClick={() => onMove("down")} disabled={idx === rowRefs.length - 1} className="p-1.5 text-gray-400 hover:text-primary disabled:opacity-30">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {ref.published ? (
        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Check className="w-2.5 h-2.5" /> Live
        </span>
      ) : (
        <span className="shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">Draft</span>
      )}
      <button onClick={onEdit} className="p-2 text-gray-400 hover:text-primary shrink-0" title="Edit">
        <Pencil className="w-4 h-4" />
      </button>
      <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 shrink-0" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ReferencesPanel() {
  const [references, setReferences] = useState<ReferenceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ReferenceRow | null>(null);
  const [creatingRow, setCreatingRow] = useState<1 | 2 | null>(null);

  const fetchReferences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/references", { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setReferences(await res.json());
      setError(null);
    } catch {
      setError("Could not load references. Make sure the API server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReferences(); }, []);

  const row1 = references.filter((r) => (r.row ?? 1) === 1).sort((a, b) => a.sortOrder - b.sortOrder);
  const row2 = references.filter((r) => (r.row ?? 1) === 2).sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDelete = async (r: ReferenceRow) => {
    if (!window.confirm(`Delete "${r.clientName}" (${r.company})?`)) return;
    await fetch(`/api/references/${r.id}`, { method: "DELETE", headers: authHeaders() });
    fetchReferences();
  };

  const moveOrder = async (rowRefs: ReferenceRow[], id: number, direction: "up" | "down") => {
    const idx = rowRefs.findIndex((r) => r.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rowRefs.length) return;
    const a = rowRefs[idx], b = rowRefs[swapIdx];
    await Promise.all([
      fetch(`/api/references/${a.id}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ sortOrder: b.sortOrder }) }),
      fetch(`/api/references/${b.id}`, { method: "PUT", headers: jsonHeaders(), body: JSON.stringify({ sortOrder: a.sortOrder }) }),
    ]);
    fetchReferences();
  };

  const RowSection = ({ rowRefs, rowNum }: { rowRefs: ReferenceRow[]; rowNum: 1 | 2 }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Row {rowNum} ({rowNum === 1 ? "scrolls left" : "scrolls right"}) — {rowRefs.length}
        </p>
        <button
          onClick={() => setCreatingRow(rowNum)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11px] font-bold uppercase tracking-wider hover:bg-primary/90"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {rowRefs.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">No references in this row yet.</div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rowRefs.map((r, idx) => (
            <RefRow
              key={r.id}
              ref={r}
              rowRefs={rowRefs}
              idx={idx}
              onEdit={() => setEditing(r)}
              onDelete={() => handleDelete(r)}
              onMove={(dir) => moveOrder(rowRefs, r.id, dir)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Clients &amp; References</p>

      {loading ? (
        <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-400">Loading…</div>
      ) : error ? (
        <div className="bg-white border border-red-200 p-8 text-center text-sm text-red-500">{error}</div>
      ) : (
        <>
          <RowSection rowRefs={row1} rowNum={1} />
          <RowSection rowRefs={row2} rowNum={2} />
        </>
      )}

      {(creatingRow !== null || editing) && (
        <ReferenceModal
          reference={editing}
          defaultRow={creatingRow ?? 1}
          onClose={() => { setCreatingRow(null); setEditing(null); }}
          onSaved={() => { setCreatingRow(null); setEditing(null); fetchReferences(); }}
        />
      )}
    </div>
  );
}
