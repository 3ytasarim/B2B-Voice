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

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Website Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-1">Effective Date: July 22, 2026</p>
        <p className="text-sm text-gray-400 mb-10">Last Updated: July 22, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <p>These Website Terms of Use (“Terms”) are a legally binding agreement between you and B2B Voice LLC, a New Mexico limited liability company operating under the B2BVoice brand (“B2BVoice,” “Company,” “we,” “us,” or “our”).</p>
            <p className="mt-3">These Terms govern your access to and use of:</p>
            <UL items={[
              "The B2BVoice website at b2b-voice.com;",
              "Website content, pages, forms, and interactive features;",
              "Free demonstrations;", "AI voice demonstrations;", "Web chat demonstrations;",
              "Contact and consultation request tools;",
              "Other publicly available online features that link to these Terms.",
            ]} />
            <p className="mt-3">By accessing or using the website, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
            <p className="mt-3">If you do not agree to these Terms, do not use the website or its interactive features.</p>
          </section>

          <section>
            <H2>1. Website Terms Only</H2>
            <p>These Terms govern use of the public B2BVoice website and related demonstration features.</p>
            <p className="mt-3">They do not by themselves govern paid implementation, development, subscription, consulting, telephony, messaging, integration, or managed services purchased from B2BVoice.</p>
            <p className="mt-3">Paid or customized services will be governed by a separate written agreement, proposal, order form, statement of work, master services agreement, or other contract.</p>
            <p className="mt-3">If a separate written agreement conflicts with these Terms, the separate written agreement will control with respect to the subject matter of that agreement.</p>
          </section>

          <section>
            <H2>2. Eligibility and Authority</H2>
            <p>You must be at least 18 years old to use the website’s business inquiry, consultation, or demonstration features.</p>
            <p className="mt-3">If you use the website on behalf of a company or other organization, you represent that:</p>
            <UL items={[
              "You have authority to act for that organization;",
              "You have authority to provide information submitted through the website;",
              "You have authority to accept these Terms on its behalf.",
            ]} />
          </section>

          <section>
            <H2>3. B2BVoice Services</H2>
            <p>B2BVoice designs and implements customized artificial intelligence and business automation solutions.</p>
            <p className="mt-3">Our services may include:</p>
            <UL items={[
              "AI voice assistants;", "Inbound and outbound telephone systems;", "AI receptionists;",
              "Call routing;", "Lead qualification;", "Appointment scheduling;",
              "SMS and messaging systems;", "Website chatbots;", "Email automations;",
              "CRM integrations;", "Calendar integrations;", "Custom API integrations;",
              "Workflow automations;", "Multilingual interactions;", "Call summaries and reporting;",
              "Other customized AI solutions.",
            ]} />
            <p className="mt-3">Descriptions on the website are general information only. Actual features, integrations, performance, availability, pricing, and project scope depend on the customer’s requirements and a separate written agreement.</p>
          </section>

          <section>
            <H2>4. No Binding Service Offer</H2>
            <p>Website content, demonstrations, examples, estimated pricing, case studies, and descriptions do not constitute a binding offer, guarantee, warranty, or promise to provide any specific service.</p>
            <p className="mt-3">Submitting a form, requesting a demonstration, scheduling a meeting, or communicating with an AI assistant does not:</p>
            <UL items={[
              "Create a customer relationship;", "Guarantee acceptance of a project;",
              "Guarantee a particular price;", "Reserve implementation capacity;",
              "Create an exclusive relationship;",
              "Create a fiduciary, employment, partnership, agency, or joint venture relationship.",
            ]} />
            <p className="mt-3">A binding customer relationship begins only when B2BVoice and the customer enter into an authorized written agreement.</p>
          </section>

          <section>
            <H2>5. AI Disclosure</H2>
            <p>Certain website, telephone, messaging, or demonstration features use artificial intelligence.</p>
            <p className="mt-3">When interacting with those features, you may be communicating with an automated AI system rather than a human.</p>
            <p className="mt-3">AI systems may:</p>
            <UL items={[
              "Generate spoken or written responses;", "Answer questions;", "Collect contact information;",
              "Ask qualifying questions;", "Schedule appointments;", "Send messages or emails;",
              "Transfer calls;", "Retrieve approved business information;", "Trigger connected workflows.",
            ]} />
            <p className="mt-3">AI-generated responses are probabilistic and may be inaccurate, incomplete, delayed, or inappropriate.</p>
            <p className="mt-3">You should not rely on an AI demonstration for:</p>
            <UL items={[
              "Medical advice;", "Legal advice;", "Financial advice;", "Emergency services;",
              "Safety-critical decisions;", "Binding price quotations;", "Final business commitments;",
              "Any decision requiring licensed professional judgment.",
            ]} />
            <p className="mt-3">Important information should be independently verified with an authorized human representative.</p>
          </section>

          <section>
            <H2>6. Demonstrations</H2>
            <p>B2BVoice may provide free or customized demonstrations.</p>
            <p className="mt-3">Demonstrations are provided solely to illustrate possible features and capabilities. A demonstration:</p>
            <UL items={[
              "May use sample, fictional, incomplete, or temporary data;",
              "May not reflect the final production configuration;",
              "May be modified or discontinued;", "May contain technical errors;",
              "May depend on third-party platforms;", "Is not a guarantee of future performance;",
              "Is not an acceptance test for a paid project unless agreed in writing.",
            ]} />
            <p className="mt-3">You may not use a demonstration to process unlawful, highly sensitive, confidential, or regulated information unless B2BVoice has expressly authorized that use in writing.</p>
          </section>

          <section>
            <H2>7. Call Recording, Transcription, and AI Processing</H2>
            <p>Calls, voice demonstrations, chat interactions, or other communications may be:</p>
            <UL items={[
              "Handled by an AI assistant;", "Recorded;", "Transcribed;", "Summarized;", "Analyzed;",
              "Routed to third-party systems;",
              "Reviewed for support, quality, security, or demonstration purposes.",
            ]} />
            <p className="mt-3">Where required by applicable law, notice or consent will be provided before recording or transcription begins.</p>
            <p className="mt-3">By continuing an interaction after receiving a recording or AI disclosure, you acknowledge that the disclosed processing may occur.</p>
            <p className="mt-3">If you do not consent to a recorded interaction, state that you do not consent and discontinue the interaction if no unrecorded alternative is offered.</p>
            <p className="mt-3">You may not use a B2BVoice demonstration to record another person without legally sufficient notice, consent, and authority.</p>
          </section>

          <section>
            <H2>8. Information You Submit</H2>
            <p>You may provide information through contact forms, demo requests, emails, calls, messages, or connected features.</p>
            <p className="mt-3">You represent and warrant that:</p>
            <UL items={[
              "The information is accurate to the best of your knowledge;",
              "You are authorized to provide it;",
              "Providing it does not violate another person’s rights;",
              "It does not contain unlawful, malicious, or infringing material;",
              "You will not submit highly sensitive information unless specifically requested through an authorized process.",
            ]} />
            <p className="mt-3">You retain ownership of information and materials you submit.</p>
            <p className="mt-3">You grant B2BVoice a non-exclusive, worldwide, royalty-free license to host, process, transmit, reproduce, and use submitted materials only as reasonably necessary to:</p>
            <UL items={[
              "Respond to your inquiry;", "Provide a requested demonstration;",
              "Evaluate a potential project;", "Operate website features;", "Protect security;",
              "Comply with law;", "Perform another purpose you authorize.",
            ]} />
            <p className="mt-3">This license ends when the relevant information is no longer reasonably needed, subject to legal, security, backup, and record-retention requirements.</p>
          </section>

          <section>
            <H2>9. Communications</H2>
            <p>By providing contact information, you authorize B2BVoice to contact you regarding:</p>
            <UL items={[
              "Your inquiry;", "Your requested demonstration;", "Your scheduled consultation;",
              "A proposal;", "A project;", "A support or security issue;",
              "A transaction or contractual matter.",
            ]} />
            <p className="mt-3">Submitting a general contact or demo form does not by itself constitute consent to receive unrelated automated marketing calls or text messages where separate consent is required by law.</p>
            <p className="mt-3">Any consent required for artificial voice calls, prerecorded calls, automated text messages, or promotional communications will be obtained separately where applicable.</p>
            <p className="mt-3">You may unsubscribe from promotional emails using the unsubscribe mechanism in the email or by contacting <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a>.</p>
          </section>

          <section>
            <H2>10. Privacy</H2>
            <p>Our collection and use of personal information is described in our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
            <p className="mt-3">By using the website, you acknowledge that information may be processed according to that Policy.</p>
          </section>

          <section>
            <H2>11. Intellectual Property</H2>
            <p>The website and its contents are owned by or licensed to B2B Voice LLC and are protected by applicable intellectual property laws.</p>
            <p className="mt-3">Protected materials may include:</p>
            <UL items={[
              "The B2BVoice name and branding;", "Logos;", "Website design;", "Text;", "Graphics;",
              "Images;", "Videos;", "Audio;", "Voice demonstrations;", "Software;", "Source code;",
              "Workflows;", "Prompts;", "Documentation;", "Databases;", "Training materials;",
              "Case studies;", "Downloadable resources;", "AI assistant designs.",
            ]} />
            <p className="mt-3">Subject to these Terms, B2BVoice grants you a limited, revocable, non-exclusive, non-transferable license to access and use the website for lawful internal business evaluation and informational purposes.</p>
            <p className="mt-3">No ownership rights are transferred to you.</p>
            <p className="mt-3">You may not, without prior written authorization:</p>
            <UL items={[
              "Copy or reproduce substantial website content;",
              "Republish or commercially exploit website materials;",
              "Modify or create derivative works;",
              "Remove copyright, trademark, or proprietary notices;",
              "Use B2BVoice branding in a misleading manner;",
              "Frame or mirror the website;", "Scrape or extract website data at scale;",
              "Reverse engineer website software or demonstration systems;",
              "Represent B2BVoice materials as your own;",
              "Use content to build or train a competing product or service.",
            ]} />
          </section>

          <section>
            <H2>12. Feedback</H2>
            <p>If you voluntarily provide ideas, suggestions, recommendations, or feedback concerning the website or B2BVoice services, you grant B2BVoice a perpetual, irrevocable, worldwide, transferable, sublicensable, royalty-free right to use and incorporate that feedback without restriction or compensation.</p>
            <p className="mt-3">This section does not transfer ownership of your confidential business information or customer data.</p>
          </section>

          <section>
            <H2>13. Acceptable Use</H2>
            <p>You may use the website only for lawful purposes.</p>
            <p className="mt-3">You may not:</p>
            <UL items={[
              "Violate any law or regulation;",
              "Engage in fraud, deception, harassment, or abuse;",
              "Impersonate a person or organization;",
              "Misrepresent your identity or affiliation;",
              "Submit information without authorization;",
              "Infringe intellectual property, privacy, publicity, or contractual rights;",
              "Upload malware, viruses, malicious code, or harmful content;",
              "Attempt unauthorized access;",
              "Probe, scan, or test system vulnerabilities without written authorization;",
              "Interfere with website availability or security;",
              "Conduct denial-of-service activity;", "Circumvent technical controls;",
              "Use bots or automated systems to access the website in an abusive manner;",
              "Scrape or harvest contact information;",
              "Use the website for unauthorized spam or telemarketing;",
              "Use AI features for unlawful surveillance;",
              "Clone or imitate a person’s voice without authorization;",
              "Use demonstrations for illegal robocalling;",
              "Collect sensitive information through the demonstration without authorization;",
              "Use the website to discriminate or make unlawful eligibility decisions;",
              "Use the website for emergency, life-safety, or high-risk decisions;",
              "Assist another person in prohibited conduct.",
            ]} />
            <p className="mt-3">B2BVoice may restrict or terminate access when it reasonably believes these Terms have been violated or continued access creates legal, security, operational, or reputational risk.</p>
          </section>

          <section>
            <H2>14. Third-Party Services</H2>
            <p>The website and demonstrations may rely on or link to third-party services, including providers of:</p>
            <UL items={[
              "Hosting;", "Telecommunications;", "Messaging;", "Artificial intelligence;",
              "Speech recognition;", "Text-to-speech;", "Scheduling;", "Email;", "CRM systems;",
              "Workflow automation;", "Analytics;", "Payment processing.",
            ]} />
            <p className="mt-3">Third-party services may experience interruptions, errors, changes, or security incidents.</p>
            <p className="mt-3">B2BVoice does not control independent third-party services and is not responsible for their availability, content, policies, or independent actions.</p>
            <p className="mt-3">Your use of a third-party service may be governed by separate terms and privacy policies.</p>
          </section>

          <section>
            <H2>15. Website Availability and Changes</H2>
            <p>We may:</p>
            <UL items={[
              "Modify the website;", "Add or remove content;", "Change demonstrations;",
              "Suspend features;", "Restrict access;", "Perform maintenance;",
              "Discontinue all or part of the website.",
            ]} />
            <p className="mt-3">We do not guarantee that the website or any feature will be continuously available, uninterrupted, secure, or error-free.</p>
          </section>

          <section>
            <H2>16. No Professional Advice</H2>
            <p>Website content and AI-generated responses are provided for general business information and demonstration purposes.</p>
            <p className="mt-3">Nothing on the website constitutes:</p>
            <UL items={[
              "Legal advice;", "Medical advice;", "Financial advice;", "Tax advice;",
              "Regulatory advice;", "Professional consulting advice for a specific situation.",
            ]} />
            <p className="mt-3">You should consult an appropriately licensed professional before acting on matters requiring professional judgment.</p>
          </section>

          <section>
            <H2>17. Disclaimer of Warranties</H2>
            <p>TO THE FULLEST EXTENT PERMITTED BY LAW, THE WEBSITE, CONTENT, DEMONSTRATIONS, AND PUBLICLY AVAILABLE FEATURES ARE PROVIDED “AS IS” AND “AS AVAILABLE.”</p>
            <p className="mt-3">B2BVOICE DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WARRANTIES OF:</p>
            <UL items={[
              "MERCHANTABILITY;", "FITNESS FOR A PARTICULAR PURPOSE;", "TITLE;",
              "NON-INFRINGEMENT;", "ACCURACY;", "RELIABILITY;", "AVAILABILITY;", "SECURITY;",
              "ERROR-FREE OPERATION.",
            ]} />
            <p className="mt-3">B2BVOICE DOES NOT WARRANT THAT:</p>
            <UL items={[
              "AI OUTPUTS WILL BE ACCURATE;",
              "DEMONSTRATIONS WILL MATCH A FINAL PRODUCTION SYSTEM;",
              "THE WEBSITE WILL BE UNINTERRUPTED;", "DEFECTS WILL BE CORRECTED;",
              "THE WEBSITE WILL BE FREE OF HARMFUL COMPONENTS;",
              "ANY PARTICULAR BUSINESS RESULT WILL BE ACHIEVED.",
            ]} />
            <p className="mt-3">Some jurisdictions do not permit certain warranty exclusions. In those jurisdictions, exclusions apply only to the extent legally permitted.</p>
          </section>

          <section>
            <H2>18. Limitation of Liability</H2>
            <p>TO THE FULLEST EXTENT PERMITTED BY LAW, B2BVOICE AND ITS MEMBERS, MANAGERS, OFFICERS, EMPLOYEES, CONTRACTORS, AFFILIATES, SERVICE PROVIDERS, LICENSORS, AND AGENTS WILL NOT BE LIABLE FOR ANY:</p>
            <UL items={[
              "INDIRECT DAMAGES;", "INCIDENTAL DAMAGES;", "SPECIAL DAMAGES;",
              "EXEMPLARY DAMAGES;", "PUNITIVE DAMAGES;", "CONSEQUENTIAL DAMAGES;",
              "LOST PROFITS;", "LOST REVENUE;", "LOST BUSINESS;", "LOST OPPORTUNITIES;",
              "LOSS OF GOODWILL;", "LOSS OR CORRUPTION OF DATA;", "BUSINESS INTERRUPTION;",
              "COST OF SUBSTITUTE SERVICES.",
            ]} />
            <p className="mt-3">THIS LIMITATION APPLIES REGARDLESS OF THE THEORY OF LIABILITY AND EVEN IF B2BVOICE WAS ADVISED THAT SUCH DAMAGES WERE POSSIBLE.</p>
            <p className="mt-3">TO THE FULLEST EXTENT PERMITTED BY LAW, THE TOTAL AGGREGATE LIABILITY OF B2BVOICE ARISING FROM OR RELATING TO YOUR USE OF THE PUBLIC WEBSITE OR A FREE DEMONSTRATION WILL NOT EXCEED ONE HUNDRED UNITED STATES DOLLARS (US $100).</p>
            <p className="mt-3">These limitations do not apply to liability that cannot lawfully be excluded or limited.</p>
            <p className="mt-3">Liability relating to paid services is governed by the applicable written customer agreement.</p>
          </section>

          <section>
            <H2>19. Indemnification</H2>
            <p>To the fullest extent permitted by law, you agree to defend, indemnify, and hold harmless B2B Voice LLC and its members, managers, officers, employees, contractors, affiliates, service providers, and agents from claims, liabilities, damages, losses, penalties, fines, costs, and reasonable attorneys’ fees arising from or relating to:</p>
            <UL items={[
              "Your unlawful use of the website;", "Your misuse of a demonstration;",
              "Your violation of these Terms;", "Information or materials you submit;",
              "Your infringement of another person’s rights;",
              "Your violation of recording, privacy, telecommunications, advertising, or consent laws;",
              "Your use of website content outside the permission granted by these Terms.",
            ]} />
            <p className="mt-3">B2BVoice may assume control of the defense of a claim subject to indemnification, and you agree to reasonably cooperate.</p>
          </section>

          <section>
            <H2>20. Copyright and Trademark Concerns</H2>
            <p>If you believe material on the website infringes your copyright, trademark, or other intellectual property rights, contact:</p>
            <p className="mt-3">Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a><br />Subject: Intellectual Property Notice</p>
            <p className="mt-3">Your notice should include:</p>
            <UL items={[
              "Identification of the protected work;",
              "Identification of the allegedly infringing material;",
              "Your contact information;",
              "A statement explaining your good-faith belief;",
              "Evidence that you own or are authorized to act for the rights holder;",
              "Your physical or electronic signature.",
            ]} />
            <p className="mt-3">Knowingly submitting a false infringement claim may result in legal liability.</p>
          </section>

          <section>
            <H2>21. Suspension and Termination</H2>
            <p>We may suspend or terminate your access to the website or interactive features when:</p>
            <UL items={[
              "You violate these Terms;", "Your activity threatens security or availability;",
              "Your activity creates legal risk;", "We are required to do so by law;",
              "We discontinue the relevant feature.",
            ]} />
            <p className="mt-3">Provisions that by their nature should survive termination will survive, including provisions concerning intellectual property, disclaimers, limitations of liability, indemnification, and dispute terms.</p>
          </section>

          <section>
            <H2>22. Governing Law and Venue</H2>
            <p>These Terms are governed by the laws of the State of New Mexico, without regard to conflict-of-law principles.</p>
            <p className="mt-3">Subject to any law requiring otherwise, you agree that disputes arising from or relating to these Terms or the public website will be brought exclusively in a state or federal court with jurisdiction in New Mexico.</p>
            <p className="mt-3">You consent to the personal jurisdiction of those courts.</p>
          </section>

          <section>
            <H2>23. Changes to These Terms</H2>
            <p>We may update these Terms from time to time.</p>
            <p className="mt-3">The revised Terms will become effective when posted unless a later effective date is stated.</p>
            <p className="mt-3">The “Last Updated” date will identify the most recent revision.</p>
            <p className="mt-3">Your continued use of the website after revised Terms become effective constitutes acceptance of the revised Terms.</p>
            <p className="mt-3">Material changes affecting paid customers will be handled under the applicable customer agreement.</p>
          </section>

          <section>
            <H2>24. General Provisions</H2>

            <H3>Entire Agreement</H3>
            <p>These Terms and the Privacy Policy constitute the entire agreement concerning use of the public website, except where a separate written agreement applies.</p>

            <H3>Severability</H3>
            <p>If any provision is found unenforceable, it will be enforced to the maximum extent permitted, and the remaining provisions will remain effective.</p>

            <H3>No Waiver</H3>
            <p>Failure to enforce a provision does not waive the right to enforce it later.</p>

            <H3>Assignment</H3>
            <p>You may not assign your rights or obligations under these Terms without our written consent.</p>
            <p className="mt-3">B2BVoice may assign these Terms as part of a merger, acquisition, restructuring, sale of assets, or transfer of the website or business.</p>

            <H3>No Third-Party Beneficiaries</H3>
            <p>These Terms do not create rights for any person or entity other than you and B2BVoice.</p>

            <H3>Electronic Communications</H3>
            <p>You agree that notices, disclosures, agreements, and communications provided electronically satisfy legal requirements that such communications be in writing.</p>

            <H3>Headings</H3>
            <p>Section headings are for convenience only and do not affect interpretation.</p>
          </section>

          <section>
            <H2>25. Contact Information</H2>
            <p>Questions regarding these Terms may be sent to:</p>
            <p className="mt-3">B2B Voice LLC<br />A New Mexico limited liability company<br />Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a><br />Website: b2b-voice.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
