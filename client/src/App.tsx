import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { LanguageSelector } from "./components/LanguageSelector";
import { RecruitmentBanner } from "./components/RecruitmentBanner";
import { ScrollToTop } from "./components/ScrollToTop";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Trucks = lazy(() => import("./pages/Trucks"));
const TruckDetails = lazy(() => import("./pages/TruckDetails"));
const Trailers = lazy(() => import("./pages/Trailers"));
const TrailerDetails = lazy(() => import("./pages/TrailerDetails"));
const Equipment = lazy(() => import("./pages/Equipment"));
const EquipmentDetails = lazy(() => import("./pages/EquipmentDetails"));
const Services = lazy(() => import("./pages/Services"));
const Team = lazy(() => import("./pages/Team"));
const Contact = lazy(() => import("./pages/Contact"));
const ApplyRepresentative = lazy(() => import("./pages/ApplyRepresentative"));

// Loading spinner component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

// Layout wrapper for public pages (with Navbar and Footer)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <RecruitmentBanner />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

// Wrapper component for public routes
function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <PublicLayout>
      <Component />
    </PublicLayout>
  );
}

// Main App Content
function AppContent() {
  return (
    <Switch>
      {/* Public Routes - With Layout */}
      <Route path="/apply-representative">
        {() => <PublicRoute component={ApplyRepresentative} />}
      </Route>
      <Route path="/">
        {() => <PublicRoute component={Home} />}
      </Route>
      <Route path="/trucks">
        {() => (
          <PublicLayout>
            <Trucks />
          </PublicLayout>
        )}
      </Route>
      <Route path="/trucks/:id">
        {() => (
          <PublicLayout>
            <TruckDetails />
          </PublicLayout>
        )}
      </Route>
      <Route path="/trailers">
        {() => (
          <PublicLayout>
            <Trailers />
          </PublicLayout>
        )}
      </Route>
      <Route path="/trailers/:id">
        {() => (
          <PublicLayout>
            <TrailerDetails />
          </PublicLayout>
        )}
      </Route>
      <Route path="/equipment">
        {() => (
          <PublicLayout>
            <Equipment />
          </PublicLayout>
        )}
      </Route>
      <Route path="/equipment/:id">
        {() => (
          <PublicLayout>
            <EquipmentDetails />
          </PublicLayout>
        )}
      </Route>
      <Route path="/services">
        {() => <PublicRoute component={Services} />}
      </Route>
      <Route path="/team">
        {() => <PublicRoute component={Team} />}
      </Route>
      <Route path="/contact">
        {() => <PublicRoute component={Contact} />}
      </Route>
      <Route path="/404">
        {() => <PublicRoute component={NotFound} />}
      </Route>
      <Route>
        {() => <PublicRoute component={NotFound} />}
      </Route>
    </Switch>
  );
}

// Detect if visitor is a bot/crawler (Facebook, Google, etc.)
function isBot(): boolean {
  if (typeof navigator === 'undefined') return false;
  const botPatterns = [
    'facebookexternalhit',
    'Facebot',
    'LinkedInBot',
    'Twitterbot',
    'WhatsApp',
    'Googlebot',
    'bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'Sogou',
    'Exabot',
    'ia_archiver',
    'crawler',
    'spider',
    'bot'
  ];
  const userAgent = navigator.userAgent.toLowerCase();
  return botPatterns.some(pattern => userAgent.includes(pattern.toLowerCase()));
}

// App wrapper with language selection gate
function AppWithLanguageGate() {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip language selection for bots/crawlers
    if (isBot()) {
      setHasSelectedLanguage(true);
      return;
    }
    // Check if user has already selected a language
    const languageSelected = localStorage.getItem("language-selected");
    setHasSelectedLanguage(languageSelected === "true");
  }, []);

  // Show loading while checking localStorage
  if (hasSelectedLanguage === null) {
    return (
      <div className="fixed inset-0 bg-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Show language selector if not selected yet
  if (!hasSelectedLanguage) {
    return (
      <LanguageSelector onLanguageSelected={() => setHasSelectedLanguage(true)} />
    );
  }

  // Show main app content
  return <AppContent />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <AppWithLanguageGate />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
