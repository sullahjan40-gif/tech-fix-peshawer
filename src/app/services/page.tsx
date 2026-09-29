import type { Metadata } from 'next';
import { ServicesClientView } from './ServicesClientView';

export const metadata: Metadata = {
  title: 'On-Site Services & Pricing | TechFix Peshawar',
  description:
    'Transparent pricing for Windows installation, SSD upgrades, data recovery, and computer diagnostic services in Peshawar. 14-day service warranty.',
};

export default function Page() {
  return <ServicesClientView />;
}
