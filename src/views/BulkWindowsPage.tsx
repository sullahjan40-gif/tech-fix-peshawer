import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageConnector } from '../components/PageConnector';
import { BulkDeployment } from '../components/BulkDeployment';
import { SiteSettings, PageSectionsData } from '../types';
import { PageUnpublishedNotice } from '../components/PageUnpublishedNotice';
import { 
  Layers, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  Zap, 
  ArrowRight,
  School
} from 'lucide-react';

interface BulkWindowsPageProps {
  settings: SiteSettings;
  pageSections?: PageSectionsData;
  onNavigate: (page: string, params?: any) => void;
}

export function BulkWindowsPage({ settings, pageSections, onNavigate }: BulkWindowsPageProps) {
  const [pcCount, setPcCount] = useState<number>(10);

  // Check if entire Bulk Windows page is unpublished
  if (pageSections?.pageStatuses?.['bulk-windows'] === 'unpublished') {
    return (
      <PageUnpublishedNotice
        pageTitle="Bulk Windows Deployment"
        pageKey="bulk-windows"
        onNavigate={onNavigate}
      />
    );
  }

  const pageMeta = pageSections?.['bulk-windows'];
  const pageTitle = pageMeta?.title || "Bulk Windows Deployment (5 to 50+ PCs)";
  const pageSubtitle = pageMeta?.subtitle || "Standardized, automated operating system setup for educational computer labs, training academies, call centers, and corporate workstations in Peshawar. Rapid turnaround with tiered volume discounts.";
  const pageBadge = pageMeta?.badge || "INSTITUTIONAL ROLLOUTS";

  const defaultPricingTiers = [
    { id: 'tier-1', minPCs: 5, maxPCs: 9, ratePerPc: 700, label: '5 - 9 Computers', desc: 'Small office / clinic batch', status: 'published' },
    { id: 'tier-2', minPCs: 10, maxPCs: 19, ratePerPc: 600, label: '10 - 19 Computers', desc: 'Standard department / academy', status: 'published' },
    { id: 'tier-3', minPCs: 20, maxPCs: 29, ratePerPc: 500, label: '20 - 29 Computers', desc: 'College / School lab wing', status: 'published' },
    { id: 'tier-4', minPCs: 30, maxPCs: 100, ratePerPc: 450, label: '30+ Computers', desc: 'Full campus / enterprise refresh', status: 'published' }
  ];

  const rawTiers = (pageMeta?.pricingTiers && pageMeta.pricingTiers.length > 0) ? pageMeta.pricingTiers : defaultPricingTiers;
  const pricingTiers = rawTiers.filter((t: any) => t.status !== 'unpublished');

  // Volume price calculator logic (dynamically uses configured admin tiers)
  const getEstimatedTotal = (count: number) => {
    const matchedTier = pricingTiers.find((t: any) => count >= t.minPCs && (t.maxPCs ? count <= t.maxPCs : true));
    let ratePerPc = matchedTier ? matchedTier.ratePerPc : 700;
    if (!matchedTier && pricingTiers.length > 0) {
      const sorted = [...pricingTiers].sort((a: any, b: any) => a.minPCs - b.minPCs);
      if (count < sorted[0].minPCs) ratePerPc = sorted[0].ratePerPc;
      else ratePerPc = sorted[sorted.length - 1].ratePerPc;
    }

    return {
      rate: ratePerPc,
      total: count * ratePerPc
    };
  };

  const currentCalc = getEstimatedTotal(pcCount);

  const defaultLabFeatures = [
    {
      title: 'Parallel USB 3.2 Deployment',
      desc: 'Deploying multiple computers simultaneously using customized WinPE images cuts total lab downtime by up to 75% compared to single-disc setups.',
      status: 'published'
    },
    {
      title: 'Debloated Windows 10 / 11 Enterprise/Pro',
      desc: 'Removal of consumer telemetry, pre-installed promotional games, Cortana bloat, and unwanted background background services for maximum speed on lab hardware.',
      status: 'published'
    },
    {
      title: 'Pre-Packaged Academic / Productivity Suites',
      desc: 'Full installation of browsers, PDF readers, media players, WinRAR, and custom programming IDEs (VS Code, Python, C++, Java, Dev-C++) or office software.',
      status: 'published'
    },
    {
      title: 'Tamper-Resistant Security Policies',
      desc: 'Configuring local group policies and restricted non-admin student profiles prevents unauthorized system setting changes and persistent malware.',
      status: 'published'
    }
  ];

  const rawFeatures = (pageMeta?.labFeatures && pageMeta.labFeatures.length > 0) ? pageMeta.labFeatures : defaultLabFeatures;
  const labFeatures = rawFeatures.filter((f: any) => f.status !== 'unpublished');

  const connectorLinks = [
    {
      page: 'services',
      title: 'All Services & Pricing',
      description: 'Need assistance for single desktop or laptop machines? Check our full consumer service catalog.',
      badge: 'Single PCs'
    },
    {
      page: 'how-it-works',
      title: 'Deployment Workflow',
      description: 'Review how we test, verify, and document our on-site work before sign-off.',
      badge: 'Workflow'
    },
    {
      page: 'technician',
      title: 'Meet Safiullah',
      description: 'Computer Science practitioner with practical lab setup and Windows systems experience.',
      badge: 'Technician'
    },
    {
      page: 'who-we-serve',
      title: 'Who We Serve',
      description: 'Explore our support for universities, schools, academies, and private business networks.',
      badge: 'Clients'
    },
    {
      page: 'faq',
      title: 'Bulk Deployment FAQ',
      description: 'Questions regarding licenses, overnight/weekend scheduling, and payment invoices.',
      badge: 'FAQ'
    },
    {
      page: 'contact',
      title: 'Request Institutional Quote',
      description: 'Send your target number of PCs and address in Peshawar for a tailored quotation.',
      badge: 'Get Quote'
    }
  ];

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Bulk Windows', active: true }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="mt-4 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-mono font-medium text-purple-300 mb-3">
            <Layers className="h-3 w-3 text-purple-400" />
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

      {/* Main Bulk Deployment Component */}
      <BulkDeployment
        settings={settings}
        onRequestBulkQuote={(count) => {
          onNavigate('contact', {
            service: 'Multiple PCs Bulk Deployment',
            problem: `Bulk Windows deployment requested for approximately ${count} computers.`
          });
        }}
      />

      {/* Interactive Volume Estimator & Technical Lab Architecture */}
      <section className="py-16 bg-slate-950/70 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive Volume Estimator */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Interactive Volume Estimator</h3>
                  <p className="text-xs text-slate-400 font-mono">Estimate your lab deployment cost</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-slate-300">Number of Computers:</span>
                    <span className="text-lg font-extrabold text-purple-400">{pcCount} PCs</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={pcCount}
                    onChange={(e) => setPcCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                    <span>5 PCs</span>
                    <span>20 PCs</span>
                    <span>40 PCs</span>
                    <span>60+ PCs</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Volume Discount Rate:</span>
                    <span className="font-mono text-white font-bold">Rs. {currentCalc.rate} / PC</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Estimated Execution Time:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {pcCount <= 10 ? '2 - 3 Hours' : pcCount <= 25 ? '4 - 6 Hours' : '1 Full Day / Weekend'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Estimated Total:</span>
                    <span className="text-xl font-extrabold text-purple-400 font-mono">
                      Rs. {currentCalc.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('contact', {
                      service: 'Multiple PCs Bulk Deployment',
                      problem: `Target PCs: ${pcCount}. Estimated quote from calculator: Rs. ${currentCalc.total.toLocaleString()}`
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-bold text-white hover:bg-purple-500 transition-colors cursor-pointer shadow-lg shadow-purple-600/20"
                >
                  <span>Request Deployment For {pcCount} PCs</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Technical Features */}
            <div className="lg:col-span-7 space-y-4">
              <div className="mb-4">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                  STANDARDIZED LAB ARCHITECTURE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Why Institutional Bulk Deployment is Better
                </h3>
              </div>

              {labFeatures.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-xs text-slate-400">
                  <p>Deployment feature specifications are currently being updated by the administrator.</p>
                  <p className="text-slate-500 mt-1">Please contact Safiullah on WhatsApp for tailored institution deployment details.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {labFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                          <span>{feat.title}</span>
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Cross-Page Connection Hub */}
      <PageConnector
        currentPageTitle="Bulk Windows"
        links={connectorLinks}
        onNavigate={onNavigate}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
