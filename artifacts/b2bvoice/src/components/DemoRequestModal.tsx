import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

type Step = 1 | 2 | 3 | 4 | 5;

type FormState = {
  email: string;
  phone: string;
  scenario: string;
  businessType: string;
  businessDescription: string;
  website: string;
  demoNeeds: string[];
  demoType: string;
  consent: boolean;
};

function StepIndicator({ current, stepLabels }: { current: number; stepLabels: string[] }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {stepLabels.slice(0, 4).map((label, i) => {
        const stepNum = i + 1;
        const done = current > stepNum;
        const active = current === stepNum;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-primary text-white"
                    : active
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${active ? "text-primary" : done ? "text-primary/60" : "text-gray-300"}`}>
                {label}
              </span>
            </div>
            {i < 3 && (
              <div className={`flex-1 h-px mb-5 mx-1 transition-all duration-500 ${done ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function DemoRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();

  const BUSINESS_TYPES = t.modal.businessTypes;
  const DEMO_NEEDS = t.modal.demoNeeds;
  const DEMO_TYPES = t.modal.demoTypes;

  const [step, setStep] = useState<Step>(1);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScenario, setShowScenario] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    phone: "",
    scenario: "",
    businessType: "",
    businessDescription: "",
    website: "",
    demoNeeds: [],
    demoType: "",
    consent: false,
  });

  const set = (field: keyof FormState, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleNeed = (need: string) =>
    set("demoNeeds", form.demoNeeds.includes(need)
      ? form.demoNeeds.filter((n) => n !== need)
      : [...form.demoNeeds, need]
    );

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setLeadId(null);
      setShowScenario(false);
      setForm({ email: "", phone: "", scenario: "", businessType: "", businessDescription: "", website: "", demoNeeds: [], demoType: "", consent: false });
      setError("");
    }, 300);
  };

  const patch = async (data: Record<string, unknown>) => {
    if (!leadId) return;
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const submitStep1 = async () => {
    if (!form.email.trim() || !form.email.includes("@")) {
      setError(t.modal.errors.email);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), phone: form.phone.trim() || undefined, scenario: form.scenario.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      const lead = await res.json();
      setLeadId(lead.id);
      setStep(2);
    } catch {
      setError(t.modal.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const submitStep2 = async () => {
    setLoading(true);
    try {
      await patch({
        businessType: form.businessType || undefined,
        businessDescription: form.businessDescription || undefined,
        website: form.website || undefined,
      });
      setStep(3);
    } catch {
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const submitStep3 = async () => {
    setLoading(true);
    try {
      await patch({ demoNeeds: JSON.stringify(form.demoNeeds) });
      setStep(4);
    } catch {
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const submitStep4 = async () => {
    if (!form.demoType) {
      setError(t.modal.errors.demoType);
      return;
    }
    if (!form.consent) {
      setError(t.modal.errors.consent);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await patch({
        demoType: form.demoType,
        consentGiven: form.consent,
        status: "complete",
      });
      setStep(5);
    } catch {
      setError(t.modal.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const isGoogleMeet = form.demoType === "google-meet";
  const isOtherBusiness = form.businessType === BUSINESS_TYPES[BUSINESS_TYPES.length - 1];

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 bg-white shadow-2xl overflow-hidden"
            style={{ maxHeight: "92vh" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t.modal.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {step < 5 ? t.modal.sub : ""}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: "calc(92vh - 80px)" }}>
              {step < 5 && <StepIndicator current={step} stepLabels={t.modal.stepLabels} />}

              <AnimatePresence mode="wait">
                {/* Step 1: Contact */}
                {step === 1 && (
                  <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">{t.modal.step1.title}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          {t.modal.step1.emailLabel} <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && submitStep1()}
                          placeholder={t.modal.step1.emailPlaceholder}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary/60 placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          {t.modal.step1.phoneLabel} <span className="text-gray-500 font-bold">{t.modal.step1.phoneOptional}</span>
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary/60 placeholder-gray-300"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">{t.modal.step1.phoneHint}</p>
                      </div>

                      {/* Scenario toggle */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowScenario((s) => !s)}
                          className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d={showScenario ? "M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" : "M10 3a.75.75 0 01.75.75v5.5h5.5a.75.75 0 010 1.5h-5.5v5.5a.75.75 0 01-1.5 0v-5.5h-5.5a.75.75 0 010-1.5h5.5v-5.5A.75.75 0 0110 3z"} clipRule="evenodd" />
                          </svg>
                          {showScenario ? "Hide scenario" : "Describe your ideal call scenario (optional)"}
                        </button>
                        {showScenario && (
                          <div className="mt-2">
                            <textarea
                              value={form.scenario}
                              onChange={(e) => set("scenario", e.target.value)}
                              rows={3}
                              placeholder="e.g. Customers call asking about appointment availability, pricing, and directions. The AI should book them directly into our calendar..."
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary/60 resize-none placeholder-gray-300"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
                    <button
                      onClick={submitStep1}
                      disabled={loading}
                      className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t.modal.next} <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Business Info */}
                {step === 2 && (
                  <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">{t.modal.step2.title}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">{t.modal.step2.businessTypeLabel}</label>
                        <select
                          value={form.businessType}
                          onChange={(e) => set("businessType", e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary/60 bg-white text-gray-700"
                        >
                          <option value="">{t.modal.step2.businessTypePlaceholder}</option>
                          {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      {isOtherBusiness && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}>
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">{t.modal.step2.descLabel}</label>
                          <textarea
                            value={form.businessDescription}
                            onChange={(e) => set("businessDescription", e.target.value)}
                            rows={2}
                            placeholder={t.modal.step2.descPlaceholder}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary/60 resize-none placeholder-gray-300"
                          />
                        </motion.div>
                      )}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          {t.modal.step2.websiteLabel} <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={form.website}
                          onChange={(e) => set("website", e.target.value)}
                          placeholder={t.modal.step2.websitePlaceholder}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary/60 placeholder-gray-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {t.modal.back}
                      </button>
                      <button
                        onClick={submitStep2}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t.modal.next} <ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Demo Needs */}
                {step === 3 && (
                  <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">{t.modal.step3.title}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {DEMO_NEEDS.map((need) => {
                        const selected = form.demoNeeds.includes(need);
                        return (
                          <button
                            key={need}
                            onClick={() => toggleNeed(need)}
                            className={`flex items-center gap-3 px-3 py-2.5 text-left text-sm border transition-all ${
                              selected
                                ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                                : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-all ${
                              selected ? "border-primary bg-primary" : "border-gray-300"
                            }`}>
                              {selected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            {need}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {t.modal.back}
                      </button>
                      <button
                        onClick={submitStep3}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t.modal.next} <ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Demo Type + Consent */}
                {step === 4 && (
                  <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">{t.modal.step4.title}</h3>
                    <div className="space-y-2 mb-6">
                      {DEMO_TYPES.map((dt) => {
                        const selected = form.demoType === dt.value;
                        return (
                          <button
                            key={dt.value}
                            onClick={() => { set("demoType", dt.value); setError(""); }}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left border transition-all ${
                              selected
                                ? "border-primary/50 bg-primary/5"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
                              selected ? "border-primary bg-primary" : "border-gray-300"
                            }`}>
                              {selected && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                            </div>
                            <div>
                              <div className={`text-sm font-semibold ${selected ? "text-primary" : "text-gray-800"}`}>{dt.label}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{dt.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Consent */}
                    <div className="border-t border-gray-100 pt-4">
                      <button
                        onClick={() => { set("consent", !form.consent); setError(""); }}
                        className="flex items-start gap-3 text-left w-full"
                      >
                        <div className={`w-4 h-4 flex-shrink-0 border mt-0.5 flex items-center justify-center transition-all ${
                          form.consent ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {form.consent && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <p className="text-xs text-gray-500">
                          {t.modal.step4.consentText}
                        </p>
                      </button>
                    </div>

                    {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
                    <div className="flex gap-2 mt-5">
                      <button onClick={() => setStep(3)} className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> {t.modal.back}
                      </button>
                      <button
                        onClick={submitStep4}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request My Free Custom Demo"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                  <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div className="text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                        className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5"
                      >
                        <Check className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {isGoogleMeet ? t.modal.success.meetTitle : t.modal.success.otherTitle}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-2">
                        {isGoogleMeet ? t.modal.success.meetSub : t.modal.success.otherSub}
                      </p>

                      {form.scenario.trim() && (
                        <div className="mt-3 mb-4 text-left bg-gray-50 border border-gray-100 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Your scenario</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{form.scenario}</p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 mt-5">
                        <button
                          onClick={handleClose}
                          className="w-full px-8 py-3 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all"
                        >
                          {t.modal.success.close}
                        </button>
                        <button
                          onClick={() => { handleClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="w-full px-8 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
                        >
                          ← Return to Homepage
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
