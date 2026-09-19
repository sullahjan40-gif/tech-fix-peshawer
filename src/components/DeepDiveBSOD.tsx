import { 
  Cpu, 
  Search, 
  CheckCircle2, 
  Terminal, 
  Flame, 
  Layers, 
  ArrowRight, 
  Wrench, 
  AlertTriangle 
} from 'lucide-react';

interface DeepDiveBSODProps {
  onBookBSOD: () => void;
}

export function DeepDiveBSOD({ onBookBSOD }: DeepDiveBSODProps) {
  const causes = [
    { name: 'Corrupted Drivers', desc: 'Outdated or conflicting display, Wi-Fi, or audio kernel drivers.' },
    { name: 'Failing RAM Stick', desc: 'Bit-flip errors in memory addresses during intensive tasks.' },
    { name: 'Failing Storage (SSD/HDD)', desc: 'Bad sectors or controller timeout during OS disk operations.' },
    { name: 'Thermal Throttling & Dust', desc: 'Dried thermal paste causing CPU/GPU to overheat and trigger protection shutoff.' },
    { name: 'System File Corruption', desc: 'Damaged Windows kernel binaries after sudden power cuts or failed updates.' },
    { name: 'Hardware Instability', desc: 'Voltage fluctuations or aging motherboard capacitors.' },
  ];

  const diagnosticFlow = [
    { step: '01', title: 'CHECK STOP ERROR CODE', detail: 'Identify exact kernel stop code (e.g. IRQL_NOT_LESS_OR_EQUAL, KERNEL_DATA_INPAGE_ERROR, CRITICAL_PROCESS_DIED)' },
    { step: '02', title: 'ANALYZE MINIDUMP LOGS', detail: 'Extract Windows crash dump using WinDbg to pinpoint the specific .sys driver or module that crashed' },
    { step: '03', title: 'HARDWARE RAM MEMTEST', detail: 'Run multi-pass hardware RAM stress diagnostic to detect memory cell defects' },
    { step: '04', title: 'CHECK STORAGE S.M.A.R.T.', detail: 'Examine reallocated sectors, CRC error count, and NVMe health percentage' },
    { step: '05', title: 'THERMAL & VOLTAGE INSPECTION', detail: 'Monitor real-time sensor temperatures under synthetic stress to rule out overheating' },
    { step: '06', title: 'SURGICAL REPAIR & FIX', detail: 'Replace bad driver, repair corrupt files, or swap faulty component without blindly wiping files' },
    { step: '07', title: 'STABILITY STRESS TEST', detail: 'Run heavy benchmark verification for 30 minutes to verify system stability under load before handover' },
  ];

  return (
    <section id="blue-screen" className="py-16 sm:py-24 bg-slate-950/70 border-y border-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
            <span className="skeuo-led-blue"></span>
            <span>DIAGNOSTIC EXCELLENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            BLUE SCREEN? <br />
            <span className="text-cyan-400">FIND THE REAL CAUSE.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A Blue Screen is a symptom. Reinstalling Windows is not always the correct solution. If your RAM has a hardware defect or your GPU driver is corrupted, reformatting will simply crash again tomorrow. We diagnose the true root cause.
          </p>
        </div>

        {/* 2-Column: Potential Causes vs Diagnostic Process */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Causes (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl skeuo-panel p-6 sm:p-8 relative">
            <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
            <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>
            
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 font-mono">
              <Search className="h-5 w-5 text-cyan-400" />
              <span>What Actually Triggers A BSOD?</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              A blue screen occurs when the Windows OS detects a critical error it cannot safely ignore.
            </p>

            <div className="space-y-3.5">
              {causes.map((c, i) => (
                <div key={i} className="rounded-xl skeuo-card p-3.5">
                  <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">
                    {c.name}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3.5 rounded-xl skeuo-inset text-xs text-cyan-300 font-mono">
              <span className="font-bold">Our Philosophy:</span> Diagnose first, repair surgically, format only if corruption is irrecoverable.
            </div>
          </div>

          {/* Diagnostic Flow (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl skeuo-panel p-6 sm:p-8 shadow-xl relative">
            <div className="absolute top-2 left-2"><span className="skeuo-screw"></span></div>
            <div className="absolute top-2 right-2"><span className="skeuo-screw"></span></div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">
                  Our Methodical 7-Step Diagnostic Flow
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Scientific hardware & software crash isolation
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-300 skeuo-badge px-2.5 py-1 rounded">
                PRO DIAGNOSTICS
              </span>
            </div>

            <div className="space-y-3.5">
              {diagnosticFlow.map((f) => (
                <div key={f.step} className="rounded-xl skeuo-card p-3.5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-xs font-mono font-bold text-cyan-300 skeuo-badge px-2 py-0.5 rounded">
                      {f.step}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-mono">
                      {f.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 pl-8 leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 font-mono">
                BSOD Diagnostics on-site from <strong className="text-emerald-400 font-mono text-sm">Rs. 1,500</strong>
              </div>
              <button
                onClick={onBookBSOD}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-5 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-lg font-mono"
              >
                <Wrench className="h-4 w-4" />
                <span>Book BSOD Diagnosis</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
