'use client';

import { useApp } from '../../context/AppContext';
import { FAQPage } from '../../views/FAQPage';

export function FAQClientView() {
  const { faqs, settings, pageSections, navigate } = useApp();

  return (
    <FAQPage
      faqs={faqs}
      settings={settings}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
