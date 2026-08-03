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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-10 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-1">Effective Date: July 22, 2026</p>
        <p className="text-sm text-gray-400 mb-10">Last Updated: July 22, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <p>B2B Voice LLC (“B2BVoice,” “Company,” “we,” “us,” or “our”) respects your privacy and is committed to handling personal information responsibly and transparently.</p>
            <p className="mt-3">This Privacy Policy explains how we collect, use, disclose, retain, and protect personal information when you:</p>
            <UL items={[
              "Visit or interact with the B2BVoice website at b2b-voice.com;",
              "Request information, contact us, or submit a demo request;",
              "Communicate with us by phone, email, SMS, messaging applications, web chat, or social media;",
              "Interact with a B2BVoice artificial intelligence assistant, voice demonstration, chatbot, or automated communication system;",
              "Purchase, evaluate, or use our products and services;",
              "Call, message, or otherwise interact with an AI assistant operated by B2BVoice on behalf of one of our business customers.",
            ]} />
            <p className="mt-3">By using our website or interacting with our services, you acknowledge the practices described in this Privacy Policy.</p>
          </section>

          <section>
            <H2>1. Scope of This Privacy Policy</H2>
            <p>This Privacy Policy applies to personal information that B2BVoice collects for its own business purposes, including information relating to website visitors, prospective customers, customers, business contacts, and individuals who communicate directly with us.</p>
            <p className="mt-3">B2BVoice also provides customized AI voice agents, telephone systems, chat systems, workflow automations, appointment scheduling systems, CRM integrations, messaging solutions, and related AI services to business customers.</p>
            <p className="mt-3">When B2BVoice processes personal information solely on behalf of a business customer, that customer generally determines why and how the information is processed. In those circumstances, B2BVoice acts as a service provider or processor to that customer.</p>
            <p className="mt-3">If you interacted with an AI assistant operated for one of our customers and wish to exercise privacy rights regarding that interaction, you should normally contact the business whose assistant you interacted with. We will reasonably assist our customer in responding to valid requests as required by applicable law and our agreement with that customer.</p>
            <p className="mt-3">This Privacy Policy does not replace the privacy notice of a B2BVoice customer.</p>
          </section>

          <section>
            <H2>2. Personal Information We Collect</H2>
            <p>The information we collect depends on how you interact with us and which services are used.</p>

            <H3>2.1 Contact and Identity Information</H3>
            <p>We may collect:</p>
            <UL items={[
              "First and last name;", "Business name;", "Job title or professional role;", "Email address;",
              "Telephone number;", "Mailing address;", "Social media or messaging account details;",
              "Other identifiers you voluntarily provide.",
            ]} />

            <H3>2.2 Business and Professional Information</H3>
            <p>We may collect:</p>
            <UL items={[
              "Industry and business type;", "Company size;", "Business location;", "Operational requirements;",
              "Current telephone, CRM, scheduling, messaging, or workflow systems;", "Requested integrations;",
              "Sales, support, scheduling, customer service, or automation requirements;",
              "Information about your authority to represent a company;",
              "Notes from meetings, demonstrations, and sales discussions.",
            ]} />

            <H3>2.3 Communications and Inquiry Information</H3>
            <p>We may collect information contained in:</p>
            <UL items={[
              "Contact forms;", "Demo requests;", "Emails;", "SMS or messaging conversations;",
              "Web chat conversations;", "Customer support requests;", "Meeting notes;",
              "Social media communications;", "Feedback, surveys, or testimonials;",
              "Documents or files you choose to provide.",
            ]} />
            <p className="mt-3">Please do not provide Social Security numbers, financial account passwords, medical records, government identification numbers, or other highly sensitive information unless B2BVoice has specifically requested the information through an authorized and appropriately protected process.</p>

            <H3>2.4 Voice, Call, and Messaging Information</H3>
            <p>When you call, message, or interact with a B2BVoice AI assistant, we may collect:</p>
            <UL items={[
              "Caller or sender telephone number;", "Recipient telephone number;",
              "Date, time, and duration of the interaction;", "Call routing information;",
              "Call status and technical logs;", "Voicemails;", "SMS or messaging content;",
              "Call recordings, where recording is enabled and legally permitted;",
              "Transcripts or summaries of conversations;",
              "Information voluntarily provided during the interaction;", "Appointment details;",
              "Lead qualification information;", "Requested services;",
              "Sentiment, intent, or interaction classifications generated by the system;",
              "Information transmitted to a customer’s CRM, calendar, email, spreadsheet, or other connected system.",
            ]} />
            <p className="mt-3">Where required by applicable law, notice or consent will be provided before a conversation is recorded or transcribed.</p>

            <H3>2.5 AI Interaction Information</H3>
            <p>When you interact with an AI-powered feature, we may process:</p>
            <UL items={[
              "Your spoken or written input;", "AI-generated responses;", "Conversation context;",
              "Language preferences;", "Selected voice or assistant settings;",
              "Tool calls or actions requested during the interaction;", "System performance information;",
              "Error reports;", "Safety and abuse-detection signals.",
            ]} />
            <p className="mt-3">You may be interacting with an automated artificial intelligence system rather than a human. AI-generated communications may contain mistakes, incomplete information, or unexpected responses.</p>

            <H3>2.6 Customer and Integration Data</H3>
            <p>Customers may connect B2BVoice services to third-party platforms such as:</p>
            <UL items={[
              "Customer relationship management systems;", "Calendars and appointment platforms;",
              "Email providers;", "Telephone and messaging systems;", "Websites and web forms;",
              "Spreadsheets and databases;", "Help desk systems;", "Property management systems;",
              "Practice management systems;", "Other APIs, applications, and business tools.",
            ]} />
            <p className="mt-3">Depending on the customer’s configuration, we may process information received from or transmitted to those connected systems.</p>
            <p className="mt-3">Customers are responsible for ensuring that they have the legal authority to provide information to B2BVoice and to instruct us to process it.</p>

            <H3>2.7 Transaction and Payment Information</H3>
            <p>If you purchase services from us, we may collect:</p>
            <UL items={[
              "Billing contact details;", "Billing address;", "Transaction amount;",
              "Subscription or project information;", "Payment status;", "Invoice and payment history;",
              "Limited payment-related identifiers.",
            ]} />
            <p className="mt-3">Payment card information may be processed directly by an independent payment processor. B2BVoice does not intend to store complete payment card numbers or card security codes on its own systems.</p>

            <H3>2.8 Technical and Website Usage Information</H3>
            <p>When you use our website or online services, we or our providers may automatically collect:</p>
            <UL items={[
              "IP address;", "Browser type;", "Device type;", "Operating system;", "Referring website;",
              "Pages viewed;", "Approximate geographic location derived from IP address;",
              "Dates and times of access;", "Click and navigation activity;", "Session information;",
              "Diagnostic information;", "Security and fraud-prevention information;",
              "Cookie and similar technology identifiers.",
            ]} />
          </section>

          <section>
            <H2>3. Sources of Personal Information</H2>
            <p>We may obtain personal information:</p>
            <UL items={[
              "Directly from you;", "From your employer or organization;", "From a B2BVoice customer;",
              "From callers, message senders, or other individuals interacting with an AI assistant;",
              "From connected CRM, calendar, telephone, messaging, email, or business systems;",
              "From service providers;", "From publicly available business sources;",
              "From referrals and business partners;",
              "Automatically through websites, calls, systems, cookies, logs, and similar technologies.",
            ]} />
          </section>

          <section>
            <H2>4. How We Use Personal Information</H2>
            <p>We may use personal information to:</p>

            <H3>4.1 Provide and Operate Our Services</H3>
            <UL items={[
              "Respond to inquiries;", "Schedule consultations or demonstrations;",
              "Design, configure, test, and operate AI assistants;", "Route and manage calls and messages;",
              "Schedule appointments;", "Generate call summaries and transcripts;",
              "Send requested emails or messages;", "Connect systems and APIs;", "Provide customer support;",
              "Maintain customer accounts and project records;", "Process payments and invoices;",
              "Perform contractual obligations.",
            ]} />

            <H3>4.2 Customize AI and Automation Systems</H3>
            <UL items={[
              "Configure assistants using customer-provided business information;",
              "Build conversation workflows;", "Create prompts and knowledge bases;",
              "Connect third-party tools;", "Test language, routing, scheduling, and messaging functions;",
              "Improve the relevance and functionality of customer-specific systems.",
            ]} />

            <H3>4.3 Communicate With You</H3>
            <UL items={[
              "Reply to questions;", "Send service-related notices;", "Confirm appointments;",
              "Provide project updates;", "Send requested demonstrations;",
              "Discuss proposals and contracts;",
              "Notify you of changes to our services, policies, or security;",
              "Send marketing communications where permitted by law.",
            ]} />
            <p className="mt-3">You may unsubscribe from marketing emails by using the unsubscribe option in the message or contacting us. You may still receive non-promotional communications relating to an active request, project, transaction, or contractual relationship.</p>

            <H3>4.4 Maintain, Protect, and Improve Our Services</H3>
            <UL items={[
              "Monitor system performance;", "Diagnose technical problems;",
              "Prevent fraud, misuse, spam, and security incidents;",
              "Evaluate call quality and assistant performance;",
              "Improve reliability, response quality, and user experience;",
              "Develop new products and features;", "Conduct internal analytics;",
              "Create aggregated or de-identified business insights;",
              "Enforce our agreements and policies.",
            ]} />

            <H3>4.5 Comply With Law and Protect Rights</H3>
            <UL items={[
              "Comply with legal obligations;", "Respond to lawful requests from authorities;",
              "Establish, exercise, or defend legal claims;",
              "Protect B2BVoice, our customers, users, and the public;",
              "Investigate suspected fraud, misuse, security incidents, or unlawful conduct;",
              "Enforce applicable agreements.",
            ]} />
          </section>

          <section>
            <H2>5. Artificial Intelligence and Automated Processing</H2>
            <p>B2BVoice uses artificial intelligence and automated technologies to provide voice, chat, telephone, messaging, workflow, and integration services.</p>
            <p className="mt-3">These technologies may be used to:</p>
            <UL items={[
              "Recognize speech;", "Convert speech into text;", "Convert text into synthetic speech;",
              "Generate responses;", "Identify the purpose of an interaction;",
              "Classify or summarize conversations;", "Route calls or messages;", "Collect information;",
              "Schedule appointments;", "Trigger workflows;", "Send information to connected systems;",
              "Assist with quality assurance and system improvement.",
            ]} />
            <p className="mt-3">AI outputs are probabilistic and may not always be accurate, complete, or appropriate. Users and customers should independently review important information and maintain appropriate human oversight.</p>
            <p className="mt-3">B2BVoice may use interaction data to maintain, secure, evaluate, and improve its services. Where required by law or contract, we will use aggregated or de-identified information, apply contractual restrictions, or obtain appropriate authorization.</p>
            <p className="mt-3">B2BVoice does not authorize customers or users to use our services for unlawful impersonation, deception, unauthorized voice cloning, unlawful telemarketing, discrimination, harassment, fraud, or other illegal activity.</p>
          </section>

          <section>
            <H2>6. How We Disclose Personal Information</H2>
            <p>We may disclose personal information to the following categories of recipients.</p>

            <H3>6.1 B2BVoice Customers</H3>
            <p>If you interact with an AI assistant operated on behalf of a business customer, information from the interaction may be provided to that customer and its authorized personnel.</p>
            <p className="mt-3">This may include call recordings, transcripts, summaries, contact details, appointment information, lead information, and other details collected during the interaction.</p>

            <H3>6.2 Service Providers and Subcontractors</H3>
            <p>We may engage providers that support:</p>
            <UL items={[
              "Cloud hosting;", "Telephony and telephone numbers;", "SMS and messaging;",
              "Speech recognition;", "Text-to-speech technology;", "Artificial intelligence models;",
              "Workflow automation;", "Email delivery;", "Calendar and appointment scheduling;",
              "CRM and business integrations;", "Website hosting;", "Analytics;",
              "Security and monitoring;", "Customer support;", "Payment processing;",
              "Professional services.",
            ]} />
            <p className="mt-3">These providers may process information only as needed to perform services for B2BVoice, subject to applicable agreements and legal requirements.</p>

            <H3>6.3 Connected Third-Party Services</H3>
            <p>When a customer or user directs us to connect B2BVoice with an external system, information may be transmitted to and from that system.</p>
            <p className="mt-3">Third-party systems are governed by their own privacy policies and terms. B2BVoice is not responsible for the independent privacy practices of third parties.</p>

            <H3>6.4 Professional Advisers</H3>
            <p>We may disclose information to attorneys, accountants, auditors, insurers, consultants, and other professional advisers where reasonably necessary.</p>

            <H3>6.5 Legal, Safety, and Compliance Disclosures</H3>
            <p>We may disclose information when we reasonably believe disclosure is necessary to:</p>
            <UL items={[
              "Comply with law, regulation, subpoena, court order, or legal process;",
              "Respond to a lawful government request;",
              "Protect the rights, property, or safety of B2BVoice, our customers, users, or others;",
              "Investigate fraud, security issues, or violations of our agreements;",
              "Establish, exercise, or defend legal claims.",
            ]} />

            <H3>6.6 Business Transactions</H3>
            <p>Information may be disclosed or transferred as part of a merger, acquisition, financing, reorganization, bankruptcy, sale of assets, or similar business transaction.</p>

            <H3>6.7 With Your Direction or Consent</H3>
            <p>We may disclose information when you direct us to do so or otherwise provide consent.</p>

            <H3>6.8 Aggregated and De-Identified Information</H3>
            <p>We may use and disclose aggregated or de-identified information that cannot reasonably be linked to an identifiable individual, subject to applicable law.</p>
          </section>

          <section>
            <H2>7. Sale and Sharing of Personal Information</H2>
            <p>B2BVoice does not sell personal information in exchange for money.</p>
            <p className="mt-3">We may use analytics, advertising, or similar technologies that involve disclosing online identifiers or website activity to third-party providers. Depending on applicable state law, certain disclosures for targeted advertising may be considered “sharing,” “sale,” or targeted advertising even when no money is exchanged.</p>
            <p className="mt-3">Where required by applicable law, we will provide an appropriate method to opt out.</p>
            <p className="mt-3">We do not knowingly sell or share the personal information of individuals under 16 years of age.</p>
          </section>

          <section>
            <H2>8. Cookies and Similar Technologies</H2>
            <p>We may use cookies, pixels, local storage, log files, and similar technologies to:</p>
            <UL items={[
              "Operate the website;", "Maintain security;", "Remember preferences;",
              "Diagnose technical issues;", "Understand website usage;",
              "Measure marketing performance;", "Improve our services.",
            ]} />
            <p className="mt-3">More information is provided in our Cookie Policy.</p>
            <p className="mt-3">You may manage cookies through your browser or device settings. Disabling certain technologies may affect website functionality.</p>
            <p className="mt-3">Our response to browser-based privacy signals may depend on applicable law and the technical capabilities of our systems. Where legally required, we will recognize supported opt-out preference signals, such as Global Privacy Control.</p>
            <p className="mt-3">Because there is currently no universally accepted standard for browser “Do Not Track” signals, our website may not respond to every Do Not Track signal.</p>
          </section>

          <section>
            <H2>9. Data Retention</H2>
            <p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including to:</p>
            <UL items={[
              "Provide services;", "Complete projects;", "Maintain business and transaction records;",
              "Satisfy contractual commitments;", "Resolve disputes;", "Protect security;",
              "Enforce agreements;", "Comply with legal, tax, accounting, and regulatory obligations.",
            ]} />
            <p className="mt-3">Retention periods vary depending on:</p>
            <UL items={[
              "The type and sensitivity of the information;", "The nature of the interaction;",
              "Customer instructions;", "Contractual requirements;", "Legal obligations;",
              "Security needs;", "Whether an account, project, or business relationship remains active.",
            ]} />
            <p className="mt-3">Call recordings, transcripts, messages, and related records may be retained according to customer configuration, contractual requirements, operational needs, or applicable law.</p>
            <p className="mt-3">When information is no longer reasonably required, we may delete it, de-identify it, or securely isolate it until deletion is possible. Information may remain temporarily in backups or disaster-recovery systems.</p>
          </section>

          <section>
            <H2>10. Data Security</H2>
            <p>We use reasonable administrative, technical, and organizational safeguards designed to protect personal information.</p>
            <p className="mt-3">These safeguards may include:</p>
            <UL items={[
              "Access controls;", "Authentication measures;", "Role-based permissions;",
              "Encryption where appropriate;", "Logging and monitoring;", "Security reviews;",
              "Vendor management;", "Data minimization;", "Backup and recovery measures;",
              "Incident response procedures.",
            ]} />
            <p className="mt-3">No method of transmission or storage is completely secure. We cannot guarantee that information will never be accessed, disclosed, altered, lost, or destroyed.</p>
            <p className="mt-3">You are responsible for protecting credentials, devices, systems, and accounts under your control.</p>
          </section>

          <section>
            <H2>11. Your Privacy Rights</H2>
            <p>Depending on where you live and subject to applicable law, you may have the right to:</p>
            <UL items={[
              "Confirm whether we process your personal information;", "Access personal information;",
              "Correct inaccurate personal information;", "Request deletion of personal information;",
              "Obtain a portable copy of certain information;",
              "Opt out of the sale of personal information;",
              "Opt out of sharing for targeted advertising;",
              "Opt out of certain profiling or automated decision-making;",
              "Limit certain uses of sensitive personal information;",
              "Withdraw consent where processing is based on consent;",
              "Appeal a denial of a privacy request;",
              "Receive equal service and not be discriminated against for exercising privacy rights.",
            ]} />
            <p className="mt-3">These rights are not absolute. Applicable law may permit or require us to retain information or deny a request in certain circumstances.</p>
            <p className="mt-3">To submit a privacy request, contact:</p>
            <p className="mt-3">Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a><br />Subject line: Privacy Request</p>
            <p className="mt-3">Please describe your request and the interaction, project, customer, telephone number, or email address involved.</p>
            <p className="mt-3">We may need to verify your identity before completing a request. Verification information will be used only for verification and security purposes.</p>
            <p className="mt-3">An authorized agent may submit a request where permitted by law. We may require proof of authorization and may need to verify the consumer’s identity directly.</p>
            <p className="mt-3">If B2BVoice processed the information solely on behalf of a customer, we may refer the request to that customer.</p>
          </section>

          <section>
            <H2>12. Marketing and Communication Choices</H2>
            <p>You may opt out of promotional emails by:</p>
            <UL items={[
              "Selecting the unsubscribe link in an email; or",
              <>Contacting <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a>.</>,
            ]} />
            <p className="mt-3">You may request that we stop non-essential promotional text messages by replying STOP where that function is available.</p>
            <p className="mt-3">Opting out of marketing will not prevent us from sending communications relating to:</p>
            <UL items={[
              "An active inquiry;", "A requested demonstration;", "A scheduled appointment;",
              "A project;", "A payment;", "A security matter;", "A contractual relationship;",
              "A legal notice.",
            ]} />
            <p className="mt-3">Submitting a contact or demo form does not automatically authorize unrelated automated marketing calls or messages. Where legally required, consent for automated or promotional communications will be obtained separately.</p>
          </section>

          <section>
            <H2>13. Call Recording and Transcription</H2>
            <p>Calls or AI interactions may be recorded, transcribed, summarized, or analyzed when the feature is enabled.</p>
            <p className="mt-3">Where required by applicable law, notice will be provided or consent will be requested before recording or transcription begins.</p>
            <p className="mt-3">If you do not wish to participate in a recorded interaction, you should state that you do not consent and discontinue the call if an alternative is not available.</p>
            <p className="mt-3">Customers using B2BVoice services are responsible for configuring and operating their systems in compliance with applicable recording, consent, privacy, advertising, and telecommunications laws.</p>
          </section>

          <section>
            <H2>14. Children’s Privacy</H2>
            <p>The B2BVoice website and services are intended for businesses and adults. They are not directed to children under 13 years of age.</p>
            <p className="mt-3">We do not knowingly collect personal information directly from children under 13 without legally sufficient authorization.</p>
            <p className="mt-3">If you believe a child has provided personal information to us, contact <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a> so that we can investigate and take appropriate action.</p>
          </section>

          <section>
            <H2>15. Third-Party Websites and Services</H2>
            <p>Our website and services may contain links to or integrations with third-party websites, platforms, applications, and services.</p>
            <p className="mt-3">We do not control and are not responsible for the privacy, security, availability, or content practices of independent third parties. You should review the policies of any third-party service you use.</p>
          </section>

          <section>
            <H2>16. International Processing</H2>
            <p>B2B Voice LLC is based in the United States.</p>
            <p className="mt-3">Personal information may be processed in the United States and in other jurisdictions where B2BVoice, its customers, or its service providers operate.</p>
            <p className="mt-3">Privacy laws in those jurisdictions may differ from the laws of your location.</p>
            <p className="mt-3">Additional contractual or legal safeguards may apply where required by applicable law or a customer agreement.</p>
          </section>

          <section>
            <H2>17. Changes to This Privacy Policy</H2>
            <p>We may update this Privacy Policy from time to time to reflect changes in:</p>
            <UL items={[
              "Our services;", "Our data practices;", "Technology;", "Legal requirements;",
              "Business operations.",
            ]} />
            <p className="mt-3">When we update the Policy, we will revise the “Last Updated” date. We may provide additional notice of material changes where appropriate.</p>
          </section>

          <section>
            <H2>18. Contact Us</H2>
            <p>Questions, concerns, and privacy requests may be sent to:</p>
            <p className="mt-3">B2B Voice LLC<br />A New Mexico limited liability company<br />Email: <a href="mailto:hello@b2b-voice.com" className="text-primary hover:underline">hello@b2b-voice.com</a><br />Website: b2b-voice.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
