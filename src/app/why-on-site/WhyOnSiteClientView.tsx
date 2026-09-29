'use client';

import { useApp } from '../../context/AppContext';
import { WhyOnSitePage } from '../../views/WhyOnSitePage';

export function WhyOnSiteClientView() {
  const { settings, pageSections, navigate } = useApp();

  return (
    <WhyOnSitePage
      settings={settings}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
