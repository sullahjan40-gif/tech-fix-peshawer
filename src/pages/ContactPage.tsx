import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { BookingForm } from '../components/BookingForm';
import { SiteSettings, ServiceItem, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { checkBookingStatus } from '../utils/api';
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  Clock, 
  MapPin, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ShieldCheck,
  Building2,
  Send
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';
import { CustomerInquiryModal } from '../components/CustomerInquiryModal';

interface ContactPageProps {
  settings: SiteSettings;
  services: ServiceItem[];
  serviceAreas: string[];
  pageSections?: PageSectionsData;
  initialService?: string;
  initialProblem?: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ContactPage({
  settings,
  services,
  serviceAreas,
  pageSections,
  initialService = '',
  initialProblem = '',
  onNavigate
}: ContactPageProps) {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  // Booking Tracker State
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Check if entire Contact page is unpublished
  if (pageSections?.pageStatuses?.contact === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Contact & Booking"
        pageKey="contact"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.contact;
  const pageTitle = pageMeta?.title || "Contact & Schedule On-Site Service";
  const pageSubtitle = pageMeta?.subtitle || "Reach out directly to book an appointment across Peshawar. Fill out the service request form below for automated tracking or message directly on WhatsApp for an immediate response.";
  const pageBadge = pageMeta?.badge || "DISPATCH & ONLINE BOOKING";

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello Safiullah! I want to schedule an on-site computer visit in Peshawar."
  );

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;

    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const data = await checkBookingStatus(trackId.trim());
      setTrackResult(data);
    } catch (err: any) {
      setTrackError(err.message || 'No booking found with this Reference ID.');
    } finally {
      setTrackLoading(false);
    }
  };

  const defaultPeshawarAreas = [
    { name: 'University Town', speed: '20 - 40 Mins', note: 'Fast Dispatch', status: 'published' },
    { name: 'Hayatabad (Phases 1 - 7)', speed: '30 - 50 Mins', note: 'Daily Coverage', status: 'published' },
    { name: 'Board Bazaar & Tehkal', speed: '20 - 35 Mins', note: 'Fast Dispatch', status: 'published' },
    { name: 'UoA / UoP Campus & Hostels', speed: '15 - 30 Mins', note: 'Direct Access', status: 'published' },
    { name: 'Saddar &Cantt Areas', speed: '30 - 50 Mins', note: 'Daily Coverage', status: 'published' },
    { name: 'Warsak Road & Surrounds', speed: '35 - 55 Mins', note: 'Scheduled Visits', status: 'published' },
    { name: 'Ring Road & Gulbahar', speed: '35 - 55 Mins', note: 'Daily Coverage', status: 'published' },
    { name: 'Dalazak Road & Kohat Road', speed: '45 - 65 Mins', note: 'Scheduled Visits', status: 'published' }
  ];

  const rawAreas = (pageMeta?.peshawarAreas && pageMeta.peshawarAreas.length > 0) ? pageMeta.peshawarAreas : defaultPeshawarAreas;
  const peshawarAreas = rawAreas.filter((a: any) => a.status !== 'unpublished');

  const connectorLinks = [
    {
      page: 'services',
      title: 'Review All Services',
      description: 'Check transparent costs and details for Windows setups, SSD upgrades, and BSOD repairs.',
      badge: 'Services'
    },
    {
      page: 'how-it-works',
      title: 'How It Works',
      description: 'Understand the 4-step workflow: appointment, arrival, live testing, and payment.',
      badge: 'Workflow'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site Is Safer',
      description: 'See why getting your PC fixed in your own presence eliminates risks and traffic.',
      badge: 'Privacy'
    },
    {
      page: 'technician',
      title: 'Meet Safiullah',
      description: 'Review your technician’s Computer Science and Cybersecurity background.',
      badge: 'Technician'
    },
    {
      page: 'who-we-serve',
      title: 'Who We Support',
      description: 'Learn how we adapt to university students, families, clinics, and offices.',
      badge: 'Clients'
    },
    {
      page: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Got questions about the Rs. 500 base visit fee, timings, or parts sourcing?',
      badge: 'FAQ'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Contact', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-1 text-xs font-mono font-medium text-rose-300 mb-3">
            <PhoneCall className="h-3 w-3 text-rose-400" />
            <span>{pageBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* BOOK ON-SITE SERVICE VISIT HERO BOX */}
        <div className="mb-12 rounded-3xl skeuo-panel p-6 sm:p-8 border border-amber-900/40 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span>BOOK ON-SITE SERVICE VISIT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Request an On-Site Technician Visit
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Tell us about your computer issue and choose a convenient on-site time. We will contact you promptly to confirm your appointment.
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('booking-form-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="skeuo-btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl cursor-pointer shrink-0"
            >
              <Calendar className="h-4 w-4" />
              <span>REQUEST A SERVICE</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Direct Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* WhatsApp Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 hover:border-emerald-400 hover:bg-emerald-950/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">
                  FASTEST
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                WhatsApp Chat
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct chat with Safiullah for instant symptom questions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-900/50 font-mono text-xs font-bold text-emerald-400">
              {settings.whatsappNumber}
            </div>
          </a>

          {/* Phone Call Card */}
          <a
            href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
            className="group rounded-2xl border border-blue-500/40 bg-blue-950/20 p-5 hover:border-blue-400 hover:bg-blue-950/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50">
                  CALL
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                Direct Telephone
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Speak directly regarding your computer failure.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-900/50 font-mono text-xs font-bold text-blue-400">
              {settings.phoneNumber}
            </div>
          </a>

          {/* Email Support Card */}
          <div className="group rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-5 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Direct Email & Queries
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Questions and quotes go straight to Safiullah's inbox.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cyan-900/50 flex flex-col gap-1.5">
              <span className="font-mono text-xs font-bold text-cyan-300 truncate" title={settings.email || 'ullahsafiullah117@gmail.com'}>
                {settings.email || 'ullahsafiullah117@gmail.com'}
              </span>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="mt-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 py-1.5 text-xs font-mono font-bold border border-cyan-500/40 cursor-pointer transition-colors"
              >
                <Send className="h-3 w-3" />
                <span>Submit Query</span>
              </button>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  MON - SAT
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Working Hours
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                9:00 AM – 8:00 PM • Peshawar & Surrounds
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Emergency visits by prior appointment
            </div>
          </div>

        </div>

        {/* Booking Status Lookup Tool */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 mb-12 backdrop-blur-xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 mb-1">
              <Search className="h-3.5 w-3.5" />
              <span>TRACK EXISTING SERVICE REQUEST</span>
            </div>
            <h3 className="text-lg font-bold text-white">Check Your Booking Status</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your booking ID (e.g. <span className="font-mono text-blue-300">REQ-12345</span>) generated when you submitted your request.
            </p>

            <form onSubmit={handleTrackSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="Enter Reference ID (e.g. REQ-XXXXX)"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {trackLoading ? 'Checking...' : 'Track'}
              </button>
            </form>

            {trackError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {trackResult && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">ID: {trackResult.id}</span>
                  <span className="rounded bg-emerald-900/60 px-2 py-0.5 font-mono text-[10px] text-emerald-300 uppercase font-bold border border-emerald-700/50">
                    {trackResult.status || 'CONFIRMED'}
                  </span>
                </div>
                <div className="text-slate-300">Customer: <strong className="text-white">{trackResult.fullName}</strong></div>
                <div className="text-slate-300">Service: <strong className="text-white">{trackResult.serviceRequired}</strong></div>
                <div className="text-slate-300">Area: <strong className="text-white">{trackResult.area}</strong></div>
                {trackResult.scheduledTime && (
                  <div className="text-emerald-400 font-mono">Scheduled Visit: {trackResult.scheduledTime}</div>
                )}
                {trackResult.adminNotes && (
                  <div className="text-slate-400 italic">Note from Safiullah: "{trackResult.adminNotes}"</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Interactive Booking Form Component */}
        <div id="booking-form-anchor">
          <BookingForm
            services={services}
            serviceAreas={serviceAreas}
            whatsappNumber={settings.whatsappNumber}
            initialService={initialService}
            initialProblem={initialProblem}
          />
        </div>

        {/* Peshawar Service Areas Coverage Section */}
        <section className="mt-16 py-12 rounded-3xl border border-slate-800 bg-slate-950/60 p-6 sm:p-10">
          <div className="max-w-3xl mb-8">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              LOCAL DISPATCH COVERAGE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Areas Served Across Peshawar
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct on-site computer service arrives at your home, hostel, or workplace across all major sectors of Peshawar:
            </p>
          </div>

          {peshawarAreas.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 text-center text-xs text-slate-400">
              Coverage areas list is currently being updated by the administrator. On-site dispatch is available across all primary areas of Peshawar.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {peshawarAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-[10px] text-blue-400">{area.note}</span>
                      <span className="font-mono text-[10px] text-emerald-400">{area.speed}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{area.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="Contact"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />

      <CustomerInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        whatsappNumber={settings.whatsappNumber}
        recipientEmail={settings.email || 'ullahsafiullah117@gmail.com'}
      />
    </div>
  );
}
