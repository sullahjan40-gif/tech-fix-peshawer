import type { Metadata } from 'next';
import { HowItWorksClientView } from './HowItWorksClientView';

export const metadata: Metadata = {
  title: 'How On-Site Computer Repair Works | TechFix Peshawar',
  description:
    'Simple 4-step on-site computer support in Peshawar: Contact, Explain, Schedule visit, and Diagnostic resolution right in front of you.',
};

export default function Page() {
  return <HowItWorksClientView />;
}
