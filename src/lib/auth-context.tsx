import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from './secure-storage';

/**
 * AUTHENTICATION BYPASS MODE
 * 
 * Set to true to bypass login and use a mock user (default for development)
 * Set to false to require real authentication (needs database setup)
 * 
 * When true:
 * - Automatically logged in as "Demo User"
 * - No database required
 * - Perfect for UI development
 * 
 * When false:
 * - Real login required
 * - Must implement database (see docs/DATABASE_INTEGRATION.md)
 */
const BYPASS_AUTH = true;

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development when auth is bypassed
const MOCK_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(BYPASS_AUTH ? MOCK_USER : null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    if (BYPASS_AUTH) {
      setIsLoading(false);
      return;
    }
    
    const savedUser = storage.auth.getUser();
    if (savedUser) {
      setUser(savedUser as User);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace this mock implementation with your API call
      // Example:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // TODO: In production, this would come from your API response
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      };

      // TODO: Store the JWT token from your API response
      // storage.auth.setToken(data.token);
      
      setUser(mockUser);
      storage.auth.setUser(mockUser);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace this mock implementation with your API call
      // Example:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name })
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      // TODO: In production, this would come from your API response
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      // TODO: Store the JWT token from your API response
      // storage.auth.setToken(data.token);

      setUser(mockUser);
      storage.auth.setUser(mockUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (BYPASS_AUTH) {
      // In bypass mode, just reload the page
      window.location.href = '/';
      return;
    }

    try {
      // TODO: Call logout API to invalidate server-side session
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${storage.auth.getToken()}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      setUser(null);
      storage.auth.clearSession(); // Clear both user and token
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local session
      setUser(null);
      storage.auth.clearSession();
      navigate('/login');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // TODO: Replace this mock implementation with your API call
      // Example:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${storage.auth.getToken()}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(updates)
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: In production, use the updated user data from API response
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      storage.auth.setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? <>{children}</> : null;
}