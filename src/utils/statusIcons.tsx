import {
  ClockIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "APPLIED":
      return <ClockIcon className="h-4 w-4" />;
    case "HR_SCREEN":
      return <BriefcaseIcon className="h-4 w-4" />;
    case "TECHNICAL_INTERVIEW":
      return <BriefcaseIcon className="h-4 w-4" />;
    case "FINAL_INTERVIEW":
      return <BriefcaseIcon className="h-4 w-4" />;
    case "OFFERED":
      return <CheckCircleIcon className="h-4 w-4" />;
    case "ACCEPTED":
      return <CheckCircleIcon className="h-4 w-4" />;
    case "REJECTED":
      return <XCircleIcon className="h-4 w-4" />;
    case "WITHDRAWN":
      return <XCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};
