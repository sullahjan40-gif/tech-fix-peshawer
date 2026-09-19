import { 
  Building2, 
  Layers, 
  Terminal, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileSpreadsheet, 
  Network
} from 'lucide-react';
import { SiteSettings } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';

interface BulkDeploymentProps {
  settings: SiteSettings;
  onRequestBulkQuote: (machineCount?: string) => void;
}

export function BulkDeployment({ settings, onRequestBulkQuote }: BulkDeploymentProps) {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello! I represent an office/school in Peshawar. We need a bulk quote for Windows deployment & setup across multiple PCs."
  );

  const targets = [
    { label: 'Offices & Corporate', desc: 'Uniform employee workstation configurations with domain/network printer setups.' },
    { label: 'Schools & Colleges', desc: 'Educational PC labs configured with standardized student and teacher privileges.' },
    { label: 'Computer Academies', desc: 'Fast turnaround lab imaging with programming compilers and IDEs preloaded.' },
    { label: 'Call Centers & Agencies', desc: 'Secure browser and VoIP headset driver profiles with locked settings.' },
  ];

  const deploymentFeatures = [
    { title: 'Automated Image Deployment', desc: 'We use rapid provisioning images instead of slow manual DVD/USB installs machine-by-machine.' },
    { title: 'Full Hardware Driver Packs', desc: 'Matched drivers injected for audio, dual-monitors, gigabit LAN, and chipsets.' },
    { title: 'Standard Office Software', desc: 'Chrome, Acrobat, Office runtime libraries, 7-Zip, and requested legitimate business tools.' },
    { title: 'Network & Printer Sharing', desc: 'Local network IP configuration, shared folder permissions, and central network printer setup.' },
    { title: 'Full Stress Testing', desc: 'Every workstation is tested for RAM, temperature, and network throughput before sign-off.' },
    { title: 'Documentation & Hardware Inventory', desc: 'Simple documented sheet of computer specifications, IP allocations, and serial records.' },
  ];

  return (
    <section id="bulk-windows" className="py-16 sm:py-24 bg-slate-950/80 border-y border-slate-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-purple-300 mb-3">
            <span className="skeuo-led-blue"></span>
            <Building2 className="h-3.5 w-3.5 text-purple-400" />
            <span>ORGANIZATIONAL & LAB DEPLOYMENT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            NEED WINDOWS ON <br />
            <span className="text-cyan-400">
              5, 10, 20 OR 50+ PCs?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Installing 20 computers manually one-by-one by hand is slow and prone to configuration mistakes. We deploy clean, standardized, hardware-optimized Windows environments rapidly using automated provisioning tools for organizations in Peshawar.
          </p>
        </div>

        {/* Big CTA Banner / Calculator teaser */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-10 shadow-2xl mb-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>

          <div>
            <div className="flex items-center gap-2 text-purple-300 font-mono text-xs uppercase tracking-wider mb-2">
              <Terminal className="h-4 w-4 text-purple-400" />
              <span>Volume Tiers Available</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-mono">
              Cost-Effective On-Site Service with Minimal Workplace Downtime
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Scheduled on weekends or after office hours so your team or students experience zero interruption during normal hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onRequestBulkQuote('10+ PCs')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-6 py-3.5 text-sm font-bold text-white shadow-xl cursor-pointer font-mono"
            >
              <span>REQUEST BULK QUOTE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn px-5 py-3.5 text-sm font-bold text-slate-200 hover:text-white transition-all font-mono"
            >
              <span>Discuss via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 2-Column Details: Deployment Features & Target Institutions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Deployment Features (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl skeuo-panel p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 font-mono">
              <Network className="h-5 w-5 text-purple-400" />
              <span>What Is Included In Bulk Deployment</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              Complete end-to-end setup delivered directly at your institution or facility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deploymentFeatures.map((f, i) => (
                <div key={i} className="rounded-xl skeuo-card p-4">
                  <div className="text-xs sm:text-sm font-bold text-white mb-1 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
                    <span>{f.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-5">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Target Customers (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl skeuo-panel p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-mono">
              <Building2 className="h-5 w-5 text-indigo-400" />
              <span>Tailored For Peshawar Institutions</span>
            </h3>

            {targets.map((t, i) => (
              <div key={i} className="rounded-xl skeuo-card p-3.5">
                <div className="text-xs font-bold text-purple-300 font-mono">
                  {t.label}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  {t.desc}
                </div>
              </div>
            ))}

            <div className="pt-2 text-xs text-slate-400 italic font-mono">
              * Official invoices and detailed machine service manifests provided for company recordkeeping.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
