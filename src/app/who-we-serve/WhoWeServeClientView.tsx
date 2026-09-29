'use client';

import { useApp } from '../../context/AppContext';
import { WhoWeServePage } from '../../views/WhoWeServePage';

export function WhoWeServeClientView() {
  const { settings, pageSections, navigate } = useApp();

  return (
    <WhoWeServePage
      settings={settings}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
