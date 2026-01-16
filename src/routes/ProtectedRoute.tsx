import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-background space-y-4">
         <div className="relative w-48 h-1 bg-muted overflow-hidden">
            <div className="absolute inset-0 bg-primary animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">
           Mainframe Sync in Progress...
         </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
