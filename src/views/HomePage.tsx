import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSelector } from '../components/ProblemSelector';
import { ServicesList } from '../components/ServicesList';
import { OnSiteAdvantage } from '../components/OnSiteAdvantage';
import { WorkflowSteps } from '../components/WorkflowSteps';
import { DeepDiveWindows } from '../components/DeepDiveWindows';
import { DeepDiveSSD } from '../components/DeepDiveSSD';
import { DeepDiveDataRecovery } from '../components/DeepDiveDataRecovery';
import { DeepDiveBSOD } from '../components/DeepDiveBSOD';
import { AudienceSection } from '../components/AudienceSection';
import { BulkDeployment } from '../components/BulkDeployment';
import { TechnicianTrust } from '../components/TechnicianTrust';
import { FAQSection } from '../components/FAQSection';
import { BookingForm } from '../components/BookingForm';
import { ContactSection } from '../components/ContactSection';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  Users, 
  Layers, 
  UserCheck, 
  HelpCircle, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  Cpu
} from 'lucide-react';
import { SiteSettings, ServiceItem, ProblemCategory, FAQItem } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';
import { fallbackFaqs, fallbackServiceAreas } from '../utils/fallbackData';

interface HomePageProps {
  settings: SiteSettings;
  services: ServiceItem[];
  problemCategories: ProblemCategory[];
  faqs?: FAQItem[];
  serviceAreas?: string[];
  onNavigate: (page: string, params?: any) => void;
}

