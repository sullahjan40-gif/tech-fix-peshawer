import { 
  PowerOff, 
  Gauge, 
  Cpu, 
  Database, 
  Laptop, 
  HardDrive, 
  Building2, 
  KeyRound,
  ArrowRight
} from 'lucide-react';

interface ProblemSelectorProps {
  onSelectProblem: (serviceKey: string, problemTitle: string) => void;
}

export function ProblemSelector({ onSelectProblem }: ProblemSelectorProps) {
  const problems = [
    {
      id: 'p1',
      title: "WINDOWS WON'T START",
      symptom: 'Stuck in reboot loop, black screen with blinking cursor, or startup repair failure.',
      serviceKey: 'windows-repair',
      serviceName: 'Windows Startup & Boot Repair',
      icon: PowerOff,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'p2',
      title: 'COMPUTER IS SLOW',
      symptom: 'Takes 5+ minutes to boot, freezes opening browsers, high disk/CPU usage at 100%.',
      serviceKey: 'slow-computer',
      serviceName: 'Slow Computer Overhaul',
      icon: Gauge,
      badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    },
    {
      id: 'p3',
      title: 'BLUE SCREEN (BSOD)',
      symptom: 'System crashes with QR code / Stop error codes like MEMORY_MANAGEMENT or CRITICAL_PROCESS_DIED.',
      serviceKey: 'blue-screen',
      serviceName: 'BSOD Real Cause Diagnosis',
      icon: Cpu,
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'p4',
      title: 'LOST DATA',
      symptom: 'Accidentally deleted files, formatted partition, or drive not opening (DO NOT FORMAT!).',
      serviceKey: 'data-recovery',
      serviceName: 'Data Recovery Assistance',
      icon: Database,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 'p5',
      title: 'NEED WINDOWS INSTALLED',
      symptom: 'New laptop/PC with FreeDOS/Ubuntu, corrupted OS, or preparing for fresh university/work semester.',
      serviceKey: 'windows-installation',
      serviceName: 'Fast Windows Installation & Setup',
      icon: Laptop,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'p6',
      title: 'UPGRADING HDD TO SSD',
      symptom: 'Old laptop has a slow mechanical hard drive; want 5x faster speed without losing existing setup.',
      serviceKey: 'os-migration',
      serviceName: 'HDD → SSD OS Migration',
      icon: HardDrive,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'p7',
      title: 'MULTIPLE PCs NEED WINDOWS',
      symptom: 'Office, school, academy, or computer lab requiring 5, 10, 20 or 50+ uniform installations.',
      serviceKey: 'bulk-windows',
      serviceName: 'Bulk Windows Deployment',
      icon: Building2,
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'p8',
      title: 'PASSWORD / ACCOUNT ACCESS',
      symptom: 'Forgotten local Windows password, PIN failure, or BitLocker recovery key guidance (Authorized only).',
      serviceKey: 'account-access',
      serviceName: 'Authorized Account Access Help',
      icon: KeyRound,
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    }
  ];

  return (
    <section id="problem-selector" className="py-14 sm:py-18 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-slate-300 mb-3">
            <span className="skeuo-led-amber"></span>
            <span>QUICK PROBLEM SELECTOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            WHAT COMPUTER PROBLEM ARE YOU HAVING?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Click on your computer issue below to see our diagnostic approach and book immediate on-site help at your location in Peshawar.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProblem(p.serviceKey, p.serviceName)}
                className="group text-left rounded-2xl skeuo-card p-5 transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl skeuo-btn text-blue-400 group-hover:text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 skeuo-badge px-2 py-0.5 rounded group-hover:text-blue-300 transition-colors">
                      Select →
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-2 font-mono">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {p.symptom}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-blue-400 font-mono">
                  <span className="truncate pr-2">{p.serviceName}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
