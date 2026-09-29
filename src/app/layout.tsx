import type { Metadata } from 'next';
import '../index.css';
import { ClientShell } from '../components/layout/ClientShell';

export const metadata: Metadata = {
  title: 'TechFix Peshawar — On-Site Computer Repair & Windows Support',
  description:
    'Professional on-site computer support, Windows setup, SSD upgrades, BSOD troubleshooting, and data recovery assistance delivered at your home, hostel, or office in Peshawar.',
  keywords: [
    'computer repair Peshawar',
    'on-site IT support Peshawar',
    'Windows installation Peshawar',
    'data recovery Peshawar',
    'SSD upgrade Peshawar',
    'laptop repair Peshawar',
    'TechFix Peshawar',
  ],
  openGraph: {
    title: 'TechFix Peshawar — On-Site Computer Repair & Windows Support',
    description:
      'Professional on-site computer support, Windows setup, SSD upgrades, BSOD troubleshooting, and data recovery assistance in Peshawar.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#090b10] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
