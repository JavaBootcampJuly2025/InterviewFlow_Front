import { apiRequest } from './api';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResult {
  success: boolean;
  message: string;
}

export const userApi = {
  async changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResult> {
    try {
      const response = await apiRequest('/users/me/change-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response && response.success) {
        return { success: true, message: 'Password changed successfully!' };
      }

      // If backend returns { success: false, message: ... }
      if (response && typeof response.message === 'string') {
        if (
          response.message.includes('Invalid email or password') ||
          response.message.includes('Current password is incorrect')
        ) {
          return { success: false, message: 'Current password is incorrect.' };
        }
        return { success: false, message: response.message };
      }

      // Fallback
      return { success: false, message: 'Failed to change password. Please try again.' };
    } catch (err: any) {
      // Try to parse backend error message
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
};
