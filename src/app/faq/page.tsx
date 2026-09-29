import type { Metadata } from 'next';
import { FAQClientView } from './FAQClientView';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | TechFix Peshawar',
  description:
    'Answers about on-site computer visits, service fees, areas covered in Peshawar, data privacy, and diagnostic procedures.',
};

export default function Page() {
  return <FAQClientView />;
}
