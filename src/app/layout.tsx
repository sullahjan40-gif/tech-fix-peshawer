import type { Metadata } from 'next';
// Global design system CSS (wood/skeuomorphic theme + Tailwind v4 base)
import '../index.css';

export const metadata: Metadata = {
  title: 'TechFix Peshawar — On-Site Computer Repair',
  description:
    'Professional on-site computer repair services in Peshawar. Windows installation, data recovery, SSD upgrades, BSOD diagnosis, and more.',
  keywords: [
    'computer repair Peshawar',
    'on-site IT support',
    'Windows installation',
    'data recovery',
    'SSD upgrade',
    'TechFix Peshawar',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
