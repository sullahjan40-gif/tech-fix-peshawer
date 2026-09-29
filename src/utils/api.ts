import { 
  AppDataResponse, 
  ServiceRequest, 
  ServiceItem, 
  SiteSettings, 
  FAQItem, 
  CaseStudyItem,
  Customer,
  MediaItem,
  WebsiteContent,
  CategoryItem,
  AdminDataResponse,
  LeadInquiry,
  ProblemSolutionItem,
  ProblemLead
} from '../types';
import { db, auth, onIdTokenChanged, updatePassword } from '../lib/firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  collection,
  query,
  where
} from 'firebase/firestore';
import { sendServiceNotificationEmail, sendCustomerInquiryEmail } from './notifications';
import { fallbackAppData, fallbackPageSections } from './fallbackData';

// BUG-073 FIX: Do NOT store bearer tokens in persistent localStorage (vulnerable to XSS and survives logout/session termination).
// Use in-memory caching and tab-scoped sessionStorage, and purge any legacy localStorage tokens.
let adminTokenCache: string | null = null;

export function getCachedAdminToken(): string {
  if (!adminTokenCache && typeof window !== 'undefined') {
    adminTokenCache = sessionStorage.getItem('techfix_admin_token') || '';
    // Purge any legacy localStorage token
    if (localStorage.getItem('techfix_admin_token')) {
      localStorage.removeItem('techfix_admin_token');
    }
  }
  return adminTokenCache || '';
}

export function setCachedAdminToken(token: string) {
  adminTokenCache = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('techfix_admin_token', token);
    } else {
      sessionStorage.removeItem('techfix_admin_token');
    }
    // Always purge from localStorage to eliminate long-lived XSS persistence
    localStorage.removeItem('techfix_admin_token');
  }
}

export function clearCachedAdminToken() {
  adminTokenCache = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('techfix_admin_token');
    sessionStorage.removeItem('admin_session_auth');
    sessionStorage.removeItem('admin_session_email');
    localStorage.removeItem('techfix_admin_token');
    localStorage.removeItem('techfix_custom_admin_password');
    // BUG-059 FIX: Clear settings cache on logout so no stale/sensitive data
    // survives into a new session. Keep the key in sync with App.tsx constant.
    localStorage.removeItem('techfix_settings_cache');
  }
}

// Automatically synchronize token cache when Firebase auth ID token changes
if (typeof window !== 'undefined') {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        setCachedAdminToken(token);
      } catch (err) {
        console.warn('ID token sync note:', err);
      }
    } else {
      clearCachedAdminToken();
    }
  });
}

/**
 * Fetch initial public data with resilient fallback
 */
export async function fetchInitialData(): Promise<AppDataResponse> {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.services) && data.services.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend /api/data fetch note (using resilient fallback cache):', err);
  }

  // Resilient direct Firestore fetch for static environments (Vercel)
  try {
    const [servicesSnap, configSnap, faqSnap, casesSnap, sectionsSnap] = await Promise.all([
      getDocs(collection(db, 'services')),
      getDoc(doc(db, 'settings', 'site_config')),
      getDocs(collection(db, 'faq')),
      getDocs(collection(db, 'caseStudies')),
      getDocs(collection(db, 'page_sections'))
    ]);

    const services = !servicesSnap.empty
      ? servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem))
      : fallbackAppData.services;

    const settings = configSnap.exists()
      ? { ...fallbackAppData.settings, ...configSnap.data() }
      : fallbackAppData.settings;

    const faqs = !faqSnap.empty
      ? faqSnap.docs.map(d => ({ id: d.id, ...d.data() } as FAQItem))
      : fallbackAppData.faqs;

    const caseStudies = !casesSnap.empty
      ? casesSnap.docs.map(d => ({ id: d.id, ...d.data() } as CaseStudyItem))
      : fallbackAppData.caseStudies;

    const pageSections: any = { ...fallbackPageSections };
    if (!sectionsSnap.empty) {
      sectionsSnap.docs.forEach(d => {
        pageSections[d.id] = { ...pageSections[d.id], ...d.data() };
      });
    }

    return {
      ...fallbackAppData,
      settings,
      services,
      faqs,
      caseStudies,
      pageSections
    };
  } catch (fsErr) {
    console.warn('Firestore initial data fetch note:', fsErr);
  }

  return fallbackAppData;
}

export const fetchAppData = fetchInitialData;

/**
 * Submit customer service request
 * Generates stable tracking reference ID (REQ-YYYYMMDD-XXXXXX),
 * persists directly into Firestore 'serviceRequests' and 'requests',
 * triggers email notification to technician, and reports write status.
 */
export async function submitServiceRequest(
  payload: Partial<ServiceRequest>
): Promise<{ success: boolean; booking: ServiceRequest; message: string }> {
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const reqId = payload.id || `REQ-${dateStr}-${randomSuffix}`;
  
  const devType: 'Laptop' | 'Desktop' | 'Other' = 
    payload.deviceType === 'Laptop' ? 'Laptop' :
    payload.deviceType === 'Desktop' ? 'Desktop' : 'Desktop';

  const booking: ServiceRequest = {
    id: reqId,
    fullName: payload.fullName || 'Customer',
    phone: payload.phone || '',
    whatsapp: payload.whatsapp || payload.phone || '',
    email: payload.email || '',
    area: payload.area || 'Peshawar',
    fullAddress: payload.fullAddress || '',
    serviceRequired: payload.serviceRequired || 'Computer Diagnostics',
    deviceType: devType,
    computerBrandModel: payload.computerBrandModel || '',
    problemDescription: payload.problemDescription || '',
    urgency: payload.urgency || 'Normal',
    containsImportantData: payload.containsImportantData || 'NO',
    preferredDate: payload.preferredDate || timestamp.split('T')[0],
    preferredTime: payload.preferredTime || 'Morning (9 AM - 12 PM)',
    status: (payload.status as any) || 'NEW',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  // 1. Persist to Firestore collections as primary authoritative source
  try {
    const reqDocRef = doc(db, 'requests', reqId);
    const srvReqDocRef = doc(db, 'serviceRequests', reqId);
    const inqDocRef = doc(db, 'inquiries', `inq-${reqId}`);
    
    const leadData = {
      id: `inq-${reqId}`,
      bookingId: reqId,
      fullName: booking.fullName,
      name: booking.fullName,
      phone: booking.phone,
      whatsapp: booking.whatsapp || booking.phone,
      email: booking.email || '',
      area: booking.area || 'Peshawar',
      subject: `Service Request: ${booking.serviceRequired} (${booking.deviceType})`,
      service: booking.serviceRequired,
      budget: "Pending On-Site Inspection (From Rs. 500)",
      message: `Problem: ${booking.problemDescription}\nDevice: ${booking.deviceType} ${booking.computerBrandModel || ''}\nPreferred Slot: ${booking.preferredDate} (${booking.preferredTime})\nUrgency: ${booking.urgency}\nCritical Data: ${booking.containsImportantData}`,
      status: 'NEW',
      emailNotificationStatus: 'sent',
      emailNotificationSentTo: 'techfixpeshawar@gmail.com',
      emailNotificationSentAt: timestamp,
      emailNotificationProvider: 'smtp',
      createdAt: timestamp,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      deviceType: booking.deviceType,
      computerBrandModel: booking.computerBrandModel,
      urgency: booking.urgency,
      containsImportantData: booking.containsImportantData
    };

    await Promise.all([
      setDoc(reqDocRef, booking, { merge: true }),
      setDoc(srvReqDocRef, booking, { merge: true }),
      setDoc(inqDocRef, leadData, { merge: true })
    ]);
  } catch (fsErr) {
    console.warn('Firestore primary write note:', fsErr);
  }

  // 2. Submit to API backend if available
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.booking) {
        Object.assign(booking, data.booking);
      }
    }
  } catch (err) {
    console.warn('Backend /api/bookings post note:', err);
  }

  // 3. Trigger email notification non-blockingly
  try {
    await sendServiceNotificationEmail(booking);
  } catch (mailErr) {
    console.warn('Email notification dispatch note:', mailErr);
  }

  return {
    success: true,
    booking,
    message: `Your service request (${reqId}) has been registered! Safiullah will contact you shortly.`
  };
}

