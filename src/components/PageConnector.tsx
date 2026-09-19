import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  Users, 
  Layers, 
  UserCheck, 
  HelpCircle, 
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

export interface PageLink {
  page: string;
  title: string;
  description: string;
  badge?: string;
  icon?: any;
}

interface PageConnectorProps {
  currentPageTitle: string;
  links: PageLink[];
  onNavigate: (page: string, params?: any) => void;
  whatsappNumber?: string;
}

export function PageConnector({ currentPageTitle, links, onNavigate, whatsappNumber = "+92 300 0000000" }: PageConnectorProps) {
  const getIcon = (page: string) => {
    switch (page) {
      case 'services': return Wrench;
      case 'how-it-works': return Clock;
      case 'why-on-site': return ShieldCheck;
      case 'who-we-serve': return Users;
      case 'bulk-windows': return Layers;
      case 'technician': return UserCheck;
      case 'faq': return HelpCircle;
      case 'contact': return Calendar;
      default: return ArrowRight;
    }
  };

  const whatsappUrl = getWhatsAppLink(
    whatsappNumber,
    `Hello Safiullah! I was viewing the ${currentPageTitle} page on your website and would like to ask a question.`
  );

  return (
    <section className="mt-20 pt-12 border-t border-slate-900 bg-gradient-to-b from-transparent to-slate-950/60 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
              Explore Related Sections
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Connect With Other Information
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Everything in our on-site computer service is transparent and connected. Jump directly to related guides or schedule your appointment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Ask on WhatsApp</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Service</span>
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const Icon = link.icon || getIcon(link.page);
            return (
              <div
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="h-4 w-4" />
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {link.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {link.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Go to {link.title}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
