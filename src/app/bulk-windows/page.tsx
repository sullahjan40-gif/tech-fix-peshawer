import type { Metadata } from 'next';
import { BulkWindowsClientView } from './BulkWindowsClientView';

export const metadata: Metadata = {
  title: 'Bulk Windows Deployment & Multi-PC Setup | TechFix Peshawar',
  description:
    'Standardized Windows installation, software deployment, driver configuration, and network optimization for computer labs, academies, and business offices in Peshawar.',
};

export default function Page() {
  return <BulkWindowsClientView />;
}
