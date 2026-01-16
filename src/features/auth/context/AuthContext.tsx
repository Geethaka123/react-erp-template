import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { User, LoginCredentials } from '../types';

interface AuthContextType {
  user: User | null;
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('erp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (creds: LoginCredentials) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: creds.email,
          role: 'admin',
        };
        setUser(mockUser);
        localStorage.setItem('erp_user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock_token_123'); // For Axios interceptor
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
