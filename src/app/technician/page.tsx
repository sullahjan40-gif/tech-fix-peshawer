import type { Metadata } from 'next';
import { AboutClientView } from '../about/AboutClientView';

export const metadata: Metadata = {
  title: 'Technician Profile & Qualifications | TechFix Peshawar',
  description:
    'Safiullah — Computer Science and Cybersecurity learner at University of Agriculture Peshawar with 5+ years hands-on experience in computer repair and troubleshooting.',
};

export default function Page() {
  return <AboutClientView />;
}
