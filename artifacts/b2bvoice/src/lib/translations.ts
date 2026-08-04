export type Lang = "en" | "de" | "es";

export interface Translations {
  nav: { home: string; features: string; industries: string; howItWorks: string; faq: string; requestDemo: string; active: string };
  hero: { badge: string; h1: string; h2: string; sub: string; cta1: string; cta2: string; liveCall: string; activeCall: string; savedToCRM: string; summarySent: string; connectingCall: string; listeningToCustomer: string; appointmentCreated: string; demoBadge: string; talkTitle: string; talkNow: string; talkDesc: string; tapToCall: string; dialNow: string };
  trust: { alwaysOn: string; languages: string; responseTime: string; integration: string };
  problem: { badge: string; heading: string; items: { title: string; desc: string }[] };
  solution: { badge: string; heading: string; sub: string; steps: { title: string; desc: string }[] };
  features: {
    badge: string; heading: string; sub: string; seeAll: string;
    api: { title: string; desc: string };
    reporting: { title: string; desc: string };
    multilang: { title: string; desc: string };
    appointment: { title: string; desc: string };
    drAppt: string; confirmed: string; getStarted: string;
    smartRouting: { title: string; desc: string };
    gdpr: { title: string; desc: string };
  };
  powerful: {
    badge: string; heading1: string; heading2: string; sub: string;
    card1: { badge: string; title: string; desc: string };
    card2: { title: string; desc: string };
    card3: { title: string; desc: string };
    card4: { title: string; desc: string };
    card5: { title: string; desc: string };
    card6: { title: string; desc: string };
    card7: { title: string; desc: string };
    card8: { title: string; desc: string };
    orbitLabels: string[];
    callLabel: string; connected: string; demoReady: string; incomingCall: string; leadCaptured: string;
  };
  languages: {
    badge: string; heading: string; sub: string; desc: string; activeLanguage: string; languagesLabel: string; active: string; totalLanguages: string; responseTime: string; availability: string; names: string[];
  };
  industries: { badge: string; heading: string; span: string; sub: string; scrollLabel: string; items: { title: string; features: string[] }[] };
  integrations: { badge: string; heading: string; sub: string; hub: string };
  dashboard: {
    badge: string; heading: string; menu: string[];
    stats: { label: string; val: string }[];
    weeklySummary: string; recentCalls: string; todayAppts: string;
    calls: { name: string; time: string; status: string; color: string }[];
    apts: { time: string; title: string }[];
  };
  howItWorks: { badge: string; heading: string; sub: string; steps: { title: string; desc: string }[] };
  testimonials: { badge: string; heading: string; items: { quote: string; author: string; role: string; metric: string }[] };
  demo: { badge: string; heading: string; span: string; sub: string; customDemo: string; allTab: string; listenSample: string; cards: { role: string; desc: string; industry: string }[] };
  pricing: { badge: string; heading: string; sub: string; cta: string; features: string[] };
  faq: { badge: string; heading: string; items: { q: string; a: string }[]; setup: { heading: string; sub: string; points: string[]; duration: string } };
  finalCta: { heading: string; span: string; sub: string; desc: string; cta1: string; cta2: string };
  finalCta2: { heading: string; span: string; desc: string; cta1: string };
  footer: { tagline: string; product: string; productLinks: string[]; industries: string; industryLinks: string[]; support: string; supportLinks: string[]; allRights: string; privacy: string; privacyPolicy: string; terms: string };
  modal: {
    title: string; sub: string; stepLabels: string[];
    businessTypes: string[]; demoNeeds: string[];
    demoTypes: { value: string; label: string; desc: string }[];
    step1: { title: string; emailLabel: string; emailPlaceholder: string; phoneLabel: string; phoneOptional: string; phoneHint: string };
    step2: { title: string; businessTypeLabel: string; businessTypePlaceholder: string; descLabel: string; descPlaceholder: string; websiteLabel: string; websitePlaceholder: string };
    step3: { title: string; otherLabel: string; otherPlaceholder: string };
    step4: { title: string; consentText: string };
    success: { meetTitle: string; meetSub: string; otherTitle: string; otherSub: string; close: string };
    errors: { email: string; demoType: string; consent: string; generic: string };
    next: string; back: string; submit: string;
  };
}