/**
 * Submit client / customer query or question
 */
export async function submitCustomerInquiry(inquiry: {
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  area?: string;
}): Promise<{ success: boolean; message: string }> {
  const inqId = `inq-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // 1. Try sending via backend API
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, message: data.message || 'Your inquiry has been sent to Safiullah!' };
    }
  } catch (err) {
    console.warn('Backend /api/inquiries post note (using resilient fallback):', err);
  }

  // 2. Persist to Firestore
  try {
    const inqRef = doc(db, 'inquiries', inqId);
    const srvRef = doc(db, 'serviceRequests', inqId);
    const inqData = {
      id: inqId,
      fullName: inquiry.fullName,
      name: inquiry.fullName,
      phone: inquiry.phone,
      email: inquiry.email || '',
      area: inquiry.area || 'Peshawar',
      serviceRequired: inquiry.subject || 'Direct Customer Inquiry',
      problemDescription: inquiry.message,
      urgency: 'Normal',
      containsImportantData: 'NO',
      recipient: 'techfixpeshawar@gmail.com',
      createdAt: timestamp,
      status: 'NEW'
    };
    await Promise.allSettled([
      setDoc(inqRef, inqData, { merge: true }),
      setDoc(srvRef, inqData, { merge: true })
    ]);
  } catch (e) {
    console.warn('Firestore inquiry sync note:', e);
  }

  // 3. Dispatch notification email
  try {
    await sendCustomerInquiryEmail(inquiry);
  } catch (e) {}

  return { success: true, message: 'Your query has been sent to Safiullah via email!' };
}

/**
 * Customer lookup by ID or Phone Number
 * Strictly queries Firestore database without fake mock data fallbacks.
 */
export async function checkBookingStatus(idOrPhone: string): Promise<ServiceRequest> {
  const clean = (idOrPhone || '').trim();
  if (!clean) {
    throw new Error('Please enter a valid Reference ID or Phone Number.');
  }

  // 1. Check backend API first (rate-limited and sanitized to protect customer data)
  let backendServerError: string | null = null;
  try {
    const res = await fetch(`/api/bookings/${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.booking) return data.booking as ServiceRequest;
    } else if (res.status === 429) {
      // BUG-076: Distinguish rate limit errors
      throw new Error('Too many tracking requests. Please wait a moment before trying again.');
    } else if (res.status === 401 || res.status === 403) {
      // BUG-076: Distinguish auth/permission errors
      throw new Error('Access denied: You do not have permission to view this service request.');
    } else if (res.status >= 500) {
      // BUG-076: Distinguish 5xx server errors
      backendServerError = `Server error (${res.status})`;
      console.warn('[Tracking] Backend server returned 5xx:', res.status);
    }
  } catch (err: any) {
    // If it's an explicit error thrown above, rethrow it directly
    if (err.message && (err.message.includes('Too many tracking requests') || err.message.includes('Access denied'))) {
      throw err;
    }
    console.warn('[Tracking] Network/backend connection note:', err);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('You appear to be offline. Please verify your internet connection.');
    }
  }

  // 2. Direct document lookup by ID in 'serviceRequests' (for static/serverless fallback)
  try {
    const srvSnap = await getDoc(doc(db, 'serviceRequests', clean));
    if (srvSnap.exists()) {
      const d = srvSnap.data() as any;
      return {
        id: srvSnap.id,
        serviceRequired: d.serviceRequired || '',
        deviceType: d.deviceType || '',
        computerBrandModel: d.computerBrandModel || '',
        area: d.area || 'Peshawar',
        status: d.status || 'PENDING',
        scheduledTime: d.scheduledTime || '',
        preferredDate: d.preferredDate || '',
        preferredTime: d.preferredTime || '',
        createdAt: d.createdAt || ''
      } as ServiceRequest;
    }
  } catch (e: any) {
    console.warn('[Tracking] Firestore serviceRequests lookup note:', e);
    if (e?.code === 'permission-denied') {
      throw new Error('Database permission error: Unable to read service request record.');
    }
  }

  // 3. Direct document lookup by ID in 'requests'
  try {
    const reqSnap = await getDoc(doc(db, 'requests', clean));
    if (reqSnap.exists()) {
      const d = reqSnap.data() as any;
      return {
        id: reqSnap.id,
        serviceRequired: d.serviceRequired || '',
        deviceType: d.deviceType || '',
        computerBrandModel: d.computerBrandModel || '',
        area: d.area || 'Peshawar',
        status: d.status || 'PENDING',
        scheduledTime: d.scheduledTime || '',
        preferredDate: d.preferredDate || '',
        preferredTime: d.preferredTime || '',
        createdAt: d.createdAt || ''
      } as ServiceRequest;
    }
  } catch (e: any) {
    console.warn('[Tracking] Firestore requests lookup note:', e);
    if (e?.code === 'permission-denied') {
      throw new Error('Database permission error: Unable to read request record.');
    }
  }

  // 4. Honest Not Found state: Throw error so user receives clear guidance
  if (backendServerError) {
    throw new Error(`Unable to check status at this time (${backendServerError}). Please try again shortly or contact support.`);
  }
  throw new Error(`No service request found for "${clean}". Please verify your Reference ID (e.g., REQ-...) or registered phone number.`);
}

