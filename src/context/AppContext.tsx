'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ServiceItem, 
  ProblemCategory, 
  FAQItem, 
  CaseStudy,
  PageSectionsData
} from '../types';
import { 
  Settings, 
  User 
} from '../types/firestore';
import { fetchInitialData, setCachedAdminToken, clearCachedAdminToken } from '../utils/api';
import { 
  db, 
  auth,
  servicesCol, 
  migrateMockDataToFirestore 
} from '../lib/firebase';
import { onSnapshot, doc, getDocs, getDoc } from 'firebase/firestore';
import { 
  fallbackProblemCategories, 
  fallbackServiceAreas, 
  fallbackFaqs, 
  fallbackCaseStudies,
  defaultPageSections
} from '../utils/fallbackData';
import { initialMockServices } from '../lib/firebase';

const SETTINGS_CACHE_KEY = 'techfix_settings_cache';
const CACHE_VERSION = 2;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const SECRET_FIELDS: ReadonlyArray<string> = [
  'resendApiKey', 'gmailAppPassword', 'gmailUser',
  'resendFromEmail', 'resendTargetEmail', 'adminPassword',
  'smtpPassword', 'smtpUser', 'apiSecret',
];

function loadCachedSettings(): Partial<Settings> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return {};
    const envelope = JSON.parse(raw);
    if (!envelope || envelope.v !== CACHE_VERSION) {
      localStorage.removeItem(SETTINGS_CACHE_KEY);
      return {};
    }
    if (!envelope.ts || Date.now() - envelope.ts > CACHE_TTL_MS) {
      localStorage.removeItem(SETTINGS_CACHE_KEY);
      return {};
    }
    return envelope.data ?? {};
  } catch (err) {
    try {
      localStorage.removeItem(SETTINGS_CACHE_KEY);
    } catch {}
    return {};
  }
}

function persistSettingsCache(s: Partial<Settings>) {
  if (typeof window === 'undefined') return;
  try {
    const { isLoading, createdAt, updatedAt, ...rest } = s as any;
    SECRET_FIELDS.forEach(f => { delete rest[f]; });
    const envelope = { v: CACHE_VERSION, ts: Date.now(), data: rest };
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(envelope));
  } catch (err) {
    console.warn('[Cache] Failed to persist settings cache:', err);
  }
}

export const AUTHORITATIVE_DEFAULTS: Settings = {
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
  technicianPhoto: '',
  visitFeeStarting: 'Rs. 500',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'published'
};

