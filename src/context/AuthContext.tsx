import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { OAuthUser } from '../services/oauthService';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  picture?: string;
  provider?: 'google' | 'github' | 'facebook' | 'local';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  loginWithOAuth: (oauthUser: OAuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple authentication - in production, this would call an API
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  const login = (username: string, password: string): boolean => {
    // Simple authentication check
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const newUser: User = {
        id: '1',
        username: username,
        role: 'admin'
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const loginWithOAuth = (oauthUser: OAuthUser) => {
    // Convert OAuth user to app user format
    const newUser: User = {
      id: oauthUser.id,
      username: oauthUser.name,
      email: oauthUser.email,
      role: 'user', // OAuth users are regular users by default
      picture: oauthUser.picture,
      provider: oauthUser.provider,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    // Clear OAuth session data
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_provider');
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithOAuth,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
