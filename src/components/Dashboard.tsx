import { useState } from "react";
import { StatsCards } from "./dashboard/StatsCards";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardTabs } from "./dashboard/DashboardTabs";
import {
  Application,
  ApplicationFormData,
  ApplicationStatus,
} from "../types/application";

interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      company: "Google",
      position: "Software Engineer",
      status: "interview",
      dateApplied: "2025-01-15",
      location: "Mountain View, CA",
      notes: "Great team culture, focus on ML projects",
      companyUrl: "https://careers.google.com",
      interviewTime: "2025-01-25T10:00",
      emailNotifications: true,
    },
    {
      id: "2",
      company: "Microsoft",
      position: "Frontend Developer",
      status: "applied",
      dateApplied: "2025-01-18",
      location: "Seattle, WA",
      notes: "Applied through their careers portal",
      companyUrl: "https://careers.microsoft.com",
    },
    {
      id: "3",
      company: "Meta",
      position: "Full Stack Developer",
      status: "offer",
      dateApplied: "2025-01-10",
      location: "Menlo Park, CA",
      notes: "Received offer after 3 rounds of interviews",
      companyUrl: "https://careers.meta.com",
    },
    {
      id: "4",
      company: "Apple",
      position: "iOS Developer",
      status: "rejected",
      dateApplied: "2025-01-05",
      location: "Cupertino, CA",
      notes: "Technical round did not go well",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

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

  const handleAddApplication = () => {
    const application: Application = {
      id: Date.now().toString(),
      ...newApplication,
      dateApplied: new Date().toISOString().split("T")[0],
    };

    setApplications([...applications, application]);
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

  const handleUpdateApplication = () => {
    if (!editingApplication) return;

    const updatedApplications = applications.map((app) =>
      app.id === editingApplication.id ? { ...app, ...editForm } : app
    );

    setApplications(updatedApplications);
    setIsEditDialogOpen(false);
    setEditingApplication(null);
  };

  const handleDeleteApplication = (applicationId: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      setApplications(applications.filter((app) => app.id !== applicationId));
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    interviews: applications.filter((app) => app.status === "interview").length,
    offers: applications.filter((app) => app.status === "offer").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
