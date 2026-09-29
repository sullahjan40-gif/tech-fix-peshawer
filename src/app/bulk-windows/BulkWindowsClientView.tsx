'use client';

import { useApp } from '../../context/AppContext';
import { BulkWindowsPage } from '../../views/BulkWindowsPage';

export function BulkWindowsClientView() {
  const { settings, pageSections, navigate } = useApp();

  return (
    <BulkWindowsPage
      settings={settings}
      pageSections={pageSections}
      onNavigate={navigate}
    />
  );
}