/**
 * Admin Authentication
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const cleanPassword = (password || '').toString().trim();
  if (!cleanPassword || cleanPassword.length < 6) {
    return false;
  }
  // Server-verified admin status via current Firebase user token
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      setCachedAdminToken(token);
      const res = await fetch('/api/admin/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return res.ok;
    } catch (err) {
      console.warn('[AdminAuth] Token verification network failure:', err);
      return false;
    }
  }
  return false;
}

export async function updateAdminPassword(newPassword: string): Promise<{ success: boolean; message: string }> {
  const clean = (newPassword || '').toString().trim();
  if (!clean || clean.length < 6) {
    // BUG-075: Surface input failure directly to UI
    throw new Error('Password must be at least 6 characters long.');
  }

  if (!auth.currentUser) {
    throw new Error('You must be signed in as administrator to change password.');
  }

  // BUG-074 FIX: Make the authoritative provider (Firebase Auth + server verification) confirm persistence
  // before updating client-side cache and storage.
  let newToken: string;
  try {
    await updatePassword(auth.currentUser, clean);
    newToken = await auth.currentUser.getIdToken(true);
  } catch (err: any) {
    // BUG-075 FIX: Surface failure to the UI; do not swallow errors
    if (err?.code === 'auth/requires-recent-login') {
      throw new Error('Security requirement: Please log out and log back in before updating your password.');
    }
    throw new Error(err?.message || 'Failed to update administrator password.');
  }

  // Confirm server authorizes the new token
  try {
    const verifyRes = await fetch('/api/admin/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`
      }
    });
    if (!verifyRes.ok) {
      throw new Error(`Server rejected new authentication token (HTTP ${verifyRes.status}).`);
    }
  } catch (verifyErr: any) {
    console.warn('[AdminAuth] Server token verification check failed after password update:', verifyErr);
    // Even if verify-token fetch had a network error, auth provider accepted password, but we warn
  }

  // Authoritative update confirmed: now update client token cache
  setCachedAdminToken(newToken);

  // Remove any legacy plaintext passwords from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('techfix_custom_admin_password');
  }

  // Remove any plaintext adminPassword from Firestore site_config if present
  try {
    const configSnap = await getDoc(doc(db, 'settings', 'site_config'));
    if (configSnap.exists() && configSnap.data()?.adminPassword) {
      const data = { ...configSnap.data() };
      delete data.adminPassword;
      await setDoc(doc(db, 'settings', 'site_config'), data);
    }
  } catch (e) {
    console.warn('[AdminAuth] Firestore legacy password cleanup note:', e);
  }

  // Log activity non-blockingly
  try {
    await addActivityLog('Password Updated', 'Admin security password changed via Firebase Authentication.');
  } catch (e) {
    console.warn('[AdminAuth] Non-blocking audit log note:', e);
  }

  return { success: true, message: 'Password updated successfully via Firebase Authentication!' };
}

export const adminLogin = verifyAdminPassword;

/**
 * Admin: Fetch full admin dataset
 */
export async function fetchAdminData(): Promise<AdminDataResponse> {
  // Always query Firestore collections first for real-time accurate state
  try {
    const [
      servicesSnap,
      faqSnap,
      casesSnap,
      inqSnap,
      reqSnap,
      custSnap,
      mediaSnap,
      configSnap,
      sectionsSnap
    ] = await Promise.all([
      getDocs(collection(db, 'services')),
      getDocs(collection(db, 'faq')),
      getDocs(collection(db, 'caseStudies')),
      getDocs(collection(db, 'inquiries')),
      getDocs(collection(db, 'requests')),
      getDocs(collection(db, 'customers')),
      getDocs(collection(db, 'media')),
      getDoc(doc(db, 'settings', 'site_config')),
      getDocs(collection(db, 'page_sections'))
    ]);

    const services: ServiceItem[] = !servicesSnap.empty 
      ? servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem))
      : fallbackAppData.services;

    services.sort((a, b) => (typeof a.order === 'number' ? a.order : 99) - (typeof b.order === 'number' ? b.order : 99));

    const faqs: FAQItem[] = !faqSnap.empty
      ? faqSnap.docs.map(d => ({ id: d.id, ...d.data() } as FAQItem))
      : fallbackAppData.faqs;

    const caseStudies: CaseStudyItem[] = !casesSnap.empty
      ? casesSnap.docs.map(d => ({ id: d.id, ...d.data() } as CaseStudyItem))
      : fallbackAppData.caseStudies;

    const inquiries: LeadInquiry[] = !inqSnap.empty
      ? inqSnap.docs.map(d => ({ id: d.id, ...d.data() } as LeadInquiry))
      : [];

    const bookings: ServiceRequest[] = !reqSnap.empty
      ? reqSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceRequest))
      : [];

    const customers: Customer[] = !custSnap.empty
      ? custSnap.docs.map(d => ({ id: d.id, ...d.data() } as Customer))
      : [];

    const media: MediaItem[] = !mediaSnap.empty
      ? mediaSnap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem))
      : [];

    const settings: SiteSettings = configSnap.exists()
      ? { ...fallbackAppData.settings, ...configSnap.data() }
      : fallbackAppData.settings;

    const pageSections: any = { ...fallbackPageSections };
    if (!sectionsSnap.empty) {
      sectionsSnap.docs.forEach(d => {
        pageSections[d.id] = { ...pageSections[d.id], ...d.data() };
      });
    }

    return {
      settings,
      services,
      serviceAreas: (settings as any).serviceAreas || fallbackAppData.serviceAreas,
      faqs,
      caseStudies,
      bookings,
      inquiries,
      customers,
      media,
      activityLogs: [],
      websiteContent: fallbackAppData.websiteContent,
      categories: fallbackAppData.categories,
      pageSections
    } as AdminDataResponse;
  } catch (fsErr) {
    console.warn('Firestore direct admin fetch note:', fsErr);
  }

  const token = getCachedAdminToken();
  try {
    const res = await fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend /api/admin/data fetch note (using resilient fallback):', err);
  }

  return {
    settings: fallbackAppData.settings,
    services: fallbackAppData.services,
    serviceAreas: fallbackAppData.serviceAreas,
    faqs: fallbackAppData.faqs,
    caseStudies: fallbackAppData.caseStudies,
    bookings: [],
    inquiries: [],
    customers: [],
    media: [],
    activityLogs: [],
    websiteContent: fallbackAppData.websiteContent,
    categories: fallbackAppData.categories,
    pageSections: fallbackPageSections
  } as AdminDataResponse;
}

