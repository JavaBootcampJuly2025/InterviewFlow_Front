export const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  console.log(`Response status: ${response.status}`);

  if (response.status === 401) {
    console.log('401 Unauthorized - clearing tokens');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API response data:', data);
  return data;
};