import type { Metadata } from 'next';
import { TrackRequestClientView } from './TrackRequestClientView';

export const metadata: Metadata = {
  title: 'Track Service Request Status | TechFix Peshawar',
  description:
    'Check real-time status and technician updates for your on-site computer repair booking using your Tracking ID or Phone Number.',
};

export default function Page() {
  return <TrackRequestClientView />;
}
