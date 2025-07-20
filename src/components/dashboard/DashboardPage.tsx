
import { useState, useEffect } from "react";
import { StatsCards } from "./StatsCards";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTabs } from "./DashboardTabs";
import { API_BASE_URL } from '../../definitions/const';
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
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/applications`);

      if (!response.ok) {
        throw new Error('Failed to load applications');
      }

      const data: ApplicationListDTO[] = await response.json();
      const transformedApplications = data.map(transformApplicationFromAPI);
      setApplications(transformedApplications);

    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApplication = async () => {
    if (!user?.id) return;

    try {
      const createRequest: CreateApplicationRequest = {
        companyName: newApplication.company,
        companyLink: newApplication.companyUrl || undefined,
        position: newApplication.position,
        status: mapStatusToBackend(newApplication.status),
        userId: parseInt(user.id)
      };

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

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
      });

      setIsAddDialogOpen(false);

    } catch (err) {
      console.error('Error creating application:', err);
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
      };

      const response = await fetch(`${API_BASE_URL}/applications/${editingApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      await loadApplications();

      setIsEditDialogOpen(false);
      setEditingApplication(null);

    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application');
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      setApplications(applications.filter((app) => app.id !== applicationId));

    } catch (err) {
      console.error('Error deleting application:', err);
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
          <p>Loading applications...</p>
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