export const T: Record<Lang, Translations> = {
  en: {
    nav: { home: "Home", features: "Features", industries: "Industries", howItWorks: "How It Works", faq: "FAQ", requestDemo: "Request a Free Custom Demo", active: "24/7 Active" },
    hero: {
      badge: "24/7 AI Voice Assistant",
      h1: "Your AI Voice Assistant",
      h2: "Talks to Customers 24/7",
      sub: "Answer incoming calls, schedule appointments automatically, sync with your CRM, and never miss a customer opportunity.",
      cta1: "Get Free Demo", cta2: "Listen to a Sample Call",
      liveCall: "Live Call", activeCall: "Active Call", savedToCRM: "SAVED TO CRM", summarySent: "SUMMARY SENT",
      connectingCall: "Connecting call...", listeningToCustomer: "Listening to customer...", appointmentCreated: "Appointment created",
      demoBadge: "TRY THE LIVE SYSTEM", talkTitle: "Talk to Our AI", talkNow: "right now.",
      talkDesc: "Ask what our AI can do for your business, explore its features, and schedule a meeting with our team.",
      tapToCall: "TAP TO CALL", dialNow: "DIAL NOW",
    },
    trust: { alwaysOn: "Always On", languages: "Languages", responseTime: "Response Time", integration: "Integration" },
    problem: {
      badge: "Challenges",
      heading: "Your Business is Losing Customers Every Day",
      items: [
        { title: "Missed Calls", desc: "A customer calls, no one answers — they go straight to your competitor." },
        { title: "After-Hours Losses", desc: "Evening and weekend opportunities go unanswered." },
        { title: "Missed Appointments", desc: "Manual follow-up is exhausting and error-prone." },
        { title: "Fragmented Processes", desc: "WhatsApp, phone, email all separate — none of it properly tracked." },
      ],
    },
    solution: {
      badge: "How It Works",
      heading: "How B2BVoice Turns Calls Into Opportunities",
      sub: "From the first ring to the final summary, B2BVoice handles the call flow so your team can focus on the customers in front of them.",
      steps: [
        { title: "AI Answers the Incoming Call", desc: "Instantly answers when a customer calls, even when your team is busy." },
        { title: "Understands the Customer's Need", desc: "Asks the right questions, identifies the request, and understands what the customer is looking for." },
        { title: "Collects Important Details", desc: "Captures key information such as name, phone number, service request, preferred time, and urgency." },
        { title: "Routes or Organizes the Request", desc: "Sends the call details to the right person, department, CRM, spreadsheet, or workflow." },
        { title: "Sends You a Clear Call Summary", desc: "After the call, you receive a simple summary with the customer's need, intent, and recommended next step." },
      ],
    },
    features: {
      badge: "Features", heading: "Powerful Features of Your AI Assistant",
      sub: "AI solutions that integrate with your existing CRM, ERP and phone systems in minutes.", seeAll: "All Features",
      api: { title: "API Integration", desc: "Connect to your existing CRM, ERP, and phone system in minutes." },
      reporting: { title: "Real-Time Reporting", desc: "Monitor all calls live. Transcripts, sentiment analysis, and performance metrics." },
      multilang: { title: "Multi-Language Support", desc: "Natural, fluent conversation in 100+ languages. Turkish, English, German, Arabic and more." },
      appointment: { title: "Appointment Management", desc: "Automated scheduling, reminders, and calendar sync." },
      drAppt: "Dr. Appointment", confirmed: "14:30 - Confirmed", getStarted: "Get Started →",
      smartRouting: { title: "Smart Routing", desc: "Route calls to the right department and the right person, instantly." },
      gdpr: { title: "GDPR Compliant", desc: "Your data stays secure, fully compliant with GDPR and international data privacy standards." },
    },
    powerful: {
      badge: "What We Build",
      heading1: "Not Just an AI Voice Agent.",
      heading2: "A Custom-Built Phone Assistant",
      sub: "We don't simply give you a generic AI tool. We design, build, and customize an AI voice assistant around your business, your customers, and your daily call flow.",
      card1: { badge: "Most Important", title: "Custom AI Assistant Built for Your Business", desc: "B2BVoice is not a ready-made bot. Our expert team designs and builds a custom AI voice assistant based on your business, services, customer questions, and call flow." },
      card2: { title: "Free Custom Demo Before You Start", desc: "We prepare a free custom demo for your business so you experience it before making any decision." },
      card3: { title: "Turn Missed Calls into Opportunities", desc: "When your team is busy, your AI assistant answers, understands the need, and captures the lead." },
      card4: { title: "Appointment and Lead Intake", desc: "Collects appointment requests, service inquiries, pricing questions, and customer details automatically." },
      card5: { title: "CRM and Automation Integration", desc: "Customer information flows automatically to your CRM, Google Sheets, calendar, or any other tool you use." },
      card6: { title: "Call Summaries and Lead Details", desc: "After each conversation, receive a clear summary: who called, what they needed, how interested they were, and the recommended next step." },
      card7: { title: "Industry-Specific Call Flows", desc: "Custom conversation flows for real estate, beauty clinics, dental offices, law firms, hotels, and other service-based businesses." },
      card8: { title: "Smart Follow-Up Options", desc: "After the call, follow-up messages can be sent through WhatsApp, SMS, or email depending on your business process." },
      orbitLabels: ["Services", "FAQ", "Booking", "Leads", "Follow-Up", "CRM"],
      callLabel: "Incoming Demo Call", connected: "Connected", demoReady: "Custom Demo Ready",
      incomingCall: "Incoming\nCall", leadCaptured: "Lead\nCaptured",
    },
    languages: {
      badge: "Multilingual Support", heading: "Voices from Around the World",
      sub: "Communicate with your customers in 30+ languages.",
      desc: "B2BVoice speaks your customers' language. Health tourism, real estate, or e-commerce — whatever your sector, never lose a foreign customer again.",
      activeLanguage: "Active Language", languagesLabel: "Languages", active: "Active",
      totalLanguages: "Total Languages", responseTime: "Response Time", availability: "Availability",
      names: ["Turkish", "English", "German", "Chinese", "Korean", "French", "Spanish", "Arabic", "Russian", "Japanese", "Italian", "Portuguese"],
    },
    industries: {
      badge: "Industries", heading: "Custom AI Voice for", span: "every industry.", sub: "From healthcare to hospitality — B2BVoice adapts to any business, any workflow, any language.", scrollLabel: "Scroll to explore",
      items: [
        { title: "Healthcare Groups", features: ["Patient Intake", "Appointment Scheduling", "Call Routing"] },
        { title: "Property Management", features: ["Leasing Inquiries", "Maintenance Triage", "Tour Scheduling"] },
        { title: "Home & Field Services", features: ["Emergency Triage", "Job Scheduling", "Dispatch Coordination"] },
        { title: "Automotive Groups", features: ["Service Booking", "Repair Updates", "Lead Routing"] },
        { title: "Law Firms", features: ["New Client Intake", "Case Type Routing", "Consultation Booking"] },
        { title: "Staffing & Recruiting", features: ["Candidate Screening", "Interview Scheduling", "Availability Checks"] },
        { title: "Logistics & Transportation", features: ["Shipment Updates", "Driver Check-Ins", "Exception Routing"] },
        { title: "Insurance Providers", features: ["Claims Intake", "Policyholder Support", "Agent Routing"] },
        { title: "Hospitality Groups", features: ["Reservation Support", "Guest Requests", "Multi-Property Routing"] },
        { title: "Senior Care & Home Health", features: ["Client Intake", "Care Scheduling", "Family Updates"] },
        { title: "Multi-Location Brands", features: ["Location Routing", "Centralized Support", "Customer Requests"] },
        { title: "Financial Services", features: ["Application Intake", "Client Support", "Secure Routing"] },
        { title: "Facilities Management", features: ["Work Order Intake", "Vendor Dispatch", "Status Updates"] },
        { title: "Manufacturing & Distribution", features: ["Order Status", "Dealer Support", "Service Requests"] },
      ],
    },
    integrations: { badge: "Integrations", heading: "Works with all the tools\nyou already use", sub: "CRM, calendar, WhatsApp, payment systems — all from one hub, automatically.", hub: "AI Hub" },
    dashboard: {
      badge: "Dashboard", heading: "Track Every Call in Real Time",
      menu: ["Overview", "Calls", "Appointments", "Customers", "Settings"],
      stats: [{ label: "Total Calls", val: "1,284" }, { label: "Answered", val: "1,271" }, { label: "Appointments", val: "342" }, { label: "New Customers", val: "89" }],
      weeklySummary: "Weekly Call Summary", recentCalls: "Recent Calls", todayAppts: "Today's Appointments",
      calls: [
        { name: "John Smith", time: "2 min ago", status: "Appointment Made", color: "text-green-700 bg-green-50 border-green-200" },
        { name: "Emma Johnson", time: "15 min ago", status: "Info Provided", color: "text-blue-700 bg-blue-50 border-blue-200" },
        { name: "+1 555 ***-****", time: "1 hour ago", status: "Missed", color: "text-orange-700 bg-orange-50 border-orange-200" },
      ],
      apts: [{ time: "14:30", title: "Checkup - Michael T." }, { time: "16:00", title: "Follow-up - Sarah K." }, { time: "17:15", title: "First Visit - James B." }],
    },
    howItWorks: {
      badge: "How It Works", heading: "How B2BVoice Turns Calls Into Opportunities",
      sub: "From the first ring to the final summary, B2BVoice handles the call flow so your team can focus on the customers in front of them.",
      steps: [
        { title: "AI Answers the Incoming Call", desc: "Instantly answers when a customer calls, even when your team is busy." },
        { title: "Understands the Customer's Need", desc: "Asks the right questions, identifies the request, and understands what the customer is looking for." },
        { title: "Collects Important Details", desc: "Captures key information such as name, phone number, service request, preferred time, and urgency." },
        { title: "Routes or Organizes the Request", desc: "Sends the call details to the right person, department, CRM, spreadsheet, or workflow." },
        { title: "Sends You a Clear Call Summary", desc: "After the call, you receive a simple summary with the customer's need, intent, and recommended next step." },
      ],
    },
    testimonials: {
      badge: "Customer Reviews", heading: "Businesses Grow with B2BVoice",
      items: [
        { quote: "We never miss a call anymore. Our clinic's appointment fill rate increased by 40%.", author: "Dr. Sarah K.", role: "Aesthetic Clinic Owner", metric: "40% more appointments" },
        { quote: "International patient inquiries coming in overnight are no longer lost. It's made a huge difference in health tourism.", author: "Michael Y.", role: "Health Tourism Director", metric: "Rise in overnight bookings" },
        { quote: "In real estate, speed is everything. With B2BVoice, we're always first to respond.", author: "Jessica A.", role: "Real Estate Consultant", metric: "0 missed calls" },
        { quote: "Customer satisfaction has visibly improved. Our appointment process is fully automated.", author: "David B.", role: "Dental Clinic Manager", metric: "80% reduction in manual workload" },
      ],
    },
    demo: {
      badge: "Audio Samples", heading: "Listen to how B2BVoice could answer calls", span: "for different businesses.",
      sub: "These are sample demos only. Every B2BVoice agent is custom-built for the specific business, its services, customer questions, scheduling rules, tone, and workflow.",
      customDemo: "Want to hear a custom demo for your business?",
      allTab: "All", listenSample: "Listen to sample",
      cards: [
        { role: "Clinic Receptionist", desc: "Warm and professional, patient routing specialist", industry: "Healthcare" },
        { role: "Hotel Concierge", desc: "Friendly and energetic, guest experience specialist", industry: "Hospitality" },
        { role: "Medical Consultant", desc: "Calm and trustworthy tone, medical information", industry: "Health Tourism" },
        { role: "Scheduling Assistant", desc: "Fast and organized, calendar management expert", industry: "Services" },
        { role: "Sales Representative", desc: "Persuasive and dynamic, lead conversion expert", industry: "Real Estate" },
        { role: "Customer Support", desc: "Patient and solution-focused, 24/7 support", industry: "E-Commerce" },
      ],
    },
    pricing: { badge: "Demo", heading: "Every business is unique", sub: "Let us analyze your needs with a personalized demo.", cta: "Request Free Demo", features: ["Setup in 1-2 days", "24/7 Support"] },
    faq: {
      badge: "FAQ", heading: "Frequently Asked Questions",
      items: [
        { q: "Does B2BVoice sound like a real human?", a: "Yes. B2BVoice is designed to speak naturally, understand customer intent, and respond in a smooth conversational way. The voice, tone, and call flow can be customized for your business." },
        { q: "Is B2BVoice a ready-made bot?", a: "No. We don't simply give you a generic AI tool. Our team builds a custom AI phone assistant around your business, services, customer questions, and daily call flow." },
        { q: "Do you offer a free demo?", a: "Yes. Before you decide to work with us, we can prepare a free custom demo for your business so you can experience how your AI assistant would speak with your customers." },
        { q: "How long does setup take?", a: "Setup time depends on your business needs and integrations, but most basic AI voice assistant demos can be prepared quickly after we understand your services, call flow, and customer questions." },
        { q: "Which tools can B2BVoice integrate with?", a: "B2BVoice can connect with tools such as CRM systems, calendars, Gmail, Google Sheets, WhatsApp, Slack, Microsoft Teams, n8n, Zapier, and other business workflows." },
        { q: "Can it handle appointment requests?", a: "Yes. B2BVoice can collect appointment requests, ask for preferred times, gather customer details, and send the information to your team, calendar, CRM, or workflow." },
        { q: "What happens after a call ends?", a: "After each call, B2BVoice can provide a clear summary including the customer's details, request, intent, and the recommended next step." },
        { q: "Is it suitable for my industry?", a: "B2BVoice can be customized for many service-based industries including real estate, dental clinics, salons, beauty clinics, law firms, medical clinics, automotive services, home services, and more." },
        { q: "Can it work with my current phone system?", a: "In many cases, yes. B2BVoice can be connected to your existing phone setup or configured with a new call flow depending on your business needs." },
        { q: "What information do you need to build my demo?", a: "We usually need your business type, services, common customer questions, preferred call flow, and what you want the AI assistant to collect or handle during calls." },
      ],
      setup: {
        heading: "Custom Setup Process",
        sub: "Every B2BVoice system is carefully prepared for the specific business. We do not install the same assistant for everyone.",
        points: [
          "What kind of business it is?",
          "What services they offer?",
          "What questions customers ask most often?",
          "How appointments or calls are scheduled?",
          "What information needs to be collected?",
          "When the assistant should answer directly?",
          "When the conversation should be handed to a human?",
          "What tone the business wants to use?",
          "What languages the business needs?",
          "What booking, CRM, calendar, or communication tools they already use?",
        ],
        duration: "The setup usually takes around 3 weeks, because the system is built carefully and tested for that specific business — because a good phone assistant must understand the business before it can represent it properly.",
      },
    },
    finalCta: { heading: "Your business is unique.", span: "Your AI assistant should be too.", sub: "", desc: "Get a free custom demo built around your services, customers, and daily call flow.", cta1: "Get a Demo Now", cta2: "Call Us" },
    finalCta2: { heading: "See Your Custom AI Assistant", span: "Before You Decide", desc: "We'll build a free personalized demo around your business, services, and call flow — so you can experience B2BVoice before getting started.", cta1: "Get a Demo Now" },
    footer: {
      tagline: "24/7 AI-Powered Call Solutions.", product: "Product",
      productLinks: ["Features", "Industries", "How It Works", "Pricing"],
      industries: "Industries",
      industryLinks: ["Clinics", "Dental", "Aesthetics", "Real Estate", "E-Commerce"],
      support: "Support", supportLinks: ["FAQ", "Docs", "Contact", "Request Demo"],
      allRights: "All rights reserved.", privacy: "Privacy", privacyPolicy: "Privacy Policy", terms: "Terms of Service",
    },
    modal: {
      title: "Request a Free Custom Demo",
      sub: "Tell us about your business — we'll prepare the most relevant demo.",
      stepLabels: ["Contact", "Business", "Needs", "Demo Type", "Done"],
      businessTypes: ["Real Estate Agent / Brokerage", "Hair Salon / Barbershop", "Beauty / Nail Salon", "Med Spa", "Accounting / Tax Office", "Law Office", "Medical / Dental Clinic", "Home Services", "Other"],
      demoNeeds: ["Answering missed calls", "Answering common customer questions", "Appointment booking", "Call scheduling", "Lead qualification", "After-hours call handling", "Selected language support", "Call summary after the conversation", "I'm not sure yet"],
      demoTypes: [
        { value: "google-meet", label: "Live Google Meet demo", desc: "Schedule a live call with our team" },
        { value: "demo-call", label: "Let the demo agent call me", desc: "Receive an AI demo call on your phone" },
        { value: "voice-recording", label: "Send me a sample voice recording", desc: "Get a custom audio sample by email" },
        { value: "not-sure", label: "I'm not sure yet", desc: "We'll help you decide" },
      ],
      step1: { title: "Contact Information", emailLabel: "Business Email", emailPlaceholder: "you@company.com", phoneLabel: "Phone Number", phoneOptional: "(optional)", phoneHint: "Required only if you want the demo agent to call you." },
      step2: { title: "Business Information", businessTypeLabel: "What type of business do you run?", businessTypePlaceholder: "Select your business type...", descLabel: "Please describe your business", descPlaceholder: "Tell us about your business...", websiteLabel: "Business website or Instagram", websitePlaceholder: "https://... or @yourhandle" },
      step3: { title: "What do you want to see in the demo?", otherLabel: "Other", otherPlaceholder: "Tell us what you have in mind..." },
      step4: { title: "How would you like to experience the demo?", consentText: "I agree to be contacted by B2BVoice regarding my demo request and business needs." },
      success: { meetTitle: "Thank you — we received your demo request.", meetSub: "You can now choose the best day and time for your live Google Meet demo by clicking the scheduling link on this page.\n\nIf you're not available right now or don't schedule a time, no worries — one of our team members will contact you shortly.\n\nPlease check your inbox.\n\nAnd don't forget to check your spam folder too — unfortunately, important emails sometimes like to hide there.\n\nHave a question? Email us anytime at hello@b2b-voice.com\n\nWe'd be happy to help.", otherTitle: "Thank you — we received your demo request.", otherSub: "We'll send you an email shortly to confirm the next step.\n\nIf you requested a demo call, we'll ask when you would like the demo agent to call you.\n\nIf you requested a sample voice recording, we'll confirm a few details first so we can prepare the most relevant example for your business.\n\nPlease check your inbox.\n\nAnd don't forget to check your spam folder too — unfortunately, important emails sometimes like to hide there.\n\nHave a question? Email us anytime at hello@b2b-voice.com\n\nWe'd be happy to help.", close: "Close" },
      errors: { email: "Please enter a valid business email.", demoType: "Please select how you'd like to experience the demo.", consent: "Please agree to be contacted to submit your request.", generic: "Something went wrong. Please try again." },
      next: "Next", back: "Back", submit: "Submit Request",
    },
  },

  de: {
    nav: { home: "Home", features: "Funktionen", industries: "Branchen", howItWorks: "So funktioniert es", faq: "FAQ", requestDemo: "Kostenlose Custom-Demo", active: "24/7 Aktiv" },
    hero: {
      badge: "24/7 KI-Sprachassistent",
      h1: "Ihr KI-Sprachassistent",
      h2: "spricht rund um die Uhr mit Kunden",
      sub: "Eingehende Anrufe annehmen, Termine automatisch planen, mit Ihrem CRM synchronisieren – und keine Kundenanfrage mehr verpassen.",
      cta1: "Kostenlose Demo", cta2: "Beispielanruf anhören",
      liveCall: "Live-Anruf", activeCall: "Aktiver Anruf", savedToCRM: "IM CRM GESPEICHERT", summarySent: "ZUSAMMENFASSUNG GESENDET",
      connectingCall: "Verbinde...", listeningToCustomer: "Höre zu...", appointmentCreated: "Termin erstellt",
      demoBadge: "LIVE-SYSTEM TESTEN", talkTitle: "Sprechen Sie mit unserer KI", talkNow: "jetzt sofort.",
      talkDesc: "Fragen Sie, was unsere KI für Ihr Unternehmen tun kann, entdecken Sie die Funktionen und vereinbaren Sie ein Meeting mit unserem Team.",
      tapToCall: "ZUM ANRUFEN TIPPEN", dialNow: "JETZT ANRUFEN",
    },
    trust: { alwaysOn: "Immer verfügbar", languages: "Sprachen", responseTime: "Antwortzeit", integration: "Integration" },
    problem: {
      badge: "Herausforderungen",
      heading: "Ihr Unternehmen verliert jeden Tag Kunden",
      items: [
        { title: "Verpasste Anrufe", desc: "Ein Kunde ruft an, niemand nimmt ab – er geht direkt zur Konkurrenz." },
        { title: "Verluste nach Feierabend", desc: "Abend- und Wochenendanfragen bleiben unbeantwortet." },
        { title: "Verpasste Termine", desc: "Manuelle Nachverfolgung ist mühsam und fehleranfällig." },
        { title: "Fragmentierte Prozesse", desc: "WhatsApp, Telefon, E-Mail – alles getrennt, nichts richtig erfasst." },
      ],
    },
    solution: {
      badge: "So funktioniert es",
      heading: "Wie B2BVoice Anrufe in Chancen verwandelt",
      sub: "Vom ersten Klingeln bis zur finalen Zusammenfassung übernimmt B2BVoice den Anrufablauf, damit sich Ihr Team auf die Kunden vor Ort konzentrieren kann.",
      steps: [
        { title: "KI beantwortet den eingehenden Anruf", desc: "Antwortet sofort, wenn ein Kunde anruft – auch wenn Ihr Team beschäftigt ist." },
        { title: "Versteht das Anliegen des Kunden", desc: "Stellt die richtigen Fragen, identifiziert die Anfrage und versteht, wonach der Kunde sucht." },
        { title: "Erfasst wichtige Details", desc: "Nimmt Schlüsselinformationen auf: Name, Telefonnummer, Serviceanfrage, bevorzugte Zeit und Dringlichkeit." },
        { title: "Leitet die Anfrage weiter oder organisiert sie", desc: "Sendet die Anrufdetails an die richtige Person, Abteilung, CRM, Tabelle oder Workflow." },
        { title: "Sendet eine klare Anrufzusammenfassung", desc: "Nach dem Anruf erhalten Sie eine einfache Zusammenfassung mit Kundenbedarf, Absicht und empfohlenem nächsten Schritt." },
      ],
    },
    features: {
      badge: "Funktionen", heading: "Leistungsstarke Funktionen Ihres KI-Assistenten",
      sub: "KI-Lösungen, die sich in Minuten in Ihr bestehendes CRM, ERP und Telefonsystem integrieren.", seeAll: "Alle Funktionen",
      api: { title: "API-Integration", desc: "Verbinden Sie sich in Minuten mit Ihrem bestehenden CRM, ERP und Telefonsystem." },
      reporting: { title: "Echtzeit-Reporting", desc: "Alle Anrufe live überwachen. Transkripte, Stimmungsanalyse und Leistungskennzahlen." },
      multilang: { title: "Mehrsprachiger Support", desc: "Natürliche, flüssige Gespräche in 100+ Sprachen. Türkisch, Englisch, Deutsch, Arabisch und mehr." },
      appointment: { title: "Terminverwaltung", desc: "Automatische Planung, Erinnerungen und Kalender-Synchronisation." },
      drAppt: "Arzttermin", confirmed: "14:30 – Bestätigt", getStarted: "Jetzt starten →",
      smartRouting: { title: "Intelligente Weiterleitung", desc: "Anrufe sofort an die richtige Abteilung und Person weiterleiten." },
      gdpr: { title: "DSGVO-konform", desc: "Ihre Daten bleiben sicher, vollständig konform mit der DSGVO und internationalen Datenschutzstandards." },
    },
    powerful: {
      badge: "Was wir bauen",
      heading1: "Nicht nur ein KI-Sprachagent.",
      heading2: "Ein maßgeschneiderter Telefonassistent",
      sub: "Wir geben Ihnen kein generisches KI-Tool. Wir entwerfen, bauen und passen einen KI-Sprachassistenten an Ihr Unternehmen, Ihre Kunden und Ihren täglichen Anruffluss an.",
      card1: { badge: "Am wichtigsten", title: "Maßgeschneiderter KI-Assistent für Ihr Unternehmen", desc: "B2BVoice ist kein vorgefertigter Bot. Unser Expertenteam entwirft und baut einen individuellen KI-Sprachassistenten basierend auf Ihrem Unternehmen, Ihren Dienstleistungen, Kundenfragen und dem Anruffluss." },
      card2: { title: "Kostenlose individuelle Demo vor dem Start", desc: "Wir bereiten eine kostenlose Demo für Ihr Unternehmen vor, damit Sie es erleben können, bevor Sie eine Entscheidung treffen." },
      card3: { title: "Verpasste Anrufe in Chancen verwandeln", desc: "Wenn Ihr Team beschäftigt ist, nimmt Ihr KI-Assistent ab, versteht das Anliegen und erfasst den Lead." },
      card4: { title: "Termin- und Lead-Aufnahme", desc: "Erfasst Terminanfragen, Serviceanfragen, Preisfragen und Kundendaten automatisch." },
      card5: { title: "CRM- und Automatisierungsintegration", desc: "Kundendaten fließen automatisch in Ihr CRM, Google Sheets, Kalender oder andere Tools." },
      card6: { title: "Anrufzusammenfassungen und Lead-Details", desc: "Nach jedem Gespräch erhalten Sie eine klare Zusammenfassung: Wer angerufen hat, was benötigt wurde, wie interessiert die Person war und den empfohlenen nächsten Schritt." },
      card7: { title: "Branchenspezifische Anrufabläufe", desc: "Individuelle Gesprächsabläufe für Immobilien, Beautykliniken, Zahnarztpraxen, Kanzleien, Hotels und andere Dienstleistungsunternehmen." },
      card8: { title: "Smarte Follow-up-Optionen", desc: "Nach dem Anruf können Follow-up-Nachrichten per WhatsApp, SMS oder E-Mail gesendet werden." },
      orbitLabels: ["Dienste", "FAQ", "Buchung", "Leads", "Follow-Up", "CRM"],
      callLabel: "Eingehender Demo-Anruf", connected: "Verbunden", demoReady: "Demo bereit",
      incomingCall: "Eingehender\nAnruf", leadCaptured: "Lead\nErfasst",
    },
    languages: {
      badge: "Mehrsprachiger Support", heading: "Stimmen aus aller Welt",
      sub: "Kommunizieren Sie mit Ihren Kunden in 30+ Sprachen.",
      desc: "B2BVoice spricht die Sprache Ihrer Kunden. Gesundheitstourismus, Immobilien oder E-Commerce – egal welche Branche, verlieren Sie nie wieder einen ausländischen Kunden.",
      activeLanguage: "Aktive Sprache", languagesLabel: "Sprachen", active: "Aktiv",
      totalLanguages: "Gesamtsprachen", responseTime: "Antwortzeit", availability: "Verfügbarkeit",
      names: ["Türkisch", "Englisch", "Deutsch", "Chinesisch", "Koreanisch", "Französisch", "Spanisch", "Arabisch", "Russisch", "Japanisch", "Italienisch", "Portugiesisch"],
    },
    industries: {
      badge: "Branchen", heading: "KI-Sprachassistent für", span: "jede Branche.", sub: "Von Gesundheit bis Gastronomie – B2BVoice passt sich jedem Unternehmen und Workflow an.", scrollLabel: "Zum Erkunden scrollen",
      items: [
        { title: "Gesundheitsgruppen", features: ["Patientenaufnahme", "Terminplanung", "Anrufweiterleitung"] },
        { title: "Hausverwaltung", features: ["Mietanfragen", "Wartungs-Triage", "Besichtigungstermine"] },
        { title: "Haus- & Vor-Ort-Services", features: ["Notfall-Triage", "Jobplanung", "Einsatzkoordination"] },
        { title: "Automobilgruppen", features: ["Servicebuchung", "Reparaturupdates", "Lead-Weiterleitung"] },
        { title: "Kanzleien", features: ["Aufnahme neuer Mandanten", "Falltyp-Routing", "Beratungstermine"] },
        { title: "Personalvermittlung", features: ["Kandidatenscreening", "Interviewplanung", "Verfügbarkeitsprüfung"] },
        { title: "Logistik & Transport", features: ["Sendungsupdates", "Fahrer-Check-ins", "Ausnahme-Routing"] },
        { title: "Versicherungen", features: ["Schadenaufnahme", "Versichertenbetreuung", "Agenten-Routing"] },
        { title: "Hotelgruppen", features: ["Reservierungsservice", "Gästewünsche", "Routing über mehrere Häuser"] },
        { title: "Seniorenpflege & häusliche Pflege", features: ["Klientenaufnahme", "Pflegeplanung", "Familienupdates"] },
        { title: "Marken mit mehreren Standorten", features: ["Standort-Routing", "Zentraler Support", "Kundenanfragen"] },
        { title: "Finanzdienstleistungen", features: ["Antragsaufnahme", "Kundenbetreuung", "Sicheres Routing"] },
        { title: "Facility Management", features: ["Aufnahme von Arbeitsaufträgen", "Lieferanten-Disposition", "Statusupdates"] },
        { title: "Produktion & Distribution", features: ["Bestellstatus", "Händlerbetreuung", "Serviceanfragen"] },
      ],
    },
    integrations: { badge: "Integrationen", heading: "Funktioniert mit allen Tools,\ndie Sie bereits nutzen", sub: "CRM, Kalender, WhatsApp, Zahlungssysteme – alles aus einer Zentrale, automatisch.", hub: "AI Hub" },
    dashboard: {
      badge: "Dashboard", heading: "Jeden Anruf in Echtzeit verfolgen",
      menu: ["Übersicht", "Anrufe", "Termine", "Kunden", "Einstellungen"],
      stats: [{ label: "Gesamt-Anrufe", val: "1.284" }, { label: "Beantwortet", val: "1.271" }, { label: "Termine", val: "342" }, { label: "Neukunden", val: "89" }],
      weeklySummary: "Wöchentliche Anrufübersicht", recentCalls: "Letzte Anrufe", todayAppts: "Heutige Termine",
      calls: [
        { name: "John Smith", time: "Vor 2 Min.", status: "Termin vereinbart", color: "text-green-700 bg-green-50 border-green-200" },
        { name: "Emma Johnson", time: "Vor 15 Min.", status: "Info gegeben", color: "text-blue-700 bg-blue-50 border-blue-200" },
        { name: "+1 555 ***-****", time: "Vor 1 Std.", status: "Verpasst", color: "text-orange-700 bg-orange-50 border-orange-200" },
      ],
      apts: [{ time: "14:30", title: "Checkup – Michael T." }, { time: "16:00", title: "Nachsorge – Sarah K." }, { time: "17:15", title: "Erstbesuch – James B." }],
    },
    howItWorks: {
      badge: "So funktioniert es", heading: "Wie B2BVoice Anrufe in Chancen verwandelt",
      sub: "Vom ersten Klingeln bis zur finalen Zusammenfassung übernimmt B2BVoice den Anrufablauf, damit sich Ihr Team auf die Kunden vor Ort konzentrieren kann.",
      steps: [
        { title: "KI beantwortet den eingehenden Anruf", desc: "Antwortet sofort, wenn ein Kunde anruft – auch wenn Ihr Team beschäftigt ist." },
        { title: "Versteht das Anliegen des Kunden", desc: "Stellt die richtigen Fragen, identifiziert die Anfrage und versteht, wonach der Kunde sucht." },
        { title: "Erfasst wichtige Details", desc: "Nimmt Schlüsselinformationen auf: Name, Telefonnummer, Serviceanfrage, bevorzugte Zeit und Dringlichkeit." },
        { title: "Leitet die Anfrage weiter oder organisiert sie", desc: "Sendet die Anrufdetails an die richtige Person, Abteilung, CRM, Tabelle oder Workflow." },
        { title: "Sendet eine klare Anrufzusammenfassung", desc: "Nach dem Anruf erhalten Sie eine einfache Zusammenfassung mit Kundenbedarf, Absicht und empfohlenem nächsten Schritt." },
      ],
    },
    testimonials: {
      badge: "Kundenmeinungen", heading: "Unternehmen wachsen mit B2BVoice",
      items: [
        { quote: "Wir verpassen keine Anrufe mehr. Die Terminbelegungsrate unserer Klinik hat sich um 40 % erhöht.", author: "Dr. Sarah K.", role: "Inhaberin einer Ästhetikklinik", metric: "40 % mehr Termine" },
        { quote: "Internationale Patientenanfragen in der Nacht gehen nicht mehr verloren. Das hat im Gesundheitstourismus einen enormen Unterschied gemacht.", author: "Michael Y.", role: "Direktor Gesundheitstourismus", metric: "Mehr Nachtbuchungen" },
        { quote: "In der Immobilienbranche zählt Geschwindigkeit. Mit B2BVoice sind wir immer Erster.", author: "Jessica A.", role: "Immobilienberaterin", metric: "0 verpasste Anrufe" },
        { quote: "Die Kundenzufriedenheit hat sich sichtbar verbessert. Unser Terminprozess ist vollständig automatisiert.", author: "David B.", role: "Manager einer Zahnklinik", metric: "80 % weniger manuelle Arbeit" },
      ],
    },
    demo: {
      badge: "Audio-Demos", heading: "Hören Sie, wie B2BVoice Anrufe beantworten könnte", span: "für verschiedene Unternehmen.",
      sub: "Dies sind nur Demo-Beispiele. Jeder B2BVoice-Agent wird individuell für das jeweilige Unternehmen entwickelt – mit spezifischen Dienstleistungen, Kundenfragen, Planungsregeln, Tonfall und Workflow.",
      customDemo: "Möchten Sie eine individuelle Demo für Ihr Unternehmen hören?",
      allTab: "Alle", listenSample: "Demo anhören",
      cards: [
        { role: "Klinik-Rezeption", desc: "Warm und professionell, spezialisiert auf Patientenweiterleitung", industry: "Gesundheit" },
        { role: "Hotel-Concierge", desc: "Freundlich und energiegeladen, Spezialist für Gästeerlebnisse", industry: "Gastgewerbe" },
        { role: "Medizinische Beratung", desc: "Ruhiger und vertrauenserweckender Ton, medizinische Informationen", industry: "Gesundheitstourismus" },
        { role: "Termin-Assistent", desc: "Schnell und organisiert, Experte für Kalender-Management", industry: "Dienstleistungen" },
        { role: "Vertriebsmitarbeiter", desc: "Überzeugend und dynamisch, Experte für Lead-Konvertierung", industry: "Immobilien" },
        { role: "Kundensupport", desc: "Geduldig und lösungsorientiert, 24/7-Support", industry: "E-Commerce" },
      ],
    },
    pricing: { badge: "Demo", heading: "Jedes Unternehmen ist einzigartig", sub: "Lassen Sie uns Ihre Anforderungen mit einer personalisierten Demo analysieren.", cta: "Kostenlose Demo anfragen", features: ["Einrichtung in 1–2 Tagen", "24/7 Support"] },
    faq: {
      badge: "FAQ", heading: "Häufig gestellte Fragen",
      items: [
        { q: "Klingt B2BVoice wie ein echter Mensch?", a: "Ja. B2BVoice ist darauf ausgelegt, natürlich zu sprechen, die Kundenabsicht zu verstehen und auf eine flüssige, gesprächige Weise zu antworten. Stimme, Ton und Gesprächsführung können für Ihr Unternehmen angepasst werden." },
        { q: "Ist B2BVoice ein fertiger Bot?", a: "Nein. Wir geben Ihnen kein generisches KI-Tool. Unser Team entwickelt einen individuellen KI-Telefonassistenten, der auf Ihr Unternehmen, Ihre Dienstleistungen, Kundenfragen und täglichen Anrufablauf zugeschnitten ist." },
        { q: "Bieten Sie eine kostenlose Demo an?", a: "Ja. Bevor Sie sich für eine Zusammenarbeit entscheiden, können wir eine kostenlose individuelle Demo für Ihr Unternehmen erstellen, damit Sie erleben können, wie Ihr KI-Assistent mit Ihren Kunden sprechen würde." },
        { q: "Wie lange dauert die Einrichtung?", a: "Die Einrichtungszeit hängt von Ihren Geschäftsanforderungen und Integrationen ab. Die meisten Basis-KI-Sprachassistenten-Demos können schnell nach einer ersten Analyse vorbereitet werden." },
        { q: "Mit welchen Tools kann B2BVoice integriert werden?", a: "B2BVoice kann mit CRM-Systemen, Kalendern, Gmail, Google Sheets, WhatsApp, Slack, Microsoft Teams, n8n, Zapier und anderen Unternehmens-Workflows verbunden werden." },
        { q: "Kann es mit Terminanfragen umgehen?", a: "Ja. B2BVoice kann Terminanfragen entgegennehmen, Wunschzeiten erfragen, Kundendaten erfassen und die Informationen an Ihr Team, Kalender, CRM oder Workflow weiterleiten." },
        { q: "Was passiert nach einem Anruf?", a: "Nach jedem Anruf kann B2BVoice eine klare Zusammenfassung mit den Kundendaten, der Anfrage, der Absicht und dem empfohlenen nächsten Schritt bereitstellen." },
        { q: "Ist es für meine Branche geeignet?", a: "B2BVoice kann für viele dienstleistungsorientierte Branchen angepasst werden, darunter Immobilien, Zahnkliniken, Salons, Schönheitskliniken, Anwaltskanzleien, medizinische Kliniken, Automobildienste, Haushaltsdienstleistungen und mehr." },
        { q: "Funktioniert es mit meinem aktuellen Telefonsystem?", a: "In vielen Fällen ja. B2BVoice kann mit Ihrem bestehenden Telefon-Setup verbunden oder je nach Ihren Geschäftsanforderungen mit einem neuen Anrufablauf konfiguriert werden." },
        { q: "Welche Informationen benötigen Sie für meine Demo?", a: "Wir benötigen in der Regel Ihren Unternehmenstyp, Ihre Dienstleistungen, häufige Kundenfragen, den bevorzugten Anrufablauf und was der KI-Assistent während der Anrufe erfassen oder bearbeiten soll." },
      ],
      setup: {
        heading: "Individueller Einrichtungsprozess",
        sub: "Jedes B2BVoice-System wird sorgfältig für das jeweilige Unternehmen vorbereitet. Wir installieren nicht denselben Assistenten für jeden.",
        points: [
          "Was für ein Unternehmen es ist?",
          "Welche Dienstleistungen angeboten werden?",
          "Welche Fragen Kunden am häufigsten stellen?",
          "Wie Termine oder Anrufe geplant werden?",
          "Welche Informationen erfasst werden müssen?",
          "Wann der Assistent direkt antworten soll?",
          "Wann das Gespräch an einen Menschen übergeben werden soll?",
          "Welchen Ton das Unternehmen verwenden möchte?",
          "Welche Sprachen das Unternehmen benötigt?",
          "Welche Buchungs-, CRM-, Kalender- oder Kommunikationstools bereits genutzt werden?",
        ],
        duration: "Die Einrichtung dauert in der Regel etwa 3 Wochen, da das System sorgfältig aufgebaut und für das jeweilige Unternehmen getestet wird — denn ein guter Telefonassistent muss das Unternehmen verstehen, bevor er es richtig repräsentieren kann.",
      },
    },
    finalCta: { heading: "Ihr Unternehmen ist einzigartig.", span: "Ihr KI-Assistent sollte es auch sein.", sub: "", desc: "Holen Sie sich eine kostenlose individuelle Demo, die auf Ihre Dienstleistungen, Kunden und Ihren täglichen Anrufablauf zugeschnitten ist.", cta1: "Jetzt Demo anfragen", cta2: "Rufen Sie uns an" },
    finalCta2: { heading: "Erleben Sie Ihren KI-Assistenten", span: "bevor Sie sich entscheiden", desc: "Wir erstellen kostenlos eine personalisierte Demo für Ihr Unternehmen, Ihre Dienstleistungen und Ihren Anrufablauf — damit Sie B2BVoice erleben können, bevor Sie starten.", cta1: "Jetzt Demo anfragen" },
    footer: {
      tagline: "24/7 KI-gestützte Anruflösungen.", product: "Produkt",
      productLinks: ["Funktionen", "Branchen", "So funktioniert es", "Preise"],
      industries: "Branchen",
      industryLinks: ["Kliniken", "Zahnarzt", "Ästhetik", "Immobilien", "E-Commerce"],
      support: "Support", supportLinks: ["FAQ", "Dokumentation", "Kontakt", "Demo anfragen"],
      allRights: "Alle Rechte vorbehalten.", privacy: "Datenschutz", privacyPolicy: "Datenschutzrichtlinie", terms: "Nutzungsbedingungen",
    },
    modal: {
      title: "Kostenlose individuelle Demo anfragen",
      sub: "Erzählen Sie uns von Ihrem Unternehmen – wir bereiten die passendste Demo vor.",
      stepLabels: ["Kontakt", "Unternehmen", "Wünsche", "Demo-Typ", "Fertig"],
      businessTypes: ["Immobilienmakler / Maklerbüro", "Friseursalon / Barbershop", "Beauty- / Nagelstudio", "Med Spa", "Steuerberatung / Buchhaltung", "Kanzlei", "Medizinische / Zahnklinik", "Haushaltsdienstleistungen", "Sonstiges"],
      demoNeeds: ["Verpasste Anrufe beantworten", "Häufige Kundenfragen beantworten", "Terminbuchung", "Anrufplanung", "Lead-Qualifizierung", "Anrufbearbeitung außerhalb der Geschäftszeiten", "Ausgewählter Sprachsupport", "Anrufzusammenfassung nach dem Gespräch", "Ich bin noch nicht sicher"],
      demoTypes: [
        { value: "google-meet", label: "Live Google Meet Demo", desc: "Planen Sie einen Live-Anruf mit unserem Team" },
        { value: "demo-call", label: "Demo-Agent soll mich anrufen", desc: "Erhalten Sie einen KI-Demo-Anruf auf Ihr Telefon" },
        { value: "voice-recording", label: "Sprachaufnahme zusenden", desc: "Erhalten Sie per E-Mail ein individuelles Audio-Beispiel" },
        { value: "not-sure", label: "Ich bin noch nicht sicher", desc: "Wir helfen Ihnen bei der Entscheidung" },
      ],
      step1: { title: "Kontaktinformationen", emailLabel: "Geschäftliche E-Mail", emailPlaceholder: "sie@unternehmen.de", phoneLabel: "Telefonnummer", phoneOptional: "(optional)", phoneHint: "Nur erforderlich, wenn Sie möchten, dass der Demo-Agent Sie anruft." },
      step2: { title: "Unternehmensinformationen", businessTypeLabel: "Was für ein Unternehmen führen Sie?", businessTypePlaceholder: "Unternehmensart auswählen...", descLabel: "Bitte beschreiben Sie Ihr Unternehmen", descPlaceholder: "Erzählen Sie uns von Ihrem Unternehmen...", websiteLabel: "Website oder Instagram Ihres Unternehmens", websitePlaceholder: "https://... oder @ihreseite" },
      step3: { title: "Was möchten Sie in der Demo sehen?", otherLabel: "Sonstiges", otherPlaceholder: "Beschreiben Sie, was Sie sich vorstellen..." },
      step4: { title: "Wie möchten Sie die Demo erleben?", consentText: "Ich erkläre mich damit einverstanden, dass B2BVoice mich bezüglich meiner Demo-Anfrage und meiner geschäftlichen Bedürfnisse kontaktiert." },
      success: { meetTitle: "Vielen Dank — wir haben Ihre Demo-Anfrage erhalten.", meetSub: "Sie können jetzt den besten Tag und die beste Uhrzeit für Ihre Live-Google-Meet-Demo auswählen, indem Sie auf den Terminierungslink auf dieser Seite klicken.\n\nWenn Sie gerade keine Zeit haben oder keinen Termin planen, kein Problem — ein Teammitglied wird sich in Kürze bei Ihnen melden.\n\nBitte prüfen Sie Ihren Posteingang.\n\nVergessen Sie auch nicht, Ihren Spam-Ordner zu überprüfen — leider verstecken sich wichtige E-Mails manchmal dort.\n\nHaben Sie eine Frage? Schreiben Sie uns jederzeit an hello@b2b-voice.com\n\nWir helfen Ihnen gerne.", otherTitle: "Vielen Dank — wir haben Ihre Demo-Anfrage erhalten.", otherSub: "Wir senden Ihnen in Kürze eine E-Mail zur Bestätigung des nächsten Schritts.\n\nWenn Sie einen Demo-Anruf angefordert haben, werden wir fragen, wann der Demo-Agent Sie anrufen soll.\n\nWenn Sie eine Sprachaufnahme angefordert haben, werden wir zunächst einige Details bestätigen, um das relevanteste Beispiel für Ihr Unternehmen vorzubereiten.\n\nBitte prüfen Sie Ihren Posteingang.\n\nVergessen Sie auch nicht, Ihren Spam-Ordner zu überprüfen — leider verstecken sich wichtige E-Mails manchmal dort.\n\nHaben Sie eine Frage? Schreiben Sie uns jederzeit an hello@b2b-voice.com\n\nWir helfen Ihnen gerne.", close: "Schließen" },
      errors: { email: "Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse ein.", demoType: "Bitte wählen Sie aus, wie Sie die Demo erleben möchten.", consent: "Bitte stimmen Sie zu, kontaktiert zu werden, um Ihre Anfrage einzureichen.", generic: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut." },
      next: "Weiter", back: "Zurück", submit: "Anfrage absenden",
    },
  },

  es: {
    nav: { home: "Inicio", features: "Características", industries: "Sectores", howItWorks: "Cómo funciona", faq: "FAQ", requestDemo: "Demo Personalizada Gratis", active: "24/7 Activo" },
    hero: {
      badge: "Asistente de Voz IA 24/7",
      h1: "Tu Asistente de Voz IA",
      h2: "atiende clientes las 24 horas",
      sub: "Responde llamadas entrantes, programa citas automáticamente, sincroniza con tu CRM y nunca pierdas una oportunidad de negocio.",
      cta1: "Demo Gratuita", cta2: "Escuchar una Llamada de Muestra",
      liveCall: "Llamada en Vivo", activeCall: "Llamada Activa", savedToCRM: "GUARDADO EN CRM", summarySent: "RESUMEN ENVIADO",
      connectingCall: "Conectando...", listeningToCustomer: "Escuchando...", appointmentCreated: "Cita creada",
      demoBadge: "PRUEBA EL SISTEMA EN VIVO", talkTitle: "Habla con Nuestra IA", talkNow: "ahora mismo.",
      talkDesc: "Pregunta qué puede hacer nuestra IA por tu negocio, explora sus funciones y agenda una reunión con nuestro equipo.",
      tapToCall: "TOCA PARA LLAMAR", dialNow: "LLAMA AHORA",
    },
    trust: { alwaysOn: "Siempre Activo", languages: "Idiomas", responseTime: "Tiempo de Respuesta", integration: "Integración" },
    problem: {
      badge: "Desafíos",
      heading: "Tu empresa pierde clientes cada día",
      items: [
        { title: "Llamadas Perdidas", desc: "Un cliente llama, nadie responde — va directo a tu competencia." },
        { title: "Pérdidas Fuera de Horario", desc: "Las oportunidades de tarde y fin de semana quedan sin respuesta." },
        { title: "Citas Perdidas", desc: "El seguimiento manual es agotador y propenso a errores." },
        { title: "Procesos Fragmentados", desc: "WhatsApp, teléfono, email por separado — nada correctamente registrado." },
      ],
    },
    solution: {
      badge: "Cómo funciona",
      heading: "Cómo B2BVoice Convierte Llamadas en Oportunidades",
      sub: "Desde el primer timbre hasta el resumen final, B2BVoice gestiona el flujo de llamadas para que tu equipo pueda centrarse en los clientes que tiene delante.",
      steps: [
        { title: "La IA Responde la Llamada Entrante", desc: "Responde al instante cuando un cliente llama, incluso cuando tu equipo está ocupado." },
        { title: "Entiende la Necesidad del Cliente", desc: "Hace las preguntas correctas, identifica la solicitud y comprende lo que el cliente busca." },
        { title: "Recopila Datos Importantes", desc: "Captura información clave: nombre, teléfono, solicitud de servicio, hora preferida y urgencia." },
        { title: "Enruta u Organiza la Solicitud", desc: "Envía los detalles de la llamada a la persona, departamento, CRM, hoja de cálculo o flujo de trabajo correcto." },
        { title: "Te Envía un Resumen Claro de la Llamada", desc: "Después de la llamada, recibes un resumen simple con la necesidad del cliente, su intención y el siguiente paso recomendado." },
      ],
    },
    features: {
      badge: "Características", heading: "Potentes funciones de tu asistente de IA",
      sub: "Soluciones de IA que se integran con tu CRM, ERP y sistema telefónico existente en minutos.", seeAll: "Todas las características",
      api: { title: "Integración API", desc: "Conecta con tu CRM, ERP y sistema telefónico existente en minutos." },
      reporting: { title: "Informes en Tiempo Real", desc: "Monitorea todas las llamadas en vivo. Transcripciones, análisis de sentimiento y métricas de rendimiento." },
      multilang: { title: "Soporte Multiidioma", desc: "Conversación natural y fluida en más de 100 idiomas. Turco, inglés, alemán, árabe y más." },
      appointment: { title: "Gestión de Citas", desc: "Programación automatizada, recordatorios y sincronización de calendario." },
      drAppt: "Cita Médica", confirmed: "14:30 – Confirmada", getStarted: "Comenzar →",
      smartRouting: { title: "Enrutamiento Inteligente", desc: "Dirige las llamadas al departamento y persona correcta al instante." },
      gdpr: { title: "Cumplimiento RGPD", desc: "Tus datos están seguros, completamente conformes con el RGPD y los estándares internacionales de privacidad." },
    },
    powerful: {
      badge: "Lo que construimos",
      heading1: "No solo un agente de voz IA.",
      heading2: "Un asistente telefónico a medida",
      sub: "No te damos simplemente una herramienta de IA genérica. Diseñamos, construimos y personalizamos un asistente de voz IA alrededor de tu negocio, tus clientes y tu flujo de llamadas diario.",
      card1: { badge: "Lo más importante", title: "Asistente de IA personalizado para tu negocio", desc: "B2BVoice no es un bot prefabricado. Nuestro equipo de expertos diseña y construye un asistente de voz IA personalizado basado en tu negocio, servicios, preguntas de clientes y flujo de llamadas." },
      card2: { title: "Demo personalizada gratuita antes de empezar", desc: "Preparamos una demo gratuita para tu negocio para que lo experimentes antes de tomar ninguna decisión." },
      card3: { title: "Convierte llamadas perdidas en oportunidades", desc: "Cuando tu equipo está ocupado, tu asistente de IA responde, entiende la necesidad y captura el lead." },
      card4: { title: "Registro de citas y leads", desc: "Recopila solicitudes de citas, consultas de servicios, preguntas de precios y datos de clientes automáticamente." },
      card5: { title: "Integración con CRM y automatización", desc: "La información del cliente fluye automáticamente a tu CRM, Google Sheets, calendario o cualquier otra herramienta que uses." },
      card6: { title: "Resúmenes de llamadas y detalles de leads", desc: "Después de cada conversación, recibe un resumen claro: quién llamó, qué necesitaba, qué tan interesado estaba y el siguiente paso recomendado." },
      card7: { title: "Flujos de llamadas específicos por sector", desc: "Flujos de conversación personalizados para inmobiliaria, clínicas de belleza, consultorios dentales, despachos, hoteles y otros negocios de servicios." },
      card8: { title: "Opciones de seguimiento inteligente", desc: "Después de la llamada, se pueden enviar mensajes de seguimiento por WhatsApp, SMS o email según tu proceso de negocio." },
      orbitLabels: ["Servicios", "FAQ", "Reservas", "Leads", "Seguimiento", "CRM"],
      callLabel: "Llamada Demo Entrante", connected: "Conectado", demoReady: "Demo Lista",
      incomingCall: "Llamada\nEntrante", leadCaptured: "Lead\nCapturado",
    },
    languages: {
      badge: "Soporte Multiidioma", heading: "Voces de todo el mundo",
      sub: "Comunícate con tus clientes en más de 30 idiomas.",
      desc: "B2BVoice habla el idioma de tus clientes. Turismo médico, inmobiliaria o e-commerce — sea cual sea tu sector, nunca pierdas a un cliente extranjero.",
      activeLanguage: "Idioma Activo", languagesLabel: "Idiomas", active: "Activo",
      totalLanguages: "Total de Idiomas", responseTime: "Tiempo de Respuesta", availability: "Disponibilidad",
      names: ["Turco", "Inglés", "Alemán", "Chino", "Coreano", "Francés", "Español", "Árabe", "Ruso", "Japonés", "Italiano", "Portugués"],
    },
    industries: {
      badge: "Sectores", heading: "Voz IA personalizada para", span: "cada sector.", sub: "De sanidad a hostelería — B2BVoice se adapta a cualquier negocio, flujo de trabajo e idioma.", scrollLabel: "Desplázate para explorar",
      items: [
        { title: "Grupos Sanitarios", features: ["Admisión de Pacientes", "Programación de Citas", "Enrutamiento de Llamadas"] },
        { title: "Gestión de Propiedades", features: ["Consultas de Alquiler", "Triaje de Mantenimiento", "Programación de Visitas"] },
        { title: "Servicios del Hogar y de Campo", features: ["Triaje de Emergencias", "Programación de Trabajos", "Coordinación de Despachos"] },
        { title: "Grupos de Automoción", features: ["Reserva de Servicio", "Actualizaciones de Reparación", "Enrutamiento de Leads"] },
        { title: "Despachos de Abogados", features: ["Admisión de Nuevos Clientes", "Enrutamiento por Tipo de Caso", "Reserva de Consultas"] },
        { title: "Personal y Selección", features: ["Evaluación de Candidatos", "Programación de Entrevistas", "Comprobación de Disponibilidad"] },
        { title: "Logística y Transporte", features: ["Actualizaciones de Envíos", "Check-ins de Conductores", "Enrutamiento de Excepciones"] },
        { title: "Aseguradoras", features: ["Admisión de Siniestros", "Soporte al Asegurado", "Enrutamiento a Agentes"] },
        { title: "Grupos de Hostelería", features: ["Soporte de Reservas", "Solicitudes de Huéspedes", "Enrutamiento Multi-Propiedad"] },
        { title: "Cuidado de Mayores y Atención Domiciliaria", features: ["Admisión de Clientes", "Programación de Cuidados", "Actualizaciones a Familias"] },
        { title: "Marcas Multilocales", features: ["Enrutamiento por Ubicación", "Soporte Centralizado", "Solicitudes de Clientes"] },
        { title: "Servicios Financieros", features: ["Admisión de Solicitudes", "Soporte al Cliente", "Enrutamiento Seguro"] },
        { title: "Gestión de Instalaciones", features: ["Admisión de Órdenes de Trabajo", "Asignación de Proveedores", "Actualizaciones de Estado"] },
        { title: "Manufactura y Distribución", features: ["Estado de Pedidos", "Soporte a Distribuidores", "Solicitudes de Servicio"] },
      ],
    },
    integrations: { badge: "Integraciones", heading: "Funciona con todas las herramientas\nque ya usas", sub: "CRM, calendario, WhatsApp, sistemas de pago — todo desde un hub, automáticamente.", hub: "AI Hub" },
    dashboard: {
      badge: "Dashboard", heading: "Rastrea cada llamada en tiempo real",
      menu: ["Resumen", "Llamadas", "Citas", "Clientes", "Configuración"],
      stats: [{ label: "Total Llamadas", val: "1.284" }, { label: "Respondidas", val: "1.271" }, { label: "Citas", val: "342" }, { label: "Nuevos Clientes", val: "89" }],
      weeklySummary: "Resumen Semanal de Llamadas", recentCalls: "Llamadas Recientes", todayAppts: "Citas de Hoy",
      calls: [
        { name: "John Smith", time: "Hace 2 min", status: "Cita Programada", color: "text-green-700 bg-green-50 border-green-200" },
        { name: "Emma Johnson", time: "Hace 15 min", status: "Info Proporcionada", color: "text-blue-700 bg-blue-50 border-blue-200" },
        { name: "+1 555 ***-****", time: "Hace 1 hora", status: "Perdida", color: "text-orange-700 bg-orange-50 border-orange-200" },
      ],
      apts: [{ time: "14:30", title: "Revisión - Michael T." }, { time: "16:00", title: "Seguimiento - Sarah K." }, { time: "17:15", title: "Primera Visita - James B." }],
    },
    howItWorks: {
      badge: "Cómo funciona", heading: "Cómo B2BVoice Convierte Llamadas en Oportunidades",
      sub: "Desde el primer timbre hasta el resumen final, B2BVoice gestiona el flujo de llamadas para que tu equipo pueda centrarse en los clientes que tiene delante.",
      steps: [
        { title: "La IA Responde la Llamada Entrante", desc: "Responde al instante cuando un cliente llama, incluso cuando tu equipo está ocupado." },
        { title: "Entiende la Necesidad del Cliente", desc: "Hace las preguntas correctas, identifica la solicitud y comprende lo que el cliente busca." },
        { title: "Recopila Datos Importantes", desc: "Captura información clave: nombre, teléfono, solicitud de servicio, hora preferida y urgencia." },
        { title: "Enruta u Organiza la Solicitud", desc: "Envía los detalles de la llamada a la persona, departamento, CRM, hoja de cálculo o flujo de trabajo correcto." },
        { title: "Te Envía un Resumen Claro de la Llamada", desc: "Después de la llamada, recibes un resumen simple con la necesidad del cliente, su intención y el siguiente paso recomendado." },
      ],
    },
    testimonials: {
      badge: "Opiniones de Clientes", heading: "Las empresas crecen con B2BVoice",
      items: [
        { quote: "Ya no perdemos ninguna llamada. La tasa de ocupación de citas de nuestra clínica aumentó un 40%.", author: "Dr. Sarah K.", role: "Propietaria de Clínica Estética", metric: "40% más citas" },
        { quote: "Las consultas de pacientes internacionales que llegan de noche ya no se pierden. Ha marcado una gran diferencia en el turismo médico.", author: "Michael Y.", role: "Director de Turismo Médico", metric: "Más reservas nocturnas" },
        { quote: "En inmobiliaria, la velocidad lo es todo. Con B2BVoice, siempre somos los primeros en responder.", author: "Jessica A.", role: "Consultora Inmobiliaria", metric: "0 llamadas perdidas" },
        { quote: "La satisfacción del cliente ha mejorado visiblemente. Nuestro proceso de citas está completamente automatizado.", author: "David B.", role: "Director de Clínica Dental", metric: "80% menos trabajo manual" },
      ],
    },
    demo: {
      badge: "Demos de Audio", heading: "Escucha cómo B2BVoice podría responder llamadas", span: "para diferentes negocios.",
      sub: "Estos son demos de muestra únicamente. Cada agente B2BVoice se construye a medida para el negocio específico, sus servicios, preguntas de clientes, reglas de programación, tono y flujo de trabajo.",
      customDemo: "¿Quieres escuchar un demo personalizado para tu negocio?",
      allTab: "Todos", listenSample: "Escuchar demo",
      cards: [
        { role: "Recepcionista de Clínica", desc: "Cálida y profesional, especialista en derivación de pacientes", industry: "Salud" },
        { role: "Conserje de Hotel", desc: "Amable y enérgica, especialista en experiencia del huésped", industry: "Hostelería" },
        { role: "Consultora Médica", desc: "Tono tranquilo y confiable, información médica", industry: "Turismo Médico" },
        { role: "Asistente de Programación", desc: "Rápida y organizada, experta en gestión de calendario", industry: "Servicios" },
        { role: "Representante de Ventas", desc: "Persuasiva y dinámica, experta en conversión de leads", industry: "Inmobiliaria" },
        { role: "Soporte al Cliente", desc: "Paciente y orientada a soluciones, soporte 24/7", industry: "E-Commerce" },
      ],
    },
    pricing: { badge: "Demo", heading: "Cada empresa es única", sub: "Déjanos analizar tus necesidades con un demo personalizado.", cta: "Solicitar Demo Gratuita", features: ["Configuración en 1-2 días", "Soporte 24/7"] },
    faq: {
      badge: "FAQ", heading: "Preguntas Frecuentes",
      items: [
        { q: "¿B2BVoice suena como un humano real?", a: "Sí. B2BVoice está diseñado para hablar de forma natural, entender la intención del cliente y responder de manera fluida y conversacional. La voz, el tono y el flujo de llamadas se pueden personalizar para tu negocio." },
        { q: "¿B2BVoice es un bot prefabricado?", a: "No. No simplemente te damos una herramienta de IA genérica. Nuestro equipo construye un asistente telefónico de IA personalizado en torno a tu negocio, servicios, preguntas de clientes y flujo de llamadas diario." },
        { q: "¿Ofrecen una demo gratuita?", a: "Sí. Antes de que decidas trabajar con nosotros, podemos preparar una demo personalizada gratuita para tu negocio para que puedas experimentar cómo tu asistente de IA hablaría con tus clientes." },
        { q: "¿Cuánto tiempo tarda la configuración?", a: "El tiempo de configuración depende de las necesidades e integraciones de tu negocio, pero la mayoría de las demos básicas se pueden preparar rápidamente después de entender tus servicios, flujo de llamadas y preguntas de clientes." },
        { q: "¿Con qué herramientas puede integrarse B2BVoice?", a: "B2BVoice puede conectarse con herramientas como sistemas CRM, calendarios, Gmail, Google Sheets, WhatsApp, Slack, Microsoft Teams, n8n, Zapier y otros flujos de trabajo empresariales." },
        { q: "¿Puede gestionar solicitudes de citas?", a: "Sí. B2BVoice puede recopilar solicitudes de citas, preguntar por horarios preferidos, reunir datos de clientes y enviar la información a tu equipo, calendario, CRM o flujo de trabajo." },
        { q: "¿Qué pasa después de que termina una llamada?", a: "Después de cada llamada, B2BVoice puede proporcionar un resumen claro con los datos del cliente, la solicitud, la intención y el siguiente paso recomendado." },
        { q: "¿Es adecuado para mi industria?", a: "B2BVoice puede personalizarse para muchas industrias de servicios, incluyendo bienes raíces, clínicas dentales, salones, clínicas de belleza, bufetes de abogados, clínicas médicas, servicios automotrices, servicios del hogar y más." },
        { q: "¿Puede funcionar con mi sistema telefónico actual?", a: "En muchos casos, sí. B2BVoice puede conectarse a tu configuración telefónica existente o configurarse con un nuevo flujo de llamadas según las necesidades de tu negocio." },
        { q: "¿Qué información necesitan para crear mi demo?", a: "Generalmente necesitamos tu tipo de negocio, servicios, preguntas frecuentes de clientes, flujo de llamadas preferido y qué quieres que el asistente de IA recopile o maneje durante las llamadas." },
      ],
      setup: {
        heading: "Proceso de Configuración Personalizado",
        sub: "Cada sistema B2BVoice se prepara cuidadosamente para el negocio específico. No instalamos el mismo asistente para todos.",
        points: [
          "¿Qué tipo de negocio es?",
          "¿Qué servicios ofrecen?",
          "¿Qué preguntas hacen los clientes con más frecuencia?",
          "¿Cómo se programan las citas o llamadas?",
          "¿Qué información necesita recopilarse?",
          "¿Cuándo el asistente debe responder directamente?",
          "¿Cuándo la conversación debe transferirse a un humano?",
          "¿Qué tono quiere usar el negocio?",
          "¿Qué idiomas necesita el negocio?",
          "¿Qué herramientas de reservas, CRM, calendario o comunicación ya utilizan?",
        ],
        duration: "La configuración generalmente toma alrededor de 3 semanas, porque el sistema se construye cuidadosamente y se prueba para ese negocio específico — porque un buen asistente telefónico debe entender el negocio antes de poder representarlo correctamente.",
      },
    },
    finalCta: { heading: "Tu negocio es único.", span: "Tu asistente de IA también debería serlo.", sub: "", desc: "Obtén una demo personalizada y gratuita diseñada en torno a tus servicios, clientes y flujo de llamadas diario.", cta1: "Obtener Demo Ahora", cta2: "Llámanos" },
    finalCta2: { heading: "Ve tu asistente de IA personalizado", span: "antes de decidirte", desc: "Construiremos una demo gratuita y personalizada en torno a tu negocio, servicios y flujo de llamadas — para que puedas experimentar B2BVoice antes de empezar.", cta1: "Obtener Demo Ahora" },
    footer: {
      tagline: "Soluciones de llamadas impulsadas por IA 24/7.", product: "Producto",
      productLinks: ["Características", "Sectores", "Cómo funciona", "Precios"],
      industries: "Sectores",
      industryLinks: ["Clínicas", "Dental", "Estética", "Inmobiliaria", "E-Commerce"],
      support: "Soporte", supportLinks: ["FAQ", "Documentación", "Contacto", "Solicitar Demo"],
      allRights: "Todos los derechos reservados.", privacy: "Privacidad", privacyPolicy: "Política de Privacidad", terms: "Términos de Servicio",
    },
    modal: {
      title: "Solicitar una Demo Personalizada Gratuita",
      sub: "Cuéntanos sobre tu negocio — prepararemos el demo más relevante.",
      stepLabels: ["Contacto", "Negocio", "Necesidades", "Tipo de Demo", "Listo"],
      businessTypes: ["Agente / Agencia Inmobiliaria", "Salón de Peluquería / Barbería", "Salón de Belleza / Uñas", "Med Spa", "Contabilidad / Asesoría Fiscal", "Despacho de Abogados", "Clínica Médica / Dental", "Servicios del Hogar", "Otro"],
      demoNeeds: ["Responder llamadas perdidas", "Responder preguntas frecuentes de clientes", "Reserva de citas", "Programación de llamadas", "Calificación de leads", "Atención fuera de horario", "Soporte en idioma seleccionado", "Resumen de llamada tras la conversación", "No estoy seguro todavía"],
      demoTypes: [
        { value: "google-meet", label: "Demo en vivo por Google Meet", desc: "Programa una llamada en vivo con nuestro equipo" },
        { value: "demo-call", label: "Que el agente demo me llame", desc: "Recibe una llamada demo de IA en tu teléfono" },
        { value: "voice-recording", label: "Envíame una grabación de voz de muestra", desc: "Recibe un audio personalizado por email" },
        { value: "not-sure", label: "No estoy seguro todavía", desc: "Te ayudaremos a decidir" },
      ],
      step1: { title: "Información de Contacto", emailLabel: "Email de Empresa", emailPlaceholder: "tu@empresa.com", phoneLabel: "Número de Teléfono", phoneOptional: "(opcional)", phoneHint: "Requerido solo si quieres que el agente demo te llame." },
      step2: { title: "Información del Negocio", businessTypeLabel: "¿Qué tipo de negocio tienes?", businessTypePlaceholder: "Selecciona tu tipo de negocio...", descLabel: "Por favor describe tu negocio", descPlaceholder: "Cuéntanos sobre tu negocio...", websiteLabel: "Sitio web o Instagram de tu negocio", websitePlaceholder: "https://... o @tuusuario" },
      step3: { title: "¿Qué quieres ver en el demo?", otherLabel: "Otro", otherPlaceholder: "Cuéntanos qué tienes en mente..." },
      step4: { title: "¿Cómo te gustaría experimentar el demo?", consentText: "Acepto ser contactado por B2BVoice en relación con mi solicitud de demo y necesidades de negocio." },
      success: { meetTitle: "Gracias — hemos recibido tu solicitud de demo.", meetSub: "Ahora puedes elegir el mejor día y hora para tu demo en vivo de Google Meet haciendo clic en el enlace de programación de esta página.\n\nSi no estás disponible ahora o no programas una hora, no te preocupes — uno de nuestros miembros del equipo te contactará en breve.\n\nPor favor revisa tu bandeja de entrada.\n\nY no olvides revisar tu carpeta de spam también — lamentablemente, los correos importantes a veces se esconden ahí.\n\n¿Tienes alguna pregunta? Escríbenos en cualquier momento a hello@b2b-voice.com\n\nEstaremos encantados de ayudarte.", otherTitle: "Gracias — hemos recibido tu solicitud de demo.", otherSub: "Te enviaremos un email pronto para confirmar el siguiente paso.\n\nSi solicitaste una llamada de demo, te preguntaremos cuándo te gustaría que el agente de demo te llame.\n\nSi solicitaste una grabación de voz de muestra, confirmaremos algunos detalles primero para poder preparar el ejemplo más relevante para tu negocio.\n\nPor favor revisa tu bandeja de entrada.\n\nY no olvides revisar tu carpeta de spam también — lamentablemente, los correos importantes a veces se esconden ahí.\n\n¿Tienes alguna pregunta? Escríbenos en cualquier momento a hello@b2b-voice.com\n\nEstaremos encantados de ayudarte.", close: "Cerrar" },
      errors: { email: "Por favor ingresa un email de empresa válido.", demoType: "Por favor selecciona cómo te gustaría experimentar el demo.", consent: "Por favor acepta ser contactado para enviar tu solicitud.", generic: "Algo salió mal. Por favor inténtalo de nuevo." },
      next: "Siguiente", back: "Atrás", submit: "Enviar Solicitud",
    },
  },
};
