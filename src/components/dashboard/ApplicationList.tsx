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
  FileTextIcon,
  ExternalLinkIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { Application } from "../../definitions/interfaces";
import { getStatusIcon } from "../../utils/statusIcons";
import { getStatusColor } from "../../utils/applicationUtils";

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
  return (
    <Card>
      <CardHeader className="mt-3 pb-1">
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>
          Track and manage your job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
