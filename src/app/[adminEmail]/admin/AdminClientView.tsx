'use client';

import { useApp } from '../../../context/AppContext';
import { AdminProtectedRoute } from '../../../components/admin/AdminProtectedRoute';

export function AdminClientView() {
  const { services, settings, loadData, navigate } = useApp();

  return (
    <AdminProtectedRoute
      isOpen={true}
      isFullScreenPage={true}
      onClose={() => navigate('home')}
      onNavigateHome={() => navigate('home')}
      services={services}
      settings={settings}
      onRefreshData={loadData}
    />
  );
}
