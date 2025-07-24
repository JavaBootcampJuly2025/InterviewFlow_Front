import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { PlusIcon, TrashIcon, UploadIcon } from "lucide-react";
import {
  ApplicationFormData,
  ApplicationStatus,
} from "../../definitions/interfaces";
import { useState } from "react";

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    if (!file.type.includes('pdf')) {
      setUploadError("Only PDF files are supported");
      return;
    }

    if (file.size === 0) {
      setUploadError("File is empty");
      return;
    }

    setUploadError(null);
    onFormChange({
      ...formData,
      cvFile: file.name,
      cvFileObject: file,
    });
  };

  const handleFileRemove = () => {
    onFormChange({
      ...formData,
      cvFile: "",
      cvFileObject: undefined,
    });
    setUploadError(null);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Add New Application</DialogTitle>
          <DialogDescription className="text-sm">
            Track a new job application you've submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                onValueChange={(value: ApplicationStatus) => {
                  const isInterviewStatus = ["HR_SCREEN", "TECHNICAL_INTERVIEW", "FINAL_INTERVIEW"].includes(value);
                  onFormChange({
                    ...formData,
                    status: value,
                    interviewTime: isInterviewStatus ? formData.interviewTime : "",
                    emailNotifications: isInterviewStatus ? formData.emailNotifications : false,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="HR_SCREEN">HR Screening</SelectItem>
                  <SelectItem value="TECHNICAL_INTERVIEW">Technical Interview</SelectItem>
                  <SelectItem value="FINAL_INTERVIEW">Final Interview</SelectItem>
                  <SelectItem value="OFFERED">Offer</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
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
            <Label htmlFor="cvFile">CV/Resume File (PDF only, max 5MB)</Label>
            {!formData.cvFile ? (
              <div>
                <Input
                  id="cvFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                />
                {uploadError && (
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-green-50">
                <div className="flex items-center space-x-2">
                  <UploadIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {formData.cvFile}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFileRemove}
                  className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationDate">Application date *</Label>
            <Input
              id="applicationDate"
              type="datetime-local"
              value={formData.applyDate}
              max={new Date().toISOString().slice(0, 16)}
              onChange={(e) => {
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

          {["HR_SCREEN",
            "TECHNICAL_INTERVIEW",
            "FINAL_INTERVIEW"].includes(formData.status) && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Interview Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="interviewTime">Interview Date & Time</Label>
                  <Input
                    id="interviewTime"
                    type="datetime-local"
                    value={formData.interviewTime}
                    onChange={(e) => {
                      const newInterviewTime = e.target.value;
                      const oldInterviewTime = formData.interviewTime;
                      onFormChange({
                        ...formData,
                        interviewTime: newInterviewTime,
                        emailNotifications: !newInterviewTime && oldInterviewTime ? false : formData.emailNotifications,
                      });
                    }}
                  />
                </div>
                <div className="flex items-start space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    disabled={!formData.interviewTime}
                    onCheckedChange={(checked) =>
                      onFormChange({
                        ...formData,
                        emailNotifications: checked,
                      })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="emailNotifications" className={`text-sm leading-relaxed ${!formData.interviewTime ? "text-muted-foreground" : ""}`}>
                    Receive email notification reminders {!formData.interviewTime && "(requires interview date)"}
                  </Label>
                </div>
              </div>
            )}

          <div className="pt-4 border-t">
            <Button onClick={onSubmit} className="w-full" size="lg">
              Add Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
