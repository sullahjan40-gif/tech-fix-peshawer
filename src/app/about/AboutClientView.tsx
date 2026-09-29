'use client';

import { useApp } from '../../context/AppContext';
import { AboutPage } from '../../views/AboutPage';

export function AboutClientView() {
  const { settings, pageSections, navigate } = useApp();

  return (
    <AboutPage
      settings={settings}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
