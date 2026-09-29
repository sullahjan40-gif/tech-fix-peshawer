'use client';

// Phase 2: Foundation page — wraps the existing React SPA inside Next.js.
//
// The existing App component uses browser APIs (window, localStorage,
// history.pushState) during initialization — it must run client-side only.
// `next/dynamic` with `{ ssr: false }` prevents Next.js from attempting
// server-side pre-rendering of this component.
//
// Phase 3 will progressively replace this wrapper with proper Server
// Components as individual pages are migrated to Next.js App Router.

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#110b07',
        color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '1rem',
      }}
    >
      Loading TechFix Peshawar…
    </div>
  ),
});

export default function Page() {
  return <App />;
}
