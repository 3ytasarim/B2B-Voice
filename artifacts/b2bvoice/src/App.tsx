import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import { LanguageProvider } from "@/lib/LanguageContext";
import { useGoogleTracking } from "@/lib/useGoogleTracking";
import { routeLoaders } from "@/routeLoaders";

// Route-level code splitting: only the Home page ships in the entry bundle.
// Blog articles (large static HTML), admin and legal pages load on demand.
const NotFound = lazy(routeLoaders.notFound);
const AdminPage = lazy(routeLoaders.admin);
const AdminLogin = lazy(routeLoaders.adminLogin);
const PrivacyPolicy = lazy(routeLoaders.privacy);
const CookiePolicy = lazy(routeLoaders.cookies);
const TermsOfUse = lazy(routeLoaders.terms);
const LegalNotice = lazy(routeLoaders.legalNotice);
const DemoPage = lazy(routeLoaders.demo);
const BlogPage = lazy(routeLoaders.blog);
const BlogPostPage = lazy(routeLoaders.blogPost);

function Router() {
  useGoogleTracking();
  return (
    <Suspense fallback={null}>
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
    </Suspense>
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
