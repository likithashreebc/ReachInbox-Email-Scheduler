import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import ScheduledPage from '@/pages/Scheduled';
import SentPage from '@/pages/Sent';
import SearchPage from '@/pages/Search';
import SettingsPage from '@/pages/Settings';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8]">
      <div className="w-5 h-5 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  return <AppShell />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scheduled" element={<ScheduledPage />} />
        <Route path="/sent" element={<SentPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
