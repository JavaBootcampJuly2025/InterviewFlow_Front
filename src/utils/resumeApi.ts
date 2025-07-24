import { ResumeResponse, FileResponse } from '../definitions/interfaces';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = (isFormData: boolean = false): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = token ? {
    'Authorization': `Bearer ${token}`,
  } : {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const resumeApi = {
  uploadResume: async (file: File): Promise<ResumeResponse> => {
    if (file.size === 0) {
      throw new Error('File is empty');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload resume: ${errorText}`);
    }

    return response.json();
  },

  downloadResume: async (fileId: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/resumes/${fileId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download resume');
    }

    return response.blob();
  },

  deleteResume: async (fileId: string): Promise<FileResponse> => {
    const response = await fetch(`${API_BASE_URL}/resumes/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete resume');
    }

    return response.json();
  },

  getUserResumes: async (): Promise<ResumeResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resumes');
    }

    return response.json();
  },

  getResumeById: async (resumeId: string): Promise<ResumeResponse> => {
    const resumes = await resumeApi.getUserResumes();
    const resume = resumes.find(r => r.fileId === resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }
    return resume;
  },
};
