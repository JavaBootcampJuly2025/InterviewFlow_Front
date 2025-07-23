import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { StatsCards } from "./StatsCards";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTabs } from "./DashboardTabs";
import { apiRequest } from '../../utils/api';
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
    status: "applied",
    notes: "",
    companyUrl: "",
    cvFile: "",
    interviewTime: "",
    emailNotifications: false,
    applyDate: "",
  });

  const [editForm, setEditForm] = useState<ApplicationFormData>({
    company: "",
    position: "",
    location: "",
    status: "applied",
    notes: "",
    companyUrl: "",
    cvFile: "",
    interviewTime: "",
    emailNotifications: false,
    applyDate: "",
  });

  const mapStatusToBackend = (frontendStatus: ApplicationStatus): string => {
    const statusMap: Record<ApplicationStatus, string> = {
      'applied': 'APPLIED',
      'HR Interview': 'HR_SCREEN',
      'Technical Interview': 'TECHNICAL_INTERVIEW',
      'Final Interview': 'FINAL_INTERVIEW',
      'offer': 'OFFERED',
      'accepted': 'ACCEPTED',
      'rejected': 'REJECTED'
    };
    return statusMap[frontendStatus] || 'APPLIED';
  };

  const mapStatusToFrontend = (backendStatus: string): ApplicationStatus => {
    const statusMap: Record<string, ApplicationStatus> = {
      'APPLIED': 'applied',
      'HR_SCREEN': 'HR Interview',
      'TECHNICAL_INTERVIEW': 'Technical Interview',
      'FINAL_INTERVIEW': 'Final Interview',
      'OFFERED': 'offer',
      'ACCEPTED': 'accepted',
      'REJECTED': 'rejected',
      'WITHDRAWN': 'rejected'
    };
    return statusMap[backendStatus] || 'applied';
  };

  const transformApplicationFromAPI = (dto: ApplicationListDTO): Application => {
    return {
      id: dto.id.toString(),
      company: dto.companyName,
      position: dto.position,
      status: mapStatusToFrontend(dto.status),
      dateApplied: dto.createdAt.split('T')[0],
      location: "", // Not provided by backend
      notes: "", // Not provided by backend
      companyUrl: dto.companyLink || "",
      applyDate: dto.applyDate || dto.createdAt || "",
    };
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
      const transformedApplications = data.map(transformApplicationFromAPI);
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
      const createRequest: CreateApplicationRequest = {
        companyName: newApplication.company,
        companyLink: newApplication.companyUrl || undefined,
        position: newApplication.position,
        status: mapStatusToBackend(newApplication.status),
        applyDate: ensureBackendDateTimeFormat(newApplication.applyDate) || undefined,
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
        status: "applied",
        notes: "",
        companyUrl: "",
        cvFile: "",
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
      interviewTime: application.interviewTime || "",
      emailNotifications: application.emailNotifications || false,
      applyDate: application.applyDate || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateApplication = async () => {
    if (!editingApplication) return;

    try {
      const updateRequest: UpdateApplicationRequest = {
        companyName: editForm.company,
        companyLink: editForm.companyUrl || undefined,
        position: editForm.position,
        status: mapStatusToBackend(editForm.status),
        applyDate: ensureBackendDateTimeFormat(editForm.applyDate) || undefined,
      };

      await apiRequest(`/applications/${editingApplication.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateRequest),
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
    applied: applications.filter((app) => app.status === "applied").length,
    interviews: applications.filter((app) => ["HR Interview", "Technical Interview", "Final Interview"].includes(app.status)).length,
    offers: applications.filter((app) => ["offer", "accepted"].includes(app.status)).length,
    rejected: applications.filter((app) => app.status === "rejected").length,
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
        setEditForm={setEditForm}
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