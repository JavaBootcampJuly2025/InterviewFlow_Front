export interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  dateApplied: string;
  location: string;
  notes?: string;
  companyUrl?: string;
  cvFile?: string;
  resumeId?: string;
  interviewTime?: string;
  emailNotifications?: boolean;
  applyDate?: string;
}

export type ApplicationStatus = "APPLIED" | "HR_SCREEN" | "TECHNICAL_INTERVIEW" | "FINAL_INTERVIEW" | "OFFERED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface ApplicationFormData {
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  notes: string;
  companyUrl: string;
  cvFile: string;
  cvFileObject?: File;
  resumeId?: string;
  resumeToDelete?: boolean;
  interviewTime: string;
  emailNotifications: boolean;
  applyDate: string;
}

export interface DashboardProps {
  user: any;
}

export interface CreateApplicationRequest {
  companyName: string;
  companyLink?: string;
  position: string;
  location?: string;
  status: string;
  applyDate?: string;
  interviewDate?: string;
  emailNotificationsEnabled?: boolean;
  resumeId?: string;
}

export interface UpdateApplicationRequest {
  companyName?: string;
  companyLink?: string;
  position?: string;
  location?: string;
  status?: string;
  applyDate?: string;
  interviewDate?: string;
  emailNotificationsEnabled?: boolean;
  resumeId?: string;
}

export interface ApplicationListDTO {
  id: number;
  status: string;
  companyName: string;
  companyLink?: string;
  position: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  applyDate: string;
  resumeId?: string;
  emailNotificationEnabled?: boolean;
  interviewDate?: string;
}

export interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  userName: string;
  createdAt: string;
  access_token?: string;
  token_type?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

export interface RegistrationPageProps {
  onLogin: (userData: any) => void;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface ResumeResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
}

export interface FileResponse {
  message: string;
  fileId: string;
}