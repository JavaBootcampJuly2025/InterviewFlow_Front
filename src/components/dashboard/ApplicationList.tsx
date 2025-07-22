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
} from "lucide-react";
import { Application } from "../../definitions/interfaces";
import { getStatusIcon } from "../../utils/statusIcons";
import { getStatusColor } from "../../utils/applicationUtils";
import { useState, useMemo } from "react";

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
    { value: "applied", label: "Applied" },
    { value: "interview", label: "Interview" },
    { value: "offer", label: "Offer" },
    { value: "rejected", label: "Rejected" },
  ];

  const sortOptions = [
    { value: "dateApplied", label: "Date Applied" },
    { value: "company", label: "Company" },
    { value: "position", label: "Position" },
    { value: "status", label: "Status" },
  ];

  return (
    <Card>
      <CardHeader className="mt-3 pb-1">
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>
          Track and manage your job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Input
              placeholder="Search by position, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 hover:cursor-pointer">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 hover:cursor-pointer">
                <FilterIcon className="h-4 w-4 mr-2 hover:cursor-pointer" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 hover:cursor-pointer">
                <SortAscIcon className="h-4 w-4 mr-2 hover:cursor-pointer" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
              className="px-3"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{application.position}</h3>
                      {application.companyUrl && (
                        <a
                          href={application.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {application.company}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      Applied:{" "}
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        application.status
                      )} flex items-center space-x-1`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(application)}
                        className="h-8 w-8 p-0"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(application.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {application.notes && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Notes:</strong> {application.notes}
                  </div>
                )}

                {application.cvFile && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <FileTextIcon className="h-4 w-4" />
                    <span>CV: {application.cvFile}</span>
                  </div>
                )}

                {application.status === "interview" &&
                  application.interviewTime && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        Interview:{" "}
                        {new Date(application.interviewTime).toLocaleString()}
                      </span>
                      {application.emailNotifications && (
                        <Badge variant="secondary">Notifications ON</Badge>
                      )}
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
