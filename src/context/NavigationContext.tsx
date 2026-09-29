'use client';

// NavigationContext — Delegates to unified AppContext
import { useApp } from './AppContext';
import type { SiteSettings, PageSectionsData } from '../types';

export type NavigateFn = (page: string, params?: { service?: string; problem?: string }) => void;

export interface NavigationContextValue {
  navigate: NavigateFn;
  settings: SiteSettings;
  pageSections: PageSectionsData;
}

export function useNavigation(): NavigationContextValue {
  const { navigate, settings, pageSections } = useApp();
  return {
    navigate,
    settings: settings as SiteSettings,
    pageSections,
  };
}
