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
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import { TrashIcon, UploadIcon, DownloadIcon } from "lucide-react";
import {
  ApplicationFormData,
  ApplicationStatus,
} from "../../definitions/interfaces";
import { useState } from "react";
import { resumeApi } from "../../utils/resumeApi";

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
      resumeToDelete: !!formData.resumeId,
    });
    setUploadError(null);
  };

  const handleDownloadResume = async () => {
    if (!formData.resumeId || !formData.cvFile) return;

    try {
      const blob = await resumeApi.downloadResume(formData.resumeId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = formData.cvFile;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Edit Application</DialogTitle>
          <DialogDescription className="text-sm">
            Update your job application details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Label htmlFor="edit-cvFile">CV/Resume File (PDF only, max 5MB)</Label>
            {!formData.cvFile ? (
              <div>
                <Input
                  id="edit-cvFile"
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
                <div className="flex items-center space-x-2">
                  {formData.resumeId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDownloadResume}
                      className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  )}
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
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-applicationDate">Application date *</Label>
            <Input
              id="edit-applicationDate"
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

          {[
            "HR_SCREEN",
            "TECHNICAL_INTERVIEW",
            "FINAL_INTERVIEW",
          ].includes(formData.status) && (
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
                    id="edit-emailNotifications"
                    checked={formData.emailNotifications}
                    disabled={!formData.interviewTime}
                    onCheckedChange={(checked) => {
                      const newFormData = {
                        ...formData,
                        emailNotifications: checked,
                      };

                      onFormChange(newFormData);
                    }}
                    className="mt-1"
                  />
                  <Label htmlFor="edit-emailNotifications" className={`text-sm leading-relaxed ${!formData.interviewTime ? "text-muted-foreground" : ""}`}>
                    Receive email notification reminders {!formData.interviewTime && "(requires interview date)"}
                  </Label>
                </div>
              </div>
            )}

          <div className="pt-4 border-t">
            <Button onClick={onSubmit} className="w-full" size="lg">
              Update Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
