import type { Metadata } from 'next';
import { ProblemsSolutionsClientView } from './ProblemsSolutionsClientView';

export const metadata: Metadata = {
  title: 'Common Computer Problems & Practical Solutions | TechFix Peshawar',
  description:
    'Solutions for slow laptops, blue screen of death (BSOD), overheating, malware infections, and failing hard drives in Peshawar.',
};

export default function Page() {
  return <ProblemsSolutionsClientView />;
}
