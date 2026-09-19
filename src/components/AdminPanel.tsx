import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  Laptop, 
  Layers, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Globe,
  Wrench,
  Users,
  Inbox,
  CalendarCheck,
  FileText,
  Image as ImageIcon,
  Building2,
  Settings as SettingsIcon,
  Menu,
  ShieldCheck,
  Archive,
  Mail,
  Clock,
  HelpCircle,
  MapPin,
  Cpu
} from 'lucide-react';
import { 
  ServiceRequest, 
  ServiceItem, 
  SiteSettings, 
  FAQItem, 
  CaseStudyItem, 
  Customer, 
  MediaItem, 
  ActivityLog, 
  WebsiteContent,
  CategoryItem,
  LeadInquiry,
  PageSectionsData,
  ProblemSolutionItem,
  ProblemLead
} from '../types';
import { fallbackPageSections } from '../utils/fallbackData';
import { 
  verifyAdminPassword, 
  fetchAdminData, 
  getCachedAdminToken, 
  setCachedAdminToken,
  clearCachedAdminToken 
} from '../utils/api';

// Admin Sub-Views
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminWebsite } from './admin/AdminWebsite';
import { AdminServices } from './admin/AdminServices';
import { AdminProblemSolutions } from './admin/AdminProblemSolutions';
import { AdminProblemLeads } from './admin/AdminProblemLeads';
import { AdminUnpublished } from './admin/AdminUnpublished';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminRequestsAndBookings } from './admin/AdminRequestsAndBookings';
import { AdminInquiries } from './admin/AdminInquiries';
import { AdminContent } from './admin/AdminContent';
import { AdminMedia } from './admin/AdminMedia';
import { AdminBusiness } from './admin/AdminBusiness';
import { AdminSettings } from './admin/AdminSettings';
import { AdminPageSectionManager } from './admin/AdminPageSectionManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  services?: ServiceItem[];
  settings?: SiteSettings;
  onRefreshData?: () => void;
  isFullScreenPage?: boolean;
}