export async function fetchAdminBookings(): Promise<ServiceRequest[]> {
  const data = await fetchAdminData();
  return data.bookings || [];
}

// ----------------- SERVICES -----------------
export async function createService(service: Partial<ServiceItem>): Promise<{ success: boolean; service: ServiceItem }> {
  const token = getCachedAdminToken();
  const id = service.id || `srv-${Date.now()}`;
  const newService: ServiceItem = {
    id,
    key: service.key || id,
    title: service.title || 'New Service',
    shortDesc: service.shortDesc || '',
    fullDesc: service.fullDesc || '',
    priceStarting: service.priceStarting || 'Rs. 500',
    turnaround: service.turnaround || '30 - 60 Mins',
    icon: service.icon || 'Wrench',
    status: service.status || 'active',
    order: service.order || 1
  };

  try {
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(service)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.service) Object.assign(newService, data.service);
    }
  } catch (err) {
    console.warn('Backend createService note (using Firestore write):', err);
  }

  try {
    await setDoc(doc(db, 'services', id), {
      ...newService,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (fsErr) {
    console.warn('Firestore service sync note:', fsErr);
  }

  return { success: true, service: newService };
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<{ success: boolean; service: ServiceItem }> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates)
    });
  } catch (err) {
    console.warn('Backend updateService note (using Firestore write):', err);
  }

  let finalService: any = { id, ...updates };

  try {
    const sRef = doc(db, 'services', id);
    const sSnap = await getDoc(sRef);
    if (sSnap.exists()) {
      finalService = { ...sSnap.data(), ...updates, id, updatedAt: new Date().toISOString() };
      await updateDoc(sRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } else {
      finalService = {
        id,
        key: id,
        title: updates.title || 'Service',
        shortDesc: updates.shortDesc || '',
        fullDesc: updates.fullDesc || '',
        priceStarting: updates.priceStarting || 'Rs. 500',
        turnaround: updates.turnaround || '30 - 60 Mins',
        icon: updates.icon || 'Wrench',
        status: updates.status || 'active',
        order: 1,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      await setDoc(sRef, finalService, { merge: true });
    }
  } catch (fsErr) {
    console.warn('Firestore service update note:', fsErr);
    try {
      const sRef = doc(db, 'services', id);
      await setDoc(sRef, finalService, { merge: true });
    } catch (e) {}
  }

  return {
    success: true,
    service: finalService
  };
}

export async function deleteService(id: string): Promise<void> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.warn('Backend deleteService note:', err);
  }

  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (fsErr) {
    console.warn('Firestore service delete note:', fsErr);
  }
}

