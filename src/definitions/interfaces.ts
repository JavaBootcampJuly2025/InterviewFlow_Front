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
  interviewTime?: string;
  emailNotifications?: boolean;
  applyDate?: string;
}

export type ApplicationStatus = "applied" | "HR Interview" | "Technical Interview" | "Final Interview" | "offer" |  "accepted" | "rejected";

export interface ApplicationFormData {
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  notes: string;
  companyUrl: string;
  cvFile: string;
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
  status: string;
  applyDate?: string;
}

export interface UpdateApplicationRequest {
  companyName?: string;
  companyLink?: string;
  position?: string;
  status?: string;
  applyDate?: string;
}

export interface ApplicationListDTO {
  id: number;
  status: string;
  companyName: string;
  companyLink?: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  applyDate: string;
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