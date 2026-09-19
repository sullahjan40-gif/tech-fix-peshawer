import { useState } from 'react';
import { ShieldCheck, MessageSquare, PhoneCall, Calendar, Menu, X, Search, Wrench } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  activePage?: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: (serviceName?: string) => void;
  onOpenTracking: () => void;
}

export function Navbar({ 
  settings, 
  activePage = 'home', 
  onNavigate, 
  onOpenBooking, 
  onOpenTracking
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', page: 'services' },
    { label: 'Why On-Site', page: 'why-on-site' },
    { label: 'Problems & Solutions', page: 'problems-solutions' },
    { label: 'How It Works', page: 'how-it-works' },
    { label: 'Who We Serve', page: 'who-we-serve' },
    { label: 'Bulk Windows', page: 'bulk-windows' },
    { label: 'About', page: 'about' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Track Request', page: 'track-request' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleLinkClick = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello Safiullah! I need computer service in Peshawar. Can you please assist me?"
  );

  return (
    <header className="sticky top-0 z-40 w-full skeuo-panel border-b border-slate-800">
      {/* Top micro status bar */}
      <div className="border-b border-slate-800/70 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 px-4 py-1.5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="skeuo-led-green"></span>
              On-Site Service Active
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">Peshawar (University Town, Hayatabad, Saddar & Surrounds)</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => {
                onNavigate('track-request');
              }}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer text-xs"
            >
              <Search className="h-3 w-3 text-blue-400" />
              <span>Track Request</span>
            </button>
            <a 
              href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors font-mono text-xs"
            >
              <PhoneCall className="h-3 w-3 text-emerald-400" />
              <span>{settings.phoneNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 group text-left cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-amber-600 to-amber-900 text-white shadow-[0_4px_10px_rgba(217,119,6,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border-t border-amber-400/40 group-hover:scale-105 transition-all">
            <Wrench className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors font-mono">
                Peshawar
              </span>
            </div>
            <p className="text-[11px] text-amber-400/90 font-mono tracking-wide">
              On-Site Computer Support
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300 p-1 rounded-xl skeuo-inset border border-amber-900/30">
          {[
            { label: 'Home', page: 'home' },
            { label: 'Services', page: 'services' },
            { label: 'Why On-Site', page: 'why-on-site' },
            { label: 'Problems & Solutions', page: 'problems-solutions' },
            { label: 'About', page: 'about' },
            { label: 'FAQ', page: 'faq' },
            { label: 'Contact', page: 'contact' },
          ].map((link) => {
            const isActive = activePage === link.page;
            return (
              <button
                key={link.page + link.label}
                onClick={() => handleLinkClick(link.page)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'skeuo-btn-primary text-white font-bold'
                    : 'text-amber-100/80 hover:text-amber-300 hover:bg-amber-950/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('track-request')}
            className="skeuo-btn inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-amber-200 border border-amber-700/40 hover:border-amber-500 hover:text-white transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-amber-400" />
            <span>Track Request</span>
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="skeuo-btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-amber-900/40"
          >
            <Calendar className="h-4 w-4" />
            <span>Book a Service</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => onNavigate('contact')}
            className="skeuo-btn-primary inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="skeuo-card rounded-lg p-2 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 skeuo-panel px-4 py-4 max-h-[85vh] overflow-y-auto">
          <div className="grid gap-1.5">
            <button
              onClick={() => handleLinkClick('home')}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all cursor-pointer ${
                activePage === 'home'
                  ? 'skeuo-btn-primary text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>Home Overview</span>
            </button>

            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleLinkClick(link.page)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'skeuo-btn-primary text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}

            <div className="mt-4 pt-3 border-t border-slate-800/80 grid gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="skeuo-btn-emerald flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-emerald-300"
              >
                <MessageSquare className="h-4 w-4" />
                Contact on WhatsApp
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('track-request');
                }}
                className="skeuo-card flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium text-slate-300 cursor-pointer"
              >
                <Search className="h-4 w-4 text-blue-400" />
                Track Service Request
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
