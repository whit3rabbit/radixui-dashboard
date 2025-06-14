/**
 * @file auth-context.tsx
 * @description This file defines the authentication context for the application.
 * It includes the AuthProvider component, the useAuth hook, and a ProtectedRoute component.
 * It manages user authentication state, provides login, register, logout, and profile update functionalities.
 * A bypass mode (`BYPASS_AUTH`) is included for development to use a mock user without real authentication.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from './secure-storage'; // Assumes secure-storage handles token and user data persistence

/**
 * @const BYPASS_AUTH
 * @description Global flag to enable or disable authentication bypass mode.
 * When true, a mock user is used, and actual authentication logic is skipped.
 * Ideal for UI development or when a backend is not available.
 * Set to `false` for production or when testing real authentication flows.
 * @default true
 */
const BYPASS_AUTH = true;

/**
 * @interface User
 * @description Defines the structure of a user object.
 * @property {string} id - Unique identifier for the user.
 * @property {string} email - User's email address.
 * @property {string} name - User's full name or display name.
 * @property {string} [avatar] - URL to the user's avatar image.
 */
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context.
 * @property {User | null} user - The current authenticated user object, or null if not authenticated.
 * @property {boolean} isAuthenticated - True if the user is authenticated, false otherwise.
 * @property {boolean} isLoading - True if the authentication state is currently being determined (e.g., on initial load or during login).
 * @property {(email: string, password: string) => Promise<{ success: boolean; error?: string }>} login - Function to attempt user login.
 * @property {(email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>} register - Function to register a new user.
 * @property {() => void} logout - Function to log out the current user.
 * @property {(updates: Partial<User>) => Promise<{ success: boolean; error?: string }>} updateProfile - Function to update the current user's profile.
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

/**
 * @const AuthContext
 * @description React context for authentication.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @const MOCK_USER
 * @description A predefined mock user object used when `BYPASS_AUTH` is true.
 */
const MOCK_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
};

/**
 * @function AuthProvider
 * @description Provides the authentication context to its children.
 * It manages user state, authentication logic (login, logout, register, profile updates),
 * and handles session persistence (if not in bypass mode).
 * @param {{ children: ReactNode }} props - Props for the component.
 * @property {ReactNode} children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The AuthProvider component.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(BYPASS_AUTH ? MOCK_USER : null);
  const [isLoading, setIsLoading] = useState(true); // True initially to check session
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

  // Value provided by the context
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // True if user object exists
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * @function useAuth
 * @description Custom hook to access the authentication context.
 * Throws an error if used outside of an `AuthProvider`.
 * @returns {AuthContextType} The authentication context.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * @interface ProtectedRouteProps
 * @description Defines the props for the ProtectedRoute component.
 * @property {ReactNode} children - The child components to render if the user is authenticated.
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * @function ProtectedRoute
 * @description A component that guards routes requiring authentication.
 * If the user is not authenticated, it redirects them to the login page.
 * It also handles the loading state, showing nothing or a spinner until authentication status is confirmed.
 * @param {ProtectedRouteProps} props - The props for the component.
 * @returns {ReactNode | null} The child components if authenticated, or null/redirects otherwise.
 */
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