import type { 
  ServiceRequest as FirestoreServiceRequest,
  Booking as FirestoreBooking,
  Settings as FirestoreSettings,
  User as FirestoreUser,
  FirestoreAuditFields,
  ContentStatus,
  ServiceRequestStatus
} from './types/firestore';

export type { 
  FirestoreServiceRequest, 
  FirestoreBooking, 
  FirestoreSettings, 
  FirestoreUser, 
  FirestoreAuditFields,
  ContentStatus,
  ServiceRequestStatus
};
export type Booking = FirestoreBooking;
export type User = FirestoreUser;

export type BookingStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'APPOINTMENT REQUESTED'
  | 'CONFIRMED'
  | 'IN PROGRESS'
  | 'WAITING FOR PARTS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED'
  | 'pending'
  | 'contacted'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface ServiceItem {
  id: string;
  key: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  priceStarting: string;
  priceNote?: string;
  turnaround: string;
  icon: string;
  customIcon?: string;
  status: ContentStatus | 'active' | 'inactive' | 'published' | 'unpublished';
  order: number;
  workflow?: string[];
  warningNote?: string;
  diagnosticSteps?: string[];
}

export interface ServiceRequest {
  id: string;
  createdAt: string;
  updatedAt?: string;
  fullName: string;
  email?: string;
  phone: string;
  whatsapp: string;
  area: string;
  fullAddress?: string;
  deviceType: 'Laptop' | 'Desktop' | 'Other';
  computerBrandModel: string;
  serviceRequired: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  urgency: 'Normal' | 'Urgent';
  containsImportantData: 'YES' | 'NO';
  hasImportantData?: boolean;
  status: BookingStatus;
  adminNotes?: string;
  scheduledTime?: string;
  technicianNotes?: string;
  visitFee?: string;
  totalQuoted?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  status?: ContentStatus | 'active' | 'inactive' | 'published' | 'unpublished';
}

export interface CaseStudyItem {
  id: string;
  title: string;
  category?: string;
  customerType?: string;
  device?: string;
  date: string;
  problem: string;
  diagnosis?: string;
  solution: string;
  result: string;
  deviceInfo?: string;
  images?: string[];
  status?: ContentStatus | 'active' | 'inactive' | 'published' | 'unpublished';
}

export type CaseStudy = CaseStudyItem;

export interface ProblemCategory {
  id: string;
  title: string;
  symptom: string;
  serviceKey: string;
  serviceName: string;
  icon?: any;
  badgeColor?: string;
}

export interface ProblemSolutionItem {
  id: string;
  key: string;
  badge: string;
  title: string;
  subtitle?: string;
  shortDesc: string;
  symptomsWhenNeeded: string[];
  honestAssessment: string;
  turnaroundCriteria?: string;
  turnaroundFactors?: string[];
  protocolBadge?: string;
  protocolTitle?: string;
  steps: {
    num: string;
    title: string;
    desc: string;
  }[];
  priceStarting: string;
  ctaText?: string;
  serviceKey?: string;
  warningRules?: string[];
  recoverableScenarios?: string[];
  unrecoverableScenarios?: string[];
  benefits?: string[];
  status: ContentStatus | 'active' | 'inactive' | 'published' | 'unpublished';
  order: number;
}

export interface ProblemLead {
  id: string;
  createdAt: string;
  updatedAt?: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  area: string;
  deviceType: string;
  problemTitle: string;
  problemDescription: string;
  urgency: 'low' | 'normal' | 'urgent';
  status: 'NEW' | 'RESEARCHING' | 'SOLVED' | 'CONTACTED' | 'ARCHIVED';
  technicianNotes?: string;
}

