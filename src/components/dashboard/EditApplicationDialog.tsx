import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import {
  ApplicationFormData,
  ApplicationStatus,
} from "../../types/application";

interface EditApplicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ApplicationFormData;
  onFormChange: (data: ApplicationFormData) => void;
  onSubmit: () => void;
}

export function EditApplicationDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: EditApplicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update your job application details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company *</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) =>
                  onFormChange({ ...formData, company: e.target.value })
                }
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position">Position *</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) =>
                  onFormChange({ ...formData, position: e.target.value })
                }
                placeholder="Job title"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) =>
                  onFormChange({ ...formData, location: e.target.value })
                }
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ApplicationStatus) =>
                  onFormChange({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-companyUrl">Company URL</Label>
            <Input
              id="edit-companyUrl"
              value={formData.companyUrl}
              onChange={(e) =>
                onFormChange({ ...formData, companyUrl: e.target.value })
              }
              placeholder="https://company.com/careers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cvFile">CV/Resume File</Label>
            <Input
              id="edit-cvFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  cvFile: e.target.files?.[0]?.name || formData.cvFile,
                })
              }
            />
            {formData.cvFile && (
              <p className="text-sm text-muted-foreground">
                Current file: {formData.cvFile}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) =>
                onFormChange({ ...formData, notes: e.target.value })
              }
              placeholder="Add any notes about this application..."
              rows={3}
            />
          </div>

          {formData.status === "interview" && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4>Interview Details</h4>
              <div className="space-y-2">
                <Label htmlFor="edit-interviewTime">
                  Interview Date & Time
                </Label>
                <Input
                  id="edit-interviewTime"
                  type="datetime-local"
                  value={formData.interviewTime}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      interviewTime: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-emailNotifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) =>
                    onFormChange({
                      ...formData,
                      emailNotifications: checked,
                    })
                  }
                />
                <Label htmlFor="edit-emailNotifications">
                  Receive email notification reminders
                </Label>
              </div>
            </div>
          )}

          <Button onClick={onSubmit} className="w-full">
            Update Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
