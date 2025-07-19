export const getStatusColor = (status: string) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800";
    case "HR Interview":
      return "bg-yellow-100 text-yellow-800";
          case "Technical Interview":
      return "bg-yellow-100 text-yellow-800";
          case "Final Interview":
      return "bg-yellow-100 text-yellow-800";
    case "offer":
      return "bg-green-100 text-green-800";
          case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