export interface SiteSettings {
  isLoading?: boolean;
  businessName?: string;
  tagline?: string;
  whatsappNumber: string; // e.g. "+92 300 0000000"
  phoneNumber: string;
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
  // Social media accounts & external links
  socialX?: string;
  socialLinkedin?: string;
  socialTiktok?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  // Email Dispatch & Deliverability settings
  emailProvider?: 'resend' | 'gmail_smtp' | 'auto';
  resendApiKey?: string;
  resendFromEmail?: string;
  resendTargetEmail?: string;
  gmailUser?: string;
  gmailAppPassword?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  area: string;
  address?: string;
  totalBookings: number;
  totalSpent?: string;
  lastServiceDate: string;
  notes?: string;
  devices?: string[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  dataUrl?: string;
  size?: string;
  type?: string;
  uploadedAt: string;
  usedIn?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface WebsiteContent {
  heroHeadline?: string;
  heroSubheadline?: string;
  announcementActive?: boolean;
  announcementText?: string;
  ctaButtonText?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  footerBio?: string;
  disclaimerText?: string;
}

export type EmailNotificationStatus = 'sent' | 'failed' | 'activation_needed' | 'credentials_pending';
export type EmailNotificationProvider = 'resend' | 'smtp' | 'formsubmit' | 'logged';

export interface LeadInquiry {
  id: string;
  bookingId?: string;
  fullName: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  area?: string;
  subject?: string;
  service?: string;
  budget?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED';
  createdAt: string;
  updatedAt?: string;
  emailNotificationStatus: EmailNotificationStatus;
  emailNotificationSentTo: string;
  emailNotificationSentAt: string;
  emailNotificationProvider: EmailNotificationProvider;
  emailNotificationError?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  serviceCount?: number;
}

export interface WorkflowStepItem {
  id: string;
  num: string;
  title: string;
  desc: string;
  status: ContentStatus;
}

export interface ToolkitItem {
  id: string;
  title: string;
  desc: string;
  status: ContentStatus;
}

export interface PillarItem {
  id: string;
  title: string;
  desc: string;
  status: ContentStatus;
}

export interface ComparisonStepItem {
  id: string;
  step: string;
  title: string;
  desc: string;
  status: ContentStatus;
}

export interface AudienceItem {
  id: string;
  key: string;
  title: string;
  tagline: string;
  headline: string;
  badge: string;
  services: string[];
  status: ContentStatus;
}

export interface BulkPricingTier {
  id: string;
  minPCs: number;
  maxPCs: number;
  ratePerPc: number;
  label: string;
  desc: string;
  status: ContentStatus;
}

export interface LabFeatureItem {
  id: string;
  title: string;
  desc: string;
  status: ContentStatus;
}

export interface EthicalCodeItem {
  id: string;
  title: string;
  desc: string;
  status: ContentStatus;
}

export interface PeshawarAreaItem {
  id: string;
  name: string;
  speed: string;
  note: string;
  status: ContentStatus;
}

export interface HowItWorksSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
  steps: WorkflowStepItem[];
  toolkit: ToolkitItem[];
}

export interface WhyOnSiteSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
  pillars: PillarItem[];
  shopSteps: ComparisonStepItem[];
  ourSteps: ComparisonStepItem[];
}

export interface WhoWeServeSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
  audiences: AudienceItem[];
}

export interface BulkWindowsSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
  pricingTiers: BulkPricingTier[];
  labFeatures: LabFeatureItem[];
}

export interface TechnicianSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
  ethicalCodes: EthicalCodeItem[];
}

export interface FAQSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
}

export interface ContactSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
  peshawarAreas: PeshawarAreaItem[];
}

export interface ServicesSectionData {
  pageStatus: ContentStatus;
  badge?: string;
  title: string;
  subtitle: string;
}

export interface PageSectionsData {
  pageStatuses: Record<string, ContentStatus>;
  services?: ServicesSectionData;
  'how-it-works': HowItWorksSectionData;
  'why-on-site': WhyOnSiteSectionData;
  'who-we-serve': WhoWeServeSectionData;
  'bulk-windows': BulkWindowsSectionData;
  technician: TechnicianSectionData;
  faq: FAQSectionData;
  contact: ContactSectionData;
}

export interface AdminDataResponse {
  settings: SiteSettings;
  services: ServiceItem[];
  serviceAreas: string[];
  faqs: FAQItem[];
  caseStudies: CaseStudyItem[];
  bookings: ServiceRequest[];
  inquiries?: LeadInquiry[];
  websiteContent?: WebsiteContent;
  categories?: CategoryItem[];
  media?: MediaItem[];
  customers?: Customer[];
  activityLogs?: ActivityLog[];
  pageSections?: PageSectionsData;
}

export interface AppDataResponse {
  services: ServiceItem[];
  faqs: FAQItem[];
  settings: SiteSettings;
  serviceAreas: string[];
  caseStudies: CaseStudyItem[];
  inquiries?: LeadInquiry[];
  problemCategories?: ProblemCategory[];
  customers?: Customer[];
  media?: MediaItem[];
  activityLogs?: ActivityLog[];
  websiteContent?: WebsiteContent;
  categories?: CategoryItem[];
  pageSections?: PageSectionsData;
}
