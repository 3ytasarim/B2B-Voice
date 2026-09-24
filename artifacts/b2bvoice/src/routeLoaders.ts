// Single place that defines how each lazily loaded page is imported, so the
// router (React.lazy) and the client entry (which preloads the current
// route's chunk before hydrating) always use the same dynamic imports.
export const routeLoaders = {
  notFound: () => import("@/pages/not-found"),
  admin: () => import("@/pages/admin"),
  adminLogin: () => import("@/pages/admin-login"),
  privacy: () => import("@/pages/privacy-policy"),
  cookies: () => import("@/pages/cookie-policy"),
  terms: () => import("@/pages/terms-of-use"),
  legalNotice: () => import("@/pages/legal-notice"),
  demo: () => import("@/pages/demo"),
  blog: () => import("@/pages/blog"),
  blogPost: () => import("@/pages/blog-post"),
} as const;

/** Returns the loader for the page that renders at `path`, if it is lazy. */
export function loaderForPath(path: string): (() => Promise<unknown>) | null {
  const p = path.replace(/\/+$/, "") || "/";
  if (p === "/") return null;
  if (p === "/admin/login") return routeLoaders.adminLogin;
  if (p === "/admin") return routeLoaders.admin;
  if (p === "/privacy-policy") return routeLoaders.privacy;
  if (p === "/cookie-policy") return routeLoaders.cookies;
  if (p === "/terms-of-use") return routeLoaders.terms;
  if (p === "/legal-notice") return routeLoaders.legalNotice;
  if (p === "/demo") return routeLoaders.demo;
  if (p === "/blog") return routeLoaders.blog;
  if (/^\/[^/]+$/.test(p)) return routeLoaders.blogPost;
  return routeLoaders.notFound;
}
