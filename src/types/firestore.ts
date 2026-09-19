/**
 * Firestore Document Models & TypeScript Interfaces
 * Strictly enforces standard audit fields (createdAt, updatedAt, status)
 * across all collections: 'services', 'serviceRequests', 'bookings', 'settings', and 'users'
 */

export type ContentStatus = 
  | 'DRAFT' 
  | 'PUBLISHED' 
  | 'UNPUBLISHED' 
  | 'ARCHIVED'
  | 'published'
  | 'unpublished'
  | 'draft'
  | 'archived'
  | 'active'
  | 'inactive';

export type ServiceRequestStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'APPOINTMENT REQUESTED'
  | 'CONFIRMED'
  | 'IN PROGRESS'
  | 'WAITING FOR PARTS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type DocumentStatus = ContentStatus | ServiceRequestStatus | string;

export interface FirestoreAuditFields {
  createdAt: string;
  updatedAt: string;
  status: DocumentStatus;
}

/**
 * ServiceRequest document in Firestore ('serviceRequests' collection)
 */
export interface ServiceRequest {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  area: string;
  address?: string;
  fullAddress?: string;
  deviceType: 'Laptop' | 'Desktop' | 'Other' | string;
  computerBrandModel: string;
  serviceRequired: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  urgency: 'Normal' | 'Urgent' | string;
  containsImportantData: 'YES' | 'NO' | string;
  hasImportantData?: boolean;
  adminNotes?: string;
  scheduledTime?: string;
  technicianNotes?: string;
  visitFee?: string;
  totalQuoted?: string;
  source?: 'web' | 'whatsapp' | 'phone' | 'admin';
  status: ServiceRequestStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Booking document in Firestore ('bookings' collection)
 */
export interface Booking extends ServiceRequest {}

/**
 * Settings document in Firestore ('settings' collection, e.g. 'site_config')
 */
export interface Settings {
  isLoading?: boolean;
  businessName?: string;
  tagline?: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  serviceCity?: string;
  serviceAreaCity?: string;
  businessHours: string;
  visitFeeStarting: string;
  bulkQuoteNote?: string;
  technicianName: string;
  technicianTitle: string;
  technicianInstitution: string;
  technicianExperience: string;
  technicianBio: string;
  technicianQuote?: string;
  technicianPhoto: string;
  supportResponseSla?: string;
  siteStatus?: 'ONLINE' | 'MAINTENANCE';
  isSitePublished?: boolean;
  serviceAreas?: string[];
  socialX?: string;
  socialLinkedin?: string;
  socialTiktok?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: ContentStatus;
}

/**
 * User document in Firestore ('users' collection)
 */
export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'technician' | 'customer' | string;
  adminClaim?: boolean;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | string;
}

/**
 * Service catalog document in Firestore ('services' collection)
 */
export interface ServiceDocument {
  id: string;
  key: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  priceStarting: string;
  priceNote?: string;
  turnaround: string;
  icon: string;
  order: number;
  workflow?: string[];
  warningNote?: string;
  diagnosticSteps?: string[];
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * FAQ document in Firestore ('faq' collection)
 */
export interface FAQDocument {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}
