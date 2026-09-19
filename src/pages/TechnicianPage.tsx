import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { TechnicianTrust } from '../components/TechnicianTrust';
import { SiteSettings, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Terminal, 
  Award, 
  CheckCircle2, 
  HeartHandshake, 
  Cpu,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

interface TechnicianPageProps {
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function TechnicianPage({ settings, pageSections, onNavigate }: TechnicianPageProps) {
  // Check if entire Technician page is unpublished
  if (pageSections?.pageStatuses?.technician === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Technician Profile"
        pageKey="technician"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.technician;
  const pageTitle = pageMeta?.title || `Meet Your Technician: ${settings.technicianName}`;
  const pageSubtitle = pageMeta?.subtitle || "Computer Science and Cybersecurity learner at the University of Agriculture, Peshawar, bringing over 5 years of practical Windows operating system troubleshooting, hardware diagnostics, and ethical computing standards to your doorstep.";
  const pageBadge = pageMeta?.badge || "PRIMARY TECHNICIAN PROFILE";

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello Safiullah! I read your profile on the website and would like to consult with you about my computer."
  );

  const defaultEthicalCodes = [
    {
      title: 'Zero Snooping & Absolute Confidentiality',
      desc: 'Your personal photos, academic projects, browser cookies, and financial documents remain strictly private. I diagnose and service your computer right before your eyes.',
      icon: ShieldCheck,
      status: 'published'
    },
    {
      title: 'Technical Honesty: No Fabricated Faults',
      desc: 'If a problem is caused by a loose ribbon cable or outdated driver, I tell you immediately. I never invent nonexistent motherboard or chipset failures to inflate fees.',
      icon: HeartHandshake,
      status: 'published'
    },
    {
      title: 'Root-Cause Diagnostics Over Blind Formatting',
      desc: 'Many local technicians blindly format your drive when Windows crashes. I inspect minidump BSOD crash logs, test RAM blocks, and isolate hardware errors to solve the real cause.',
      icon: Terminal,
      status: 'published'
    },
    {
      title: 'Clear, Respectful Communication',
      desc: 'Explaining technical concepts in polite, plain Pashto, Urdu, or English so you understand what happened and how to avoid recurring issues.',
      icon: Award,
      status: 'published'
    }
  ];

  const rawEthicalCodes = (pageMeta?.ethicalCodes && pageMeta.ethicalCodes.length > 0)
    ? pageMeta.ethicalCodes.map((c: any) => ({
        ...c,
        icon: ShieldCheck
      }))
    : defaultEthicalCodes;

  const ethicalCodes = rawEthicalCodes.filter((c: any) => c.status !== 'unpublished');

  const connectorLinks = [
    {
      page: 'why-on-site',
      title: 'Why On-Site Is Safer',
      description: 'See why getting your computer fixed in your own presence is safer than leaving it at a shop.',
      badge: 'Privacy'
    },
    {
      page: 'how-it-works',
      title: 'How It Works',
      description: 'Review our 4-step on-site process: from online scheduling to testing and honest payment.',
      badge: 'Process'
    },
    {
      page: 'services',
      title: 'Explore Technical Services',
      description: 'Check transparent pricing for Windows installations, SSD upgrades, and BSOD repairs.',
      badge: 'Services'
    },
    {
      page: 'who-we-serve',
      title: 'Who We Support',
      description: 'Discover how Safiullah supports university students, home users, clinics, and offices.',
      badge: 'Clients'
    },
    {
      page: 'faq',
      title: 'Technician FAQ',
      description: 'Answers about student credentials, visit fees, warranty coverage, and tools.',
      badge: 'FAQ'
    },
    {
      page: 'contact',
      title: 'Book a Consultation',
      description: 'Schedule an on-site visit or send a direct WhatsApp message to Safiullah.',
      badge: 'Contact'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Technician', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-mono font-medium text-amber-300 mb-3">
            <UserCheck className="h-3 w-3 text-amber-400" />
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

      {/* Main Technician Trust Component */}
      <TechnicianTrust
        settings={settings}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* Detailed Technical Philosophy & Ethics */}
      <section className="py-16 bg-slate-950/80 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              PROFESSIONAL ETHICAL CHARTER
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              The 4 Standards of My Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Unlike generic street technicians who view computers as anonymous boxes, my approach is grounded in academic discipline, technical rigor, and respect for the customer.
            </p>
          </div>

          {ethicalCodes.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 text-center text-xs text-slate-400">
              Ethical standards charter is currently being updated by the administrator.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ethicalCodes.map((code, idx) => {
                const Icon = code.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-bold text-white">
                          {code.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {code.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-amber-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Personal Commitment</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Direct Chat with Safiullah */}
          <div className="mt-12 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white">Have a specific question about your machine?</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                You can reach out directly on WhatsApp to describe your symptom before scheduling a visit.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message Safiullah</span>
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Service</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="Technician"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
