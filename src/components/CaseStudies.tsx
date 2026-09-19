import { useState } from 'react';
import { CaseStudy } from '../types';
import { Sparkles, Laptop, Building2, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudiesProps {
  caseStudies: CaseStudy[];
  onBookSimilar: (title: string) => void;
}

export function CaseStudies({ caseStudies, onBookSimilar }: CaseStudiesProps) {
  // Built-in initial real examples if none in database
  const defaultExamples: CaseStudy[] = [
    {
      id: 'cs-1',
      title: 'Agricultural University Student Laptop Resuscitation',
      category: 'SSD Upgrade & Windows 11',
      device: 'HP ProBook 450 G3 (Core i5 6th Gen)',
      problem: 'Boot time exceeded 4.5 minutes. Student was unable to open SPSS and heavy browser tabs simultaneously without frequent freezing.',
      solution: 'Installed 256GB NVMe SSD, migrated Windows operating system, preserved student research data, and tuned startup services.',
      result: 'Boot time dropped from 4.5 minutes to 11 seconds. Applications launch instantly with zero lag.',
      date: 'Recent Case'
    },
    {
      id: 'cs-2',
      title: 'Home Office Recurring BSOD & Crash Isolation',
      category: 'BSOD Diagnostics',
      device: 'Custom Desktop PC (Ryzen 5, 16GB RAM)',
      problem: 'Random blue screens with "CRITICAL_PROCESS_DIED" and "IRQL_NOT_LESS_OR_EQUAL" occurring every 2 hours during remote work.',
      solution: 'Analyzed Minidump crash logs with WinDbg. Discovered faulty memory addresses in RAM Stick 2 and conflicting display driver.',
      result: 'Replaced defective RAM module and cleanly installed manufacturer WHQL graphics drivers. 100% stable under 2-hour stress test.',
      date: 'Recent Case'
    },
    {
      id: 'cs-3',
      title: 'Small Academy 12-Workstation Computer Lab Rollout',
      category: 'Bulk Deployment',
      device: '12x Dell OptiPlex Small Form Factor Desktops',
      problem: 'Academy had outdated mixed systems with various viruses, broken audio drivers, and no central printer connectivity.',
      solution: 'Standardized automated Windows 10 Pro image deployment, locked student profiles, installed Python/VS Code suites, configured network shared printer.',
      result: 'All 12 PCs deployed on Saturday with zero interruption to classes. Clean documentation provided to management.',
      date: 'Recent Case'
    }
  ];

  const displayList = caseStudies.length > 0 ? caseStudies : defaultExamples;

  return (
    <section id="case-studies" className="py-16 sm:py-24 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-blue-300 mb-3">
              <span className="skeuo-led-blue"></span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>FIELD WORK EXAMPLES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              REAL SERVICE EXAMPLES
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Documented cases of actual problems diagnosed and resolved on-site in Peshawar.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            <div>Proven Diagnostics</div>
            <div className="text-cyan-400">Peshawar Field Work</div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayList.map((cs) => (
            <div
              key={cs.id}
              className="rounded-3xl skeuo-card p-6 flex flex-col justify-between relative"
            >
              <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
              <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 skeuo-badge px-2.5 py-1 rounded">
                    {cs.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{cs.date}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug font-mono">
                  {cs.title}
                </h3>

                <div className="text-xs text-cyan-400 font-mono mb-4 flex items-center gap-1.5">
                  <Laptop className="h-3.5 w-3.5" />
                  <span>{cs.device}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-xl skeuo-inset p-3">
                    <span className="text-slate-400 font-semibold block mb-0.5 font-mono">Problem Diagnosed:</span>
                    <span className="text-slate-200 leading-relaxed">{cs.problem}</span>
                  </div>

                  <div className="rounded-xl skeuo-inset p-3">
                    <span className="text-cyan-400 font-semibold block mb-0.5 font-mono">On-Site Solution:</span>
                    <span className="text-slate-200 leading-relaxed">{cs.solution}</span>
                  </div>

                  <div className="rounded-xl skeuo-inset p-3">
                    <span className="text-emerald-400 font-semibold block mb-0.5 font-mono">Measured Outcome:</span>
                    <span className="text-emerald-200 font-medium leading-relaxed">{cs.result}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onBookSimilar(cs.category)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn py-2.5 px-3 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer font-mono"
                >
                  <span>Have A Similar Issue? Book Now</span>
                  <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
