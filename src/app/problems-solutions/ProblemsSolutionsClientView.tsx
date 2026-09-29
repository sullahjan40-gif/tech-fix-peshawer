'use client';

import { useApp } from '../../context/AppContext';
import { ProblemsSolutionsPage } from '../../views/ProblemsSolutionsPage';

export function ProblemsSolutionsClientView() {
  const { settings, navigate } = useApp();

  return (
    <ProblemsSolutionsPage
      settings={settings}
      onNavigate={navigate}
    />
  );
}
