import { useState, useEffect } from 'react';
import { 
  ServiceItem, 
  ProblemCategory, 
  FAQItem, 
  CaseStudy,
  PageSectionsData
} from './types';
import { 
  ServiceRequest, 
  Booking, 
  Settings, 
  User 
} from './types/firestore';
import { fetchInitialData, setCachedAdminToken, clearCachedAdminToken } from './utils/api';
import { getWhatsAppLink } from './utils/whatsapp';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { 
  db, 
  auth,
  servicesCol, 
  settingsCol,
  serviceRequestsCol,
  bookingsCol,
  migrateMockDataToFirestore 
} from './lib/firebase';
import { onSnapshot, doc, getDocs, getDoc } from 'firebase/firestore';

// Dedicated Separate Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { WhyOnSitePage } from './pages/WhyOnSitePage';
import { WhoWeServePage } from './pages/WhoWeServePage';
import { BulkWindowsPage } from './pages/BulkWindowsPage';
import { AboutPage } from './pages/AboutPage';
import { ProblemsSolutionsPage } from './pages/ProblemsSolutionsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { TrackRequestPage } from './pages/TrackRequestPage';

import { MessageSquare, Calendar } from 'lucide-react';

import { 
  fallbackAppData, 
  fallbackProblemCategories, 
  fallbackServiceAreas, 
  fallbackFaqs, 
  fallbackCaseStudies,
  defaultPageSections
} from './utils/fallbackData';
import { initialMockServices } from './lib/firebase';

const VALID_PAGES = [
  'home',
  'services',
  'how-it-works',
  'why-on-site',
  'who-we-serve',
  'bulk-windows',
  'technician',
  'about',
  'problems-solutions',
  'faq',
  'contact',
  'track-request',
  'admin'
];

function getPageFromHash(hash: string): string {
  if (typeof window !== 'undefined') {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const decodedPath = decodeURIComponent(rawPath);
    if (
      decodedPath === '/admin' || 
      decodedPath === '/techfixpeshawar@gmail.com/admin' ||
      decodedPath.endsWith('/techfixpeshawar@gmail.com/admin') ||
      rawPath === '/admin' ||
      rawPath === '/techfixpeshawar@gmail.com/admin' ||
      rawPath.endsWith('/techfixpeshawar@gmail.com/admin')
    ) {
      return 'admin';
    }
  }
  const clean = decodeURIComponent(hash).replace(/^#\/?/, '').toLowerCase().trim();
  if (
    clean === 'admin' || 
    clean === '/admin' || 
    clean === 'techfixpeshawar@gmail.com/admin' || 
    clean === '/techfixpeshawar@gmail.com/admin' ||
    clean.endsWith('/techfixpeshawar@gmail.com/admin')
  ) {
    return 'admin';
  }
  if (clean === 'track-request' || clean === 'track') return 'track-request';
  return VALID_PAGES.includes(clean) ? clean : 'home';
}

// ─── Settings cache helpers ────────────────────────────────────────────────
// BUG-059 FIX: Version-stamp cache so stale data from old sessions is rejected.
// Increment CACHE_VERSION whenever the Settings shape changes in a breaking way.
const SETTINGS_CACHE_KEY = 'techfix_settings_cache';
const CACHE_VERSION = 2;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fields that must NEVER be written into client-side storage even if they
// somehow appear on the Settings object (defence-in-depth against future changes).
const SECRET_FIELDS: ReadonlyArray<string> = [
  'resendApiKey', 'gmailAppPassword', 'gmailUser',
  'resendFromEmail', 'resendTargetEmail', 'adminPassword',
  'smtpPassword', 'smtpUser', 'apiSecret',
];

export function clearSettingsCache(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SETTINGS_CACHE_KEY);
    }
  } catch {}
}

function loadCachedSettings(): Partial<Settings> {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return {};
    const envelope = JSON.parse(raw);
    // BUG-059: Reject cache if version mismatch
    if (!envelope || envelope.v !== CACHE_VERSION) {
      console.info('[Cache] Stale or unversioned settings cache detected; clearing.');
      localStorage.removeItem(SETTINGS_CACHE_KEY);
      return {};
    }
    // BUG-059: Reject cache if older than TTL
    if (!envelope.ts || Date.now() - envelope.ts > CACHE_TTL_MS) {
      console.info('[Cache] Expired settings cache detected; clearing.');
      localStorage.removeItem(SETTINGS_CACHE_KEY);
      return {};
    }
    return envelope.data ?? {};
  } catch (err) {
    // BUG-078 FIX: Record a debug-safe diagnostic and remove corrupt cache entries
    console.warn('[Cache] Corrupt settings cache JSON detected; purging corrupt entry.', err);
    try {
      localStorage.removeItem(SETTINGS_CACHE_KEY);
    } catch {}
    return {};
  }
}

