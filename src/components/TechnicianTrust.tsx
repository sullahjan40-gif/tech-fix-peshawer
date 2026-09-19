import { useState } from 'react';
import { ShieldCheck, GraduationCap, CheckCircle2, Lock, Terminal, Award, Star } from 'lucide-react';
import { SiteSettings } from '../types';

interface TechnicianTrustProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

const DEFAULT_PORTRAIT = '/uploads/technician-portrait-1789213477063.jpg';

export function TechnicianTrust({ settings, onOpenBooking }: TechnicianTrustProps) {
  const [imgError, setImgError] = useState(false);

  const photoSrc = !imgError && settings.technicianPhoto && settings.technicianPhoto.trim() !== '' 
    ? settings.technicianPhoto 
    : DEFAULT_PORTRAIT;

  return (
    <section id="technician" className="py-16 sm:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Container with tactile wood panel */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-10 shadow-2xl relative border border-amber-900/40">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 right-3"><span className="skeuo-screw"></span></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Professional Photo frame */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="relative w-full max-w-[260px]">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden skeuo-inset p-1.5 shadow-2xl border border-amber-900/50 bg-stone-950">
                  <img
                    src={photoSrc}
                    alt={settings.technicianName}
                    className="h-full w-full object-cover object-center rounded-xl filter brightness-[0.96] contrast-[1.04]"
                    loading="eager"
                    decoding="async"
                    onError={() => {
                      if (!imgError) setImgError(true);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent rounded-xl pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Middle: Details & 3 Badges */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                  Your Trusted Local Technician
                </h2>

                <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
                  I'm a student at the <span className="text-amber-400 font-semibold">University of Agriculture, Peshawar</span>, learning Computer Science and Cybersecurity. With around 5 years of practical computer experience, I'm here to help you with honest advice and reliable support.
                </p>

                {/* 3 Stat Badges matching mockup */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl skeuo-card p-2.5 text-center border border-amber-900/30">
                    <ShieldCheck className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">5+ Years</div>
                    <div className="text-[10px] text-stone-400">Experience</div>
                  </div>
                  <div className="rounded-xl skeuo-card p-2.5 text-center border border-amber-900/30">
                    <GraduationCap className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">Student</div>
                    <div className="text-[10px] text-stone-400">UAP</div>
                  </div>
                  <div className="rounded-xl skeuo-card p-2.5 text-center border border-amber-900/30">
                    <Terminal className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">Skilled in</div>
                    <div className="text-[10px] text-stone-400">Windows & Security</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Our Promise Card matching mockup */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl skeuo-card p-6 border border-amber-800/40 relative">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Our Promise</span>
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-stone-200 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Fast & professional service</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Transparent pricing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Your satisfaction matters</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-amber-900/40 flex items-center justify-between">
                  <span className="text-xs text-stone-400">Technician Signature</span>
                  <span className="text-xl text-amber-300 font-serif italic tracking-wide">
                    Safiullah
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
