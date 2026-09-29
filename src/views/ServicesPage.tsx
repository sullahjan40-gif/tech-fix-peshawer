import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { ServicesList } from '../components/ServicesList';
import { DeepDiveWindows } from '../components/DeepDiveWindows';
import { DeepDiveSSD } from '../components/DeepDiveSSD';
import { DeepDiveDataRecovery } from '../components/DeepDiveDataRecovery';
import { DeepDiveBSOD } from '../components/DeepDiveBSOD';
import { ServiceItem, SiteSettings, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { Wrench, CheckCircle, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface ServicesPageProps {
  services: ServiceItem[];
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function ServicesPage({ services, settings, pageSections, onNavigate }: ServicesPageProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Check if entire Services page is unpublished
  if (pageSections?.pageStatuses?.services === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Services & Pricing"
        pageKey="services"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.services;
  const pageTitle = pageMeta?.title || "Computer Diagnostic & On-Site Repair Services";
  const pageSubtitle = pageMeta?.subtitle || "Professional computer diagnostics, clean operating system deployments, storage upgrades, and data recovery assistance delivered directly to your home, university hostel, or office in Peshawar.";
  const pageBadge = pageMeta?.badge || "ON-SITE SERVICE DIRECTORY";

  // Filter out any inactive services
  const publishedServices = services.filter((s) => s.status !== 'inactive');

  const scrollToDeepDive = (serviceKey: string) => {
    const el = document.getElementById(serviceKey);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBook = (serviceName: string) => {
    onNavigate('contact', { service: serviceName });
  };

  const filteredServices = publishedServices.filter((s) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'os') return s.key.includes('windows') || s.key.includes('os');
    if (filterCategory === 'hardware') return s.key.includes('ssd') || s.key.includes('hardware');
    if (filterCategory === 'diagnostics') return s.key.includes('recovery') || s.key.includes('blue-screen') || s.key.includes('bsod');
    if (filterCategory === 'commercial') return s.key.includes('bulk') || s.key.includes('office');
    return true;
  });

  const connectorLinks = [
    {
      page: 'how-it-works',
      title: 'How It Works',
      description: 'Review our 4-step on-site protocol: from online contact and fixed quote to live repair and verification.',
      badge: 'Step-by-Step'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site vs Local Shops',
      description: 'Discover why avoiding computer bazaar shops protects your confidential files and saves 2-3 days of downtime.',
      badge: '100% Privacy'
    },
    {
      page: 'technician',
      title: 'Meet Your Technician',
      description: 'Learn about Safiullah, a Computer Science & Cybersecurity student with 5+ years of practical diagnostics.',
      badge: 'CS & Cyber'
    },
    {
      page: 'faq',
      title: 'Services FAQ',
      description: 'Answers about base visit fees (Rs. 500), hardware procurement, SSD warranties, and emergency visits.',
      badge: 'Help & Rates'
    },
    {
      page: 'bulk-windows',
      title: 'Bulk Deployment for Labs',
      description: 'Need Windows 10/11 installed on 5 to 50+ PCs for a school, academy, or office? See dedicated bulk service.',
      badge: 'Institutions'
    },
    {
      page: 'contact',
      title: 'Book an Appointment',
      description: 'Ready for service? Send your device details and address for fast scheduling across Peshawar.',
      badge: 'Schedule Now'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Services', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
            <Wrench className="h-3 w-3 text-blue-400" />
            <span>{pageBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            {pageSubtitle}
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            <button
              onClick={() => setFilterCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All Services ({publishedServices.length})
            </button>
            <button
              onClick={() => setFilterCategory('os')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filterCategory === 'os'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Windows & OS
            </button>
            <button
              onClick={() => setFilterCategory('hardware')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filterCategory === 'hardware'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              SSD & Upgrades
            </button>
            <button
              onClick={() => setFilterCategory('diagnostics')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filterCategory === 'diagnostics'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              BSOD & Recovery
            </button>
            <button
              onClick={() => setFilterCategory('commercial')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filterCategory === 'commercial'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Offices & Labs
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <ServicesList
        services={filteredServices.length > 0 ? filteredServices : services}
        onBookService={handleBook}
        onViewDeepDive={scrollToDeepDive}
      />

      {/* Technical Deep Dives */}
      <div className="space-y-12 mt-12">
        <div id="windows-installation">
          <DeepDiveWindows onBookThis={() => handleBook('Windows Installation & Setup')} />
        </div>

        <div id="os-migration">
          <DeepDiveSSD onUpgradeToSSD={() => handleBook('OS Migration (HDD to SSD)')} />
        </div>

        <div id="data-recovery">
          <DeepDiveDataRecovery
            settings={settings}
            onBookRecovery={() => handleBook('Data Recovery Assistance')}
          />
        </div>

        <div id="blue-screen">
          <DeepDiveBSOD onBookBSOD={() => handleBook('Blue Screen (BSOD) Diagnostic')} />
        </div>
      </div>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="Services"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