export function AdminPanel({
  isOpen,
  onClose,
  services,
  settings,
  onRefreshData,
  isFullScreenPage = false
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Active Navigation
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'website' | 'services' | 'problems-solutions' | 'problem-leads' | 'unpublished' | 'customers' | 'requests' | 'bookings' | 'inquiries' | 'content' | 'media' | 'business' | 'settings' |
    'page-how-it-works' | 'page-why-on-site' | 'page-who-we-serve' | 'page-bulk-windows' | 'page-technician' | 'page-faq' | 'page-contact'
  >('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Loaded full admin dataset
  const [adminBookings, setAdminBookings] = useState<ServiceRequest[]>([]);
  const [adminInquiries, setAdminInquiries] = useState<LeadInquiry[]>([]);
  const [adminServices, setAdminServices] = useState<ServiceItem[]>(services || []);
  const [adminProblemSolutions, setAdminProblemSolutions] = useState<ProblemSolutionItem[]>([]);
  const [adminProblemLeads, setAdminProblemLeads] = useState<ProblemLead[]>([]);
  const [adminSettings, setAdminSettings] = useState<SiteSettings>(settings as any);
  const [adminAreas, setAdminAreas] = useState<string[]>([]);
  const [adminFaqs, setAdminFaqs] = useState<FAQItem[]>([]);
  const [adminCases, setAdminCases] = useState<CaseStudyItem[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<Customer[]>([]);
  const [adminMedia, setAdminMedia] = useState<MediaItem[]>([]);
  const [adminLogs, setAdminLogs] = useState<ActivityLog[]>([]);
  const [adminWebsiteContent, setAdminWebsiteContent] = useState<WebsiteContent | undefined>();
  const [adminCategories, setAdminCategories] = useState<CategoryItem[]>([]);
  const [adminPageSections, setAdminPageSections] = useState<PageSectionsData>(fallbackPageSections);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch full dataset
  const loadFullAdminData = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchAdminData();
      if (data.bookings) setAdminBookings(data.bookings);
      if ((data as any).inquiries) setAdminInquiries((data as any).inquiries);
      if (data.services) setAdminServices(data.services);
      if ((data as any).problemSolutions) setAdminProblemSolutions((data as any).problemSolutions);
      if ((data as any).problemLeads) setAdminProblemLeads((data as any).problemLeads);
      if (data.settings) setAdminSettings(data.settings);
      if (data.serviceAreas) setAdminAreas(data.serviceAreas);
      if (data.faqs) setAdminFaqs(data.faqs);
      if (data.caseStudies) setAdminCases(data.caseStudies);
      if (data.customers) setAdminCustomers(data.customers);
      if (data.media) setAdminMedia(data.media);
      if (data.activityLogs) setAdminLogs(data.activityLogs);
      if (data.websiteContent) setAdminWebsiteContent(data.websiteContent);
      if (data.categories) setAdminCategories(data.categories);
      if ((data as any).pageSections) setAdminPageSections((data as any).pageSections);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen || isFullScreenPage) {
      loadFullAdminData();
    }
  }, [isOpen, isFullScreenPage]);

  const handleLogout = () => {
    clearCachedAdminToken();
    onClose();
  };

  const handleTabChange = (tab: any, subTab: string = 'all') => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not open and not full screen page, don't render
  if (!isOpen && !isFullScreenPage) return null;

  // 2. AUTHENTICATED STATE: FULL DARK SKEUOMORPHIC CMS EXPERIENCE
  const pendingRequestsCount = adminBookings.filter(b => b.status === 'NEW' || b.status === 'pending').length;
  const confirmedCount = adminBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'confirmed').length;
  const pendingProblemLeadsCount = adminProblemLeads.filter(l => l.status === 'NEW').length;
  const unpublishedCount = (adminServices || []).filter(s => s.status === 'inactive' || (s as any).status === 'unpublished' || s.status === 'UNPUBLISHED').length +
    (adminFaqs || []).filter(f => f.status === 'inactive' || f.status === 'unpublished' || f.status === 'UNPUBLISHED').length +
    (adminCases || []).filter(c => c.status === 'inactive' || c.status === 'unpublished' || c.status === 'UNPUBLISHED').length +
    (adminProblemSolutions || []).filter(p => p.status === 'inactive' || p.status === 'unpublished' || p.status === 'UNPUBLISHED').length;

  return (
    <div className={`fixed inset-0 z-50 flex bg-[#030712] text-slate-100 font-sans overflow-hidden ${
      isFullScreenPage ? 'relative' : ''
    }`}>
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 skeuo-panel border-r border-slate-800/80 justify-between shrink-0 rounded-none relative">
        {/* Brand & Technician Profile */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl skeuo-btn text-blue-400 font-mono font-bold">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-mono tracking-tight">TechFix CMS</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="skeuo-led-emerald"></span>
                <span className="text-[10px] text-slate-400 font-mono">Safiullah • Peshawar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'dashboard' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500 text-white font-bold font-mono">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('website')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'website' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Website Config</span>
          </button>

          {/* DEDICATED SECTION: 8 WEBSITE PAGES & CONTENT (CMS) */}
          <div className="pt-3 pb-1 border-t border-slate-800/80 mt-2">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
              <span>Pages & CMS Content</span>
              <span className="text-[9px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40 font-mono">8 Pages</span>
            </div>
          </div>

          <button
            onClick={() => handleTabChange('services')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'services' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-blue-400" />
              <span>Services</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.services !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.services !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-how-it-works')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-how-it-works' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>How It Works</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['how-it-works'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.['how-it-works'] !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-why-on-site')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-why-on-site' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Why On-Site</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['why-on-site'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.['why-on-site'] !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-who-we-serve')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-who-we-serve' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-purple-400" />
              <span>Who We Serve</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['who-we-serve'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.['who-we-serve'] !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-bulk-windows')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-bulk-windows' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Bulk Windows</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['bulk-windows'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.['bulk-windows'] !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('problems-solutions')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'problems-solutions' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>Problems & Solutions</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['problems-solutions'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.['problems-solutions'] !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-technician')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-technician' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>About (Technician)</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.technician !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.technician !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-faq')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-faq' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-pink-400" />
              <span>FAQ</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.faq !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.faq !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          <button
            onClick={() => handleTabChange('page-contact')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'page-contact' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              <span>Contact</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.contact !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={adminPageSections?.pageStatuses?.contact !== 'unpublished' ? 'Published' : 'Unpublished'}></span>
          </button>

          {/* UNPUBLISHED & OPERATIONS */}
          <div className="pt-3 pb-1 border-t border-slate-800/80 mt-2">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Operations & Requests
            </div>
          </div>

          <button
            onClick={() => handleTabChange('unpublished')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'unpublished' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-amber-300 hover:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Archive className="h-4 w-4 text-amber-400" />
              <span>Unpublished Items</span>
            </div>
            {unpublishedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                {unpublishedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('customers')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'customers' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Customers ({adminCustomers.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('requests')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'requests' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4" />
              <span>Service Requests</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] skeuo-badge text-blue-300 font-mono font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('bookings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'bookings' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="h-4 w-4" />
              <span>Bookings</span>
            </div>
            {confirmedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] skeuo-badge text-purple-300 font-mono font-bold">
                {confirmedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('inquiries')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'inquiries' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-emerald-400" />
              <span>Lead Inquiries</span>
            </div>
            {adminInquiries.filter(i => i.status === 'NEW').length > 0 ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                {adminInquiries.filter(i => i.status === 'NEW').length}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">
                {adminInquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('problem-leads')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'problem-leads' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4 text-cyan-400" />
              <span>Problem Leads CRM</span>
            </div>
            {pendingProblemLeadsCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                {pendingProblemLeadsCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">
                {adminProblemLeads.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('content')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'content' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Content (Bio, FAQ)</span>
          </button>

          <button
            onClick={() => handleTabChange('media')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'media' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => handleTabChange('business')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'business' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Business & Areas</span>
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
              activeTab === 'settings' 
                ? 'skeuo-btn-primary text-white shadow-lg' 
                : 'skeuo-btn text-slate-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 skeuo-btn hover:text-white transition-colors font-mono cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 text-cyan-400" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 skeuo-btn hover:text-rose-200 transition-colors cursor-pointer font-mono"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#030712]">
        {/* Top Header Bar */}
        <header className="h-16 px-6 skeuo-panel rounded-none border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl skeuo-btn text-slate-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="skeuo-led-blue"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold hidden sm:inline">
                Peshawar On-Site Computer Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadFullAdminData}
              disabled={isLoadingData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl skeuo-btn text-xs text-slate-200 hover:text-white transition-colors cursor-pointer font-mono"
              title="Refresh Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl skeuo-btn text-cyan-300 text-xs font-semibold hover:text-white transition-colors cursor-pointer font-mono"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
            <div className="w-64 bg-slate-950 p-4 space-y-2 border-r border-slate-800 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                  <span className="font-bold text-white text-sm font-mono">CMS Menu</span>
                  <button onClick={() => setIsMobileNavOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <button onClick={() => handleTabChange('dashboard')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Dashboard</button>
                <button onClick={() => handleTabChange('website')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Website Config</button>

                <div className="pt-2 pb-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 font-bold uppercase px-2">CMS Pages</div>
                <button onClick={() => handleTabChange('services')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>1. Services</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.services !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-how-it-works')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>2. How It Works</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['how-it-works'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-why-on-site')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>3. Why On-Site</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['why-on-site'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-who-we-serve')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>4. Who We Serve</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['who-we-serve'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-bulk-windows')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>5. Bulk Windows</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['bulk-windows'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('problems-solutions')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>6. Problems & Solutions</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.['problems-solutions'] !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-technician')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>7. About (Technician)</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.technician !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-faq')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>8. FAQ</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.faq !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
                <button onClick={() => handleTabChange('page-contact')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>9. Contact</span>
                  <span className={`w-2 h-2 rounded-full ${adminPageSections?.pageStatuses?.contact !== 'unpublished' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>

                <div className="pt-2 pb-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 font-bold uppercase px-2">Operations</div>
                <button onClick={() => handleTabChange('unpublished')} className="w-full text-left p-2 rounded text-xs text-amber-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>Unpublished Items</span>
                  {unpublishedCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono">
                      {unpublishedCount}
                    </span>
                  )}
                </button>
                <button onClick={() => handleTabChange('customers')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Customers</button>
                <button onClick={() => handleTabChange('requests')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Requests</button>
                <button onClick={() => handleTabChange('bookings')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Bookings</button>
                <button onClick={() => handleTabChange('inquiries')} className="w-full text-left p-2 rounded text-xs text-emerald-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>Lead Inquiries</span>
                  {adminInquiries.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono">
                      {adminInquiries.length}
                    </span>
                  )}
                </button>
                <button onClick={() => handleTabChange('problem-leads')} className="w-full text-left p-2 rounded text-xs text-cyan-300 hover:bg-slate-900 flex items-center justify-between">
                  <span>Problem Leads CRM</span>
                  {pendingProblemLeadsCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono">
                      {pendingProblemLeadsCount}
                    </span>
                  )}
                </button>
                <button onClick={() => handleTabChange('content')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Content</button>
                <button onClick={() => handleTabChange('media')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Media</button>
                <button onClick={() => handleTabChange('business')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Business</button>
                <button onClick={() => handleTabChange('settings')} className="w-full text-left p-2 rounded text-xs text-slate-300 hover:bg-slate-900">Settings</button>
              </div>

              <button onClick={handleLogout} className="w-full p-2 text-xs text-red-400 text-left">Logout</button>
            </div>
            <div className="flex-1" onClick={() => setIsMobileNavOpen(false)} />
          </div>
        )}

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                bookings={adminBookings}
                activityLogs={adminLogs}
                onNavigateTab={handleTabChange}
                onOpenNewBookingModal={() => handleTabChange('requests')}
              />
            )}

            {activeTab === 'website' && (
              <AdminWebsite
                initialContent={adminWebsiteContent}
                settings={adminSettings}
                onSaved={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'services' && (
              <AdminServices
                services={adminServices}
                categories={adminCategories}
                pageSections={adminPageSections}
                defaultSubTab={activeSubTab}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'page-how-it-works' && (
              <AdminPageSectionManager
                pageKey="how-it-works"
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'page-why-on-site' && (
              <AdminPageSectionManager
                pageKey="why-on-site"
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'page-who-we-serve' && (
              <AdminPageSectionManager
                pageKey="who-we-serve"
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'page-bulk-windows' && (
              <AdminPageSectionManager
                pageKey="bulk-windows"
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'page-technician' && (
              <AdminPageSectionManager
                pageKey="technician"
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'problems-solutions' && (
              <AdminProblemSolutions
                problemSolutions={adminProblemSolutions}
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'problem-leads' && (
              <AdminProblemLeads
                leads={adminProblemLeads}
                settings={adminSettings}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'page-faq' && (
              <AdminPageSectionManager
                pageKey="faq"
                pageSections={adminPageSections}
                faqs={adminFaqs}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'page-contact' && (
              <AdminPageSectionManager
                pageKey="contact"
                pageSections={adminPageSections}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToPage={(p) => {
                  window.location.hash = p;
                }}
              />
            )}

            {activeTab === 'unpublished' && (
              <AdminUnpublished
                services={adminServices}
                faqs={adminFaqs}
                caseStudies={adminCases}
                problemSolutions={adminProblemSolutions}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
                onNavigateToTab={handleTabChange}
              />
            )}

            {activeTab === 'customers' && (
              <AdminCustomers
                customers={adminCustomers}
                bookings={adminBookings}
                serviceAreas={adminAreas}
                onRefresh={loadFullAdminData}
              />
            )}

            {activeTab === 'requests' && (
              <AdminRequestsAndBookings
                bookings={adminBookings}
                settings={adminSettings}
                mode="requests"
                initialSubTab={activeSubTab}
                serviceAreas={adminAreas}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'bookings' && (
              <AdminRequestsAndBookings
                bookings={adminBookings}
                settings={adminSettings}
                mode="bookings"
                initialSubTab={activeSubTab}
                serviceAreas={adminAreas}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'inquiries' && (
              <AdminInquiries
                inquiries={adminInquiries}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'content' && (
              <AdminContent
                settings={adminSettings}
                faqs={adminFaqs}
                caseStudies={adminCases}
                onOpenMediaTab={() => handleTabChange('media')}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'media' && (
              <AdminMedia
                media={adminMedia}
                technicianPhoto={adminSettings.technicianPhoto}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'business' && (
              <AdminBusiness
                settings={adminSettings}
                serviceAreas={adminAreas}
                onRefresh={() => {
                  loadFullAdminData();
                  onRefreshData();
                }}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettings
                settings={adminSettings || settings}
                onRefresh={() => {
                  loadFullAdminData();
                  if (onRefreshData) onRefreshData();
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
