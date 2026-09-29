import type { Metadata } from 'next';
import { AboutClientView } from './AboutClientView';

export const metadata: Metadata = {
  title: 'About Safiullah & TechFix Peshawar | Computer Practitioner',
  description:
    'Learn about Safiullah, Computer Science and Cybersecurity learner at University of Agriculture Peshawar with 5+ years of practical hardware and Windows diagnostics experience.',
};

export default function Page() {
  return <AboutClientView />;
}
