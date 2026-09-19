import { Laptop, Phone, MessageSquare, Mail, MapPin, ShieldCheck, Lock, ArrowRight, Linkedin, Facebook, Share2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.28c-.01 2.37-.9 4.7-2.5 6.36-1.74 1.83-4.27 2.81-6.79 2.61-2.4-.17-4.69-1.39-6.07-3.37-1.49-2.07-1.84-4.82-1.01-7.25.75-2.29 2.53-4.14 4.79-4.99 1.18-.45 2.45-.63 3.71-.56v4.07c-.77-.1-1.57.03-2.27.38-.85.41-1.49 1.18-1.77 2.08-.34 1.05-.14 2.26.54 3.09.64.81 1.68 1.28 2.72 1.27 1.22.03 2.4-.64 2.97-1.71.3-.54.44-1.16.43-1.78V.02h.21z" />
    </svg>
  );
}

interface FooterProps {
  settings: SiteSettings;
  onNavigate?: (page: string, params?: any) => void;
  onOpenBooking: () => void;
}

export function Footer({ settings, onNavigate, onOpenBooking }: FooterProps) {
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello! I am contacting you from your website regarding on-site service in Peshawar."
  );

  const handleNav = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      onOpenBooking();
    }
  };

  const socialLinks = [
    {
      name: 'X (Twitter)',
      url: settings.socialX || 'https://x.com',
      icon: <XIcon className="h-4 w-4" />,
      hoverColor: 'hover:text-sky-300 hover:border-sky-500/40',
      label: '@safiullah on X'
    },
    {
      name: 'LinkedIn',
      url: settings.socialLinkedin || 'https://linkedin.com',
      icon: <Linkedin className="h-4 w-4" />,
      hoverColor: 'hover:text-blue-400 hover:border-blue-500/40',
      label: 'LinkedIn Profile'
    },
    {
      name: 'TikTok',
      url: settings.socialTiktok || 'https://tiktok.com',
      icon: <TikTokIcon className="h-4 w-4" />,
      hoverColor: 'hover:text-pink-400 hover:border-pink-500/40',
      label: 'TikTok Videos'
    },
    {
      name: 'Facebook',
      url: settings.socialFacebook || 'https://facebook.com',
      icon: <Facebook className="h-4 w-4" />,
      hoverColor: 'hover:text-blue-500 hover:border-blue-600/40',
      label: 'Facebook Page'
    }
  ];

  return (
    <footer className="skeuo-panel border-t border-slate-800 text-slate-400 text-xs py-14 relative overflow-hidden">
      {/* Decorative Hardware Corner Rivets */}
      <div className="absolute top-3 left-4 hidden sm:block">
        <span className="skeuo-screw opacity-60" />
      </div>
      <div className="absolute top-3 right-4 hidden sm:block">
        <span className="skeuo-screw opacity-60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand, Positioning & Social Hub */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_4px_10px_rgba(37,99,235,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border-t border-blue-300/40 group-hover:scale-105 transition-all">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white font-mono group-hover:text-blue-400 transition-colors block">
                  {settings.businessName || 'Peshawar On-Site PC Support'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Hardware & Diagnostic Specialist
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings.tagline || 'Contact Online — We Come To You. Professional Computer Support in Peshawar.'}
            </p>

            <div className="skeuo-inset rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Operational Philosophy:
              </div>
              <div className="text-slate-400">Fast diagnostic clarity, genuine drivers, no unnecessary reformatting, and respectful customer data privacy.</div>
            </div>

            {/* Skeuomorphic Social Media & Contact Keys Console */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300">
                  Connect & Social Channels
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.label}
                    className={`skeuo-social-btn flex items-center justify-center h-9 w-9 rounded-xl text-slate-300 transition-all ${item.hoverColor}`}
                  >
                    {item.icon}
                  </a>
                ))}

                {/* Direct WhatsApp Key */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Direct WhatsApp Chat with Technician"
                  className="skeuo-social-btn flex items-center justify-center h-9 px-2.5 gap-1.5 rounded-xl text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 text-xs font-mono font-bold"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Direct Phone Key */}
                <a
                  href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
                  title="Direct Call Dispatch"
                  className="skeuo-social-btn flex items-center justify-center h-9 px-2.5 gap-1.5 rounded-xl text-blue-400 hover:text-blue-300 hover:border-blue-500/40 text-xs font-mono font-bold"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </a>

                {/* Direct Email Key */}
                <a
                  href={`mailto:${settings.email}`}
                  title="Send Direct Inquiry Email"
                  className="skeuo-social-btn flex items-center justify-center h-9 w-9 rounded-xl text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Services Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Core Services
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('services')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Windows 10 / 11 Installation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('services')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  HDD to SSD OS Migration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('services')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Data Recovery Assistance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('services')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Blue Screen (BSOD) Repair
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('bulk-windows')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Bulk Lab Deployment (5-50+ PCs)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('services')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-blue-400 font-semibold"
                >
                  View All Services →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Navigation Pages */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Explore Pages
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('how-it-works')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  How It Works (4 Steps)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('why-on-site')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Why On-Site (Vs Shop)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('problems-solutions')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Problems & Solutions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('about')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  About Safiullah (Technician)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('who-we-serve')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Who We Serve
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('bulk-windows')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Bulk Windows
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('faq')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer text-slate-400"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer font-semibold text-blue-400"
                >
                  Contact & Book Visit →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Dispatch Contact */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Direct Contact
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg skeuo-inset flex items-center justify-center shrink-0">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono">
                  {settings.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg skeuo-inset flex items-center justify-center shrink-0">
                  <Phone className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <a href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`} className="hover:text-white font-mono">
                  {settings.phoneNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg skeuo-inset flex items-center justify-center shrink-0">
                  <Mail className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <a 
                  href={`mailto:${settings.email || 'ullahsafiullah117@gmail.com'}`} 
                  className="truncate hover:text-cyan-300 transition-colors font-mono"
                  title="Send email query to Safiullah"
                >
                  {settings.email || 'ullahsafiullah117@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg skeuo-inset flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <span>Peshawar, Khyber Pakhtunkhwa</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => handleNav('contact')}
                className="skeuo-btn-primary w-full rounded-xl px-3 py-2.5 text-xs font-bold text-white text-center block cursor-pointer"
              >
                Schedule an On-Site Visit
              </button>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Bottom Line with Hidden Admin Access */}
        <div className="pt-6 border-t border-amber-950/40 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="text-stone-400 hover:text-amber-400/90 transition-colors cursor-pointer text-left focus:outline-none"
              title="TechFix System Access"
            >
              © {new Date().getFullYear()} TechFix On-Site Computer Services. All rights reserved.
            </button>
          </div>

          <div className="text-center md:text-right font-mono text-[11px] text-amber-500/80">
            Fast Support • Better Performance • Peshawar
          </div>
        </div>

      </div>
    </footer>
  );
}
