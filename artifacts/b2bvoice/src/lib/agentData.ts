const B = "https://b2b-voice-media.fsn1.your-objectstorage.com/site/agents";

export interface AgentInfo {
  id: number;
  name: string;
  role: string;
  industry: string;
  photo: string;
  audio: string;
}

export const AGENTS: Record<"en" | "de" | "es", AgentInfo[]> = {
  en: [
    { id: 1,  name: "Alex",   role: "Real Estate Assistant — Fast, professional, and lead-focused",       industry: "Real Estate",      photo: `${B}/en/photos/1-alex.webp`,    audio: `${B}/en/audio/1_Alex_Real_Estate.mp3` },
    { id: 2,  name: "Mia",    role: "Salon Receptionist — Friendly, helpful, and appointment-focused",   industry: "Hair Salon",        photo: `${B}/en/photos/2-mia.webp`,     audio: `${B}/en/audio/2-Mia_Hair_salon.mp3` },
    { id: 3,  name: "James",  role: "Legal Intake Assistant — Professional, respectful, and careful",    industry: "Law Office",        photo: `${B}/en/photos/3-James.webp`,   audio: `${B}/en/audio/3-James_law-office.mp3` },
    { id: 4,  name: "Emily",  role: "Dental Office Assistant — Calm, clear, and reassuring",             industry: "Dental Office",     photo: `${B}/en/photos/4-Emily.webp`,   audio: `${B}/en/audio/4-emily-dental.mp3` },
    { id: 5,  name: "Olivia", role: "Clinic Phone Assistant — Professional, calm, and organized",        industry: "Medical Clinic",    photo: `${B}/en/photos/5-Olivia.webp`,  audio: `${B}/en/audio/5-olivia-medical.mp3` },
    { id: 6,  name: "Daniel", role: "Tax Office Assistant — Organized, clear, and detail-focused",       industry: "Tax & Accounting",  photo: `${B}/en/photos/6-Daniel.webp`,  audio: `${B}/en/audio/6-daniel-tax.mp3` },
    { id: 7,  name: "Sophia", role: "Beauty Appointment Assistant — Soft, polished, and client-friendly",industry: "Beauty & Nail",     photo: `${B}/en/photos/7-Sophia.webp`,  audio: `${B}/en/audio/7-sophia-beauty.mp3` },
    { id: 8,  name: "Ryan",   role: "Service Call Assistant — Direct, practical, and responsive",        industry: "Home Services",     photo: `${B}/en/photos/8-Ryan.webp`,    audio: `${B}/en/audio/8-Ryan_home_services.mp3` },
    { id: 9,  name: "Emma",   role: "Customer Service Assistant — Patient, solution-focused, supportive",industry: "Customer Service",  photo: `${B}/en/photos/9-Emma.webp`,    audio: `${B}/en/audio/9-Emma-customer-support.mp3` },
    { id: 10, name: "Ethan",  role: "Sales Assistant — Confident, friendly, and lead-focused",           industry: "Sales",             photo: `${B}/en/photos/10-ethan.webp`,  audio: `${B}/en/audio/10-Ethan_sales.mp3` },
    { id: 11, name: "Ava",    role: "Med Spa Consultation Assistant — Premium, calm, trust-building",    industry: "Med Spa",           photo: `${B}/en/photos/11-Ava.webp`,    audio: `${B}/en/audio/11-Ava-med-spa.mp3` },
    { id: 12, name: "Zoe",    role: "Appointment Assistant — Organized, friendly, and schedule-focused", industry: "Appointments",      photo: `${B}/en/photos/12-Zoe.webp`,    audio: `${B}/en/audio/12-Zoe_appointment.mp3` },
  ],
  de: [
    { id: 1,  name: "Lukas",  role: "Immobilien-Assistent — Schnell, professionell und lead-orientiert",           industry: "Immobilien",          photo: `${B}/de/photos/1-Lukas.webp`,   audio: `${B}/de/audio/1-lukas-immobilien.mp3` },
    { id: 2,  name: "Anna",   role: "Salon-Rezeptionistin — Freundlich, hilfsbereit und terminorientiert",         industry: "Friseursalon",        photo: `${B}/de/photos/2-Anna.webp`,    audio: `${B}/de/audio/2-anna-barber.mp3` },
    { id: 3,  name: "Jonas",  role: "Kanzlei-Assistent — Professionell, respektvoll und sorgfältig",              industry: "Anwaltskanzlei",      photo: `${B}/de/photos/3-Jonas.webp`,   audio: `${B}/de/audio/3-Jonas-anwelt.mp3` },
    { id: 4,  name: "Sophie", role: "Zahnarztpraxis-Assistentin — Ruhig, klar und vertrauensvoll",                industry: "Zahnarztpraxis",      photo: `${B}/de/photos/4-Sophie.webp`,  audio: `${B}/de/audio/4-sophie-zahnar.mp3` },
    { id: 5,  name: "Laura",  role: "Praxis-Assistentin — Professionell, ruhig und organisiert",                  industry: "Arztpraxis",          photo: `${B}/de/photos/5-Laura.webp`,   audio: `${B}/de/audio/5-Laura-Cilinic.mp3` },
    { id: 6,  name: "Felix",  role: "Steuerkanzlei-Assistent — Strukturiert, klar und detailorientiert",          industry: "Steuerberater",       photo: `${B}/de/photos/6-Felix.webp`,   audio: `${B}/de/audio/6-felix-steur.mp3` },
    { id: 7,  name: "Clara",  role: "Beauty-Assistentin — Sanft, gepflegt und kundenorientiert",                  industry: "Kosmetikstudio",      photo: `${B}/de/photos/7-Clara.webp`,   audio: `${B}/de/audio/7-clara-kosmetik.mp3` },
    { id: 8,  name: "Max",    role: "Service-Assistent — Direkt, praktisch und lösungsorientiert",                industry: "Handwerker",          photo: `${B}/de/photos/8-Max.webp`,     audio: `${B}/de/audio/8-max-handwerker.mp3` },
    { id: 9,  name: "Marie",  role: "Kundenservice-Assistentin — Geduldig, klar und lösungsorientiert",           industry: "Kundenservice",       photo: `${B}/de/photos/9-Marie.webp`,   audio: `${B}/de/audio/9-marie-kunden.mp3` },
    { id: 10, name: "Leon",   role: "Vertriebs-Assistent — Selbstbewusst, freundlich und verkaufsorientiert",     industry: "Vertrieb",            photo: `${B}/de/photos/10-Leon.webp`,   audio: `${B}/de/audio/10_leon_vertrie.mp3` },
    { id: 11, name: "Emilia", role: "Ästhetik-Assistentin — Premium, ruhig und vertrauensbildend",                industry: "Ästhetische Klinik",  photo: `${B}/de/photos/11-Emilia.webp`, audio: `${B}/de/audio/11-emilia-klinik.mp3` },
    { id: 12, name: "Lena",   role: "Terminassistentin — Organisiert, freundlich und kalenderorientiert",         industry: "Terminverwaltung",    photo: `${B}/de/photos/12-Lena.webp`,   audio: `${B}/de/audio/12-lena-termin.mp3` },
  ],
  es: [
    { id: 1,  name: "Álvaro",  role: "Asistente Inmobiliario — Rápido, profesional y orientado a leads",             industry: "Inmobiliaria",          photo: `${B}/es/photos/1-Alvaro.webp`,    audio: `${B}/es/audio/1-Alvaro_inmobilira.mp3` },
    { id: 2,  name: "Lucía",   role: "Recepcionista de Peluquería — Cercana, amable y enfocada en citas",            industry: "Peluquería",            photo: `${B}/es/photos/2-Lucia.webp`,     audio: `${B}/es/audio/2-Lucia_recopcion.mp3` },
    { id: 3,  name: "Sergio",  role: "Asistente Legal — Profesional, respetuoso y cuidadoso",                        industry: "Despacho de Abogados",  photo: `${B}/es/photos/3-sergio.webp`,    audio: `${B}/es/audio/3-sergio-legal.mp3` },
    { id: 4,  name: "Elena",   role: "Asistente Dental — Tranquila, clara y de confianza",                           industry: "Clínica Dental",        photo: `${B}/es/photos/4-Elena.webp`,     audio: `${B}/es/audio/4-elena-clinic.mp3` },
    { id: 5,  name: "Carmen",  role: "Asistente de Clínica — Profesional, serena y organizada",                      industry: "Clínica Médica",        photo: `${B}/es/photos/5-Carmen.webp`,    audio: `${B}/es/audio/5-carmen-clinica.mp3` },
    { id: 6,  name: "Javier",  role: "Asistente de Asesoría — Ordenado, claro y orientado a información",            industry: "Asesoría / Gestoría",   photo: `${B}/es/photos/6-Javier.webp`,    audio: `${B}/es/audio/6-Javier-assesorie.mp3` },
    { id: 7,  name: "Martina", role: "Asistente de Belleza — Suave, elegante y orientada al cliente",                industry: "Centro de Estética",    photo: `${B}/es/photos/7-martina.webp`,   audio: `${B}/es/audio/7-martina-este.mp3` },
    { id: 8,  name: "Carlos",  role: "Asistente de Servicio Técnico — Directo, práctico y resolutivo",               industry: "Servicios del Hogar",   photo: `${B}/es/photos/8-Carlos.webp`,    audio: `${B}/es/audio/8-carlos-services.mp3` },
    { id: 9,  name: "Isabel",  role: "Asistente de Atención al Cliente — Paciente, clara y orientada a soluciones",  industry: "Atención al Cliente",   photo: `${B}/es/photos/9-Isabel.webp`,    audio: `${B}/es/audio/9-isabel-cliente.mp3` },
    { id: 10, name: "Diego",   role: "Asistente Comercial — Seguro, dinámico y orientado a conversión",               industry: "Ventas",                photo: `${B}/es/photos/10-Diego.webp`,    audio: `${B}/es/audio/10-Diego_ventas.mp3` },
    { id: 11, name: "Valeria", role: "Asistente de Clínica Estética — Premium, tranquila y de confianza",            industry: "Clínica Estética",      photo: `${B}/es/photos/11-Valaria.webp`,  audio: `${B}/es/audio/11-Valeria_clinica.mp3` },
    { id: 12, name: "Paula",   role: "Asistente de Citas — Organizada, amable y enfocada en agenda",                 industry: "Gestión de Citas",      photo: `${B}/es/photos/12-Paula.webp`,    audio: `${B}/es/audio/12-paula-citas.mp3` },
  ],
};
