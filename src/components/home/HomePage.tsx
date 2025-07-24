import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CheckCircleIcon,
  ClockIcon,
  BarChart3Icon,
  BellIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircleIcon,
      title: "Track Applications",
      description: "Keep all your job applications organized in one place",
    },
    {
      icon: ClockIcon,
      title: "Status Updates",
      description: "Never miss an update with real-time status tracking",
    },
    {
      icon: BarChart3Icon,
      title: "Analytics",
      description: "Get insights into your job search progress",
    },
    {
      icon: BellIcon,
      title: "Reminders",
      description: "Set reminders for follow-ups and deadlines",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          Track All Your Job Applications in One Place
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          Manage your resume statuses and never miss an update again. Stay
          organized and boost your job search success.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
          <Button size="lg" onClick={() => navigate("/register")} className="w-full sm:w-auto">
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto"
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Everything you need to manage your job search
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Our platform provides all the tools you need to stay on top of your
            job applications and land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center h-full transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-4">
                <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted rounded-lg p-6 sm:p-8 lg:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
          Ready to organize your job search?
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Join thousands of job seekers who are already using JobTracker to land
          their dream jobs.
        </p>
        <Button size="lg" onClick={() => navigate("/register")} className="w-full sm:w-auto">
          Start Tracking Today
        </Button>
      </div>
    </div>
  );
}