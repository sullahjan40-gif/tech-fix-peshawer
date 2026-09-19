import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { SiteSettings, ProblemSolutionItem, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  Wrench, 
  AlertTriangle, 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Send, 
  RotateCw, 
  Clock, 
  ChevronRight, 
  Layers, 
  Phone, 
  MessageSquare,
  HelpCircle,
  Flame,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';
import { fetchProblemSolutions, submitProblemLead } from '../utils/api';

interface ProblemsSolutionsPageProps {
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function ProblemsSolutionsPage({ settings, pageSections, onNavigate }: ProblemsSolutionsPageProps) {
  const [solutions, setSolutions] = useState<ProblemSolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // "Problem Not Listed" Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('University Town');
  const [deviceType, setDeviceType] = useState('Laptop');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'urgent'>('normal');

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ leadId: string; message: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check if entire Problems & Solutions page is unpublished
  if ((pageSections?.pageStatuses as any)?.['problems-solutions'] === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Problems & Solutions"
        pageKey="problems-solutions"
        onNavigate={onNavigate}
      />
    );
  }

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    try {
      setLoading(true);
      const data = await fetchProblemSolutions();
      if (Array.isArray(data) && data.length > 0) {
        setSolutions(data);
      }
    } catch (e) {
      console.warn('Error loading problem solutions:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitProblemLead({
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        email: email.trim() || undefined,
        area: area.trim(),
        deviceType,
        problemTitle: problemTitle.trim(),
        problemDescription: problemDescription.trim(),
        urgency
      });

      setSubmitSuccess({
        leadId: res.lead?.id || 'LEAD-PRB',
        message: res.message || 'Problem submitted! Safiullah will review your symptom and contact you shortly.'
      });

      // Reset form
      setFullName('');
      setPhone('');
      setWhatsapp('');
      setEmail('');
      setProblemTitle('');
      setProblemDescription('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit problem inquiry. Please try again or WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSolutions = solutions.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      item.shortDesc.toLowerCase().includes(q) ||
      (item.symptomsWhenNeeded || []).some(s => s.toLowerCase().includes(q))
    );

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'windows') return matchesSearch && item.key.includes('win');
    if (activeFilter === 'ssd') return matchesSearch && (item.key.includes('ssd') || item.key.includes('hdd'));
    if (activeFilter === 'recovery') return matchesSearch && item.key.includes('recovery');
    if (activeFilter === 'bsod') return matchesSearch && (item.key.includes('blue') || item.key.includes('bsod'));
    return matchesSearch;
  });

  const connectorLinks = [
    {
      page: 'services',
      title: 'Complete Service Menu',
      description: 'Explore full catalog of Windows installation, hardware diagnostics, and fixed prices.',
      badge: 'Services'
    },
    {
      page: 'why-on-site',
      title: 'Why On-Site Is Safer',
      description: 'Learn why getting your computer diagnosed in front of you prevents data snooping.',
      badge: 'Privacy'
    },
    {
      page: 'about',
      title: 'About Safiullah',
      description: 'Review credentials, University of Agriculture background, and ethical charters.',
      badge: 'Technician'
    },
    {
      page: 'how-it-works',
      title: 'How It Works (4 Steps)',
      description: 'Review our transparent procedure from online booking to verified on-site fix.',
      badge: 'Process'
    },
    {
      page: 'contact',
      title: 'Book a Diagnostic Visit',
      description: 'Schedule a visit at your home, university hostel, or office in Peshawar.',
      badge: 'Schedule'
    }
  ];

  return (
    <div className="py-6 space-y-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Problems & Solutions', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
            <Wrench className="h-3 w-3 text-blue-400" />
            <span>DIAGNOSTIC & TECHNICAL ARCHIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Computer Problems & Proven Solutions
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            Deep-dive technical methodologies for everyday computer issues. We diagnose the true root cause before your eyes, follow non-destructive protocols, and avoid blind reformatting.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symptom, error, SSD, BSOD..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Problems' },
              { id: 'windows', label: 'Windows Boot' },
              { id: 'ssd', label: 'Slow HDD / SSD' },
              { id: 'recovery', label: 'Data Recovery' },
              { id: 'bsod', label: 'Blue Screen (BSOD)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="mt-8 space-y-10">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <RotateCw className="h-5 w-5 animate-spin text-blue-400" />
              <span>Loading technical problem guides...</span>
            </div>
          ) : filteredSolutions.length === 0 ? (
            <div className="p-10 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
              <p className="text-sm font-bold text-white">No listed solution matches "{searchQuery}".</p>
              <p className="text-xs text-slate-400">
                You can submit your exact problem below! Safiullah will research your hardware & software symptom and contact you.
              </p>
            </div>
          ) : (
            filteredSolutions.map((item, idx) => (
              <div
                key={item.id || idx}
                className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl hover:border-blue-500/30 transition-all"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.badge || 'TECHNICAL SOLUTION'}
                    </span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight pt-1">
                      {item.title}
                    </h2>
                    {item.subtitle && (
                      <p className="text-xs font-mono text-blue-400/90">{item.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      {item.priceStarting}
                    </span>
                    <button
                      onClick={() => onNavigate('contact', { service: item.title })}
                      className="skeuo-btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <span>{item.ctaText || 'Book This Fix'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description & Honest Assessment */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.shortDesc}
                    </p>

                    {item.symptomsWhenNeeded && item.symptomsWhenNeeded.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                          <span>When Do You Need This On-Site Solution?</span>
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400">
                          {item.symptomsWhenNeeded.map((sym, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.warningRules && item.warningRules.length > 0 && (
                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                        <span className="text-xs font-bold text-rose-300 font-mono flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-rose-400" />
                          <span>CRITICAL RULES: STOP BEFORE YOU FORMAT</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-rose-200/90">
                          {item.warningRules.map((rule, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold mt-0.5">✕</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    {item.honestAssessment && (
                      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Honest Diagnostic Assessment</span>
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.honestAssessment}
                        </p>
                      </div>
                    )}

                    {item.turnaroundFactors && item.turnaroundFactors.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-indigo-400" />
                          <span>{item.turnaroundCriteria || 'Turnaround Time Factors:'}</span>
                        </span>
                        <ul className="space-y-1 text-xs text-slate-400">
                          {item.turnaroundFactors.map((f, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-1.5">
                              <span className="text-indigo-400 mt-0.5">›</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.benefits && item.benefits.length > 0 && (
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                        <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Immediate Benefits You Will Feel:</span>
                        </span>
                        <ul className="space-y-1 text-xs text-emerald-200/90">
                          {item.benefits.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step-by-Step Protocol Bar */}
                {item.steps && item.steps.length > 0 && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{item.protocolTitle || 'Methodical Diagnostic Workflow'}</span>
                      </span>
                      {item.protocolBadge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {item.protocolBadge}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {item.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-1.5"
                        >
                          <span className="text-[10px] font-mono font-extrabold text-blue-400">
                            {step.num || `0${sIdx + 1}`}
                          </span>
                          <h4 className="text-[11px] font-bold text-white leading-snug">
                            {step.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ========================================================================= */}
        {/* UNLISTED PROBLEM SUBMISSION FORM ("Problem Not Listed?")                 */}
        {/* ========================================================================= */}
        <section className="mt-16 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-mono font-medium text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>CUSTOM RESEARCH & ON-SITE DIAGNOSIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Is Your Computer Problem Not Listed Here?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every computer issue has a root cause. Tell Safiullah your exact hardware model and symptoms. He will research the technical schematics and contact you with a direct solution and on-site estimate.
            </p>
          </div>

          {submitSuccess ? (
            <div className="max-w-xl mx-auto p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 font-mono">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-300">Inquiry Received Successfully!</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{submitSuccess.message}</p>
              <div className="text-[11px] text-amber-300 bg-slate-950 py-1.5 px-3 rounded-lg border border-slate-800 inline-block">
                Reference ID: <strong className="text-white">{submitSuccess.leadId}</strong>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="text-xs font-mono text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                >
                  Submit Another Problem Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="max-w-2xl mx-auto space-y-4">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bilal Khan"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Phone Number (Calling) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0312 3456789"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">WhatsApp Number (For Direct Update)</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0312 3456789 (leave blank if same)"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Location / Campus in Peshawar</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="University Town">University Town</option>
                    <option value="Agriculture University Campus & Hostels">Agriculture University Campus & Hostels</option>
                    <option value="Peshawar University Campus">Peshawar University Campus</option>
                    <option value="Hayatabad (Phases 1 - 7)">Hayatabad (Phases 1 - 7)</option>
                    <option value="Saddar & Cantt">Saddar & Cantt</option>
                    <option value="Board Bazar & Jamrud Road">Board Bazar & Jamrud Road</option>
                    <option value="Warsak Road">Warsak Road</option>
                    <option value="Danishabad & Rahatabad">Danishabad & Rahatabad</option>
                    <option value="Ring Road / Gulbahar">Ring Road / Gulbahar</option>
                    <option value="Other Area in Peshawar">Other Area in Peshawar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Device Type & Brand</label>
                  <input
                    type="text"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    placeholder="e.g. Dell Inspiron 15, HP Pavilion, Custom PC"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Problem Title / Short Summary *</label>
                <input
                  type="text"
                  required
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="e.g. Screen flickering when launching AutoCAD, or BitLocker recovery key error"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Detailed Problem Description & Symptoms *</label>
                <textarea
                  required
                  rows={4}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Please describe what happens: Did it happen after a Windows update? Does the computer turn off, make beeping sounds, or freeze? The more detail you provide, the faster Safiullah can research the solution."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-sans"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
                  <span className="text-[11px] text-slate-400">Urgency:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'normal'}
                      onChange={() => setUrgency('normal')}
                      className="text-amber-500"
                    />
                    <span>Normal (Within 24h)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'urgent'}
                      onChange={() => setUrgency('urgent')}
                      className="text-rose-500"
                    />
                    <span className="text-rose-400 font-bold">Urgent (Today)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="skeuo-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <span>Transmitting Problem Details...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Problem for Research</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Cross-Page Connection Hub */}
        <PageConnector
          currentPageTitle="Problems & Solutions"
          links={connectorLinks}
          onNavigate={onNavigate}
          whatsappNumber={settings.whatsappNumber}
        />
      </div>
    </div>
  );
}
