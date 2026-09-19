import React from 'react';
import { ShieldAlert, ArrowLeft, MessageSquare, PhoneCall, Home } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

interface PageUnpublishedNoticeProps {
  pageTitle: string;
  pageKey: string;
  onNavigate: (page: string) => void;
}

export function PageUnpublishedNotice({ pageTitle, pageKey, onNavigate }: PageUnpublishedNoticeProps) {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: 'Home', page: 'home' },
            { label: pageTitle, active: true }
          ]} 
          onNavigate={onNavigate} 
        />

        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-slate-950/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            SECTION CURRENTLY OFFLINE / UNDER MAINTENANCE
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            {pageTitle} is Temporarily Unpublished
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
            This section has been temporarily set to offline by the technician for content updates or scheduling maintenance. Our on-site diagnostic and repair services remain fully operational across all sectors of Peshawar.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>Back to Homepage</span>
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/25 transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Book On-Site Visit</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            Need urgent assistance? Call or WhatsApp technician Safiullah directly at{' '}
            <a href="tel:03440940443" className="text-emerald-400 font-mono font-semibold hover:underline">
              0344 0940443
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
