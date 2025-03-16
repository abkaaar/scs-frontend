import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import API_ENDPOINTS from './environtment';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_ENDPOINTS.API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          message.error('Session expired. Please login again.');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          message.error('You do not have permission to access this resource.');
          break;
        case 500:
          message.error('Server error. Please try again later.');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      message.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      message.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Create Authentication Context
const AuthContext = createContext(null);

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          const response = await api.get('/auth/verify');
          setUser(response.data);
          
          // If user is on the login page but already authenticated, redirect to dashboard
          if (window.location.pathname === '/sign-in' || window.location.pathname === '/') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        // Token is invalid or expired - handled by interceptor
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      
      // Store token
      localStorage.setItem('authToken', response.data.token);
      
      // Set user state
      setUser(response.data.user);
      
      // Show success message
      message.success('Login successful');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      // Show error message from server if available
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Login failed. Please check your credentials.');
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if server request fails
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      message.success('You have been logged out');
      navigate('/sign-in');
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    api // Expose configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route component
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Public Route component (redirects to dashboard if already authenticated)
export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};