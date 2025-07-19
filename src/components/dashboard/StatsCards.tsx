import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Applications</CardDescription>
          <CardTitle className="text-3xl">{stats.total}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Applied</CardDescription>
          <CardTitle className="text-3xl">{stats.applied}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Interviews</CardDescription>
          <CardTitle className="text-3xl">{stats.interviews}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Offers</CardDescription>
          <CardTitle className="text-3xl">{stats.offers}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
