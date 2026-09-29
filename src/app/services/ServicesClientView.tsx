'use client';

import { useApp } from '../../context/AppContext';
import { ServicesPage } from '../../views/ServicesPage';

export function ServicesClientView() {
  const { activeServices, settings, pageSections, navigate } = useApp();

  return (
    <ServicesPage
      services={activeServices}
      settings={settings}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
