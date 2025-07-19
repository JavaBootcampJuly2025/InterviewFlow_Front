import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";
import { Header } from "./components/Header";
import { AnimatedBackground } from "./components/AnimatedBackground";
import "./components/globals.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage("home");
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "login":
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "register":
        return (
          <RegistrationPage onNavigate={setCurrentPage} onLogin={handleLogin} />
        );
      case "dashboard":
        return isAuthenticated ? (
          <Dashboard user={user} />
        ) : (
          <HomePage onNavigate={setCurrentPage} />
        );
      case "profile":
        return isAuthenticated ? (
          <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
        ) : (
          <HomePage onNavigate={setCurrentPage} />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        <main className="container mx-auto px-4 py-8">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}
