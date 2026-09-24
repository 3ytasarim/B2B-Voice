import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  canonicalFor,
  postMeta,
  type PageMeta,
} from "./pageMeta";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage: string;
}

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO = `${SITE_URL}/logo-clean.png`;

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  legalName: "B2B Voice LLC",
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: LOGO },
  email: "hello@b2b-voice.com",
};

const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: canonicalFor(it.path),
  })),
});

/** JSON-LD graphs (each becomes one <script type="application/ld+json">) for a path. */
export function jsonLdFor(page: PageMeta, posts: Post[]): object[] {
  const ctx = { "@context": "https://schema.org" };

  if (page.path === "/") {
    return [
      { ...ctx, ...organization },
      {
        ...ctx,
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: "en",
        publisher: { "@id": ORG_ID },
      },
      {
        ...ctx,
        "@type": "Service",
        name: "AI Voice Agents for Businesses",
        serviceType: "AI voice agent and AI receptionist development",
        description: page.description,
        url: `${SITE_URL}/`,
        provider: { "@id": ORG_ID },
      },
    ];
  }

  if (page.path === "/blog") {
    return [
      {
        ...ctx,
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        name: "B2BVoice Blog",
        description: page.description,
        url: canonicalFor("/blog"),
        inLanguage: "en",
        publisher: { "@id": ORG_ID },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: canonicalFor(`/${p.slug}`),
          datePublished: p.date,
        })),
      },
      { ...ctx, ...breadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]) },
    ];
  }

  const post = posts.find((p) => `/${p.slug}` === page.path);
  if (post) {
    const url = canonicalFor(page.path);
    return [
      {
        ...ctx,
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: postMeta(post).description,
        image: postMeta(post).ogImage || DEFAULT_OG_IMAGE,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
        publisher: { ...organization, "@type": "Organization" },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        inLanguage: "en",
        articleSection: post.category,
        keywords: post.tags.join(", ") || undefined,
      },
      {
        ...ctx,
        ...breadcrumb([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: page.path },
        ]),
      },
    ];
  }

  if (page.noindex) return [];
  return [
    {
      ...ctx,
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: canonicalFor(page.path),
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
    },
    { ...ctx, ...breadcrumb([{ name: "Home", path: "/" }, { name: page.title.replace(/ \| .*/, ""), path: page.path }]) },
  ];
}
