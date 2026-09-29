import type { Metadata } from 'next';
import { WhyOnSiteClientView } from './WhyOnSiteClientView';

export const metadata: Metadata = {
  title: 'Why Choose On-Site Computer Repair | TechFix Peshawar',
  description:
    'No carrying heavy desktops to Saddar or Gulbahar. 100% data privacy: watch everything performed right in front of you at your home or office.',
};

export default function Page() {
  return <WhyOnSiteClientView />;
}
