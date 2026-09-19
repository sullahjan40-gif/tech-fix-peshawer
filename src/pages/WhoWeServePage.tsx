import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { AudienceSection } from '../components/AudienceSection';
import { SiteSettings, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  Users, 
  GraduationCap, 
  Home, 
  Building2, 
  CheckCircle2, 
  Code2, 
  ShieldCheck, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

interface WhoWeServePageProps {
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function WhoWeServePage({ settings, pageSections, onNavigate }: WhoWeServePageProps) {
  // Check if entire Who We Serve page is unpublished
  if (pageSections?.pageStatuses?.['who-we-serve'] === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Who We Serve"
        pageKey="who-we-serve"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.['who-we-serve'];
  const pageTitle = pageMeta?.title || "Who We Serve in Peshawar";
  const pageSubtitle = pageMeta?.subtitle || "Whether you are a university student rushing to meet a project deadline, a family needing a dependable home computer, or an office requiring fast workstation maintenance, our on-site service adapts directly to your requirements.";
  const pageBadge = pageMeta?.badge || "CUSTOMIZED ON-SITE SUPPORT";
  const studentHighlights = [
    'University of Agriculture Peshawar & University of Peshawar hostellers',
    'UET Peshawar, IM|Sciences, Khyber Medical College, and Islamia College students',
    'Semester project & thesis deadlines: zero wait time, same-day fix',
    'Developer setup: Python, C++, Java, VS Code, Git, Android Studio, Dev-C++',
    'Fair, student-conscious pricing structure'
  ];

  const officeHighlights = [
    'Doctor clinics & medical laboratories: patient management & billing PCs',
    'Distribution offices & accounting departments: quick QuickBooks / Excel fixes',
    'Network printer sharing across multiple office computers',
    'Scheduled weekend or evening visits with zero workday disruption',
    'Formal receipts, invoices, and diagnostic summaries for company records'
  ];

  const connectorLinks = [
    {
      page: 'bulk-windows',
      title: 'Bulk Windows Deployment',
      description: 'Need multiple PCs set up for a school computer lab, academy, or office? See dedicated bulk service.',
      badge: '5-50+ PCs'
    },
    {
      page: 'services',
      title: 'View Services & Pricing',
      description: 'Transparent pricing for Windows setups, SSD migration, and hardware diagnostics.',
      badge: 'Menu'
    },
    {
      page: 'technician',
      title: 'Meet Safiullah',
      description: 'Learn about Safiullah’s Computer Science background and university credentials.',
      badge: 'Technician'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site Is Safer',
      description: 'Read how in-home visits protect personal family files and avoid traffic.',
      badge: 'Privacy'
    },
    {
      page: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Questions about hostel visits, payment methods, and hardware parts.',
      badge: 'FAQ'
    },
    {
      page: 'contact',
      title: 'Book a Service Visit',
      description: 'Schedule your appointment at your campus hostel, family residence, or workplace.',
      badge: 'Book Now'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Who We Serve', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-3">
            <Users className="h-3 w-3 text-indigo-400" />
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

      {/* Main Audience Overview Component */}
      <AudienceSection
        customAudiences={pageMeta?.audiences}
        onBookForAudience={(category) => onNavigate('contact', { service: category })}
      />

      {/* Deep Segment Focus */}
      <section className="py-16 bg-slate-950/70 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Campus & Hostel Focus */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-blue-950/20 to-slate-900/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">University & Hostel Students</h3>
                    <p className="text-xs text-blue-400 font-mono">Hostel Doorstep Diagnostic Support</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Taking a slow or crashing laptop to an off-campus shop often means losing it for 3-4 days right before midterm submissions or final year presentations. As a fellow student at UoA, Safiullah understands the urgency and provides on-site assistance directly to university accommodation and student apartments.
                </p>

                <div className="space-y-2.5 mb-6">
                  {studentHighlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('contact', { service: 'Student Laptop Support' })}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600/90 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <span>Book Student Support</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Workplace & Clinic Focus */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-purple-950/20 to-slate-900/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Offices, Clinics & Small Businesses</h3>
                    <p className="text-xs text-purple-400 font-mono">Zero Business Disruption</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  Commercial workstations cannot afford downtime. We troubleshoot accounting PCs, configure shared network printers, set up automated backup drives, and clean up sluggish systems during your quiet hours or over weekends.
                </p>

                <div className="space-y-2.5 mb-6">
                  {officeHighlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('contact', { service: 'Office Workstation Support' })}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600/90 py-2.5 text-xs font-bold text-white hover:bg-purple-600 transition-colors cursor-pointer"
              >
                <span>Book Office Maintenance</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="Who We Serve"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
