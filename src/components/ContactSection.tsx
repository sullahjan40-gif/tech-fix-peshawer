import React, { useState } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { SiteSettings } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';
import { CustomerInquiryModal } from './CustomerInquiryModal';

interface ContactSectionProps {
  settings: SiteSettings;
  serviceAreas: string[];
  onOpenBooking: () => void;
}

export function ContactSection({ settings, serviceAreas, onOpenBooking }: ContactSectionProps) {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello! I have a computer problem. I want to inquire about your on-site support in Peshawar."
  );

  return (
    <section id="contact" className="py-16 sm:py-24 relative overflow-hidden bg-slate-950/90 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* SCHEDULE ON-SITE SUPPORT CARD MATCHING MOCKUP */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-10 shadow-2xl mb-16 border border-amber-900/40 relative">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute bottom-3 right-3"><span className="skeuo-screw"></span></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col items-start text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Schedule On-Site Support or Consult Directly
                </h2>
              </div>

              <p className="mt-2 text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
                Need immediate help? Book a service visit or get in touch. We're here to help!
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenBooking}
                  className="skeuo-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xl cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book On-Site Service Visit</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skeuo-btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold text-amber-200 border border-amber-700/40 hover:border-amber-500 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <p className="mt-4 text-xs text-stone-400">
                Or contact us directly via WhatsApp or phone.
              </p>
            </div>

            {/* Right side framed sign matching mockup: "Better Performance Starts Here" */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="rounded-2xl border-4 border-amber-950/80 bg-stone-950 p-6 text-center shadow-2xl relative w-full max-w-[280px] flex flex-col items-center justify-center min-h-[140px] rotate-1 hover:rotate-0 transition-transform">
                <div className="text-lg sm:text-xl font-serif italic text-amber-200/90 tracking-wider">
                  "Better Performance <br /> Starts Here"
                </div>
                <div className="mt-2 text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">
                  TechFix Peshawar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Headline: COMPUTER PROBLEM? CONTACT ME. */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full skeuo-badge px-3.5 py-1 text-xs font-mono font-medium text-slate-300 mb-3">
            <span className="skeuo-led-cyan"></span>
            <span>GET IN TOUCH DIRECTLY</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            COMPUTER PROBLEM? CONTACT ME.
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Reach out via your preferred method. We respond promptly with diagnostic guidance and dispatch schedule.
          </p>
        </div>

        {/* Contact Grid: 4 Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          
          {/* Channel 1: WhatsApp (Primary) */}
          <div className="rounded-2xl skeuo-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl skeuo-btn text-emerald-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 skeuo-badge px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="skeuo-led-emerald"></span>
                  PRIMARY
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase">WhatsApp Chat</div>
              <div className="text-base font-bold text-white mt-1 font-mono">
                {settings.whatsappNumber}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Fastest response for diagnostic photos and location pins.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-emerald px-4 py-2.5 text-xs font-bold text-emerald-200 font-mono"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Channel 2: Direct Phone */}
          <div className="rounded-2xl skeuo-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl skeuo-btn text-blue-400">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 skeuo-badge px-2 py-0.5 rounded">
                  CALL
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase">Direct Phone</div>
              <div className="text-base font-bold text-white mt-1 font-mono">
                {settings.phoneNumber}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Call during active business hours for urgent issues.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <a
                href={`tel:${settings.phoneNumber.replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white transition-colors font-mono"
              >
                <span>Call Technician</span>
              </a>
            </div>
          </div>

          {/* Channel 3: Email */}
          <div className="rounded-2xl skeuo-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl skeuo-btn text-cyan-400">
                  <Mail className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 skeuo-badge px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="skeuo-led-emerald"></span>
                  CONNECTED
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase">Email Notifications</div>
              <div className="text-sm font-bold text-white mt-1 truncate font-mono" title={settings.email || 'ullahsafiullah117@gmail.com'}>
                {settings.email || 'ullahsafiullah117@gmail.com'}
              </div>
              <p className="text-xs text-slate-300 mt-2">
                All client questions, custom PC quotes, and service inquiries deliver directly to this inbox.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-4 py-2.5 text-xs font-bold text-white font-mono cursor-pointer shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Query Online</span>
              </button>
              <a
                href={`mailto:${settings.email || 'ullahsafiullah117@gmail.com'}?subject=Computer%20Service%20Inquiry%20-%20Peshawar`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors font-mono"
              >
                <span>Direct Mailto Client</span>
              </a>
            </div>
          </div>

          {/* Channel 4: Hours & Dispatch Availability */}
          <div className="rounded-2xl skeuo-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl skeuo-btn text-purple-400">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 skeuo-badge px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="skeuo-led-emerald"></span>
                  HOURS
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase">Operating Hours</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug font-mono">
                {settings.businessHours}
              </div>
              <p className="text-xs text-slate-300 mt-2 font-mono">
                Visit fee from {settings.visitFeeStarting}.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <button
                onClick={onOpenBooking}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl skeuo-btn-primary px-4 py-2.5 text-xs font-bold text-white cursor-pointer font-mono"
              >
                <span>Request Dispatch</span>
              </button>
            </div>
          </div>

        </div>

        {/* SERVICE AREAS DISPLAY ("WHERE WE PROVIDE SERVICE") */}
        <div className="rounded-3xl skeuo-panel p-6 sm:p-8 relative">
          <div className="absolute top-3 left-3"><span className="skeuo-screw"></span></div>
          <div className="absolute top-3 right-3"><span className="skeuo-screw"></span></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl skeuo-btn text-blue-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-mono">WHERE WE PROVIDE SERVICE</h4>
                <p className="text-xs text-slate-300">Active on-site coverage areas in Peshawar, Khyber Pakhtunkhwa</p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 skeuo-badge px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
              <span className="skeuo-led-emerald"></span>
              Primary City: Peshawar
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {serviceAreas.map((area, idx) => (
              <span
                key={idx}
                className="rounded-xl skeuo-card px-3.5 py-1.5 text-xs text-slate-200 flex items-center gap-1.5 font-mono"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                <span>{area}</span>
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4 italic font-mono">
            * Located outside these primary zones in Khyber Pakhtunkhwa? Inquire via WhatsApp for custom travel arrangements or scheduled multi-machine deployments.
          </p>
        </div>

      </div>

      <CustomerInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        whatsappNumber={settings.whatsappNumber}
        recipientEmail={settings.email || 'ullahsafiullah117@gmail.com'}
      />
    </section>
  );
}