function persistSettingsCache(s: Partial<Settings>) {
  try {
    // Never persist loading/transient state or server-side secrets
    const { isLoading, createdAt, updatedAt, ...rest } = s as any;
    // BUG-059: Strip any secret fields that should never be in the browser
    SECRET_FIELDS.forEach(f => { delete rest[f]; });
    const envelope = { v: CACHE_VERSION, ts: Date.now(), data: rest };
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(envelope));
  } catch (err) {
    // BUG-078: Record safe diagnostic if storage fails (e.g. quota exceeded)
    console.warn('[Cache] Failed to persist settings cache:', err);
  }
}

const AUTHORITATIVE_DEFAULTS: Settings = {
  isLoading: true,
  businessName: 'TechFix On-Site Computer Services',
  tagline: 'Contact Online — We Come To You. Professional Computer Support in Peshawar.',
  phoneNumber: '+92 327 5526107',
  whatsappNumber: '+92 327 5526107',
  email: 'techfixpeshawar@gmail.com',
  businessHours: 'Monday – Saturday: 9:00 AM – 8:00 PM (Emergency Sunday visits by arrangement)',
  serviceAreaCity: 'Peshawar, Khyber Pakhtunkhwa',
  technicianName: 'Safiullah',
  technicianTitle: 'Computer Science & Cybersecurity Practitioner',
  technicianInstitution: 'University of Agriculture, Peshawar',
  technicianExperience: '5+ Years Practical Windows & Hardware Diagnostics',
  technicianBio: 'Hi, I am Safiullah. I am a Computer Science and Cybersecurity learner at the University of Agriculture, Peshawar, with around 5 years of practical experience working with computers and Windows systems.',
  technicianQuote: 'My goal is simple: solve computer problems efficiently while saving customers the time and inconvenience of taking their computer to a repair shop.',
  technicianPhoto: (typeof window !== 'undefined' && localStorage.getItem('techfix_technician_photo')) || '',
  visitFeeStarting: 'Rs. 500',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'published'
};

