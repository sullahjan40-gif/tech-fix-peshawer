'use client';

import { useApp } from '../../context/AppContext';
import { HowItWorksPage } from '../../views/HowItWorksPage';

export function HowItWorksClientView() {
  const { settings, caseStudies, pageSections, navigate } = useApp();

  return (
    <HowItWorksPage
      settings={settings}
      caseStudies={caseStudies}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
