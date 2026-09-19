import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { FAQSection } from '../components/FAQSection';
import { FAQItem, SiteSettings, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

interface FAQPageProps {
  faqs: FAQItem[];
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function FAQPage({ faqs, settings, pageSections, onNavigate }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Check if entire FAQ page is unpublished
  if (pageSections?.pageStatuses?.faq === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Frequently Asked Questions"
        pageKey="faq"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.faq;
  const pageTitle = pageMeta?.title || "Frequently Asked Questions";
  const pageSubtitle = pageMeta?.subtitle || "Clear, honest answers about our on-site computer service in Peshawar: pricing, data privacy, SSD upgrades, emergency bookings, and hostel visits.";
  const pageBadge = pageMeta?.badge || "TRANSPARENT ANSWERS";

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello Safiullah! I have a question about your on-site computer service."
  );

  // Extended categorized FAQ database - filter out any with status === 'unpublished'
  const allFaqs: FAQItem[] = (faqs.length > 0 ? faqs : [
    {
      id: 'faq-1',
      question: 'How much does an on-site visit cost in Peshawar?',
      answer: 'Our standard visit and diagnostic fee starts at Rs. 500 across primary areas (University Town, Hayatabad, Saddar, Tehkal, Board Bazaar). When you proceed with a standard service (such as Windows installation or SSD migration), the diagnostic fee is transparently bundled or factored into the fixed service total agreed before work begins.',
      category: 'pricing'
    },
    {
      id: 'faq-2',
      question: 'Will my personal files, photos, and browser data be kept private?',
      answer: '100% yes. As a Computer Science & Cybersecurity student, Safiullah operates under strict ethical guidelines. Diagnostics and installations occur entirely in your home or office right in front of you. Your files never leave your premises and are never copied or opened.',
      category: 'privacy'
    },
    {
      id: 'faq-3',
      question: 'Do I need to buy the SSD myself or can you bring one?',
      answer: 'Both options work! You are welcome to buy your preferred brand (e.g. Samsung, Kingston, Lexar, Crucial) beforehand from any vendor. Alternatively, let us know during booking and we can procure a brand-new, sealed SSD with official distributor warranty on your behalf and install it on-site.',
      category: 'hardware'
    },
    {
      id: 'faq-4',
      question: 'How long does an on-site Windows installation take?',
      answer: 'On modern SSD-equipped systems, a clean Windows 10/11 install including official chipset, graphics, Wi-Fi drivers, and baseline debloating takes roughly 45 to 60 minutes. On older mechanical HDDs, it generally requires 75 to 90 minutes.',
      category: 'os'
    },
    {
      id: 'faq-5',
      question: 'Can you visit university hostels (UoP, UoA, UET)?',
      answer: 'Yes! Safiullah is an active university student at the University of Agriculture, Peshawar. We frequently visit hostel gates, student apartments, and university residential sectors with flexible evening timings that fit class schedules.',
      category: 'locations'
    },
    {
      id: 'faq-6',
      question: 'What if my computer problem cannot be solved on-site?',
      answer: 'Over 92% of software, OS, overheating, and drive issues are resolved during the visit. If an extreme micro-soldering motherboard or physical chip defect is diagnosed, we will explain the exact fault honestly, provide honest repair guidance, and you only pay the modest diagnostic fee.',
      category: 'pricing'
    },
    {
      id: 'faq-7',
      question: 'Do you offer bulk Windows deployment for schools or academies?',
      answer: 'Yes, we have a specialized bulk deployment framework for 5 to 50+ computers with automated USB deployment, driver slipstreaming, and standardized student or office software bundles at discounted volume rates.',
      category: 'os'
    },
    {
      id: 'faq-8',
      question: 'What are your working hours?',
      answer: 'Monday to Saturday from 9:00 AM to 8:00 PM. Emergency weekend or Sunday appointments can also be scheduled via prior WhatsApp consultation.',
      category: 'locations'
    }
  ]).filter((item: any) => item.status !== 'unpublished');

  const filteredFaqs = allFaqs.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      activeCategory === 'all' || 
      (item.category && item.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

  const connectorLinks = [
    {
      page: 'services',
      title: 'Full Service Directory',
      description: 'Review transparent prices and turnaround times for Windows setups, SSDs, and recovery.',
      badge: 'Services'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site Is Safer',
      description: 'Learn why avoiding crowded bazaar repair shops protects your privacy and saves days.',
      badge: 'Privacy'
    },
    {
      page: 'how-it-works',
      title: 'How It Works',
      description: 'Review our step-by-step 4-step workflow: from WhatsApp message to completed repair.',
      badge: 'Workflow'
    },
    {
      page: 'technician',
      title: 'Meet Safiullah',
      description: 'Get to know your technician’s Computer Science background and cybersecurity standards.',
      badge: 'Credentials'
    },
    {
      page: 'bulk-windows',
      title: 'Bulk Lab Setup',
      description: 'Learn about automated 5 to 50+ computer deployment for educational institutions.',
      badge: 'Institutions'
    },
    {
      page: 'contact',
      title: 'Still Have Questions? Book',
      description: 'Send us a message on WhatsApp or submit a service request form for direct assistance.',
      badge: 'Contact'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'FAQ', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs font-mono font-medium text-teal-300 mb-3">
            <HelpCircle className="h-3 w-3 text-teal-400" />
            <span>{pageBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 mb-10 backdrop-blur-xl">
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. SSD, visit fee, hostel, photos, time)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'pricing', label: 'Pricing & Fees' },
              { id: 'privacy', label: 'Data Safety & Privacy' },
              { id: 'hardware', label: 'SSD & Hardware' },
              { id: 'os', label: 'Windows & OS' },
              { id: 'locations', label: 'Locations & Timing' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-4 max-w-4xl">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center">
              <p className="text-sm text-slate-400">No questions matched your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 text-xs text-teal-400 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen 
                      ? 'border-teal-500/50 bg-slate-900/80' 
                      : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-teal-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Fast Ask Strip */}
        <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl">
          <div>
            <h3 className="text-base font-bold text-white">Couldn't find your question?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Send a quick WhatsApp message directly to Safiullah for an instant answer.</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="FAQ"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
