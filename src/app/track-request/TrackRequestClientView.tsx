'use client';

import { useApp } from '../../context/AppContext';
import { TrackRequestPage } from '../../views/TrackRequestPage';

export function TrackRequestClientView() {
  const { settings, navigate } = useApp();

  return (
    <TrackRequestPage
      settings={settings}
      onNavigate={navigate}
    />
  );
}
