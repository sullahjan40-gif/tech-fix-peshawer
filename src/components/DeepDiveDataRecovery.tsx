import { 
  ShieldAlert, 
  AlertOctagon, 
  Ban, 
  CheckCircle2, 
  ArrowRight, 
  HardDrive, 
  FileWarning, 
  Database, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { SiteSettings } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';

interface DeepDiveDataRecoveryProps {
  settings: SiteSettings;
  onBookRecovery: () => void;
}

export function DeepDiveDataRecovery({ settings, onBookRecovery }: DeepDiveDataRecoveryProps) {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "URGENT: I lost important data on my computer. I have stopped using the drive. Need on-site data recovery in Peshawar."
  );

  const criticalWarnings = [
    { title: 'DO NOT FORMAT THE DRIVE', desc: 'Formatting destroys file directory tables and sector allocation maps.' },
    { title: 'DO NOT INSTALL WINDOWS ON IT', desc: 'Installing a new OS overwrites tens of thousands of sectors permanently.' },
    { title: 'DO NOT COPY NEW FILES TO IT', desc: 'Any new document, video, or download takes the space of deleted files.' },
    { title: 'DO NOT KEEP USING IT UNNECESSARILY', desc: 'Even normal web browsing writes temporary cache files to the storage drive.' },
  ];

  const recoveryProtocol = [
    { step: '01', title: 'STOP USING THE DRIVE', desc: 'Safely disconnect power or unmount the partition immediately.' },
    { step: '02', title: 'ASSESS THE DRIVE', desc: 'Check S.M.A.R.T. health, read sector availability, and detect physical versus logical damage.' },
    { step: '03', title: 'PROTECT ORIGINAL DATA', desc: 'Lock write access using read-only mounting to ensure original drive stays untouched.' },
    { step: '04', title: 'CREATE AN IMAGE/CLONE', desc: 'Bit-by-bit raw disk image cloned to a verified external working drive.' },
    { step: '05', title: 'RECOVER FROM THE COPY', desc: 'Run deep signature carving and reconstruction on the cloned copy without touching the patient drive.' },
  ];

  const commonScenarios = [
    'Accidentally deleted thesis, assignments, or documents',
    'Family photos & videos deleted from Recycle Bin',
    'Drive formatted by mistake during Windows setup',
    'RAW partition or "You need to format the disk before using it" error',
    'Windows crashed and refuses to boot, but files remain on drive',
    'Accidentally deleted partition using Disk Management'
  ];

  return (
    <section id="data-recovery" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-rose-300 mb-3">
            <span className="skeuo-led-red"></span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>HIGH-PRIORITY WARNING & SERVICE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
            LOST YOUR DATA? <br />
            <span className="text-rose-400">STOP BEFORE YOU FORMAT.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            When files are deleted, they may remain physically present on the drive until their storage sectors are overwritten by new data. Acting promptly and properly is the difference between full recovery and permanent loss.
          </p>
        </div>

        {/* PROMINENT RED SKEUOMORPHIC WARNING CONSOLE */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-8 mb-12 shadow-2xl relative border-2 border-rose-500/40">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 right-3"><span className="skeuo-screw"></span></div>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-900/40">
            <div className="rounded-xl skeuo-btn p-2.5 text-rose-400">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide font-mono">
                CRITICAL FIRST RESPONSE: DO NOT OVERWRITE DATA
              </h3>
              <p className="text-xs text-rose-300/90 font-mono">
                Observe these 4 strict rules right now if you want any chance of recovering your files
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {criticalWarnings.map((w, i) => (
              <div key={i} className="rounded-2xl skeuo-card p-4 border border-rose-900/40">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1.5 font-mono">
                  <Ban className="h-4 w-4 shrink-0" />
                  <span>{w.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-rose-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300 font-mono">
              Turn off your computer now if you have deleted crucial files.
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl skeuo-btn-rose px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg font-mono"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Emergency WhatsApp Support</span>
            </a>
          </div>
        </div>

        {/* 2-Column: Safe Protocol vs Realistic Honest Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Recovery Protocol (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl skeuo-panel p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 font-mono">
              <Database className="h-5 w-5 text-rose-400" />
              <span>Our Non-Destructive Recovery Protocol</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              We never perform unsafe in-place recovery that could destroy your original drive.
            </p>

            <div className="space-y-4">
              {recoveryProtocol.map((p) => (
                <div key={p.step} className="rounded-xl skeuo-card p-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono font-bold text-rose-400 skeuo-badge px-2 py-0.5 rounded">
                      {p.step}
                    </span>
                    <h4 className="text-sm font-bold text-white font-mono">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 pl-9 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Honest Scopes & Physical Damage Limits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Common Scenarios */}
            <div className="rounded-2xl skeuo-panel p-6">
              <h4 className="text-sm font-bold text-white mb-3 font-mono">
                Recoverable Scenarios (Logical)
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {commonScenarios.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Crucial Honesty: Physical Damage Warning */}
            <div className="rounded-2xl skeuo-panel p-6">
              <h4 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2 font-mono">
                <FileWarning className="h-4 w-4 text-amber-400" />
                <span>Physical Damage & Hardware Failures</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                We are 100% honest with customers: No on-site technician can fix physically destroyed hard drive heads in a bedroom or office.
              </p>
              
              <div className="rounded-xl skeuo-inset p-3 text-[11px] text-slate-300 space-y-1.5 font-mono border border-slate-800">
                <div className="text-rose-400 font-semibold uppercase">Requires Specialist Cleanroom Lab:</div>
                <div>• Clicking / grinding metallic sound from HDD</div>
                <div>• Drive motor completely dead / not spinning</div>
                <div>• Burnt circuit board / electrical surge failure</div>
                <div>• Physical head crash or platter scratches</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Initial Diagnostic on-site
                </span>
                <button
                  onClick={onBookRecovery}
                  className="rounded-xl skeuo-btn-primary px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer font-mono"
                >
                  Request Assessment
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
