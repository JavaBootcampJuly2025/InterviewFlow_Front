const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthHeaders = () => {
  const credentials = localStorage.getItem('authCredentials');
  return credentials ? {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};