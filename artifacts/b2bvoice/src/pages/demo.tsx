import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { Link } from "wouter";

type Step = 1 | 2 | 3 | 4 | 5;

type FormState = {
  email: string;
  phone: string;
  scenario: string;
  businessType: string;
  businessDescription: string;
  website: string;
  demoNeeds: string[];
  otherNeed: string;
  demoType: string;
  consent: boolean;
};

function StepIndicator({ current, stepLabels }: { current: number; stepLabels: string[] }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {stepLabels.slice(0, 4).map((label, i) => {
        const stepNum = i + 1;
        const done = current > stepNum;
        const active = current === stepNum;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-primary text-white"
                    : active
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${active ? "text-primary" : done ? "text-primary/60" : "text-gray-300"}`}>
                {label}
              </span>
            </div>
            {i < 3 && (
              <div className={`flex-1 h-px mb-6 mx-2 transition-all duration-500 ${done ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function DemoPage() {
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
    otherNeed: "",
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
      await patch({ businessType: form.businessType || undefined, businessDescription: form.businessDescription || undefined, website: form.website || undefined });
      setStep(3);
    } catch { setStep(3); } finally { setLoading(false); }
  };

  const submitStep3 = async () => {
    setLoading(true);
    try {
      const allNeeds = form.otherNeed.trim()
        ? [...form.demoNeeds, form.otherNeed.trim()]
        : form.demoNeeds;
      await patch({ demoNeeds: JSON.stringify(allNeeds) });
      setStep(4);
    } catch { setStep(4); } finally { setLoading(false); }
  };

  const submitStep4 = async () => {
    if (!form.demoType) { setError(t.modal.errors.demoType); return; }
    if (!form.consent) { setError(t.modal.errors.consent); return; }
    setLoading(true);
    setError("");
    try {
      await patch({ demoType: form.demoType, consentGiven: form.consent, status: "complete" });
      setStep(5);
    } catch { setError(t.modal.errors.generic); } finally { setLoading(false); }
  };

  const isGoogleMeet = form.demoType === "google-meet";
  const isOtherBusiness = form.businessType === BUSINESS_TYPES[BUSINESS_TYPES.length - 1];

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  const inputCls = "w-full px-4 py-3.5 text-base border border-gray-200 focus:outline-none focus:border-primary/60 placeholder-gray-300 rounded-none";
  const labelCls = "text-sm font-semibold text-gray-700 block mb-2";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div style={{ overflow: "hidden", height: 28 }}>
          <img src="/logo-clean.webp" alt="B2BVoice" style={{ width: 150, height: "auto", display: "block", marginTop: -63 }} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {step < 5 && (
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t.modal.title}</h1>
            <p className="text-base text-gray-500">{t.modal.sub}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 shadow-sm p-8 md:p-10">
          {step < 5 && <StepIndicator current={step} stepLabels={t.modal.stepLabels} />}

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t.modal.step1.title}</h3>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>
                      {t.modal.step1.emailLabel} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitStep1()}
                      placeholder={t.modal.step1.emailPlaceholder}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {t.modal.step1.phoneLabel}{" "}
                      <span className="text-gray-500 font-bold text-sm">{t.modal.step1.phoneOptional}</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={inputCls}
                    />
                    <p className="text-xs text-gray-400 mt-1.5">{t.modal.step1.phoneHint}</p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowScenario((s) => !s)}
                      className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d={showScenario ? "M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" : "M10 3a.75.75 0 01.75.75v5.5h5.5a.75.75 0 010 1.5h-5.5v5.5a.75.75 0 01-1.5 0v-5.5h-5.5a.75.75 0 010-1.5h5.5v-5.5A.75.75 0 0110 3z"} clipRule="evenodd" />
                      </svg>
                      {showScenario ? "Hide scenario" : "Describe your ideal call scenario (optional)"}
                    </button>
                    {showScenario && (
                      <div className="mt-3">
                        <textarea
                          value={form.scenario}
                          onChange={(e) => set("scenario", e.target.value)}
                          rows={4}
                          placeholder="e.g. Customers call asking about appointment availability, pricing, and directions. The AI should book them directly into our calendar..."
                          className="w-full px-4 py-3.5 text-base border border-gray-200 focus:outline-none focus:border-primary/60 resize-none placeholder-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                <button
                  onClick={submitStep1}
                  disabled={loading}
                  className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-60 rounded-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t.modal.next} <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t.modal.step2.title}</h3>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>{t.modal.step2.businessTypeLabel}</label>
                    <select
                      value={form.businessType}
                      onChange={(e) => set("businessType", e.target.value)}
                      className="w-full px-4 py-3.5 text-base border border-gray-200 focus:outline-none focus:border-primary/60 bg-white text-gray-700 rounded-none"
                    >
                      <option value="">{t.modal.step2.businessTypePlaceholder}</option>
                      {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {isOtherBusiness && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }}>
                      <label className={labelCls}>{t.modal.step2.descLabel}</label>
                      <textarea
                        value={form.businessDescription}
                        onChange={(e) => set("businessDescription", e.target.value)}
                        rows={3}
                        placeholder={t.modal.step2.descPlaceholder}
                        className="w-full px-4 py-3.5 text-base border border-gray-200 focus:outline-none focus:border-primary/60 resize-none placeholder-gray-300"
                      />
                    </motion.div>
                  )}
                  <div>
                    <label className={labelCls}>
                      {t.modal.step2.websiteLabel}{" "}
                      <span className="text-gray-400 font-bold">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      placeholder={t.modal.step2.websitePlaceholder}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-5 py-4 border border-gray-200 text-base text-gray-600 hover:bg-gray-50 transition-colors rounded-none">
                    <ArrowLeft className="w-4 h-4" /> {t.modal.back}
                  </button>
                  <button
                    onClick={submitStep2}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-60 rounded-none"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t.modal.next} <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t.modal.step3.title}</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {DEMO_NEEDS.map((need) => {
                    const selected = form.demoNeeds.includes(need);
                    return (
                      <button
                        key={need}
                        onClick={() => toggleNeed(need)}
                        className={`flex items-center gap-3 px-4 py-3.5 text-left text-base border transition-all rounded-none ${
                          selected
                            ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                          selected ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {need}
                      </button>
                    );
                  })}

                  {/* Other — toggle + textarea */}
                  <button
                    onClick={() => {
                      if (form.otherNeed !== "__open__") {
                        set("otherNeed", "__open__");
                      } else {
                        set("otherNeed", "");
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 text-left text-base border transition-all rounded-none ${
                      form.otherNeed && form.otherNeed !== "__open__"
                        ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                        : form.otherNeed === "__open__"
                        ? "border-primary/40 bg-primary/5 text-primary font-semibold"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      form.otherNeed ? "border-primary bg-primary" : "border-gray-300"
                    }`}>
                      {form.otherNeed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {t.modal.step3.otherLabel}
                  </button>

                  <AnimatePresence>
                    {(form.otherNeed === "__open__" || (form.otherNeed && form.otherNeed !== "__open__")) && (
                      <motion.div
                        key="other-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <textarea
                          autoFocus
                          rows={3}
                          value={form.otherNeed === "__open__" ? "" : form.otherNeed}
                          onChange={(e) => set("otherNeed", e.target.value || "__open__")}
                          placeholder={t.modal.step3.otherPlaceholder}
                          className="w-full mt-1 px-4 py-3 text-base border border-primary/40 bg-primary/5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary resize-none rounded-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-5 py-4 border border-gray-200 text-base text-gray-600 hover:bg-gray-50 transition-colors rounded-none">
                    <ArrowLeft className="w-4 h-4" /> {t.modal.back}
                  </button>
                  <button
                    onClick={submitStep3}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-60 rounded-none"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t.modal.next} <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t.modal.step4.title}</h3>
                <div className="space-y-3 mb-6">
                  {DEMO_TYPES.map((dt) => {
                    const selected = form.demoType === dt.value;
                    return (
                      <button
                        key={dt.value}
                        onClick={() => { set("demoType", dt.value); setError(""); }}
                        className={`w-full flex items-start gap-4 px-5 py-4 text-left border transition-all rounded-none ${
                          selected ? "border-primary/50 bg-primary/5" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
                          selected ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {selected && <div className="w-full h-full rounded-full bg-white scale-[0.4]" />}
                        </div>
                        <div>
                          <div className={`text-base font-semibold ${selected ? "text-primary" : "text-gray-800"}`}>{dt.label}</div>
                          <div className="text-sm text-gray-400 mt-0.5">{dt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <button
                    onClick={() => { set("consent", !form.consent); setError(""); }}
                    className="flex items-start gap-3 text-left w-full"
                  >
                    <div className={`w-5 h-5 flex-shrink-0 border-2 mt-0.5 flex items-center justify-center transition-all ${
                      form.consent ? "border-primary bg-primary" : "border-gray-300"
                    }`}>
                      {form.consent && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{t.modal.step4.consentText}</p>
                  </button>
                </div>

                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(3)} className="flex items-center gap-1.5 px-5 py-4 border border-gray-200 text-base text-gray-600 hover:bg-gray-50 transition-colors rounded-none">
                    <ArrowLeft className="w-4 h-4" /> {t.modal.back}
                  </button>
                  <button
                    onClick={submitStep4}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-60 rounded-none"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request My Free Custom Demo"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="py-8 max-w-lg mx-auto">
                  {/* Check icon */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                      className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {isGoogleMeet ? t.modal.success.meetTitle : t.modal.success.otherTitle}
                    </h3>
                  </div>

                  {/* Body paragraphs */}
                  <div className="text-left space-y-3 text-base text-gray-600 leading-relaxed">
                    {isGoogleMeet ? (
                      <>
                        <p>You can now choose the best day and time for your live Google Meet demo by clicking the scheduling link on this page.</p>
                        <a
                          href="https://calendar.app.google/aKu2n5KzGBrMMvBL8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors rounded-none break-all"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          Schedule your Google Meet →
                        </a>
                        <p>If you're not available right now or don't schedule a time, no worries — one of our team members will contact you shortly.</p>
                        <p>Please check your inbox.</p>
                        <p>And don't forget to check your spam folder too — unfortunately, important emails sometimes like to hide there.</p>
                        <p>Have a question? Email us anytime at <a href="mailto:hello@b2b-voice.com" className="text-primary font-medium hover:underline">hello@b2b-voice.com</a></p>
                        <p>We'd be happy to help.</p>
                      </>
                    ) : (
                      <>
                        <p>We'll send you an email shortly to confirm the next step.</p>
                        <p>If you requested a demo call, we'll ask when you would like the demo agent to call you.</p>
                        <p>If you requested a sample voice recording, we'll confirm a few details first so we can prepare the most relevant example for your business.</p>
                        <p>Please check your inbox.</p>
                        <p>And don't forget to check your spam folder too — unfortunately, important emails sometimes like to hide there.</p>
                        <p>Have a question? Email us anytime at <a href="mailto:hello@b2b-voice.com" className="text-primary font-medium hover:underline">hello@b2b-voice.com</a></p>
                        <p>We'd be happy to help.</p>
                      </>
                    )}
                  </div>

                  {form.scenario.trim() && (
                    <div className="mt-5 text-left bg-gray-50 border border-gray-100 px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your scenario</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{form.scenario}</p>
                    </div>
                  )}

                  <div className="text-center mt-6">
                    <Link href="/" className="inline-block px-10 py-4 bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all rounded-none">
                      {t.modal.success.close}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
