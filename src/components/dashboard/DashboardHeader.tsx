import { AddApplicationDialog } from "./AddApplicationDialog";
import { EditApplicationDialog } from "./EditApplicationDialog";
import { Application, ApplicationFormData } from "../../definitions/interfaces";

interface DashboardHeaderProps {
  user: any;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  newApplication: ApplicationFormData;
  setNewApplication: (data: ApplicationFormData) => void;
  editForm: ApplicationFormData;
  setEditForm: (data: ApplicationFormData) => void;
  onAddApplication: () => void;
  onUpdateApplication: () => void;
}

export function DashboardHeader({
  user,
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newApplication,
  setNewApplication,
  editForm,
  setEditForm,
  onAddApplication,
  onUpdateApplication,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1>Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your job search progress
        </p>
      </div>

      <div className="flex space-x-2">
        <AddApplicationDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          formData={newApplication}
          onFormChange={setNewApplication}
          onSubmit={onAddApplication}
        />

        <EditApplicationDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formData={editForm}
          onFormChange={setEditForm}
          onSubmit={onUpdateApplication}
        />
      </div>
    </div>
  );
}
