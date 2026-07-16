import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using B2BVoice services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Description of Service</h2>
            <p>B2BVoice provides AI-powered voice assistant solutions for businesses, including automated call handling, appointment scheduling, CRM integration, and multilingual support. Services are provided on a subscription or custom agreement basis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Use of Service</h2>
            <p>You agree to use B2BVoice only for lawful business purposes. You must not:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the service to harass, deceive, or defraud individuals</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse-engineer or misuse the AI models</li>
              <li>Exceed usage limits outlined in your subscription plan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a> of any unauthorized use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Payment & Billing</h2>
            <p>Subscription fees are billed according to your selected plan. All fees are non-refundable unless otherwise stated. We reserve the right to modify pricing with 30 days notice. Failure to pay may result in service suspension.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Intellectual Property</h2>
            <p>All content, technology, and materials on the B2BVoice platform are owned by or licensed to us. You may not copy, modify, or distribute our proprietary technology. You retain ownership of your business data processed through our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Service Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. We are not liable for downtime caused by third-party infrastructure, maintenance windows, or events beyond our reasonable control.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, B2BVoice shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Termination</h2>
            <p>Either party may terminate the agreement with written notice. Upon termination, your access will be revoked and your data will be handled per our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Governing Law</h2>
            <p>These terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation or, if necessary, through the competent courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">11. Contact</h2>
            <p>B2BVoice<br />Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