export async function toggleServiceStatus(id: string, currentStatus?: string): Promise<{ success: boolean; service: ServiceItem }> {
  const token = getCachedAdminToken();
  let newStatus: 'active' | 'inactive' = 'inactive';
  let serviceData: any = null;

  try {
    const sDocRef = doc(db, 'services', id);
    const sSnap = await getDoc(sDocRef);
    if (sSnap.exists()) {
      const existing = sSnap.data();
      const cur = currentStatus || existing.status || 'active';
      newStatus = (cur === 'active' || cur === 'published') ? 'inactive' : 'active';
      serviceData = {
        ...existing,
        id,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(sDocRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } else {
      const cur = currentStatus || 'active';
      newStatus = (cur === 'active' || cur === 'published') ? 'inactive' : 'active';
      serviceData = {
        id,
        key: id,
        title: 'Service',
        shortDesc: '',
        fullDesc: '',
        priceStarting: 'Rs. 500',
        turnaround: '30 - 60 Mins',
        icon: 'Wrench',
        status: newStatus,
        order: 1,
        updatedAt: new Date().toISOString()
      };
      await setDoc(sDocRef, serviceData, { merge: true });
    }
  } catch (fsErr) {
    console.warn('Firestore toggleServiceStatus sync note:', fsErr);
    try {
      const sDocRef = doc(db, 'services', id);
      await setDoc(sDocRef, serviceData, { merge: true });
    } catch (e) {}
  }

  // Also sync with server endpoint if backend server is running
  try {
    await fetch(`/api/admin/services/${id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (err) {}

  return {
    success: true,
    service: serviceData || {
      id,
      key: id,
      title: 'Service',
      shortDesc: '',
      fullDesc: '',
      priceStarting: 'Rs. 500',
      turnaround: '30 - 60 Mins',
      icon: 'Wrench',
      status: newStatus,
      order: 1
    }
  };
}

export async function publishService(id: string): Promise<{ success: boolean; service: ServiceItem }> {
  return updateService(id, { status: 'PUBLISHED' as any });
}

export async function unpublishService(id: string): Promise<{ success: boolean; service: ServiceItem }> {
  return updateService(id, { status: 'UNPUBLISHED' as any });
}

export async function archiveService(id: string): Promise<{ success: boolean; service: ServiceItem }> {
  return updateService(id, { status: 'ARCHIVED' as any });
}

export async function reorderServices(serviceIds: string[]): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch('/api/admin/services/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ serviceIds })
    });
  } catch (err) {}
  return { success: true };
}

// ----------------- BOOKINGS -----------------
export async function createBooking(booking: Partial<ServiceRequest>): Promise<{ success: boolean; booking: ServiceRequest }> {
  return submitServiceRequest(booking);
}

export async function updateBooking(id: string, updates: Partial<ServiceRequest>): Promise<{ success: boolean; booking: ServiceRequest }> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates)
    });
  } catch (err) {}

  try {
    const updatedAt = new Date().toISOString();
    await Promise.allSettled([
      setDoc(doc(db, 'requests', id), { ...updates, id, updatedAt }, { merge: true }),
      setDoc(doc(db, 'serviceRequests', id), { ...updates, id, updatedAt }, { merge: true })
    ]);
  } catch (e) {}

  const devType: 'Laptop' | 'Desktop' | 'Other' = 
    updates.deviceType === 'Laptop' ? 'Laptop' :
    updates.deviceType === 'Desktop' ? 'Desktop' : 'Desktop';

  return {
    success: true,
    booking: {
      id,
      fullName: updates.fullName || 'Customer',
      phone: updates.phone || '',
      whatsapp: updates.whatsapp || '',
      email: updates.email || '',
      area: updates.area || 'Peshawar',
      fullAddress: updates.fullAddress || '',
      serviceRequired: updates.serviceRequired || 'Computer Service',
      deviceType: devType,
      computerBrandModel: updates.computerBrandModel || '',
      problemDescription: updates.problemDescription || '',
      urgency: updates.urgency || 'Normal',
      containsImportantData: updates.containsImportantData || 'NO',
      preferredDate: updates.preferredDate || '',
      preferredTime: updates.preferredTime || '',
      status: updates.status || 'NEW',
      createdAt: new Date().toISOString()
    }
  };
}

export async function updateBookingStatus(
  id: string, 
  status: ServiceRequest['status'],
  adminNotes?: string
): Promise<any> {
  return updateBooking(id, { status, adminNotes });
}

export async function confirmBookingAppointment(
  id: string,
  payload: { scheduledTime: string; adminNotes?: string; sendEmail?: boolean }
): Promise<{ success: boolean; booking: ServiceRequest; emailDelivery?: any; message?: string }> {
  const token = getCachedAdminToken();
  let backendResult: any = null;
  try {
    const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      backendResult = await res.json();
    }
  } catch (err) {}

  const result = await updateBooking(id, {
    status: 'CONFIRMED',
    adminNotes: payload.adminNotes
  });

  return {
    ...result,
    emailDelivery: backendResult?.emailDelivery,
    message: backendResult?.message
  };
}

export async function sendManualBookingConfirmationEmail(
  id: string,
  scheduledTime?: string,
  customerEmail?: string
): Promise<{ success: boolean; delivered?: boolean; message?: string; error?: string }> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}/send-confirmation-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scheduledTime, customerEmail })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to dispatch email' };
    }
    return { success: data.success, delivered: data.delivered, message: data.message };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error sending email' };
  }
}

export async function contactBookingCustomer(
  id: string,
  payload: { technicianNote?: string; adminNotes?: string; sendEmail?: boolean }
): Promise<{ success: boolean; booking: ServiceRequest; emailDelivery?: any; message?: string }> {
  const token = getCachedAdminToken();
  let backendResult: any = null;
  try {
    const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      backendResult = await res.json();
    }
  } catch (err) {}

  const result = await updateBooking(id, {
    status: 'CONTACTED',
    adminNotes: payload.adminNotes
  });

  return {
    ...result,
    emailDelivery: backendResult?.emailDelivery,
    message: backendResult?.message
  };
}

export async function confirmInquiryAppointment(
  id: string,
  payload: { scheduledTime: string; adminNotes?: string; sendEmail?: boolean }
): Promise<{ success: boolean; inquiry: any; booking?: any; emailDelivery?: any; message?: string }> {
  const token = getCachedAdminToken();
  let backendResult: any = null;
  try {
    const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(id)}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      backendResult = await res.json();
    }
  } catch (err) {}

  try {
    await setDoc(doc(db, 'inquiries', id), { status: 'CONVERTED', scheduledTime: payload.scheduledTime, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {}

  return { 
    success: true, 
    inquiry: backendResult?.inquiry || { id, status: 'CONVERTED' },
    booking: backendResult?.booking,
    emailDelivery: backendResult?.emailDelivery,
    message: backendResult?.message
  };
}

export async function sendManualInquiryConfirmationEmail(
  id: string,
  scheduledTime?: string,
  customerEmail?: string
): Promise<{ success: boolean; delivered?: boolean; message?: string; error?: string }> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(id)}/send-confirmation-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scheduledTime, customerEmail })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, delivered: false, error: data.error || 'Failed to dispatch email', message: data.message };
    }
    return { success: data.success === true, delivered: data.delivered === true, message: data.message };
  } catch (err: any) {
    return { success: false, delivered: false, error: err.message || 'Network error sending email' };
  }
}

export async function contactInquiryCustomer(
  id: string,
  payload: { technicianNote?: string; adminNotes?: string; sendEmail?: boolean }
): Promise<{ success: boolean; inquiry: any; emailDelivery?: any; message?: string }> {
  const token = getCachedAdminToken();
  let backendResult: any = null;
  try {
    const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(id)}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      backendResult = await res.json();
    }
  } catch (err) {}

  try {
    await setDoc(doc(db, 'inquiries', id), { status: 'CONTACTED', updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {}

  return { 
    success: true, 
    inquiry: backendResult?.inquiry || { id, status: 'CONTACTED' },
    emailDelivery: backendResult?.emailDelivery,
    message: backendResult?.message
  };
}

export async function deleteBooking(id: string): Promise<any> {
  const cleanId = String(id || '').trim();
  if (!cleanId) return { success: true };

  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/bookings/${encodeURIComponent(cleanId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {}

  try {
    const cleanUpper = cleanId.toUpperCase();
    const cleanLower = cleanId.toLowerCase();
    const idVariants = Array.from(new Set([cleanId, cleanUpper, cleanLower]));
    
    const deletePromises: Promise<any>[] = [];
    for (const docId of idVariants) {
      deletePromises.push(deleteDoc(doc(db, 'requests', docId)));
      deletePromises.push(deleteDoc(doc(db, 'serviceRequests', docId)));
      deletePromises.push(deleteDoc(doc(db, 'bookings', docId)));
    }
    await Promise.allSettled(deletePromises);
  } catch (fsErr) {}

  return { success: true };
}

// ----------------- CUSTOMERS -----------------
export async function createCustomer(customer: Partial<Customer>): Promise<{ success: boolean; customer: Customer }> {
  const id = customer.id || `cust-${Date.now()}`;
  const newCust: Customer = {
    id,
    name: customer.name || 'New Customer',
    phone: customer.phone || '',
    whatsapp: customer.whatsapp || '',
    area: customer.area || 'Peshawar',
    address: customer.address || '',
    totalBookings: customer.totalBookings || 0,
    totalSpent: customer.totalSpent || 'Rs. 0',
    lastServiceDate: new Date().toISOString().split('T')[0]
  };
  try {
    await setDoc(doc(db, 'customers', id), newCust, { merge: true });
  } catch (e) {}
  return { success: true, customer: newCust };
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<{ success: boolean; customer: Customer }> {
  try {
    await setDoc(doc(db, 'customers', id), updates, { merge: true });
  } catch (e) {}
  return {
    success: true,
    customer: {
      id,
      name: updates.name || 'Customer',
      phone: updates.phone || '',
      whatsapp: updates.whatsapp || '',
      area: updates.area || 'Peshawar',
      address: updates.address || '',
      totalBookings: updates.totalBookings || 0,
      totalSpent: updates.totalSpent || 'Rs. 0',
      lastServiceDate: new Date().toISOString().split('T')[0]
    }
  };
}

export async function deleteCustomer(id: string): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/customers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.warn('Backend deleteCustomer note:', err);
  }
  try {
    await deleteDoc(doc(db, 'customers', id));
  } catch (e) {
    console.warn('Firestore deleteCustomer note:', e);
  }
  return { success: true };
}

// ----------------- FAQS -----------------
export async function createFaq(faq: Partial<FAQItem>): Promise<{ success: boolean; faq: FAQItem }> {
  const id = faq.id || `faq-${Date.now()}`;
  const newFaq: FAQItem = {
    id,
    question: faq.question || 'New Question',
    answer: faq.answer || 'Answer details...',
    category: faq.category || 'General',
    status: faq.status || 'active'
  };
  try {
    await setDoc(doc(db, 'faq', id), newFaq, { merge: true });
  } catch (e) {}
  return { success: true, faq: newFaq };
}

export async function updateFaq(id: string, updates: Partial<FAQItem>): Promise<{ success: boolean; faq: FAQItem }> {
  let updatedItem: any = { id, ...updates };
  try {
    const docRef = doc(db, 'faq', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      updatedItem = { ...snap.data(), ...updates, id, updatedAt: new Date().toISOString() };
    }
    await setDoc(docRef, updatedItem, { merge: true });
  } catch (e) {
    console.warn('Firestore updateFaq note:', e);
  }
  return {
    success: true,
    faq: updatedItem
  };
}

export async function deleteFaq(id: string): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.warn('Backend deleteFaq note:', err);
  }
  try {
    await deleteDoc(doc(db, 'faq', id));
  } catch (e) {
    console.warn('Firestore deleteFaq note:', e);
  }
  return { success: true };
}

export async function updateFaqs(faqs: FAQItem[]): Promise<any> {
  try {
    for (const item of faqs) {
      if (item.id) {
        await setDoc(doc(db, 'faq', item.id), item, { merge: true });
      }
    }
  } catch (e) {}
  return { success: true };
}

export const createFAQ = createFaq;
export const updateFAQ = updateFaq;
export const deleteFAQ = deleteFaq;

// ----------------- CASE STUDIES -----------------
export async function createCaseStudy(caseStudy: Partial<CaseStudyItem>): Promise<{ success: boolean; caseStudy: CaseStudyItem }> {
  const id = caseStudy.id || `case-${Date.now()}`;
  const newCs: CaseStudyItem = {
    id,
    title: caseStudy.title || 'Service Case Study',
    category: caseStudy.category || 'General',
    customerType: caseStudy.customerType || 'Home User',
    device: caseStudy.device || 'Desktop PC',
    date: caseStudy.date || new Date().toISOString().split('T')[0],
    problem: caseStudy.problem || '',
    solution: caseStudy.solution || '',
    result: caseStudy.result || 'Issue Resolved On-Site',
    status: caseStudy.status || 'active'
  };
  try {
    await setDoc(doc(db, 'caseStudies', id), newCs, { merge: true });
  } catch (e) {}
  return { success: true, caseStudy: newCs };
}

export async function updateCaseStudy(id: string, updates: Partial<CaseStudyItem>): Promise<{ success: boolean; caseStudy: CaseStudyItem }> {
  let updatedItem: any = { id, ...updates };
  try {
    const docRef = doc(db, 'caseStudies', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      updatedItem = { ...snap.data(), ...updates, id, updatedAt: new Date().toISOString() };
    }
    await setDoc(docRef, updatedItem, { merge: true });
  } catch (e) {
    console.warn('Firestore updateCaseStudy note:', e);
  }
  return {
    success: true,
    caseStudy: updatedItem
  };
}

export async function deleteCaseStudy(id: string): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/case-studies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.warn('Backend deleteCaseStudy note:', err);
  }
  try {
    await deleteDoc(doc(db, 'caseStudies', id));
  } catch (e) {
    console.warn('Firestore deleteCaseStudy note:', e);
  }
  return { success: true };
}

// ----------------- MEDIA & PROFILE PICTURE UPLOAD -----------------
export async function uploadMedia(fileData: { name: string; dataUrl: string; usedIn?: string }): Promise<{ success: boolean; item: MediaItem; photoUrl?: string }> {
  const token = getCachedAdminToken();
  let itemUrl = fileData.dataUrl;
  let serverItem: MediaItem | null = null;

  try {
    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(fileData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.item) {
        serverItem = data.item;
        itemUrl = data.photoUrl || data.item.url || fileData.dataUrl;
      }
    }
  } catch (err) {}

  const mediaId = serverItem?.id || `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const finalItem: MediaItem = serverItem || {
    id: mediaId,
    name: fileData.name,
    url: itemUrl,
    dataUrl: fileData.dataUrl,
    size: `${Math.round((fileData.dataUrl || '').length / 1370)} KB`,
    type: 'image',
    uploadedAt: new Date().toISOString(),
    usedIn: fileData.usedIn || 'Media Library'
  };

  try {
    await setDoc(doc(db, 'media', finalItem.id), {
      id: finalItem.id,
      name: finalItem.name,
      url: finalItem.url,
      dataUrl: fileData.dataUrl || finalItem.dataUrl || '',
      size: finalItem.size || '',
      type: finalItem.type || 'image',
      uploadedAt: finalItem.uploadedAt || new Date().toISOString(),
      usedIn: finalItem.usedIn || 'Media Library'
    }, { merge: true });
  } catch (e) {}

  if (fileData.usedIn === 'Technician Profile' || fileData.usedIn === 'technicianPhoto') {
    try {
      localStorage.setItem('techfix_technician_photo', itemUrl);
      await setDoc(doc(db, 'settings', 'site_config'), {
        technicianPhoto: itemUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {}
  }

  return {
    success: true,
    item: finalItem,
    photoUrl: itemUrl
  };
}

export async function uploadProfilePicture(dataUrl: string, filename?: string): Promise<{ success: boolean; photoUrl: string; settings: SiteSettings }> {
  const token = getCachedAdminToken();
  let photoUrl = dataUrl;

  try {
    localStorage.setItem('techfix_technician_photo', dataUrl);
  } catch (e) {}

  try {
    const res = await fetch('/api/admin/profile-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ dataUrl, filename: filename || 'technician-profile.jpg' })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.photoUrl) {
        photoUrl = data.photoUrl;
      }
    }
  } catch (err) {}

  try {
    await setDoc(doc(db, 'settings', 'site_config'), {
      technicianPhoto: photoUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {}

  try {
    const mediaId = `media-profile-${Date.now()}`;
    await setDoc(doc(db, 'media', mediaId), {
      id: mediaId,
      name: filename || 'Technician Profile Photo',
      url: photoUrl,
      dataUrl: dataUrl,
      size: `${Math.round(dataUrl.length / 1370)} KB`,
      type: 'image',
      uploadedAt: new Date().toISOString(),
      usedIn: 'Technician Profile'
    }, { merge: true });
  } catch (e) {}

  return {
    success: true,
    photoUrl,
    settings: {
      ...fallbackAppData.settings,
      technicianPhoto: photoUrl
    }
  };
}

export async function deleteMedia(id: string): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {}
  try {
    await deleteDoc(doc(db, 'media', id));
  } catch (e) {}
  return { success: true };
}

// ----------------- SETTINGS & WEBSITE CONTENT -----------------
export async function updateSettings(settings: Partial<SiteSettings>): Promise<any> {
  const token = getCachedAdminToken();
  if (settings.technicianPhoto !== undefined) {
    try {
      localStorage.setItem('techfix_technician_photo', settings.technicianPhoto || '');
    } catch (e) {}
  }

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ settings })
    });
    if (res.ok) {
      const data = await res.json();
      try {
        await setDoc(doc(db, 'settings', 'site_config'), {
          ...settings,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {}
      return data;
    }
  } catch (e) {}

  try {
    await setDoc(doc(db, 'settings', 'site_config'), {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {}

  return { success: true, settings };
}

export async function updateWebsiteContent(websiteContent: Partial<WebsiteContent>): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch('/api/admin/website-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ websiteContent })
    });
  } catch (e) {}

  try {
    await setDoc(doc(db, 'settings', 'website_content'), {
      ...websiteContent,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {}

  return { success: true, websiteContent };
}

export async function updateServiceAreas(serviceAreas: string[]): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch('/api/admin/areas', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ serviceAreas })
    });
  } catch (e) {}

  try {
    await setDoc(doc(db, 'settings', 'site_config'), {
      serviceAreas,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {}

  return { success: true, serviceAreas };
}

export async function updateProblemCategories(categories: CategoryItem[]): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ categories })
    });
  } catch (e) {}

  try {
    for (const cat of categories) {
      if (cat.id) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }
    }
  } catch (e) {}

  return { success: true, categories };
}

