import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { Toaster } from 'sonner';

import '@/index.css';

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            expand={false}
            closeButton
            toastOptions={{
              className: "premium-toast",
              style: {
                fontFamily: "var(--font-sans)",
              }
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
