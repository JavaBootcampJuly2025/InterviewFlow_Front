export const getStatusColor = (status: string) => {
  switch (status) {
    case "APPLIED":
      return "bg-blue-100 text-blue-800";
    case "HR_SCREEN":
      return "bg-yellow-100 text-yellow-800";
    case "TECHNICAL_INTERVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "FINAL_INTERVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "OFFERED":
      return "bg-green-100 text-green-800";
    case "ACCEPTED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "WITHDRAWN":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
