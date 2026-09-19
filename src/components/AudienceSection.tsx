import { GraduationCap, Home, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { AudienceItem } from '../types';

interface AudienceSectionProps {
  customAudiences?: AudienceItem[];
  onBookForAudience: (category: string) => void;
}

export function AudienceSection({ customAudiences, onBookForAudience }: AudienceSectionProps) {
  const defaultAudiences = [
    {
      id: 'students',
      title: 'STUDENTS',
      tagline: 'Agriculture University, Peshawar Uni, Medical & Engineering Campuses',
      headline: 'Your laptop is part of your education. Get computer problems handled without wasting your study day.',
      icon: GraduationCap,
      accent: 'border-blue-500/40 bg-blue-950/30 text-blue-400',
      badge: 'STUDENT FRIENDLY',
      status: 'published',
      services: [
        'Clean Windows 10 & 11 setups for semester work',
        'HDD to SSD upgrades for old study laptops',
        'BSOD & overheating diagnostics',
        'Academic software, compilers & development environments',
        'Thesis & lost assignment data recovery assistance',
        'Special student turnaround speed'
      ]
    },
    {
      id: 'home-users',
      title: 'HOME USERS',
      tagline: 'Families, Personal Laptops & Home Desktops Across Peshawar',
      headline: 'Computer problems at home? Get practical assistance without carrying your computer around.',
      icon: Home,
      accent: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400',
      badge: 'MAXIMUM CONVENIENCE',
      status: 'published',
      services: [
        'Zero travel: no carrying heavy desktop towers in traffic',
        'Full privacy: family photos & accounts stay safe in your home',
        'Home Wi-Fi & wireless printer configuration',
        'Slow PC cleanups & storage expansion',
        'Parental controls & browser safety setups',
        'Transparent in-person diagnosis in your living room'
      ]
    },
    {
      id: 'offices',
      title: 'OFFICES & ACADEMIES',
      tagline: 'Small Businesses, Schools, Academies & Computer Labs',
      headline: "Keep your team's computers working with on-site support and bulk Windows deployment.",
      icon: Building2,
      accent: 'border-purple-500/40 bg-purple-950/30 text-purple-400',
      badge: 'WORKPLACE READY',
      status: 'published',
      services: [
        'Bulk Windows deployment across 5, 10, 20 or 50+ PCs',
        'Standardized workstation software & driver profiles',
        'Network printer sharing & office file sharing',
        'Scheduled weekend maintenance with zero downtime',
        'Computer lab refreshes for schools & colleges',
        'Formal receipts & documented hardware logs'
      ]
    }
  ];

  const getIconAndAccent = (item: AudienceItem, idx: number) => {
    const key = (item.key || item.id || '').toLowerCase();
    if (key.includes('student')) {
      return { icon: GraduationCap, accent: 'border-blue-500/40 bg-blue-950/30 text-blue-400' };
    } else if (key.includes('home')) {
      return { icon: Home, accent: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400' };
    } else if (key.includes('office') || key.includes('acad')) {
      return { icon: Building2, accent: 'border-purple-500/40 bg-purple-950/30 text-purple-400' };
    }
    const icons = [GraduationCap, Home, Building2];
    const accents = [
      'border-blue-500/40 bg-blue-950/30 text-blue-400',
      'border-emerald-500/40 bg-emerald-950/30 text-emerald-400',
      'border-purple-500/40 bg-purple-950/30 text-purple-400'
    ];
    return { icon: icons[idx % icons.length], accent: accents[idx % accents.length] };
  };

  const rawAudiences = (customAudiences && customAudiences.length > 0)
    ? customAudiences.map((aud, idx) => {
        const styling = getIconAndAccent(aud, idx);
        return {
          id: aud.key || aud.id,
          title: aud.title,
          tagline: aud.tagline,
          headline: aud.headline,
          badge: aud.badge,
          icon: styling.icon,
          accent: styling.accent,
          status: aud.status || 'published',
          services: aud.services || []
        };
      })
    : defaultAudiences;

  const audiences = rawAudiences.filter((a) => a.status !== 'unpublished');

  return (
    <section id="who-we-serve" className="py-16 sm:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-slate-300 mb-3">
            <span className="skeuo-led-cyan"></span>
            <span>TAILORED SUPPORT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            WHO WE SERVE IN PESHAWAR
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Dedicated on-site service designed for real everyday needs—from student hostels to active commercial offices.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {audiences.map((aud) => {
            const Icon = aud.icon;
            return (
              <div
                key={aud.id}
                className="rounded-3xl skeuo-panel p-6 sm:p-8 flex flex-col justify-between transition-all shadow-xl relative"
              >
                <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
                <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl skeuo-btn text-blue-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="skeuo-badge text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {aud.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 font-mono">
                    {aud.title}
                  </h3>
                  <div className="text-xs text-blue-400 font-medium mb-3 font-mono">
                    {aud.tagline}
                  </div>

                  <p className="text-sm text-slate-300 font-medium mb-6 leading-relaxed">
                    "{aud.headline}"
                  </p>

                  <div className="space-y-2.5 text-xs text-slate-400 border-t border-slate-800/80 pt-4 mb-6">
                    <div className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                      Popular Services:
                    </div>
                    {aud.services.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onBookForAudience(aud.title)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer font-mono"
                  >
                    <span>Request Service for {aud.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
