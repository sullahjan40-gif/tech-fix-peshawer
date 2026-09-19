import { 
  HardDrive, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FolderCheck,
  Cpu
} from 'lucide-react';

interface DeepDiveSSDProps {
  onUpgradeToSSD: () => void;
}

export function DeepDiveSSD({ onUpgradeToSSD }: DeepDiveSSDProps) {
  const benefits = [
    { title: 'Instant Boot Times', desc: 'Windows boots in 10-15 seconds compared to 2-5 minutes on an old mechanical drive.' },
    { title: 'Faster App Launching', desc: 'Browsers, Microsoft Office, Photoshop, and IDEs open almost instantaneously.' },
    { title: 'Smooth File Transfers', desc: 'High-speed read/write speeds eliminate system-wide freezing and 100% disk usage.' },
    { title: 'Zero Moving Parts', desc: 'SSDs are silent, generate less heat, consume less battery power, and resist physical shock.' },
    { title: 'Less Waiting, More Studying/Working', desc: 'Eliminates everyday lag during multitasking, browser tab switching, and zooming.' },
  ];

  return (
    <section id="os-migration" className="py-16 sm:py-24 bg-slate-950/70 border-y border-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-emerald-300 mb-3">
            <span className="skeuo-led-emerald"></span>
            <span>HARDWARE ACCELERATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            MAKE YOUR OLD COMPUTER FEEL FASTER
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Many older computers use traditional mechanical hard disk drives (HDDs). Replacing the system drive with a modern SSD is the single highest-impact upgrade you can make to improve everyday responsiveness.
          </p>
        </div>

        {/* Visual Pipeline Banner: OLD HDD -> OS MIGRATION -> SSD -> FASTER EXPERIENCE */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-8 mb-12 shadow-2xl relative">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>

          <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">
            UPGRADE PIPELINE • PRESERVE ALL YOUR FILES & PROGRAMS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Step 1 */}
            <div className="rounded-2xl skeuo-card p-4 text-center">
              <div className="inline-flex p-3 rounded-xl skeuo-btn text-slate-400 mb-3">
                <HardDrive className="h-6 w-6" />
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase">Input</div>
              <div className="text-sm font-bold text-slate-200 mt-1 font-mono">OLD SLOW HDD</div>
              <div className="text-[11px] text-slate-300 mt-1">Mechanical 5400 RPM bottlenecks everyday tasks</div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl skeuo-card p-4 text-center">
              <div className="inline-flex p-3 rounded-xl skeuo-btn text-blue-400 mb-3">
                <Zap className="h-6 w-6" />
              </div>
              <div className="text-xs font-mono text-blue-400 uppercase">Process</div>
              <div className="text-sm font-bold text-white mt-1 font-mono">OS MIGRATION</div>
              <div className="text-[11px] text-slate-300 mt-1">Sector alignment & exact disk cloning without data loss</div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl skeuo-card p-4 text-center">
              <div className="inline-flex p-3 rounded-xl skeuo-btn text-cyan-400 mb-3">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 uppercase">Hardware</div>
              <div className="text-sm font-bold text-white mt-1 font-mono">SOLID STATE (SSD)</div>
              <div className="text-[11px] text-slate-300 mt-1">500MB/s+ SATA or 2000MB/s+ NVMe ultra-fast storage</div>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl skeuo-card p-4 text-center">
              <div className="inline-flex p-3 rounded-xl skeuo-btn text-emerald-400 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-xs font-mono text-emerald-400 uppercase">Result</div>
              <div className="text-sm font-bold text-emerald-300 mt-1 font-mono">FASTER EVERYDAY</div>
              <div className="text-[11px] text-slate-300 mt-1">Instant responsiveness, snappy multitasking</div>
            </div>
          </div>
        </div>

        {/* 2-Column: Benefits & Technical Honesty Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Benefits Grid (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl skeuo-panel p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
                <Zap className="h-5 w-5 text-emerald-400" />
                <span>Immediate Benefits You Will Feel</span>
              </h3>

              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-mono">{b.title}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">
                Old HDD can be kept as a secondary storage drive for backups!
              </span>
            </div>
          </div>

          {/* Migration vs Reinstallation Note (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl skeuo-panel p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 font-mono">
                <FolderCheck className="h-5 w-5 text-blue-400" />
                <span>Direct Migration vs Fresh Setup</span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                When appropriate, I can migrate your entire existing Windows installation, installed software, and user files to the SSD instead of starting from zero.
              </p>

              <div className="rounded-xl skeuo-inset p-4 text-xs text-slate-300 space-y-2 border border-amber-500/20">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Honest Diagnostic Requirement:</span>
                </div>
                <p className="leading-relaxed">
                  Direct migration depends on the health of your old drive and existing Windows installation. If the old mechanical drive has failing sectors or severe operating system corruption, a clean setup with manual data migration is much safer and more reliable.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800">
              <button
                onClick={onUpgradeToSSD}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-emerald px-5 py-3 text-xs sm:text-sm font-bold text-emerald-200 transition-all cursor-pointer shadow-lg font-mono"
              >
                <Zap className="h-4 w-4" />
                <span>UPGRADE TO SSD</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