export function HomePage({ 
  settings, 
  services, 
  problemCategories, 
  faqs = fallbackFaqs,
  serviceAreas = fallbackServiceAreas,
  onNavigate 
}: HomePageProps) {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello Safiullah! I have a computer problem and would like to ask about your on-site service in Peshawar."
  );

  const portalCards = [
    {
      page: 'services',
      title: 'Services',
      subtitle: 'Complete Diagnostic & Repair Catalog',
      description: 'Windows 10/11 clean setups, HDD to SSD migration, Blue Screen (BSOD) repair, and data recovery assistance with transparent pricing.',
      icon: Wrench,
      accent: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
      badge: 'Transparent Pricing'
    },
    {
      page: 'how-it-works',
      title: 'How It Works',
      subtitle: 'Simple 4-Step On-Site Protocol',
      description: 'From your online inquiry to on-site diagnosis, live repair in your presence, and verification before payment.',
      icon: Clock,
      accent: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      badge: 'Zero Confusion'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site',
      subtitle: 'Compare: Local Shop vs On-Site Way',
      description: 'Eliminate traffic hassle, protect family data from unauthorized inspection or parts swapping, and save 2-3 days of computer downtime.',
      icon: ShieldCheck,
      accent: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
      badge: 'Strict Privacy'
    },
    {
      page: 'who-we-serve',
      title: 'Who We Serve',
      subtitle: 'Students, Families & Businesses',
      description: 'Tailored on-site support for university hostel students, home desktops, clinics, academies, and busy commercial offices.',
      icon: Users,
      accent: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-400',
      badge: 'Peshawar Wide'
    },
    {
      page: 'bulk-windows',
      title: 'Bulk Windows',
      subtitle: '5 to 50+ PCs Automated Deployment',
      description: 'Rapid, standardized OS rollout for educational computer labs, call centers, and commercial offices with volume pricing.',
      icon: Layers,
      accent: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      badge: 'Lab & Office Ready'
    },
    {
      page: 'problems-solutions',
      title: 'Problems & Solutions',
      subtitle: 'Technical Deep-Dives & Live Research',
      description: 'Comprehensive guides for Windows install, SSD migration, data recovery, and BSOD diagnostics. Submit unlisted symptoms for direct research.',
      icon: Cpu,
      accent: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      badge: 'Self-Diagnostic Matrix'
    },
    {
      page: 'about',
      title: 'About Safiullah',
      subtitle: 'Technician Profile & Ethical Charter',
      description: 'University of Agriculture CS & Cybersecurity student with 5+ years hands-on Windows & hardware troubleshooting. Honest, ethical, and communicative.',
      icon: UserCheck,
      accent: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      badge: 'Verified Student Tech'
    },
    {
      page: 'faq',
      title: 'FAQ',
      subtitle: 'Direct Answers to Common Questions',
      description: 'Visit fee policy, timing, personal photo privacy, parts sourcing, warranty terms, and service areas across Peshawar.',
      icon: HelpCircle,
      accent: 'border-teal-500/40 bg-teal-950/20 text-teal-400',
      badge: 'Instant Answers'
    },
    {
      page: 'contact',
      title: 'Contact & Booking',
      subtitle: 'Schedule Your On-Site Visit',
      description: 'Online booking form, direct WhatsApp chat, telephone line, Peshawar area coverage map, and request status tracking.',
      icon: PhoneCall,
      accent: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      badge: 'Fast Dispatch'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <Hero
        settings={settings}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* 2. PROBLEM SELECTOR ("WHAT IS WRONG WITH YOUR COMPUTER?") */}
      <ProblemSelector
        onSelectProblem={(serviceKey, problemTitle) => {
          onNavigate('contact', {
            service: serviceKey,
            problem: `Selected symptom: ${problemTitle}`
          });
        }}
      />

      {/* 3. MULTI-PAGE GATEWAY MATRIX */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>DEDICATED EXPLORATION SECTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Explore Our Comprehensive Service Hub
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Each section has a dedicated page with in-depth technical details, transparent workflows, customer guides, and direct ways to connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {portalCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.page}
                  onClick={() => onNavigate(card.page)}
                  className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.accent} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <div className="text-xs font-mono text-blue-400/80 mb-2">
                      {card.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore {card.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES LIST */}
      <ServicesList
        services={services}
        onBookService={(serviceName) => onNavigate('contact', { service: serviceName })}
        onViewDeepDive={(_key) => onNavigate('services')}
      />

      {/* 5. ON-SITE ADVANTAGE (Local Shop vs On-Site Way) */}
      <OnSiteAdvantage
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* 6. 4-STEP ON-SITE PROTOCOL (Workflow) */}
      <WorkflowSteps
        settings={settings}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* 7. DEEP DIVE: WINDOWS INSTALLATION & SETUP */}
      <DeepDiveWindows
        onBookThis={() => onNavigate('contact', { service: 'Fast Windows Installation & Setup' })}
      />

      {/* 8. DEEP DIVE: HDD TO SSD UPGRADE */}
      <DeepDiveSSD
        onUpgradeToSSD={() => onNavigate('contact', { service: 'Make Your Old Computer Feel Faster (HDD → SSD)' })}
      />

      {/* 9. DEEP DIVE: DATA RECOVERY FIRST RESPONSE */}
      <DeepDiveDataRecovery
        settings={settings}
        onBookRecovery={() => onNavigate('contact', { service: 'Data Recovery Assistance' })}
      />

      {/* 10. DEEP DIVE: BLUE SCREEN (BSOD) DIAGNOSIS */}
      <DeepDiveBSOD
        onBookBSOD={() => onNavigate('contact', { service: 'Blue Screen / BSOD Real Cause Diagnosis' })}
      />

      {/* 11. AUDIENCE SEGMENTATION */}
      <AudienceSection
        onBookForAudience={(category) => onNavigate('contact', { problem: `Audience Category: ${category}` })}
      />

      {/* 12. BULK LAB & COMMERCIAL DEPLOYMENT */}
      <BulkDeployment
        settings={settings}
        onRequestBulkQuote={(count) => onNavigate('contact', { 
          service: 'Bulk Windows Setup for Labs & Offices', 
          problem: `Bulk setup inquiry for ${count || 'multiple'} systems` 
        })}
      />

      {/* 13. MEET SAFIULLAH (Technician Trust & Verification) */}
      <TechnicianTrust
        settings={settings}
        onOpenBooking={() => onNavigate('contact')}
      />

      {/* 14. FREQUENTLY ASKED QUESTIONS */}
      <FAQSection
        faqs={faqs}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* 15. FAST DIRECT ON-SITE BOOKING FORM */}
      <section id="book-online" className="py-14 sm:py-20 bg-slate-950/80 border-t border-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">BOOK ON-SITE VISIT</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Schedule Your Computer Service in Peshawar</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Fill in your device details and address. Safiullah will review your request, coordinate arrival time, and diagnose on-site in front of you.
            </p>
          </div>

          <BookingForm
            services={services}
            serviceAreas={serviceAreas}
            whatsappNumber={settings.whatsappNumber}
            onSuccessSubmitted={(_b) => onNavigate('track-request')}
          />
        </div>
      </section>

      {/* 16. CONTACT & PESHAWAR AREA COVERAGE */}
      <ContactSection
        settings={settings}
        serviceAreas={serviceAreas}
        onOpenBooking={() => onNavigate('contact')}
      />
    </div>
  );
}

