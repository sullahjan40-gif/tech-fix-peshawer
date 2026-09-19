import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { OnSiteAdvantage } from '../components/OnSiteAdvantage';
import { SiteSettings, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Car, 
  Clock, 
  ThumbsUp,
  FileCheck
} from 'lucide-react';

interface WhyOnSitePageProps {
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function WhyOnSitePage({ settings, pageSections, onNavigate }: WhyOnSitePageProps) {
  // Check if entire Why On-Site page is unpublished
  if (pageSections?.pageStatuses?.['why-on-site'] === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Why On-Site"
        pageKey="why-on-site"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.['why-on-site'];
  const pageTitle = pageMeta?.title || "Why Choose On-Site Service Over a Repair Shop?";
  const pageSubtitle = pageMeta?.subtitle || "Taking your computer to a crowded repair shop in Saddar or City Bazaar exposes your private data, consumes hours in traffic, and leaves you without your machine for days. On-site computer repair changes that completely.";
  const pageBadge = pageMeta?.badge || "TRANSPARENCY & PEACE OF MIND";

  const defaultPillars = [
    {
      title: 'Zero Private Data Snooping',
      desc: 'We never open personal picture galleries, browser history, WhatsApp folders, or financial documents. You sit right beside the computer and observe every diagnostic step.',
      icon: Eye,
      status: 'published'
    },
    {
      title: 'No Risk of Swapped Hardware',
      desc: 'In bazaar shops, unscrupulous helpers occasionally swap original RAM sticks or SSDs with degraded units. With on-site service, your machine never leaves your room or desk.',
      icon: ShieldCheck,
      status: 'published'
    },
    {
      title: 'Zero Transit Shock or Hinge Damage',
      desc: 'Carrying desktop towers and fragile laptops through Peshawar traffic, potholes, or rain frequently loosens heat sinks, snaps ribbon cables, or cracks screens. On-site prevents all travel damage.',
      icon: Car,
      status: 'published'
    },
    {
      title: 'Immediate Real-World Testing',
      desc: 'Test your machine on your exact home or office Wi-Fi, with your specific printer, monitor cables, and sound systems before the technician departs.',
      icon: CheckCircle2,
      status: 'published'
    }
  ];

  const rawPillars = (pageMeta?.pillars && pageMeta.pillars.length > 0) ? pageMeta.pillars.map((p: any) => ({
    ...p,
    icon: ShieldCheck
  })) : defaultPillars;
  const privacyPillars = rawPillars.filter((p: any) => p.status !== 'unpublished');

  const connectorLinks = [
    {
      page: 'who-we-serve',
      title: 'Who We Serve',
      description: 'Discover how on-site visits benefit university hostel students, busy families, and medical clinics.',
      badge: 'Clients'
    },
    {
      page: 'technician',
      title: 'Meet Your Technician',
      description: 'Review Safiullah’s credentials, background in Computer Science, and cybersecurity ethics.',
      badge: 'Credentials'
    },
    {
      page: 'how-it-works',
      title: 'How It Works',
      description: 'See the 4-step appointment process: clear communication, fixed estimates, and live repair.',
      badge: 'Process'
    },
    {
      page: 'services',
      title: 'Explore All Services',
      description: 'View full menu of Windows setups, SSD migration, BSOD isolation, and data recovery.',
      badge: 'Services'
    },
    {
      page: 'faq',
      title: 'Read the FAQ',
      description: 'Direct answers to questions regarding the Rs. 500 visit fee, privacy rules, and travel areas.',
      badge: 'Questions'
    },
    {
      page: 'contact',
      title: 'Book an On-Site Visit',
      description: 'Request a visit at your home, campus hostel, or commercial office in Peshawar.',
      badge: 'Book Visit'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Why On-Site', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-mono font-medium text-cyan-300 mb-3">
            <ShieldCheck className="h-3 w-3 text-cyan-400" />
            <span>{pageBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Side by Side Comparison Component */}
      <OnSiteAdvantage
        customShopSteps={pageMeta?.shopSteps}
        customOurSteps={pageMeta?.ourSteps}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* Core Privacy & Security Deep Dive */}
      <section className="py-16 bg-slate-950/80 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              CYBERSECURITY & CONFIDENTIALITY
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Our 4 Pillars of Data Confidentiality
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              As a Computer Science & Cybersecurity practitioner, Safiullah adheres to professional data protection principles that traditional shop apprentices often ignore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {privacyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-white">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Strict Ethical Protocol</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Guarantee Strip */}
          <div className="mt-12 rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 mb-1">
                <FileCheck className="h-4 w-4" />
                <span>FAIR DIAGNOSTIC COMMITMENT</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Standard Rs. 500 Base Diagnostic & Visit Fee
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                We agree on exact service costs before taking action. If a problem requires hardware replacement, you only pay the agreed repair price or the transparent visit fee if you choose not to proceed.
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              Schedule an On-Site Visit
            </button>
          </div>

        </div>
      </section>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="Why On-Site"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
