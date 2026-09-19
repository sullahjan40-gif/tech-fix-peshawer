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
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

interface AboutPageProps {
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function AboutPage({ settings, pageSections, onNavigate }: AboutPageProps) {
  // Check if entire About / Technician page is unpublished
  if (pageSections?.pageStatuses?.technician === 'unpublished' || pageSections?.pageStatuses?.about === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="About Safiullah"
        pageKey="about"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = (pageSections as any)?.about || pageSections?.technician;
  const pageTitle = pageMeta?.title || `About Safiullah — TechFix Peshawar`;
  const pageSubtitle = pageMeta?.subtitle || "Computer Science and Cybersecurity learner at the University of Agriculture, Peshawar, bringing over 5 years of practical Windows operating system troubleshooting, hardware diagnostics, and ethical computing standards to your doorstep.";
  const pageBadge = pageMeta?.badge || "MEET YOUR TECHNICIAN";

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
      page: 'problems-solutions',
      title: 'Problems & Solutions',
      description: 'Explore technical deep-dives for Windows installs, SSD upgrades, data recovery, and BSOD fixes.',
      badge: 'Solutions'
    },
    {
      page: 'services',
      title: 'Explore All Services',
      description: 'Check transparent pricing for Windows installations, SSD upgrades, and hardware diagnostics.',
      badge: 'Menu'
    },
    {
      page: 'how-it-works',
      title: 'How It Works',
      description: 'Review our 4-step on-site process: from online scheduling to testing and honest payment.',
      badge: 'Process'
    },
    {
      page: 'faq',
      title: 'FAQ',
      description: 'Answers about student credentials, visit fees, warranty coverage, and tools.',
      badge: 'Answers'
    },
    {
      page: 'contact',
      title: 'Book a Consultation',
      description: 'Schedule an on-site visit or send a direct WhatsApp message to Safiullah.',
      badge: 'Contact'
    }
  ];

  return (
    <div className="py-6 space-y-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'About', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 max-w-3xl">
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

      {/* Main Technician Trust Component (Portrait, Bio, Experience, Verification Badges) */}
      <TechnicianTrust
        settings={settings}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* Academic Background & Origin Story Section */}
      <section className="py-12 bg-slate-950/70 border-t border-b border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>The Story Behind TechFix Peshawar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                "Computer problems shouldn't force people to lose their private data or an entire day in traffic."
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <p>
                  Hi, I'm Safiullah. I am an active student at the <strong>University of Agriculture, Peshawar</strong>, advancing my academic knowledge in <strong>Computer Science and Cybersecurity</strong>. Over the last 5 years, I have worked hands-on with computers, Windows architectures, hardware troubleshooting, operating system migrations, and data recovery.
                </p>
                <p>
                  I started TechFix because I witnessed a recurring pattern across Peshawar: students and families having minor software glitches or slow hard drives, only to carry heavy desktop towers or fragile laptops across traffic to bazaar repair shops. There, machines often sit unattended for days, and customers worry about personal photo albums or passwords being inspected by strangers.
                </p>
                <p>
                  TechFix is built on an entirely different philosophy: <strong>We come directly to your desk or doorstep.</strong> Every diagnostic check, Windows installation, and SSD migration is done in front of you. You see everything, test everything on your own Wi-Fi, and pay an honest, agreed-upon fee with zero surprises.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-amber-400 block uppercase">Institution</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{settings.technicianInstitution}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-emerald-400 block uppercase">Experience</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">5+ Years Practical</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-sky-400 block uppercase">Specialization</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">CS & Cybersecurity</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/10 to-slate-900 border border-amber-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Student-Led & Ethical</h3>
                    <p className="text-[11px] text-slate-400">Strict cybersecurity ethics applied on-site</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>No cracked software, malware bundles, or unauthorized keys.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Personal pictures and browser sessions remain 100% confidential.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Plain Urdu, Pashto, or English explanations of your PC issue.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Consult Directly with Safiullah</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Technical Philosophy & Ethics */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl mb-8">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
              PROFESSIONAL ETHICAL CHARTER
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              The 4 Standards of My Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Unlike generic street technicians who treat computers as anonymous metal boxes, my approach is grounded in academic discipline, technical rigor, and respect for customer privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ethicalCodes.map((code, idx) => {
              const Icon = code.icon || ShieldCheck;
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

          {/* Direct CTA Box */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white">Have a question about your laptop or desktop?</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Reach out directly on WhatsApp to describe your symptom before scheduling an on-site visit.
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
        currentPageTitle="About"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