export default function App() {
  // BUG-04 FIX: Seed initial state from localStorage cache so the UI
  // instantly renders the last-saved admin values (zero flash).
  // Falls back to authoritative defaults only on first-ever load.
  const [settings, setSettings] = useState<Settings>(() => {
    const cached = loadCachedSettings();
    return {
      ...AUTHORITATIVE_DEFAULTS,
      ...cached,
      // Always start with isLoading true so we know a fresh fetch is in flight
      isLoading: Object.keys(cached).length === 0,
      technicianPhoto:
        (typeof window !== 'undefined' && localStorage.getItem('techfix_technician_photo')) ||
        cached.technicianPhoto ||
        '',
    };
  });

  // Track Firestore ServiceRequest, Booking, and User entities
  const [_recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [_recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [_currentUser, setCurrentUser] = useState<User | null>(null);

  const [services, setServices] = useState<ServiceItem[]>(initialMockServices);
  const [problemCategories, setProblemCategories] = useState<ProblemCategory[]>(fallbackProblemCategories);
  const [serviceAreas, setServiceAreas] = useState<string[]>(fallbackServiceAreas);
  const [faqs, setFaqs] = useState<FAQItem[]>(fallbackFaqs);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(fallbackCaseStudies);
  const [pageSections, setPageSections] = useState<PageSectionsData>(defaultPageSections);
  const [loading, setLoading] = useState(false);

  // Active Multi-Page Router State
  const [activePage, setActivePage] = useState<string>(() => {
    return getPageFromHash(window.location.hash);
  });

  // Booking pre-selection states passed between pages
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('');
  const [selectedProblemForBooking, setSelectedProblemForBooking] = useState<string>('');

  const loadData = async () => {
    try {
      let firestoreExists = false;
      let firestoreData: any = null;
      // 1. Explicitly verify existence of the 'site_config' Firestore document first
      try {
        const siteConfigSnap = await getDoc(doc(db, 'settings', 'site_config'));
        if (siteConfigSnap.exists()) {
          firestoreExists = true;
          const { adminPassword: _adminPassword, ...safeFirestoreData } = siteConfigSnap.data();
          firestoreData = safeFirestoreData;
          const merged = {
            ...safeFirestoreData,
            isLoading: false,
            technicianPhoto: safeFirestoreData.technicianPhoto !== undefined
              ? safeFirestoreData.technicianPhoto
              : ''
          };
          setSettings(prev => ({
            ...prev,
            ...merged,
          }));
          // BUG-04: Persist to cache so next page load is instant (zero flash)
          persistSettingsCache(merged);
        }
      } catch (fsErr) {
        console.warn('Firestore initial site_config fetch note:', fsErr);
      }

      // 2. Fetch general app data from backend API / fallback
      const data = await fetchInitialData();
      if (data) {
        if (data.settings) {
          setSettings(prev => {
            // If the authoritative site_config Firestore document exists, NEVER let API-fetched server settings overwrite it
            if (firestoreExists && firestoreData) {
              return { ...prev, isLoading: false };
            }
            const apiMerged = {
              ...prev,
              ...data.settings,
              isLoading: false,
              technicianPhoto: prev.technicianPhoto || data.settings.technicianPhoto || ''
            };
            // BUG-04: Persist API settings to cache (only when Firestore not the source)
            persistSettingsCache(apiMerged);
            return apiMerged;
          });
        }
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        }
        if (data.problemCategories && data.problemCategories.length > 0) {
          setProblemCategories(data.problemCategories);
        }
        if (data.serviceAreas && data.serviceAreas.length > 0) {
          setServiceAreas(data.serviceAreas);
        }
        if (data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
        if (data.caseStudies && data.caseStudies.length > 0) {
          setCaseStudies(data.caseStudies);
        }
        if ((data as any).pageSections) {
          setPageSections((data as any).pageSections);
        }
      }
    } catch (err) {
      console.warn('Initial data hydration note (handled gracefully with preloaded data):', err);
    } finally {
      setSettings(prev => ({ ...prev, isLoading: false }));
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Real-Time Firestore Snapshots & Auth tracking to ensure UI updates automatically
  useEffect(() => {
    // 0. Listen to Auth state and verify token admin claim
    const unsubAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setCachedAdminToken(idToken);

          const idTokenResult = await firebaseUser.getIdTokenResult();
          const hasAdminClaim = !!idTokenResult.claims.admin;
          const userDoc: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: hasAdminClaim ? 'admin' : 'customer',
            adminClaim: hasAdminClaim,
            displayName: firebaseUser.displayName || undefined,
            phoneNumber: firebaseUser.phoneNumber || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active'
          };
          setCurrentUser(userDoc);
          if (hasAdminClaim || firebaseUser.email === 'ullahsafiullah117@gmail.com' || firebaseUser.email === 'sullahjan40@gmail.com') {
            initFirestoreIfAdmin(firebaseUser);
          }
        } catch (authErr) {
          console.warn('Auth token claim check handled:', authErr);
        }
      } else {
        clearCachedAdminToken();
        setCurrentUser(null);
      }
    });

    // Initialize Firestore collections only if an authenticated administrator is signed in
    const initFirestoreIfAdmin = async (firebaseUser: any) => {
      try {
        if (firebaseUser) {
          const snap = await getDocs(servicesCol);
          if (snap.empty) {
            console.log('⚡ Admin authenticated: Initializing Firestore with mock services, requests, bookings, and settings...');
            await migrateMockDataToFirestore();
          }
        }
      } catch (err) {
        console.warn('Firestore initialization check handled:', err);
      }
    };

    // 1. Real-time snapshot on 'services' collection
    const unsubServices = onSnapshot(servicesCol, (snapshot) => {
      if (!snapshot.empty) {
        const liveServices: ServiceItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          liveServices.push({
            id: docSnap.id,
            key: data.key || docSnap.id,
            title: data.title || '',
            shortDesc: data.shortDesc || '',
            fullDesc: data.fullDesc || '',
            priceStarting: data.priceStarting || 'Contact for quote',
            priceNote: data.priceNote,
            turnaround: data.turnaround || '45 – 90 mins',
            icon: data.icon || 'Wrench',
            status: (data.status === 'inactive' || data.status === 'unpublished') ? 'inactive' : 'active',
            order: typeof data.order === 'number' ? data.order : 99,
            workflow: data.workflow,
            warningNote: data.warningNote,
            diagnosticSteps: data.diagnosticSteps
          });
        });
        liveServices.sort((a, b) => a.order - b.order);
        if (liveServices.length > 0) {
          setServices(liveServices);
        }
      }
    }, (err) => {
      console.warn('Firestore services snapshot listener handled:', err);
    });

    // 2. Real-time snapshot on 'settings' collection ('site_config') - Database as single source of truth
    const settingsDocRef = doc(db, 'settings', 'site_config');
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        const snapshotMerge = {
          ...data,
          technicianPhoto: data.technicianPhoto !== undefined
            ? data.technicianPhoto
            : ''
        };
        setSettings((prev) => ({
          ...prev,
          ...snapshotMerge,
        }));
        // BUG-04: Keep cache in sync — admin saves instantly propagate to cache
        persistSettingsCache(snapshotMerge);
      }
    }, (err) => {
      console.warn('Firestore settings snapshot listener handled:', err);
    });

    return () => {
      unsubAuth();
      unsubServices();
      unsubSettings();
    };
  }, []);

  // Listen for browser Back/Forward navigation (both hash and history popstate - BUG-062, BUG-175)
  useEffect(() => {
    const handleLocationChange = () => {
      const page = getPageFromHash(window.location.hash);
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Page Navigator Handler
  const handleNavigate = (page: string, params?: { service?: string; problem?: string }) => {
    const targetPage = VALID_PAGES.includes(page) ? page : 'home';

    if (params?.service) {
      setSelectedServiceForBooking(params.service);
    }
    if (params?.problem) {
      setSelectedProblemForBooking(params.problem);
    }

    setActivePage(targetPage);

    // Synchronize URL hash and path so links can be shared, bookmarked, and backed
    if (targetPage === 'home') {
      history.pushState(null, '', '/');
    } else if (targetPage === 'admin') {
      window.location.hash = 'techfixpeshawar@gmail.com/admin';
    } else {
      window.location.hash = targetPage;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeServices = services.filter(s => 
    s.status === 'PUBLISHED' || 
    s.status === 'published' || 
    s.status === 'active' || 
    (!s.status && s.status !== 'UNPUBLISHED' && s.status !== 'unpublished' && s.status !== 'DRAFT' && s.status !== 'ARCHIVED' && s.status !== 'inactive')
  );

  // Dedicated full-screen route for /admin or #admin
  if (activePage === 'admin') {
    return (
      <AdminProtectedRoute
        isOpen={true}
        isFullScreenPage={true}
        onClose={() => handleNavigate('home')}
        onNavigateHome={() => handleNavigate('home')}
        services={services}
        settings={settings}
        onRefreshData={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <Navbar
        settings={settings}
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenBooking={(serviceName) => handleNavigate('contact', { service: serviceName })}
        onOpenTracking={() => handleNavigate('track-request')}
      />

      {/* 2. DYNAMIC PAGE ROUTING CONTAINER */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            settings={settings}
            services={activeServices}
            problemCategories={problemCategories}
            faqs={faqs}
            serviceAreas={serviceAreas}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            services={activeServices}
            settings={settings}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'how-it-works' && (
          <HowItWorksPage
            settings={settings}
            caseStudies={caseStudies}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'why-on-site' && (
          <WhyOnSitePage
            settings={settings}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'who-we-serve' && (
          <WhoWeServePage
            settings={settings}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'bulk-windows' && (
          <BulkWindowsPage
            settings={settings}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {(activePage === 'about' || activePage === 'technician') && (
          <AboutPage
            settings={settings}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'problems-solutions' && (
          <ProblemsSolutionsPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'faq' && (
          <FAQPage
            faqs={faqs}
            settings={settings}
            pageSections={pageSections}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'track-request' && (
          <TrackRequestPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage
            settings={settings}
            services={activeServices}
            serviceAreas={serviceAreas}
            pageSections={pageSections}
            initialService={selectedServiceForBooking}
            initialProblem={selectedProblemForBooking}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 3. GLOBAL FOOTER WITH PAGE CONNECTIONS */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleNavigate('contact')}
      />

      {/* 5. FLOATING SPEED ACTION BAR */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5">
        <a
          href={getWhatsAppLink(
            settings.whatsappNumber,
            "Hello Safiullah! I have a computer problem and would like to ask about on-site service in Peshawar."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-emerald-600/40 hover:bg-emerald-500 hover:scale-105 transition-all border border-emerald-400/30"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp Fast Response</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>

        {activePage !== 'contact' && (
          <button
            onClick={() => handleNavigate('contact')}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:scale-105 transition-all border border-blue-400/30 cursor-pointer sm:hidden"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Visit</span>
          </button>
        )}
      </div>

    </div>
  );
}
