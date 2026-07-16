import { Link } from "wouter";

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Legal Notice</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Company Information</h2>
            <p>
              <strong>B2BVoice</strong><br />
              AI Voice Assistant Solutions<br />
              Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a><br />
              Website: <a href="https://b2b-voice.com" className="text-primary hover:underline">b2b-voice.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Service Description</h2>
            <p>B2BVoice offers AI-powered voice assistant technology designed for businesses. Our platform enables automated call handling, appointment booking, CRM integration, and multilingual customer communication.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Disclaimer</h2>
            <p>The information provided on this website is for general informational purposes only. While we strive to keep all content accurate and up to date, we make no warranties of any kind regarding the completeness or accuracy of the information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">External Links</h2>
            <p>Our website may contain links to third-party websites. B2BVoice has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Intellectual Property</h2>
            <p>All content on this website — including text, graphics, logos, and software — is the property of B2BVoice and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">AI & Automated Processing Notice</h2>
            <p>B2BVoice uses artificial intelligence to process voice calls on behalf of our business clients. All AI interactions are conducted with the knowledge of the business deploying the service. Users interacting with a B2BVoice-powered assistant may request to speak with a human representative at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Contact</h2>
            <p>For any legal inquiries, please contact us at:<br />
            <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
