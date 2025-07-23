import { apiRequest } from './api';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResult {
  success: boolean;
  message: string;
}

export interface ChangeProfilePayload {
  username: string;
  email: string;
}

export interface ChangeProfileResult {
  success: boolean;
  message: string;
}

export interface UserProfile {
  userName: string;
  email: string;
}

export const userApi = {
  async changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResult> {
    try {
     const token = localStorage.getItem('access_token');
      const response = await apiRequest('/users/me/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response && response.success) {
        return { success: true, message: 'Password changed successfully!' };
      }

      if (response && typeof response.message === 'string') {
        if (
          response.message.includes('Invalid email or password') ||
          response.message.includes('Current password is incorrect')
        ) {
          return { success: false, message: 'Current password is incorrect.' };
        }
        return { success: false, message: response.message };
      }

      return { success: false, message: 'Failed to change password. Please try again.' };
    } catch (err: any) {
      let msg = 'Failed to change password. Please try again.';
      if (typeof err?.message === 'string') {
        if (
          err.message.includes('Invalid email or password') ||
          err.message.includes('Current password is incorrect')
        ) {
          msg = 'Current password is incorrect.';
        } else if (err.message.includes('Validation failed')) {
          msg = 'Validation failed. Please check your input.';
        } else if (err.message.includes('User not found')) {
          msg = 'User not found.';
        } else if (err.message.includes('Unauthorized')) {
          msg = 'You are not authorized. Please log in again.';
        }
      }
      return { success: false, message: msg };
    }
  },

  async changeProfile(payload: ChangeProfilePayload): Promise<ChangeProfileResult> {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiRequest('/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response && response.userName && response.email) {
        return { success: true, message: 'Profile updated successfully!' };
      }

      if (response && typeof response.message === 'string') {
        if (response.message.includes('Email must be valid')) {
          return { success: false, message: 'Email must be valid.' };
        }
        if (response.message.includes('Username is required')) {
          return { success: false, message: 'Username is required.' };
        }
        if (response.message.includes('Email is required')) {
          return { success: false, message: 'Email is required.' };
        }
        return { success: false, message: response.message };
      }

      return { success: false, message: 'Failed to update profile. Please try again.' };
    } catch (err: any) {
      let msg = 'Failed to update profile. Please try again.';
      if (typeof err?.message === 'string') {
        if (err.message.includes('Email must be valid')) {
          msg = 'Email must be valid.';
        } else if (err.message.includes('Username is required')) {
          msg = 'Username is required.';
        } else if (err.message.includes('Email is required')) {
          msg = 'Email is required.';
        } else if (err.message.includes('Unauthorized')) {
          msg = 'You are not authorized. Please log in again.';
        }
      }
      return { success: false, message: msg };
    }
  },

  async getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem('access_token');
    const response = await apiRequest('/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response;
  },
};

