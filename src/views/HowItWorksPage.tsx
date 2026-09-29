import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { WorkflowSteps } from '../components/WorkflowSteps';
import { CaseStudies } from '../components/CaseStudies';
import { SiteSettings, CaseStudy, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  Clock, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Terminal, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HowItWorksPageProps {
  settings: SiteSettings;
  caseStudies: CaseStudy[];
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function HowItWorksPage({ settings, caseStudies, pageSections, onNavigate }: HowItWorksPageProps) {
  // Check if entire How It Works page is unpublished
  if (pageSections?.pageStatuses?.['how-it-works'] === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="How It Works"
        pageKey="how-it-works"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.['how-it-works'];
  const pageTitle = pageMeta?.title || "How Our On-Site Service Works";
  const pageSubtitle = pageMeta?.subtitle || "No packing your desktop in a car, no waiting days in a crowded bazaar repair shop. We follow a predictable 4-step workflow that keeps you informed and in control at all times.";
  const pageBadge = pageMeta?.badge || "TRANSPARENT ON-SITE PROTOCOL";

  const defaultToolkit = [
    {
      title: 'High-Speed Bootable Diagnostics',
      desc: 'Multiple Sandisk & Samsung 3.2 Gen 2 USB drives preloaded with official Microsoft Windows 10/11 installation images, WinPE recovery suites, and memory test kernels.',
      status: 'published'
    },
    {
      title: 'Hardware & Storage Diagnostic Tools',
      desc: 'S.M.A.R.T telemetry analyzers, bad-sector detectors, NVMe-to-USB-C enclosure rigs, and 2.5" SATA docking adapters for safe isolated data testing.',
      status: 'published'
    },
    {
      title: 'Precision Screwdrivers & ESD Gear',
      desc: 'iFixit precision bit set, anti-static grounding wristband, non-marring prying spudgers, and premium thermal interface compound (Arctic MX-4).',
      status: 'published'
    },
    {
      title: 'Offline Official Driver Cache',
      desc: 'Pre-downloaded official network, chipset, graphics, and audio drivers for Dell, HP, Lenovo, and Asus laptops to ensure instant offline functionality.',
      status: 'published'
    }
  ];

  const rawToolkit = (pageMeta?.toolkit && pageMeta.toolkit.length > 0) ? pageMeta.toolkit : defaultToolkit;
  const toolkitItems = rawToolkit.filter((item: any) => item.status !== 'unpublished');

  const connectorLinks = [
    {
      page: 'services',
      title: 'Explore Services & Pricing',
      description: 'Check transparent costs and turnaround times for Windows setups, SSD migration, and BSOD repairs.',
      badge: 'Service Catalog'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site vs Local Shops',
      description: 'See the detailed comparison: zero travel, same-day resolution, and 100% data confidentiality.',
      badge: 'Compare'
    },
    {
      page: 'technician',
      title: 'Meet Safiullah',
      description: 'Read about your technician’s Computer Science & Cybersecurity qualifications at University of Agriculture.',
      badge: 'Technician'
    },
    {
      page: 'who-we-serve',
      title: 'Who We Serve',
      description: 'See tailored solutions for university hostel students, home desktops, clinics, and offices in Peshawar.',
      badge: 'Audience'
    },
    {
      page: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Got questions about the Rs. 500 base visit fee, parts purchasing, or backup policies?',
      badge: 'Questions'
    },
    {
      page: 'contact',
      title: 'Schedule an Appointment',
      description: 'Ready to proceed? Fill our quick service form or send a WhatsApp message to book a visit.',
      badge: 'Book Now'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'How It Works', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-mono font-medium text-emerald-300 mb-3">
            <Clock className="h-3 w-3 text-emerald-400" />
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

      {/* 4 Steps Workflow Component */}
      <WorkflowSteps
        settings={settings}
        customSteps={pageMeta?.steps}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* On-Site Diagnostic Toolkit Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              PREPARATION & HARDWARE TOOLKIT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              What Safiullah Brings to Your Doorstep
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              On-site doesn't mean amateur. We arrive fully equipped with professional diagnostic gear, high-speed test rigs, and clean tools so repairs are finished in one visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolkitItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-mono font-bold text-blue-400 border border-blue-500/20">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified & Tested Before Dispatch</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Case Studies */}
      <CaseStudies
        caseStudies={caseStudies}
        onBookSimilar={(category) => onNavigate('contact', { service: category })}
      />

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="How It Works"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
