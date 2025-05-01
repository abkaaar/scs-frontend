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

// Create a separate axios instance for student API
const studentApi = axios.create({
  baseURL: API_ENDPOINTS.STUDENT_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token for both API instances
const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      const url = config.url || '';
  
      // Only add Authorization header for protected endpoints
      // Exclude auth-related endpoints
      const isAuthEndpoint = 
        url.includes('/auth/login') || 
        url.includes('/auth/verify-otp') ||
        url.includes('/auth/register');
  
      if (token && !isAuthEndpoint) {
        console.log(`Adding token to request: ${url}`);
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle common errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 401:
            message.error('Session expired. Please login again.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // window.location.href = '/sign-in';
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
};

// Apply interceptors to both API instances
addAuthInterceptor(api);
addAuthInterceptor(studentApi);

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
        // Get stored user and token
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        console.log('Auth check - Token exists:', !!token);
        console.log('Auth check - User exists:', !!storedUser);
        
        if (storedUser && token) {
          // Set user from localStorage - no need to verify token
          // The backend doesn't have a /auth/verify endpoint
          setUser(JSON.parse(storedUser));
          
          // If user is on the login page but already authenticated, redirect to dashboard
          if (window.location.pathname === '/sign-in' || window.location.pathname === '/') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  // Request login to get temp token and send OTP
  const requestLogin = async (loginData) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        loginData
      );
      if (response.data.success) {
        // Store temporary token if provided by backend
        if (response.data.token) {
          // Some systems provide a temporary token here
          localStorage.setItem('tempAuthToken', response.data.token);
        }
        return { success: true, token: response.data.token };
      } else {
        message.error(response.data.message || 'Login failed', 5);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Login error occurred', 5);
      return { success: false, message: error.response?.data?.message || 'Login error occurred' };
    }
  };

  // Verify OTP and complete login
  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.API_BASE_URL}/auth/verify-otp`,
        {
          email: email,
          verificationCode: otp,
        }
      );
      
      if (response.data.success) {
        // Clear any temporary token
        localStorage.removeItem('tempAuthToken');
        
        // Store permanent token and user data
        if (response.data.token) {
          console.log('Storing auth token:', response.data.token.substring(0, 20) + '...');
          localStorage.setItem('authToken', response.data.token);
        } else {
          console.error('No token received in OTP verification response');
          message.warning('Authentication token not received');
        }
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set user state
        setUser(response.data.user);
        
        message.success('OTP verified. Redirecting to dashboard...');
        navigate('/dashboard');
        return { success: true };
      } else {
        message.error(response.data.message || 'OTP verification failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'OTP verification error occurred');
      return { success: false, message: error.response?.data?.message || 'OTP verification error occurred' };
    }
  };

  // Logout function
  const logout = async () => {
   
      localStorage.removeItem('authToken');
      localStorage.removeItem('tempAuthToken'); // Clean up any temp token
      localStorage.removeItem('user');
      setUser(null);
      message.success('You have been logged out');
      navigate('/sign-in');
  
  };

  // Student management functions
  const addStudent = async (studentData) => {
    try {
      const response = await studentApi.post(API_ENDPOINTS.ADD_STUDENT, studentData);
      message.success('Student added successfully');
      return { success: true, data: response.data };
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add student');
      return { success: false, message: error.response?.data?.message || 'Failed to add student' };
    }
  };

  const getStudents = async () => {
    try {
      const response = await studentApi.get(API_ENDPOINTS.GET_ALL_STUDENTS);
      return { success: true, data: response.data };
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch students');
      return { success: false, message: error.response?.data?.message || 'Failed to fetch students' };
    }
  };

  const getStudent = async (id) => {
    try {
      const response = await studentApi.get(`${API_ENDPOINTS.GET_STUDENT}/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch student');
      return { success: false, message: error.response?.data?.message || 'Failed to fetch student' };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const response = await studentApi.put(`${API_ENDPOINTS.UPDATE_STUDENT}/${id}`, studentData);
      message.success('Student updated successfully');
      return { success: true, data: response.data };
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update student');
      return { success: false, message: error.response?.data?.message || 'Failed to update student' };
    }
  };

  const deleteStudent = async (id) => {
    try {
      await studentApi.delete(`${API_ENDPOINTS.DELETE_STUDENT}/${id}`);
      message.success('Student deleted successfully');
      return { success: true };
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete student');
      return { success: false, message: error.response?.data?.message || 'Failed to delete student' };
    }
  };

  // Get all departments for the dropdown in student form
  const getDepartments = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL_DEPARTMENTS);
      console.log('Raw department response:', response.data);
      
      // Ensure we return a properly formatted array
      let departmentsArray = [];
      
      if (response.data && response.data.success) {
        if (Array.isArray(response.data.data)) {
          departmentsArray = response.data.data;
        } else if (response.data.departments && Array.isArray(response.data.departments)) {
          departmentsArray = response.data.departments;
        }
      } else if (Array.isArray(response.data)) {
        departmentsArray = response.data;
      }
      
      return { 
        success: true, 
        data: departmentsArray 
      };
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error(error.response?.data?.message || 'Failed to fetch departments');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch departments',
        data: []
      };
    }
  };

  // Clearance requests functions
  const getClearanceRequests = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ALL_CLEARANCE_REQUESTS);
      // return { success: true, data: response.data.data };
      console.log('Raw clearance response:', response.data);

        let clearanceArray = [];
      
      if (response.data && response.data.success) {
        if (Array.isArray(response.data.data)) {
          clearanceArray = response.data.data;
        } else if (response.data.clearance && Array.isArray(response.data.clearance)) {
          clearanceArray = response.data.clearance;
        }
      } else if (Array.isArray(response.data)) {
        clearanceArray = response.data;
      }
      
      return { 
        success: true, 
        data: clearanceArray 
      };
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch clearance requests');
      return { success: false, message: error.response?.data?.message || 'Failed to fetch clearance requests' };
    }
  };
  
  
  

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    requestLogin,
    verifyOtp,
    logout,
    loading,
    api, // Expose configured axios instance
    // Student management functions
    addStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    getDepartments,
    getClearanceRequests
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
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

// Public Route component (redirects to dashboard if already authenticated)
export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};
