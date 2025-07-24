export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    
    if (payload.exp && payload.exp < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const getStoredAuthData = () => {
  const token = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return null;
  }
  
  if (!isTokenValid(token)) {
    clearAuthData();
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    return { user, token };
  } catch (error) {
    clearAuthData();
    return null;
  }
};
