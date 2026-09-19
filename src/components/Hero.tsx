import { useState } from 'react';
import { ShieldCheck, MessageSquare, Calendar, CheckCircle2, ArrowRight, MapPin, Laptop, HardDrive, Cpu, Database, Wrench, UserCheck, Clock, Star, Zap } from 'lucide-react';
import { SiteSettings } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';

interface HeroProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

const DEFAULT_PORTRAIT = '/uploads/technician-portrait-1789213477063.jpg';

export function Hero({ settings, onOpenBooking }: HeroProps) {
  const [imgError, setImgError] = useState(false);
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello! I have a computer problem. I'd like to book an on-site visit in Peshawar."
  );

  const photoSrc = !imgError && settings.technicianPhoto && settings.technicianPhoto.trim() !== '' 
    ? settings.technicianPhoto 
    : DEFAULT_PORTRAIT;

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16">
      {/* Background ambient lighting in warm amber/gold */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Landscape Hero Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT SIDE (6 or 7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Small label matching mockup */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-mono font-medium text-amber-300 mb-5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>FAST • RELIABLE • PROFESSIONAL</span>
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-5">
              Computer Problem? <br />
              <span className="text-amber-400">
                We'll Come to You.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-6 max-w-2xl font-sans">
              Expert on-site & remote computer support in Peshawar. Windows, repairs, upgrades, and more — for home, office and students.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              <button
                onClick={onOpenBooking}
                className="skeuo-btn-primary inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-xl cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span className="tracking-wide text-xs sm:text-sm">Book a Service Visit</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="skeuo-btn inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-amber-200 border border-amber-700/40 hover:border-amber-500 hover:text-white shadow-lg cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span className="tracking-wide text-xs sm:text-sm">Chat on WhatsApp</span>
              </a>
            </div>

            {/* 4 Trust bar items matching mockup */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl pt-4 border-t border-amber-900/40">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-900/40 border border-amber-900/20">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Fast Response</div>
                  <div className="text-[10px] text-stone-400">Usually within 1 hour</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-900/40 border border-amber-900/20">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Trusted & Secure</div>
                  <div className="text-[10px] text-stone-400">Your data is safe</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-900/40 border border-amber-900/20">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Peshawar Area</div>
                  <div className="text-[10px] text-stone-400">Home & Office Support</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-900/40 border border-amber-900/20">
                <Star className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">5+ Years Experience</div>
                  <div className="text-[10px] text-stone-400">Real Solutions</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Tech Service Interface with Technician Image and Floating Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Outer Tech HUD Frame inspired by skeuomorphic chassis */}
            <div className="relative w-full max-w-md rounded-3xl skeuo-panel p-4 shadow-2xl border border-amber-800/40">
              {/* Corner screws for physical hardware authenticity */}
              <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
              <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
              <div className="absolute bottom-3 left-3"><span className="skeuo-screw"></span></div>
              <div className="absolute bottom-3 right-3"><span className="skeuo-screw"></span></div>

              {/* Header HUD Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-amber-900/40 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="skeuo-led-green"></span>
                  <span className="font-mono text-amber-200 font-semibold text-[11px] tracking-wide">ON-SITE DISPATCH READY</span>
                </div>
                <span className="rounded-md skeuo-badge px-2 py-0.5 font-mono text-[10px] text-amber-300 font-bold border border-amber-700/40">
                  PESHAWAR
                </span>
              </div>

              {/* Central Technician Photo with Tech HUD Overlays */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-amber-900/60 bg-stone-950 skeuo-inset flex items-center justify-center">
                <img
                  src={photoSrc}
                  alt="Computer Service Technician in Peshawar"
                  className="h-full w-full object-cover object-center filter brightness-[0.96] contrast-[1.04]"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={() => {
                    if (!imgError) setImgError(true);
                  }}
                />

                {/* Subtle gradient vignette at bottom of photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

                {/* Technician ID badge embedded in image */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl skeuo-panel p-2.5 backdrop-blur-md border border-amber-700/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{settings.technicianName}</span>
                        <span className="skeuo-led-green"></span>
                      </div>
                      <div className="text-[10px] text-amber-200/80 font-mono">
                        {settings.technicianTitle}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/90 px-2 py-1 rounded-md border border-amber-800/60 font-bold shadow-inner">
                      5+ YRS EXP
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Technology Service Cards surrounding/layering */}
              {/* Floating Card 1: Top Left */}
              <div className="absolute -top-3 -left-3 sm:-left-6 rounded-xl skeuo-card px-3 py-2 shadow-2xl flex items-center gap-2 z-20">
                <div className="rounded-lg skeuo-inset p-1.5 text-blue-400">
                  <Laptop className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white font-mono">WINDOWS INSTALL</div>
                  <div className="text-[9px] text-slate-400 font-mono">10 & 11 • Clean & Drivers</div>
                </div>
              </div>

              {/* Floating Card 2: Top Right */}
              <div className="absolute -top-3 -right-3 sm:-right-6 rounded-xl skeuo-card px-3 py-2 shadow-2xl flex items-center gap-2 z-20">
                <div className="rounded-lg skeuo-inset p-1.5 text-cyan-400">
                  <HardDrive className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white font-mono">SSD MIGRATION</div>
                  <div className="text-[9px] text-slate-400 font-mono">HDD to SSD Upgrade</div>
                </div>
              </div>

              {/* Floating Card 3: Middle Left */}
              <div className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 rounded-xl skeuo-card px-3 py-2 shadow-2xl flex items-center gap-2 z-20">
                <div className="rounded-lg skeuo-inset p-1.5 text-emerald-400">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white font-mono">DATA RECOVERY</div>
                  <div className="text-[9px] text-slate-400 font-mono">Safe Sector Imaging</div>
                </div>
              </div>

              {/* Floating Card 4: Middle Right */}
              <div className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 rounded-xl skeuo-card px-3 py-2 shadow-2xl flex items-center gap-2 z-20">
                <div className="rounded-lg skeuo-inset p-1.5 text-indigo-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white font-mono">BSOD ANALYSIS</div>
                  <div className="text-[9px] text-slate-400 font-mono">Minidump & RAM Checks</div>
                </div>
              </div>

              {/* Floating Card 5: Bottom Center */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-xl skeuo-card px-4 py-2 shadow-2xl flex items-center gap-2.5 z-20 whitespace-nowrap">
                <div className="rounded-lg skeuo-inset p-1 text-blue-400">
                  <Wrench className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide font-mono">
                  ON-SITE SUPPORT • WE COME TO YOU
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* SERVICE-FIRST HERO PANEL: HOW IT WORKS */}
        <div className="mt-12 lg:mt-16 rounded-2xl skeuo-panel p-4 sm:p-6 shadow-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="skeuo-led-blue"></span>
              <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-200 uppercase font-mono">
                HOW IT WORKS • SERVICE JOURNEY
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Transparent, Direct & In Front of You
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { num: '01', title: 'CONTACT', desc: 'WhatsApp or web form' },
              { num: '02', title: 'BOOK', desc: 'Choose convenient time' },
              { num: '03', title: 'WE VISIT', desc: 'At your home/office' },
              { num: '04', title: 'DIAGNOSE', desc: 'Find root cause first' },
              { num: '05', title: 'SOLVE', desc: 'Hardware & OS fixed' },
              { num: '06', title: 'TEST', desc: 'Customer verifies & pays' },
            ].map((step, idx) => (
              <div 
                key={step.num}
                className="group relative rounded-xl skeuo-card p-3.5 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-blue-400 group-hover:text-cyan-300 transition-colors">
                    {step.num}
                  </span>
                  {idx < 5 && (
                    <span className="hidden lg:block text-slate-600 text-xs font-mono">→</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mb-0.5 tracking-tight font-mono">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight font-sans">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
