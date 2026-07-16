import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p>B2BVoice ("we", "our", "us") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect information when you use our website and AI voice assistant services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Data We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Contact information (name, email address, phone number, company name)</li>
              <li>Demo request data submitted through our forms</li>
              <li>Call recordings and transcripts processed through our AI assistant (with consent)</li>
              <li>Usage and analytics data (IP address, browser type, pages visited)</li>
              <li>CRM and calendar data via integrations (only with explicit authorization)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. How We Use Your Data</h2>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide and improve our AI voice assistant service</li>
              <li>Respond to demo requests and inquiries</li>
              <li>Send service-related communications</li>
              <li>Analyze usage patterns to enhance product quality</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Legal Basis for Processing</h2>
            <p>We process personal data based on: your consent, the performance of a contract, our legitimate interests, and compliance with legal obligations — in accordance with the GDPR and applicable data protection laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Data Retention</h2>
            <p>We retain personal data only as long as necessary for the purposes described in this policy, or as required by law. Call recordings are deleted upon your request or after the agreed retention period.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Third-Party Sharing</h2>
            <p>We do not sell your personal data. We may share data with trusted service providers (hosting, analytics, CRM integrations) strictly under data processing agreements. All third parties are GDPR-compliant.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Your Rights</h2>
            <p>You have the right to: access your data, request correction or deletion, withdraw consent, object to processing, and lodge a complaint with a supervisory authority. Contact us at <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a> to exercise your rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Contact</h2>
            <p>B2BVoice<br />Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
