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
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { PlusIcon } from "lucide-react";
import {
  ApplicationFormData,
  ApplicationStatus,
} from "../../definitions/interfaces";

interface AddApplicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ApplicationFormData;
  onFormChange: (data: ApplicationFormData) => void;
  onSubmit: () => void;
}

export function AddApplicationDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: AddApplicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>
            Track a new job application you've submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    company: e.target.value,
                  })
                }
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    position: e.target.value,
                  })
                }
                placeholder="Job title"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    location: e.target.value,
                  })
                }
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
                  <SelectItem value="HR Interview">HR Screening</SelectItem>
                  <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                  <SelectItem value="final_interview">Final Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyUrl">Company URL</Label>
            <Input
              id="companyUrl"
              value={formData.companyUrl}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  companyUrl: e.target.value,
                })
              }
              placeholder="https://company.com/careers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvFile">CV/Resume File</Label>
            <Input
              id="cvFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  cvFile: e.target.files?.[0]?.name || "",
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  notes: e.target.value,
                })
              }
              placeholder="Add any notes about this application..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationDate">Application date *</Label>
            <Input
              id="applicationDate"
              type="datetime-local"
              value={formData.applyDate}
              max={new Date().toISOString().slice(0, 16)} // Prevent future dates
              onChange={(e) => {
                // Ensure ISO-8601 with seconds
                let value = e.target.value;
                if (value && value.length === 16) {
                  value = value + ":00";
                }
                onFormChange({
                  ...formData,
                  applyDate: value,
                });
              }}
              required
            />
          </div>

          {["HR Interview",
            "Technical Interview",
            "Final Interview"].includes(formData.status) && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4>Interview Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="interviewTime">Interview Date & Time</Label>
                  <Input
                    id="interviewTime"
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
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      onFormChange({
                        ...formData,
                        emailNotifications: checked,
                      })
                    }
                  />
                  <Label htmlFor="emailNotifications">
                    Receive email notification reminders
                  </Label>
                </div>
              </div>
            )}

          <Button onClick={onSubmit} className="w-full">
            Add Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
