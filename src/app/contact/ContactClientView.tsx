'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { ContactPage } from '../../views/ContactPage';

export function ContactClientView() {
  const searchParams = useSearchParams();
  const { 
    settings, 
    activeServices, 
    serviceAreas, 
    pageSections, 
    selectedServiceForBooking, 
    selectedProblemForBooking,
    navigate 
  } = useApp();

  const serviceParam = searchParams?.get('service') || selectedServiceForBooking || '';
  const problemParam = searchParams?.get('problem') || selectedProblemForBooking || '';

  return (
    <ContactPage
      settings={settings}
      services={activeServices}
      serviceAreas={serviceAreas}
      pageSections={pageSections}
      initialService={serviceParam}
      initialProblem={problemParam}
      onNavigate={navigate}
    />
  );
}
