import type { Metadata } from 'next';
import { HomeClientView } from './HomeClientView';

export const metadata: Metadata = {
  title: 'TechFix Peshawar — Professional On-Site Computer Repair',
  description:
    'On-site computer diagnostic, clean Windows setup, SSD upgrades, data recovery, and laptop servicing at your doorstep in Peshawar. WhatsApp fast response.',
};

export default function Page() {
  return <HomeClientView />;
}