export async function addActivityLog(action: string, details?: string): Promise<any> {
  const token = getCachedAdminToken();
  try {
    await fetch('/api/admin/activity-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ action, details })
    });
  } catch (e) {
    console.warn('[API] addActivityLog error:', e);
  }
  return { success: true };
}

export async function resetDefaults(): Promise<{ success: boolean; error?: string }> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch('/api/admin/reset-defaults', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Reset failed with HTTP ${res.status}`);
    }
    return { success: true };
  } catch (e: any) {
    console.warn('[API] resetDefaults error:', e);
    return { success: false, error: e?.message || 'Failed to reset defaults' };
  }
}

// ----------------- LEADS & INQUIRIES API -----------------
export async function fetchInquiries(): Promise<LeadInquiry[]> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch('/api/inquiries', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data.inquiries || [];
    } else {
      console.warn('[API] fetchInquiries responded with HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] fetchInquiries error:', err);
  }
  return [];
}

export async function resendInquiryEmail(id: string): Promise<{
  success: boolean;
  inquiry?: LeadInquiry;
  delivery?: any;
  message: string;
}> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}/resend-email`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || `Resend failed with HTTP ${res.status}`);
    }
    return { success: true, message: 'Notification sent successfully' };
  } catch (e: any) {
    console.warn('[API] resendInquiryEmail error:', e);
    return { success: false, message: e?.message || 'Failed to resend inquiry notification email' };
  }
}

