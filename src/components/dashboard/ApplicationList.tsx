import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  FileTextIcon,
  ExternalLinkIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  SortAscIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "lucide-react";
import { Application } from "../../definitions/interfaces";
import { getStatusIcon } from "../../utils/statusIcons";
import { getStatusColor } from "../../utils/applicationUtils";
import { useState, useMemo } from "react";
import { NotesSection } from '../notes/NotesSection';
import { resumeApi } from "../../utils/resumeApi";

interface ApplicationListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (applicationId: string) => void;
}

export function ApplicationList({
  applications,
  onEdit,
  onDelete,
}: ApplicationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("dateApplied");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());

  const handleDownloadResume = async (resumeId: string, fileName: string) => {
    try {
      const blob = await resumeApi.downloadResume(resumeId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter((app) => {
      const matchesSearch =
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "dateApplied":
          aValue = new Date(a.dateApplied);
          bValue = new Date(b.dateApplied);
          break;
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case "position":
          aValue = a.position.toLowerCase();
          bValue = b.position.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "APPLIED", label: "Applied" },
    { value: "HR_SCREEN", label: "HR Screening" },
    { value: "TECHNICAL_INTERVIEW", label: "Technical Interview" },
    { value: "FINAL_INTERVIEW", label: "Final Interview" },
    { value: "OFFERED", label: "Offer" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

  const sortOptions = [
    { value: "dateApplied", label: "Date Applied" },
    { value: "company", label: "Company" },
    { value: "position", label: "Position" },
    { value: "status", label: "Status" },
  ];

  const toggleApplicationExpanded = (applicationId: string) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId);
    } else {
      newExpanded.add(applicationId);
    }
    setExpandedApplications(newExpanded);
  };

  return (
    <Card>
      <CardHeader className="mt-3 pb-1">
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>
          Track and manage your job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search by position, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-52 hover:cursor-pointer">
                <FilterIcon className="h-4 w-4 mr-2 hover:cursor-pointer" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full sm:w-52">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1 sm:w-44 hover:cursor-pointer">
                  <SortAscIcon className="h-4 w-4 mr-2 hover:cursor-pointer" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full sm:w-44">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 w-auto shrink-0"
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found matching your criteria.
            </div>
          ) : (
            filteredAndSortedApplications.map((application) => (
              <div
                key={application.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{application.position}</h3>
                      {application.companyUrl && (
                        <a
                          href={application.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.company}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.location}
                    </p>
                    {application.cvFile && application.resumeId && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <FileTextIcon className="h-4 w-4" />
                        <span className="truncate">CV: {application.cvFile}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadResume(application.resumeId!, application.cvFile!)}
                          className="h-6 px-2 text-blue-600 hover:text-blue-800 shrink-0"
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex flex-col sm:items-end">
                      <div className="text-sm text-muted-foreground">
                        Applied: {new Date(application.dateApplied).toLocaleDateString()}
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          application.status
                        )} flex items-center space-x-1 w-fit mt-1`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(application)}
                        className="h-8 w-8 p-0"
                        title="Edit application"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(application.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        title="Delete application"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleApplicationExpanded(application.id)}
                        className="h-8 w-8 p-0"
                        title={
                          expandedApplications.has(application.id)
                            ? "Collapse notes"
                            : "Expand notes"
                        }
                      >
                        {expandedApplications.has(application.id) ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {application.notes && (
                  <div className="text-sm text-muted-foreground break-words">
                    <strong>Notes:</strong> {application.notes}
                  </div>
                )}

                {["HR_SCREEN", "TECHNICAL_INTERVIEW", "FINAL_INTERVIEW"].includes(application.status) &&
                  application.interviewTime && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          Interview: {new Date(application.interviewTime).toLocaleString()}
                        </span>
                      </div>
                      {application.emailNotifications && (
                        <Badge variant="secondary" className="w-fit">Notifications ON</Badge>
                      )}
                    </div>
                  )}
                {expandedApplications.has(application.id) && (
                  <div className="border-t pt-4">
                    <NotesSection applicationId={application.id} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
