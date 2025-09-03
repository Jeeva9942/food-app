import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';

interface User {
  id: string;
  email: string;
  userType: 'vendor' | 'supplier';
  profile: any;
  verified: boolean;
  rating?: {
    average: number;
    count: number;
  };
}

interface AuthContextType {
  user: User | undefined;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loginWithRedirect: (options?: any) => void;
  getAccessTokenSilently: () => Promise<string>;
  loading: boolean;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    loginWithRedirect, 
    logout: auth0Logout,
    getAccessTokenSilently 
  } = useAuth0();
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user: auth0User, isAuthenticated, loginWithPopup, logout: auth0Logout } = useAuth0();

  // Enhanced login function with connection options
  const login = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  };

  // Enhanced logout function
  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && auth0User && !user) {
      handleOAuthLogin();
    }
  }, [isAuthenticated, auth0User]);

  const handleOAuthLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/oauth`, {
        method: 'POST',
        headers: {
      const syncUserData = async () => {
        try {
          const token = await getAccessTokenSilently();
          
          // Store/update user data in backend
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
              picture: user.picture,
            }),
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      };
      
      syncUserData();

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
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
      auth0Logout({ returnTo: window.location.origin });
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const value = {
    user,
    token,
    login,
    login,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
    loading,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};