import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { StatsCards } from "./StatsCards";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTabs } from "./DashboardTabs";
import { apiRequest } from '../../utils/api';
import { resumeApi } from '../../utils/resumeApi';
import {
  Application,
  ApplicationFormData,
  ApplicationListDTO,
  ApplicationStatus,
  CreateApplicationRequest,
  DashboardProps,
  UpdateApplicationRequest,
} from "../../definitions/interfaces";

export function DashboardPage({ user }: DashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const [newApplication, setNewApplication] = useState<ApplicationFormData>({
    company: "",
    position: "",
    location: "",
    status: "APPLIED",
    notes: "",
    companyUrl: "",
    cvFile: "",
    cvFileObject: undefined,
    resumeId: undefined,
    resumeToDelete: false,
    interviewTime: "",
    emailNotifications: false,
    applyDate: "",
  });

  const [editForm, setEditForm] = useState<ApplicationFormData>({
    company: "",
    position: "",
    location: "",
    status: "APPLIED",
    notes: "",
    companyUrl: "",
    cvFile: "",
    cvFileObject: undefined,
    resumeId: undefined,
    resumeToDelete: false,
    interviewTime: "",
    emailNotifications: false,
    applyDate: "",
  });

  const mapStatusToBackend = (frontendStatus: ApplicationStatus): string => {
    return frontendStatus;
  };

  const mapStatusToFrontend = (backendStatus: string): ApplicationStatus => {
    const validStatuses: ApplicationStatus[] = [
      "APPLIED", "HR_SCREEN", "TECHNICAL_INTERVIEW",
      "FINAL_INTERVIEW", "OFFERED", "ACCEPTED", "REJECTED", "WITHDRAWN"
    ];
    return validStatuses.includes(backendStatus as ApplicationStatus)
      ? backendStatus as ApplicationStatus
      : 'APPLIED';
  };

  const transformApplicationFromAPI = (dto: ApplicationListDTO): Application => {
    const result = {
      id: dto.id.toString(),
      company: dto.companyName,
      position: dto.position,
      status: mapStatusToFrontend(dto.status),
      dateApplied: dto.createdAt.split('T')[0],
      location: dto.location || "",
      notes: "",
      companyUrl: dto.companyLink || "",
      applyDate: dto.applyDate || dto.createdAt || "",
      resumeId: dto.resumeId,
      emailNotifications: dto.emailNotificationEnabled || false,
      interviewTime: dto.interviewDate || "",
    };

    return result;
  };

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await apiRequest('/applications') as ApplicationListDTO[];
      const transformedApplications = await Promise.all(
        data.map(async (dto) => {
          const application = transformApplicationFromAPI(dto);

          if (application.resumeId) {
            try {
              const resumeInfo = await resumeApi.getResumeById(application.resumeId);
              application.cvFile = resumeInfo.fileName;
            } catch (error) {
              console.error('Failed to load resume info for application:', application.id, error);
            }
          }

          return application;
        })
      );

      setApplications(transformedApplications);

    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const ensureBackendDateTimeFormat = (dateStr: string) => {
    if (!dateStr) return "";
    let [date, time] = dateStr.includes('T') ? dateStr.split('T') : dateStr.split(' ');
    if (!time) return dateStr;
    if (time.length === 5) time = time + ":00";
    if (time.length > 8) time = time.slice(0, 8);
    return `${date} ${time}`;
  };

  const handleAddApplication = async () => {
    if (!user?.id) return;

    try {
      let resumeId: string | undefined = undefined;

      if (newApplication.cvFileObject) {
        try {
          const resumeResponse = await resumeApi.uploadResume(newApplication.cvFileObject);
          resumeId = resumeResponse.fileId;
        } catch (resumeError) {
          console.error('Failed to upload resume:', resumeError);
          alert('Failed to upload resume. Application will be created without resume.');
        }
      }

      const createRequest: CreateApplicationRequest = {
        companyName: newApplication.company,
        companyLink: newApplication.companyUrl || undefined,
        position: newApplication.position,
        location: newApplication.location || undefined,
        status: mapStatusToBackend(newApplication.status),
        applyDate: ensureBackendDateTimeFormat(newApplication.applyDate) || undefined,
        interviewDate: newApplication.interviewTime ? ensureBackendDateTimeFormat(newApplication.interviewTime) : undefined,
        emailNotificationsEnabled: newApplication.emailNotifications,
        resumeId: resumeId,
      };

      await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify(createRequest),
      });

      await loadApplications();

      setNewApplication({
        company: "",
        position: "",
        location: "",
        status: "APPLIED",
        notes: "",
        companyUrl: "",
        cvFile: "",
        cvFileObject: undefined,
        resumeId: undefined,
        resumeToDelete: false,
        interviewTime: "",
        emailNotifications: false,
        applyDate: "",
      });

      setIsAddDialogOpen(false);

    } catch (err) {
      setError('Failed to create application');
    }
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setEditForm({
      company: application.company,
      position: application.position,
      location: application.location,
      status: application.status as ApplicationStatus,
      notes: application.notes || "",
      companyUrl: application.companyUrl || "",
      cvFile: application.cvFile || "",
      cvFileObject: undefined,
      resumeId: application.resumeId,
      resumeToDelete: false,
      interviewTime: application.interviewTime || "",
      emailNotifications: application.emailNotifications || false,
      applyDate: application.applyDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateApplication = async () => {
    if (!editingApplication) return;

    try {
      let finalResumeId = editForm.resumeId;

      if (editForm.cvFileObject) {
        if (editForm.resumeId) {
          try {
            await resumeApi.deleteResume(editForm.resumeId);
          } catch (error) {
            console.error('Failed to delete old resume:', error);
          }
        }

        try {
          const resumeResponse = await resumeApi.uploadResume(editForm.cvFileObject);
          finalResumeId = resumeResponse.fileId;
          editForm.cvFile = resumeResponse.fileName;
        } catch (resumeError) {
          console.error('Failed to upload new resume:', resumeError);
          alert('Failed to upload new resume. Application will be updated without resume change.');
          finalResumeId = undefined;
        }
      }
      else if (editForm.resumeToDelete && editForm.resumeId) {
        try {
          await resumeApi.deleteResume(editForm.resumeId);
          finalResumeId = undefined;
        } catch (error) {
          console.error('Failed to delete resume:', error);
        }
      }

      const updateRequest: UpdateApplicationRequest = {
        companyName: editForm.company,
        companyLink: editForm.companyUrl || undefined,
        position: editForm.position,
        location: editForm.location || undefined,
        status: mapStatusToBackend(editForm.status),
        applyDate: ensureBackendDateTimeFormat(editForm.applyDate) || undefined,
        interviewDate: editForm.interviewTime ? ensureBackendDateTimeFormat(editForm.interviewTime) : undefined,
        emailNotificationsEnabled: editForm.emailNotifications,
        resumeId: finalResumeId,
      };

      const requestBody = JSON.stringify(updateRequest);

      const response = await apiRequest(`/applications/${editingApplication.id}`, {
        method: 'PATCH',
        body: requestBody,
      });

      await loadApplications();

      setIsEditDialogOpen(false);
      setEditingApplication(null);

    } catch (err) {
      setError('Failed to update application');
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await apiRequest(`/applications/${applicationId}`, {
        method: 'DELETE',
      });

      setApplications(applications.filter((app) => app.id !== applicationId));

    } catch (err) {
      setError('Failed to delete application');
      await loadApplications();
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "APPLIED").length,
    interviews: applications.filter((app) => ["HR_SCREEN", "TECHNICAL_INTERVIEW", "FINAL_INTERVIEW"].includes(app.status)).length,
    offers: applications.filter((app) => ["OFFERED", "ACCEPTED"].includes(app.status)).length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <DashboardHeader
        user={user}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        newApplication={newApplication}
        setNewApplication={setNewApplication}
        editForm={editForm}
        setEditForm={(data) => {
          setEditForm(
            (prevForm) => {
              return data;
            }
          );
        }}
        onAddApplication={handleAddApplication}
        onUpdateApplication={handleUpdateApplication}
      />

      <StatsCards stats={stats} />

      <DashboardTabs
        applications={applications}
        stats={stats}
        onEditApplication={handleEditApplication}
        onDeleteApplication={handleDeleteApplication}
      />
    </div>
  );
}