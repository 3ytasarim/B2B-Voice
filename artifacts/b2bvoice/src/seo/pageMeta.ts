// Single source of truth for every public page's head metadata.
// Used by the prerenderer (scripts/prerender.mjs via entry-server.tsx) to
// write the metadata into the first HTML response, and by usePageMeta() to
// keep it correct during client-side navigation.

export const SITE_URL = "https://b2b-voice.com";
export const SITE_NAME = "B2BVoice";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  ogImage: string;
  noindex?: boolean;
  /** ISO dates, articles only. */
  published?: string;
}

export const HOME_META: PageMeta = {
  path: "/",
  title: "B2BVoice – AI Voice Assistant for Businesses",
  description:
    "B2BVoice — Your AI Voice Assistant that answers calls, schedules appointments and syncs with your CRM 24/7.",
  ogType: "website",
  ogImage: DEFAULT_OG_IMAGE,
};

export const STATIC_PAGES: PageMeta[] = [
  HOME_META,
  {
    path: "/blog",
    title: "Blog | B2BVoice — AI Voice Assistant Insights",
    description:
      "Insights, guides, and industry news about AI voice assistants, business automation, and customer communication from the B2BVoice team.",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    path: "/demo",
    title: "Book a Free AI Voice Agent Demo | B2BVoice",
    description:
      "Tell us about your business and hear a custom AI voice agent handle your calls, book appointments and update your CRM. Book your free B2BVoice demo.",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | B2BVoice",
    description:
      "How B2BVoice collects, uses and protects personal data when you visit our website or use our AI voice agent services.",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    path: "/cookie-policy",
    title: "Cookie Policy | B2BVoice",
    description:
      "Which cookies and similar technologies the B2BVoice website uses, why we use them and how you can manage your preferences.",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    path: "/terms-of-use",
    title: "Website Terms of Use | B2BVoice",
    description:
      "The terms and conditions that apply when you access and use the B2BVoice website and its content.",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
  },
  {
    path: "/legal-notice",
    title: "Legal Notice | B2BVoice",
    description: "Legal notice and company information for B2BVoice (B2B Voice LLC), including contact details.",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
  },
];

export const NOT_FOUND_META: PageMeta = {
  path: "/404",
  title: "Page Not Found | B2BVoice",
  description: "The page you are looking for does not exist.",
  ogType: "website",
  ogImage: DEFAULT_OG_IMAGE,
  noindex: true,
};

export const ADMIN_META: PageMeta = {
  path: "/admin",
  title: "Admin | B2BVoice",
  description: "B2BVoice administration.",
  ogType: "website",
  ogImage: DEFAULT_OG_IMAGE,
  noindex: true,
};

/** Trim to a search-snippet friendly length on a word boundary. */
export function snippet(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–—-]+$/, "") + "…";
}

export function postMeta(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
}): PageMeta {
  return {
    path: `/${post.slug}`,
    title: `${post.title} | ${SITE_NAME}`,
    description: snippet(post.excerpt),
    ogType: "article",
    ogImage: post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`
      : DEFAULT_OG_IMAGE,
    published: post.date,
  };
}

export function canonicalFor(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
