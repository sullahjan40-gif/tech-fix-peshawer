import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactClientView } from './ContactClientView';

export const metadata: Metadata = {
  title: 'Book an On-Site Visit | TechFix Peshawar',
  description:
    'Schedule a fast computer repair visit in Peshawar. Tell us your issue, pick your time slot, and our technician comes to your location.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-slate-400 font-mono text-sm">Loading booking form...</div>}>
      <ContactClientView />
    </Suspense>
  );
}
