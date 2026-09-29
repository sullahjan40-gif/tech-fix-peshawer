import type { Metadata } from 'next';
import { AdminClientView } from './AdminClientView';

export const metadata: Metadata = {
  title: 'Administrator Console | TechFix Peshawar',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminClientView />;
}