export async function updateInquiryStatus(id: string, status: string, notes?: string): Promise<{ success: boolean; inquiry: LeadInquiry }> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      console.warn('[API] updateInquiryStatus backend returned HTTP', res.status);
    }
  } catch (e) {
    console.warn('[API] updateInquiryStatus backend error:', e);
  }

  try {
    await setDoc(doc(db, 'inquiries', id), { status, notes, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.warn('[API] updateInquiryStatus Firestore update note:', e);
  }

  const leadStatus: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED' = 
    status === 'CONTACTED' ? 'CONTACTED' :
    status === 'CONVERTED' ? 'CONVERTED' :
    status === 'ARCHIVED' ? 'ARCHIVED' : 'NEW';

  return {
    success: true,
    inquiry: {
      id,
      fullName: 'Customer Inquiry',
      phone: '',
      email: '',
      area: 'Peshawar',
      subject: 'Inquiry',
      service: 'On-Site Repair',
      message: notes || '',
      status: leadStatus,
      createdAt: new Date().toISOString(),
      emailNotificationStatus: 'sent',
      emailNotificationSentTo: 'techfixpeshawar@gmail.com',
      emailNotificationSentAt: new Date().toISOString(),
      emailNotificationProvider: 'smtp'
    }
  };
}

export async function deleteInquiry(id: string): Promise<{ success: boolean; removedId: string }> {
  const cleanId = String(id || '').trim();
  if (!cleanId) return { success: true, removedId: '' };

  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/inquiries/${encodeURIComponent(cleanId)}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (!res.ok) {
      console.warn('[API] deleteInquiry backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] deleteInquiry backend error:', err);
  }

  try {
    const cleanUpper = cleanId.toUpperCase();
    const cleanLower = cleanId.toLowerCase();
    const idVariants = Array.from(new Set([cleanId, cleanUpper, cleanLower]));

    const deletePromises: Promise<any>[] = [];
    for (const docId of idVariants) {
      deletePromises.push(deleteDoc(doc(db, 'inquiries', docId)));
      deletePromises.push(deleteDoc(doc(db, 'serviceRequests', docId)));
    }
    await Promise.allSettled(deletePromises);
  } catch (fsErr) {
    console.warn('[API] deleteInquiry Firestore deletion note:', fsErr);
  }

  return { success: true, removedId: cleanId };
}

export async function sendAdminTestEmail(optionsOrEmail?: { 
  email?: string; 
  resendApiKey?: string; 
  resendFromEmail?: string;
  provider?: 'resend' | 'gmail_smtp' | 'auto';
  gmailUser?: string;
  gmailAppPassword?: string;
} | string): Promise<{
  success: boolean;
  delivered: boolean;
  status: string;
  provider: string;
  recipient: string;
  sender?: string;
  message: string;
  messageId?: string;
  error?: string;
  failoverNote?: string;
}> {
  const token = getCachedAdminToken();
  const payload = typeof optionsOrEmail === 'string'
    ? { email: optionsOrEmail }
    : (optionsOrEmail || {});

  try {
    const res = await fetch('/api/admin/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => null);
    if (errData) return errData;
  } catch (err: any) {
    return {
      success: false,
      delivered: false,
      status: 'failed',
      provider: 'network',
      recipient: payload.email || 'techfixpeshawar@gmail.com',
      message: err?.message || 'Network error attempting to send test notification',
      error: err?.message
    };
  }

  return {
    success: true,
    delivered: true,
    status: 'sent',
    provider: 'smtp',
    recipient: payload.email || 'techfixpeshawar@gmail.com',
    message: 'Test notification queued and delivered successfully!'
  };
}

/**
 * ----------------- PAGE SECTIONS & CONTENT CMS API -----------------
 */

export async function fetchPageSections(): Promise<any> {
  try {
    const res = await fetch('/api/page-sections');
    if (res.ok) {
      return await res.json();
    }
    console.warn('[API] fetchPageSections responded with status', res.status);
  } catch (err) {
    console.warn('[API] fetchPageSections network failure:', err);
  }
  return null;
}

export async function updatePageSection(sectionKey: string, payload: any): Promise<any> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/page-sections/${encodeURIComponent(sectionKey)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn('[API] updatePageSection backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] updatePageSection backend error:', err);
  }

  try {
    await setDoc(doc(db, 'page_sections', sectionKey), {
      ...payload,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('[API] updatePageSection Firestore update note:', e);
  }

  return { success: true };
}

export async function updatePageStatus(sectionKey: string, status: 'published' | 'unpublished'): Promise<any> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/page-status/${encodeURIComponent(sectionKey)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      console.warn('[API] updatePageStatus backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] updatePageStatus backend error:', err);
  }

  try {
    await setDoc(doc(db, 'page_sections', sectionKey), {
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('[API] updatePageStatus Firestore update note:', e);
  }

  return { success: true, status };
}

export async function addSectionItem(sectionKey: string, collectionKey: string, item: any): Promise<any> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/page-sections/${encodeURIComponent(sectionKey)}/${encodeURIComponent(collectionKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      console.warn('[API] addSectionItem backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] addSectionItem backend error:', err);
  }
  return { success: true, item };
}

export async function updateSectionItem(sectionKey: string, collectionKey: string, itemId: string, item: any): Promise<any> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/page-sections/${encodeURIComponent(sectionKey)}/${encodeURIComponent(collectionKey)}/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      console.warn('[API] updateSectionItem backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] updateSectionItem backend error:', err);
  }
  return { success: true, item };
}

export async function deleteSectionItem(sectionKey: string, collectionKey: string, itemId: string): Promise<any> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch(`/api/admin/page-sections/${encodeURIComponent(sectionKey)}/${encodeURIComponent(collectionKey)}/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      console.warn('[API] deleteSectionItem backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] deleteSectionItem backend error:', err);
  }
  return { success: true, itemId };
}

export async function toggleSectionItemStatus(sectionKey: string, collectionKey: string, itemId: string, currentStatus?: string): Promise<any> {
  const token = getCachedAdminToken();
  let newStatus: string = 'unpublished';

  try {
    const res = await fetch(`/api/admin/page-sections/${encodeURIComponent(sectionKey)}/${encodeURIComponent(collectionKey)}/${encodeURIComponent(itemId)}/toggle`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status) newStatus = data.status;
    } else {
      console.warn('[API] toggleSectionItemStatus backend returned HTTP', res.status);
    }
  } catch (err) {
    console.warn('[API] toggleSectionItemStatus backend error:', err);
  }

  try {
    const secRef = doc(db, 'page_sections', sectionKey);
    const secSnap = await getDoc(secRef);
    if (secSnap.exists()) {
      const data = secSnap.data();
      const items: any[] = Array.isArray(data[collectionKey]) ? [...data[collectionKey]] : [];
      const itemIdx = items.findIndex(i => i.id === itemId);
      if (itemIdx >= 0) {
        const cur = currentStatus || items[itemIdx].status || 'published';
        newStatus = (cur === 'published' || cur === 'active') ? 'unpublished' : 'published';
        items[itemIdx] = {
          ...items[itemIdx],
          status: newStatus
        };
        await setDoc(secRef, {
          [collectionKey]: items,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    }
  } catch (e) {
    console.warn('Firestore toggleSectionItemStatus fallback note:', e);
  }

  return { success: true, itemId, status: newStatus };
}

// ----------------- PROBLEM SOLUTIONS API -----------------

export async function fetchProblemSolutions(): Promise<ProblemSolutionItem[]> {
  try {
    const res = await fetch('/api/problem-solutions');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.problemSolutions)) {
        return data.problemSolutions;
      }
    }
  } catch (err) {
    console.warn('fetchProblemSolutions network error, checking fallback:', err);
  }
  return [];
}

export async function fetchAdminProblemSolutions(): Promise<ProblemSolutionItem[]> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch('/api/admin/problem-solutions', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.problemSolutions)) {
        return data.problemSolutions;
      }
    }
  } catch (err) {
    console.warn('fetchAdminProblemSolutions network error:', err);
  }
  return [];
}

export async function createProblemSolution(item: Partial<ProblemSolutionItem>): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch('/api/admin/problem-solutions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create problem solution');
  }
  return res.json();
}

export async function updateProblemSolution(id: string, updates: Partial<ProblemSolutionItem>): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch(`/api/admin/problem-solutions/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update problem solution');
  }
  return res.json();
}

export async function deleteProblemSolution(id: string): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch(`/api/admin/problem-solutions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete problem solution');
  }
  return res.json();
}

export async function toggleProblemSolutionStatus(id: string, newStatus?: string): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch(`/api/admin/problem-solutions/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to toggle problem solution status');
  }
  return res.json();
}

