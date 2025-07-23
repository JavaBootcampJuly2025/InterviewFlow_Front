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

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      // Throw error so component can handle it
      throw new Error(errorData.message || 'Unauthorized');
    }
    const errorText = await response.text();
    console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`API request failed: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  console.log('API response data:', data);
  return data;
};