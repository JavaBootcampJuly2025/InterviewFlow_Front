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
}

export type ApplicationStatus = "applied" | "interview" | "offer" | "rejected";

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
}
