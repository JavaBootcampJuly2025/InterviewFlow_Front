import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { BarChart3Icon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useIsTablet } from "../ui/use-mobile";

interface StatisticsProps {
  stats: {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
}


export function Statistics({ stats }: StatisticsProps) {
  const chartData = [
    { name: "Applied", value: stats.applied, color: "#3b82f6" },
    { name: "Interview", value: stats.interviews, color: "#f59e0b" },
    { name: "Offer", value: stats.offers, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const isTablet = useIsTablet();

  return (
    <Card>
      <CardHeader className="mt-3 pb-1">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3Icon className="h-5 w-5" />
          <span>Application Statistics</span>
        </CardTitle>
        <CardDescription>
          Visual breakdown of your application statuses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={isTablet ? 70 : 90}
                  fill="#8884d8"
                  dataKey="value"
                  className={isTablet ? "text-xs" : "text-sm"}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h3>Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Applied Applications</span>
                <span className="font-semibold">{stats.applied}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span>Interview Stage</span>
                <span className="font-semibold">{stats.interviews}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span>Offers Received</span>
                <span className="font-semibold">{stats.offers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span>Rejections</span>
                <span className="font-semibold">{stats.rejected}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Success Rate</span>
                <span className="font-semibold">
                  {stats.total > 0
                    ? Math.round(
                      ((stats.offers + stats.interviews) / stats.total) * 100
                    )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