export interface AppContextType {
  settings: Settings;
  services: ServiceItem[];
  activeServices: ServiceItem[];
  problemCategories: ProblemCategory[];
  serviceAreas: string[];
  faqs: FAQItem[];
  caseStudies: CaseStudy[];
  pageSections: PageSectionsData;
  loading: boolean;
  currentUser: User | null;
  selectedServiceForBooking: string;
  selectedProblemForBooking: string;
  setSelectedServiceForBooking: (service: string) => void;
  setSelectedProblemForBooking: (problem: string) => void;
  navigate: (page: string, params?: { service?: string; problem?: string }) => void;
  loadData: () => Promise<void>;
  activePage: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSettings] = useState<Settings>(() => {
    const cached = loadCachedSettings();
    return {
      ...AUTHORITATIVE_DEFAULTS,
      ...cached,
      isLoading: Object.keys(cached).length === 0,
      technicianPhoto:
        (typeof window !== 'undefined' && localStorage.getItem('techfix_technician_photo')) ||
        cached.technicianPhoto ||
        '',
    };
  });

  const [_currentUser, setCurrentUser] = useState<User | null>(null);
  const [services, setServices] = useState<ServiceItem[]>(initialMockServices);
  const [problemCategories, setProblemCategories] = useState<ProblemCategory[]>(fallbackProblemCategories);
  const [serviceAreas, setServiceAreas] = useState<string[]>(fallbackServiceAreas);
  const [faqs, setFaqs] = useState<FAQItem[]>(fallbackFaqs);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(fallbackCaseStudies);
  const [pageSections, setPageSections] = useState<PageSectionsData>(defaultPageSections);
  const [loading, setLoading] = useState(false);

  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('');
  const [selectedProblemForBooking, setSelectedProblemForBooking] = useState<string>('');

  // Determine active page identifier based on pathname
  const getActivePageName = useCallback((): string => {
    if (!pathname || pathname === '/') return 'home';
    const clean = pathname.replace(/^\//, '').toLowerCase();
    if (clean.includes('admin')) return 'admin';
    if (clean === 'services') return 'services';
    if (clean === 'how-it-works') return 'how-it-works';
    if (clean === 'why-on-site') return 'why-on-site';
    if (clean === 'who-we-serve') return 'who-we-serve';
    if (clean === 'bulk-windows') return 'bulk-windows';
    if (clean === 'about' || clean === 'technician') return 'about';
    if (clean === 'problems-solutions') return 'problems-solutions';
    if (clean === 'faq') return 'faq';
    if (clean === 'contact') return 'contact';
    if (clean === 'track-request') return 'track-request';
    return 'home';
  }, [pathname]);

  const activePage = getActivePageName();

  const loadData = useCallback(async () => {
    try {
      let firestoreExists = false;
      let firestoreData: any = null;
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
          persistSettingsCache(merged);
        }
      } catch (fsErr) {
        console.warn('Firestore initial site_config fetch note:', fsErr);
      }

      const data = await fetchInitialData();
      if (data) {
        if (data.settings) {
          setSettings(prev => {
            if (firestoreExists && firestoreData) {
              return { ...prev, isLoading: false };
            }
            const apiMerged = {
              ...prev,
              ...data.settings,
              isLoading: false,
              technicianPhoto: prev.technicianPhoto || data.settings.technicianPhoto || ''
            };
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-Time Firestore Snapshots & Auth tracking
  useEffect(() => {
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
            try {
              const snap = await getDocs(servicesCol);
              if (snap.empty) {
                console.log('⚡ Admin authenticated: Initializing Firestore mock services...');
                await migrateMockDataToFirestore();
              }
            } catch (fsInitErr) {
              console.warn('Firestore initialization check handled:', fsInitErr);
            }
          }
        } catch (authErr) {
          console.warn('Auth token claim check handled:', authErr);
        }
      } else {
        clearCachedAdminToken();
        setCurrentUser(null);
      }
    });

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

  // Backward-compatible hash-listener: redirects bookmark hashes (e.g. #services) to real Next.js URLs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (!hash) return;
      if (hash === 'services') router.push('/services');
      else if (hash === 'how-it-works') router.push('/how-it-works');
      else if (hash === 'why-on-site') router.push('/why-on-site');
      else if (hash === 'who-we-serve') router.push('/who-we-serve');
      else if (hash === 'bulk-windows') router.push('/bulk-windows');
      else if (hash === 'about') router.push('/about');
      else if (hash === 'technician') router.push('/technician');
      else if (hash === 'problems-solutions') router.push('/problems-solutions');
      else if (hash === 'faq') router.push('/faq');
      else if (hash === 'contact') router.push('/contact');
      else if (hash === 'track-request' || hash === 'track') router.push('/track-request');
      else if (hash === 'admin' || hash.includes('/admin')) router.push('/techfixpeshawar@gmail.com/admin');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [router]);

  // Navigate handler for all components (Navbar, Footer, PageConnector, Breadcrumbs, etc.)
  const navigate = useCallback((page: string, params?: { service?: string; problem?: string }) => {
    if (params?.service) {
      setSelectedServiceForBooking(params.service);
    }
    if (params?.problem) {
      setSelectedProblemForBooking(params.problem);
    }

    let targetUrl = '/';
    if (page === 'home' || page === '/') {
      targetUrl = '/';
    } else if (page === 'admin') {
      targetUrl = '/techfixpeshawar@gmail.com/admin';
    } else {
      targetUrl = `/${page.replace(/^\//, '')}`;
    }

    if (params) {
      const sp = new URLSearchParams();
      if (params.service) sp.set('service', params.service);
      if (params.problem) sp.set('problem', params.problem);
      const query = sp.toString();
      if (query) {
        targetUrl += `?${query}`;
      }
    }

    router.push(targetUrl);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [router]);

  const activeServices = services.filter(s => 
    s.status === 'PUBLISHED' || 
    s.status === 'published' || 
    s.status === 'active' || 
    (!s.status && s.status !== 'UNPUBLISHED' && s.status !== 'unpublished' && s.status !== 'DRAFT' && s.status !== 'ARCHIVED' && s.status !== 'inactive')
  );

  return (
    <AppContext.Provider
      value={{
        settings,
        services,
        activeServices,
        problemCategories,
        serviceAreas,
        faqs,
        caseStudies,
        pageSections,
        loading,
        currentUser: _currentUser,
        selectedServiceForBooking,
        selectedProblemForBooking,
        setSelectedServiceForBooking,
        setSelectedProblemForBooking,
        navigate,
        loadData,
        activePage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
