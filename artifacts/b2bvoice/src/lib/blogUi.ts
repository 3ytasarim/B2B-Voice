import type { Locale } from "./i18n";

/** Text of the blog chrome (index + article page) per language. The articles themselves are translated separately. */
export interface BlogUi {
  eyebrow: string;
  headingLead: string; // dark, light-weight part of the H1
  headingAccent: string; // navy, bold part
  subtitle: string;
  all: string;
  filterLabel: string;
  searchPlaceholder: string;
  searchLabel: string;
  articleOne: string;
  articleMany: string;
  inTopic: string; // "in {topic}"
  noResults: string;
  showAll: string;
  readArticle: string;
  backToBlog: string;
  home: string;
  breadcrumb: string;
  published: string;
  by: string;
  topicsLabel: string;
  related: string;
  ctaLead: string;
  ctaDemo: string;
  ctaOr: string;
  ctaHome: string;
  ctaEnd: string;
  notFoundTitle: string;
  notFoundText: string;
  indexTitle: string;
  indexDescription: string;
  topics: Record<string, string>;
}

const TOPICS_EN = {
  Fundamentals: "Fundamentals",
  Technology: "Technology",
  "Buyer Guides": "Buyer Guides",
  "Industry Solutions": "Industry Solutions",
  "Operations & Integrations": "Operations & Integrations",
  "Testing & Quality": "Testing & Quality",
};

export const BLOG_UI: Record<Locale, BlogUi> = {
  en: {
    eyebrow: "Blog",
    headingLead: "KNOWLEDGE & ",
    headingAccent: "INSIGHTS",
    subtitle: "Practical guides on AI voice agents: how they work, how to choose one, and how to test it before it takes your calls.",
    all: "All",
    filterLabel: "Filter articles by topic",
    searchPlaceholder: "Search articles…",
    searchLabel: "Search articles",
    articleOne: "article",
    articleMany: "articles",
    inTopic: "in",
    noResults: "No articles match your search.",
    showAll: "Show all articles",
    readArticle: "Read article",
    backToBlog: "← Back to Blog",
    home: "Home",
    breadcrumb: "Breadcrumb",
    published: "Published",
    by: "By",
    topicsLabel: "Topics",
    related: "Related Articles",
    ctaLead: "Want to hear an AI voice agent handle your own calls?",
    ctaDemo: "Book a free B2BVoice demo",
    ctaOr: "or read more about",
    ctaHome: "what B2BVoice builds for businesses",
    ctaEnd: ".",
    notFoundTitle: "404 – Page not found",
    notFoundText: "This page could not be found.",
    indexTitle: "Blog | B2BVoice",
    indexDescription: "Guides on AI voice agents and AI receptionists: how they work, how to choose and test one, and how to run it on real business calls.",
    topics: TOPICS_EN,
  },
  de: {
    eyebrow: "Blog",
    headingLead: "WISSEN & ",
    headingAccent: "INSIGHTS",
    subtitle: "Praxisnahe Ratgeber zu KI-Sprachagenten: wie sie funktionieren, wie Sie den richtigen auswählen und wie Sie ihn testen, bevor er Ihre Anrufe annimmt.",
    all: "Alle",
    filterLabel: "Artikel nach Thema filtern",
    searchPlaceholder: "Artikel durchsuchen…",
    searchLabel: "Artikel durchsuchen",
    articleOne: "Artikel",
    articleMany: "Artikel",
    inTopic: "in",
    noResults: "Keine Artikel gefunden.",
    showAll: "Alle Artikel anzeigen",
    readArticle: "Artikel lesen",
    backToBlog: "← Zurück zum Blog",
    home: "Startseite",
    breadcrumb: "Brotkrumen-Navigation",
    published: "Veröffentlicht am",
    by: "Von",
    topicsLabel: "Themen",
    related: "Ähnliche Artikel",
    ctaLead: "Möchten Sie hören, wie ein KI-Sprachagent Ihre eigenen Anrufe bearbeitet?",
    ctaDemo: "Kostenlose B2BVoice-Demo buchen",
    ctaOr: "oder erfahren Sie mehr darüber,",
    ctaHome: "was B2BVoice für Unternehmen entwickelt",
    ctaEnd: ".",
    notFoundTitle: "404 – Seite nicht gefunden",
    notFoundText: "Diese Seite konnte nicht gefunden werden.",
    indexTitle: "Blog | B2BVoice",
    indexDescription: "Ratgeber zu KI-Sprachagenten und KI-Rezeptionisten: wie sie funktionieren, wie Sie einen auswählen und testen und wie Sie ihn im echten Geschäftsalltag betreiben.",
    topics: {
      Fundamentals: "Grundlagen",
      Technology: "Technologie",
      "Buyer Guides": "Kaufratgeber",
      "Industry Solutions": "Branchenlösungen",
      "Operations & Integrations": "Betrieb & Integrationen",
      "Testing & Quality": "Tests & Qualität",
    },
  },
  es: {
    eyebrow: "Blog",
    headingLead: "CONOCIMIENTO Y ",
    headingAccent: "PERSPECTIVAS",
    subtitle: "Guías prácticas sobre agentes de voz con IA: cómo funcionan, cómo elegir uno y cómo probarlo antes de que atienda sus llamadas.",
    all: "Todos",
    filterLabel: "Filtrar artículos por tema",
    searchPlaceholder: "Buscar artículos…",
    searchLabel: "Buscar artículos",
    articleOne: "artículo",
    articleMany: "artículos",
    inTopic: "en",
    noResults: "Ningún artículo coincide con su búsqueda.",
    showAll: "Mostrar todos los artículos",
    readArticle: "Leer artículo",
    backToBlog: "← Volver al blog",
    home: "Inicio",
    breadcrumb: "Ruta de navegación",
    published: "Publicado el",
    by: "Por",
    topicsLabel: "Temas",
    related: "Artículos relacionados",
    ctaLead: "¿Quiere escuchar cómo un agente de voz con IA atiende sus propias llamadas?",
    ctaDemo: "Reserve una demostración gratuita de B2BVoice",
    ctaOr: "o conozca más sobre",
    ctaHome: "lo que B2BVoice desarrolla para las empresas",
    ctaEnd: ".",
    notFoundTitle: "404 – Página no encontrada",
    notFoundText: "No se pudo encontrar esta página.",
    indexTitle: "Blog | B2BVoice",
    indexDescription: "Guías sobre agentes de voz con IA y recepcionistas con IA: cómo funcionan, cómo elegir y probar uno y cómo operarlo en llamadas reales de negocio.",
    topics: {
      Fundamentals: "Fundamentos",
      Technology: "Tecnología",
      "Buyer Guides": "Guías de compra",
      "Industry Solutions": "Soluciones por sector",
      "Operations & Integrations": "Operaciones e integraciones",
      "Testing & Quality": "Pruebas y calidad",
    },
  },
};
