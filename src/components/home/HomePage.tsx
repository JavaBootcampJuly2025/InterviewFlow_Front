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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl mb-6">
          Track All Your Job Applications in One Place
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Manage your resume statuses and never miss an update again. Stay
          organized and boost your job search success.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" onClick={() => navigate("/register")}>
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl mb-4">
            Everything you need to manage your job search
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools you need to stay on top of your
            job applications and land your dream job.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted rounded-lg p-12 text-center">
        <h2 className="text-3xl mb-4">Ready to organize your job search?</h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of job seekers who are already using JobTracker to land
          their dream jobs.
        </p>
        <Button size="lg" onClick={() => navigate("/register")}>
          Start Tracking Today
        </Button>
      </div>
    </div>
  );
}