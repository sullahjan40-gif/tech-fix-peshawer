'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider, useApp } from '../../context/AppContext';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { MessageSquare, Calendar } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/whatsapp';

function InnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, activePage, navigate } = useApp();

  const isAdmin = pathname?.toLowerCase().includes('admin');

  // Dedicated clean view for Admin Panel without public Navbar/Footer
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <Navbar
        settings={settings}
        activePage={activePage}
        onNavigate={navigate}
        onOpenBooking={(serviceName) => navigate('contact', { service: serviceName })}
        onOpenTracking={() => navigate('track-request')}
      />

      {/* 2. DYNAMIC PAGE ROUTING CONTAINER */}
      <main className="flex-1">
        {children}
      </main>

      {/* 3. GLOBAL FOOTER WITH PAGE CONNECTIONS */}
      <Footer
        settings={settings}
        onNavigate={navigate}
        onOpenBooking={() => navigate('contact')}
      />

      {/* 4. FLOATING SPEED ACTION BAR */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5">
        <a
          href={getWhatsAppLink(
            settings.whatsappNumber,
            "Hello Safiullah! I have a computer problem and would like to ask about on-site service in Peshawar."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-emerald-600/40 hover:bg-emerald-500 hover:scale-105 transition-all border border-emerald-400/30"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp Fast Response</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>

        {activePage !== 'contact' && (
          <button
            onClick={() => navigate('contact')}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:scale-105 transition-all border border-blue-400/30 cursor-pointer sm:hidden"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Visit</span>
          </button>
        )}
      </div>

    </div>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <InnerShell>{children}</InnerShell>
    </AppProvider>
  );
}
