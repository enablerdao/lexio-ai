// API configuration
const API_CONFIG = {
  // In production, use the deployed API URL
  production: {
    baseUrl: 'https://lexio-ai-api.herokuapp.com', // Replace with your actual API URL
  },
  // In development, use the local API
  development: {
    baseUrl: '/backend-api',
  },
};

// Get the current environment
const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Get the API base URL based on the current environment
export const getApiBaseUrl = () => {
  const env = getEnvironment();
  return API_CONFIG[env]?.baseUrl || API_CONFIG.development.baseUrl;
};

// Function to make API requests
export const fetchApi = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};