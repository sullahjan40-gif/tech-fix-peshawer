import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Preserve existing React 19 setup
  reactStrictMode: true,

  // Phase 2: foundation only.
  // Image optimization, redirects, rewrites will be configured in Phase 3+
  // once API routes and page components are fully migrated.
};

export default nextConfig;