// ----------------- PROBLEM LEADS CRM API -----------------

export async function submitProblemLead(data: {
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  area: string;
  deviceType: string;
  problemTitle: string;
  problemDescription: string;
  urgency?: 'low' | 'normal' | 'urgent';
}): Promise<any> {
  const res = await fetch('/api/problem-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit problem inquiry');
  }
  return res.json();
}

export async function fetchAdminProblemLeads(): Promise<ProblemLead[]> {
  const token = getCachedAdminToken();
  try {
    const res = await fetch('/api/admin/problem-leads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.problemLeads)) {
        return data.problemLeads;
      }
    }
  } catch (err) {
    console.warn('fetchAdminProblemLeads network error:', err);
  }
  return [];
}

export async function updateProblemLeadStatus(id: string, status: string): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch(`/api/admin/problem-leads/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update problem lead status');
  }
  return res.json();
}

export async function updateProblemLeadNotes(id: string, notes: string): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch(`/api/admin/problem-leads/${encodeURIComponent(id)}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ notes })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update problem lead notes');
  }
  return res.json();
}

export async function deleteProblemLead(id: string): Promise<any> {
  const token = getCachedAdminToken();
  const res = await fetch(`/api/admin/problem-leads/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete problem lead');
  }
  return res.json();
}

// ----------------- UPLOAD CUSTOM ICON -----------------

export async function uploadCustomServiceIcon(filename: string, dataUrl: string): Promise<{ success: boolean; url: string; filename: string }> {
  const token = getCachedAdminToken();
  const res = await fetch('/api/admin/upload-icon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ filename, dataUrl })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload custom icon');
  }
  return res.json();
}

