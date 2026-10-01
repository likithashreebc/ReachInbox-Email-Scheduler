import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext, useAuthProvider } from '@/hooks/useAuth';
import { AppRoutes } from '@/routes';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#f5f5f5',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #1f1f1f',
              padding: '10px 14px',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fef2f2' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
