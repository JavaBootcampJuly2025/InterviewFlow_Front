import {
  ClockIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "applied":
      return <ClockIcon className="h-4 w-4" />;
    case "interview":
      return <BriefcaseIcon className="h-4 w-4" />;
    case "offer":
      return <CheckCircleIcon className="h-4 w-4" />;
    case "rejected":
      return <XCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};
