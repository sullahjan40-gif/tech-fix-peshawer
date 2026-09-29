'use client';

import { useApp } from '../context/AppContext';
import { HomePage } from '../views/HomePage';

export function HomeClientView() {
  const { 
    settings, 
    activeServices, 
    problemCategories, 
    faqs, 
    serviceAreas, 
    navigate 
  } = useApp();

  return (
    <HomePage
      settings={settings}
      services={activeServices}
      problemCategories={problemCategories}
      faqs={faqs}
      serviceAreas={serviceAreas}
      onNavigate={navigate}
    />
  );
}
