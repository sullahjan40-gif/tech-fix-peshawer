import { 
  Laptop, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Terminal
} from 'lucide-react';

interface DeepDiveWindowsProps {
  onBookThis: () => void;
}

export function DeepDiveWindows({ onBookThis }: DeepDiveWindowsProps) {
  const workflow = [
    { step: '01', title: 'BACKUP IMPORTANT DATA', desc: 'Verify and safely preserve user desktop, documents, browser bookmarks, and files prior to partition setup.' },
    { step: '02', title: 'INSTALL WINDOWS (10 / 11)', desc: 'Clean installation on verified storage partition using official Microsoft media without third-party modifications.' },
    { step: '03', title: 'INSTALL OFFICIAL DRIVERS', desc: 'Chipset, GPU (Nvidia/AMD/Intel), Wi-Fi, Ethernet, Audio, and touchpad drivers directly from manufacturer.' },
    { step: '04', title: 'INSTALL CRITICAL UPDATES', desc: 'Security definitions and cumulative patches to ensure immediate protection against exploits.' },
    { step: '05', title: 'CONFIGURE & DEBLOAT', desc: 'Disable intrusive background telemetry, startup bloatware, configure privacy controls, and install PDF/browser essentials.' },
    { step: '06', title: 'STABILITY & HARDWARE TEST', desc: 'Verify sound, web camera, microphone, display refresh, battery sleep states, and thermal stability before handover.' },
  ];

  const reasons = [
    'Corrupted or unbootable Windows',
    'Severe malware or software instability',
    'Failed Windows update loop',
    'Preparing a newly purchased laptop (FreeDOS/Linux)',
    'Refreshing a second-hand/used PC',
    'Reinstalling Windows following an SSD upgrade',
    'Frequent application crashing and slow explorer'
  ];

  const timeFactors = [
    { label: 'Storage Type', detail: 'NVMe/SATA SSD is 3-5x faster than mechanical HDD' },
    { label: 'Hardware Generation', detail: 'CPU speed, RAM generation (DDR3 vs DDR4 vs DDR5)' },
    { label: 'USB Port Speed', detail: 'USB 3.0 / 3.2 vs legacy USB 2.0 transfer rates' },
    { label: 'Driver Complexity', detail: 'Dedicated gaming GPUs and hybrid laptops take additional verification' },
    { label: 'Data Volume', detail: 'Size of existing personal files requiring backup prior to formatting' },
  ];

  return (
    <section id="windows-installation" className="py-16 sm:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-cyan-300 mb-3">
            <span className="skeuo-led-blue"></span>
            <span>SERVICE DEEP-DIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            FAST WINDOWS INSTALLATION & SETUP
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            I install and configure genuine Windows on compatible laptops and desktop computers. Every setup is performed with precision—ensuring correct UEFI partitioning, official manufacturer drivers, and zero unwanted bloatware.
          </p>
        </div>

        {/* 2-Column Info & Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Reasons & Realistic Time Expectation */}
          <div className="lg:col-span-5 space-y-6">
            {/* Common Reasons */}
            <div className="rounded-2xl skeuo-panel p-6 relative">
              <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
              <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-mono">
                <Laptop className="h-5 w-5 text-cyan-400" />
                <span>When Do You Need A Fresh Windows Install?</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Honest Realistic Time Box */}
            <div className="rounded-2xl skeuo-panel p-6 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2 font-mono">
                <Clock className="h-4 w-4" />
                <span>Honest & Efficient Turnaround Times</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                We do not make misleading marketing promises that a full installation is magically done in "4 to 10 minutes". A proper, stable setup involves drivers, security updates, and thorough hardware verification.
              </p>
              
              <div className="space-y-2 text-xs skeuo-inset p-3.5 rounded-xl">
                <div className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Total time depends realistically on:
                </div>
                {timeFactors.map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-800/80 last:border-0 font-mono">
                    <span className="text-slate-300 font-medium">{f.label}:</span>
                    <span className="text-slate-400 text-[11px] text-right">{f.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Steps */}
          <div className="lg:col-span-7 rounded-2xl skeuo-panel p-6 sm:p-8 shadow-xl relative">
            <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
            <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Our Step-by-Step Installation Workflow
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Consistent, professional procedure for maximum stability and speed
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-300 skeuo-badge px-2.5 py-1 rounded">
                6-STEP PROTOCOL
              </span>
            </div>

            <div className="space-y-4">
              {workflow.map((w) => (
                <div 
                  key={w.step} 
                  className="rounded-xl skeuo-card p-4"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono font-bold text-cyan-300 skeuo-badge px-2 py-0.5 rounded">
                      {w.step}
                    </span>
                    <h4 className="text-sm font-bold text-white font-mono">
                      {w.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 pl-9 leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 font-mono">
                Starting from <strong className="text-emerald-400 font-mono text-sm">Rs. 1,500</strong> on-site in Peshawar
              </div>
              <button
                onClick={onBookThis}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-5 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-lg font-mono"
              >
                <span>Book Windows Setup</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
