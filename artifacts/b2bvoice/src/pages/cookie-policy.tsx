import { Link } from "wouter";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-gray-800 mb-3">{children}</h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-gray-800 mt-5 mb-2">{children}</h3>
);

const UL = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc pl-5 mt-2 space-y-1">
    {items.map((it, i) => <li key={i}>{it}</li>)}
  </ul>
);

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-400 mb-1">Effective Date: July 22, 2026</p>
        <p className="text-sm text-gray-400 mb-10">Last Updated: July 22, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <p>This Cookie Policy explains how B2B Voice LLC, operating under the B2BVoice brand (“B2BVoice,” “we,” “us,” or “our”), may use cookies and similar technologies on the B2BVoice website.</p>
            <p className="mt-3">This Policy should be read together with our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section>
            <H2>1. What Are Cookies?</H2>
            <p>Cookies are small files that a website may store on your browser or device.</p>
            <p className="mt-3">Websites may use cookies and similar technologies to:</p>
            <UL items={[
              "Operate website features;", "Maintain security;", "Remember preferences;",
              "Understand how visitors use a website;", "Diagnose errors;",
              "Measure website and marketing performance.",
            ]} />
            <p className="mt-3">Similar technologies may include pixels, tags, local storage, software development kits, and server logs.</p>
          </section>

          <section>
            <H2>2. Cookies We May Use</H2>

            <H3>Strictly Necessary Cookies</H3>
            <p>These technologies support essential functions such as:</p>
            <UL items={[
              "Website security;", "Fraud and abuse prevention;", "Network management;",
              "Form operation;", "Session management;", "Saving privacy choices.",
            ]} />
            <p className="mt-3">Because these technologies are necessary to operate the website, they may not be capable of being disabled through a website preference tool.</p>

            <H3>Functional Cookies</H3>
            <p>Functional technologies may remember choices such as:</p>
            <UL items={[
              "Language;", "Display preferences;", "Form progress;", "Previously selected settings.",
            ]} />
            <p className="mt-3">Disabling them may reduce website functionality.</p>

            <H3>Analytics Cookies</H3>
            <p>If enabled, analytics technologies may help us understand:</p>
            <UL items={[
              "Which pages are visited;", "How visitors reach the website;",
              "How long visitors remain;", "Which features are used;",
              "Whether technical errors occur.",
            ]} />
            <p className="mt-3">We may use this information to improve website performance and user experience.</p>

            <H3>Advertising and Marketing Technologies</H3>
            <p>If enabled, advertising technologies may be used to:</p>
            <UL items={[
              "Measure advertising performance;",
              "Understand whether an advertisement led to a website visit;",
              "Limit repeated advertisements;",
              "Support audience measurement or targeted advertising.",
            ]} />
            <p className="mt-3">Depending on applicable state law, the use of some advertising technologies may constitute “sharing,” “sale,” or targeted advertising even when personal information is not sold for money.</p>
          </section>

          <section>
            <H2>3. Third-Party Technologies</H2>
            <p>Some cookies or similar technologies may be operated by third-party providers that support hosting, security, analytics, communications, embedded content, appointment scheduling, or advertising.</p>
            <p className="mt-3">Third parties may process information according to their own privacy policies.</p>
            <p className="mt-3">The technologies used on the website may change as we add, remove, or update website features.</p>
          </section>

          <section>
            <H2>4. Managing Cookies</H2>
            <p>You may manage or delete cookies through your browser settings.</p>
            <p className="mt-3">Most browsers allow you to:</p>
            <UL items={[
              "View stored cookies;", "Delete cookies;", "Block all or selected cookies;",
              "Block third-party cookies;", "Receive a warning before a cookie is stored.",
            ]} />
            <p className="mt-3">Blocking cookies may affect certain website features.</p>
            <p className="mt-3">Where B2BVoice provides a cookie preference tool, you may use that tool to update your choices.</p>
            <p className="mt-3">Where required by applicable law and technically supported, B2BVoice will recognize valid opt-out preference signals such as Global Privacy Control.</p>
            <p className="mt-3">Because there is no universally accepted standard for browser “Do Not Track” signals, our website may not respond to every Do Not Track signal.</p>
          </section>

          <section>
            <H2>5. Updates to This Cookie Policy</H2>
            <p>We may update this Cookie Policy when:</p>
            <UL items={[
              "Website technologies change;", "Service providers change;",
              "Our practices change;", "Legal requirements change.",
            ]} />
            <p className="mt-3">The “Last Updated” date identifies the latest version.</p>
          </section>

          <section>
            <H2>6. Contact Us</H2>
            <p>Questions about this Cookie Policy may be sent to:</p>
            <p className="mt-3">B2B Voice LLC<br />A New Mexico limited liability company<br />Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a><br />Website: b2b-voice.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
