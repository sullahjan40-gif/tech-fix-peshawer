import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  page?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (page: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-400 font-mono py-4" aria-label="Breadcrumb">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer text-slate-400"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
          {item.active || !item.page ? (
            <span className="text-blue-400 font-medium">{item.label}</span>
          ) : (
            <button
              onClick={() => onNavigate(item.page!)}
              className="hover:text-blue-400 transition-colors cursor-pointer text-slate-400"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
