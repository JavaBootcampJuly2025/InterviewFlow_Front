import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ApplicationList } from "./ApplicationList";
import { Statistics } from "./Statistics";
import { Application } from "../../definitions/interfaces";

interface DashboardTabsProps {
  applications: Application[];
  stats: {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (applicationId: string) => void;
}

export function DashboardTabs({
  applications,
  stats,
  onEditApplication,
  onDeleteApplication,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="applications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="applications">
        <ApplicationList
          applications={applications}
          onEdit={onEditApplication}
          onDelete={onDeleteApplication}
        />
      </TabsContent>

      <TabsContent value="statistics">
        <Statistics stats={stats} />
      </TabsContent>
    </Tabs>
  );
}
