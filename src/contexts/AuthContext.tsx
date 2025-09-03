import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  userType: 'vendor' | 'supplier';
  profile: any;
  verified: boolean;
  rating?: {
    average: number;
    count: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loginWithRedirect: (options?: any) => void;
  getAccessTokenSilently: () => Promise<string>;
  loading: boolean;
  updateProfile: (profileData: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    user: auth0User, 
    isAuthenticated, 
    isLoading,
    loginWithRedirect, 
    logout: auth0Logout,
    getAccessTokenSilently 
  } = useAuth0();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored user data first
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // If Auth0 user is authenticated, sync with backend
        if (isAuthenticated && auth0User && !isLoading) {
          await handleOAuthLogin();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isAuthenticated, auth0User, isLoading]);

  const handleOAuthLogin = async () => {
    try {
      if (!auth0User) return;

      // Get Auth0 access token
      const auth0Token = await getAccessTokenSilently();
      
      // Sync user data with backend
      const response = await fetch(`${API_URL}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth0Token}`,
        },
        body: JSON.stringify({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          name: auth0User.name,
          picture: auth0User.picture,
          userType: 'vendor', // Default to vendor, can be updated later
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        console.error('OAuth sync error:', data.message);
      }
    } catch (error) {
      console.error('OAuth login error:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ profile: profileData }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (isAuthenticated) {
      auth0Logout({ 
        logoutParams: {
          returnTo: window.location.origin 
        }
      });
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
    loading: loading || isLoading,
    updateProfile,
    isAuthenticated: isAuthenticated || !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};