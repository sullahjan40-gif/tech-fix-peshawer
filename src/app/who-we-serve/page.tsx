import type { Metadata } from 'next';
import { WhoWeServeClientView } from './WhoWeServeClientView';

export const metadata: Metadata = {
  title: 'Who We Serve: Homes, Students, Offices | TechFix Peshawar',
  description:
    'Dedicated computer repair for families & home PCs, university students in hostels, freelancers, and small offices throughout Peshawar.',
};

export default function Page() {
  return <WhoWeServeClientView />;
}
