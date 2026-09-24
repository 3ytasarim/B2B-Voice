import { lazy, Suspense, type ComponentType } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import { LanguageProvider } from "@/lib/LanguageContext";
import { useGoogleTracking } from "@/lib/useGoogleTracking";
import { routeLoaders } from "@/routeLoaders";

// Route-level code splitting: only the Home page ships in the entry bundle.
// Blog articles (large static HTML), admin and legal pages load on demand.
// Each lazy page carries its OWN Suspense boundary. Home must never sit inside
// a shared boundary: components inside it (3D/WebGL) can suspend, and a shared
// boundary would hide the whole page (display:none) and reset its animations.
function lazyPage(loader: () => Promise<{ default: ComponentType }>) {
  const Page = lazy(loader);
  return function LazyPage() {
    return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    );
  };
}

const NotFound = lazyPage(routeLoaders.notFound);
const AdminPage = lazyPage(routeLoaders.admin);
const AdminLogin = lazyPage(routeLoaders.adminLogin);
const PrivacyPolicy = lazyPage(routeLoaders.privacy);
const CookiePolicy = lazyPage(routeLoaders.cookies);
const TermsOfUse = lazyPage(routeLoaders.terms);
const LegalNotice = lazyPage(routeLoaders.legalNotice);
const DemoPage = lazyPage(routeLoaders.demo);
const BlogPage = lazyPage(routeLoaders.blog);
const BlogPostPage = lazyPage(routeLoaders.blogPost);

/** First tab stop: lets keyboard users jump past the navigation. */
function SkipLink() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return null;
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-primary focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

function Router() {
  useGoogleTracking();
  return (
    <>
    <SkipLink />
    <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        <Route path="/legal-notice" component={LegalNotice} />
        <Route path="/demo" component={DemoPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/404" component={NotFound} />
        <Route path="/:slug" component={BlogPostPage} />
        <Route component={NotFound} />
    </Switch>
    </>
  );
}

const queryClient = new QueryClient();

interface AppProps {
  /** Set only during prerendering: the URL path being rendered. */
  ssrPath?: string;
}

function App({ ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter
            base={import.meta.env.BASE_URL.replace(/\/$/, "")}
            ssrPath={ssrPath}
          >
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
