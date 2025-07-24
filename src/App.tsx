import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./components/home/HomePage";
import { LoginPage } from "./components/login/LoginPage";
import { RegistrationPage } from "./components/registration/RegistrationPage";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { AnimatedBackground } from "./components/background/AnimatedBackground";
import { ResponsiveTest } from "./components/ui/responsive-test";
import { getStoredAuthData, clearAuthData } from "./utils/authUtils";
import { Loader2 } from "lucide-react";
import "./globals.css";
import type { ReactElement } from "react";

function PrivateRoute({ isAuthenticated, isLoading, children }: { isAuthenticated: boolean, isLoading: boolean, children: ReactElement }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const authData = getStoredAuthData();

      if (authData) {
        setUser(authData.user);
        setIsAuthenticated(true);
      } else {
        clearAuthData();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.access_token) {
      localStorage.setItem("access_token", userData.access_token);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearAuthData();
  };


  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <div className="min-h-screen relative flex flex-col">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
            <Routes>
              {!isAuthenticated ? (<Route path="/" element={<HomePage />} />) : (<Route
                path="/"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                    <DashboardPage user={user} />
                  </PrivateRoute>
                }
              />)}
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegistrationPage onLogin={handleLogin} />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                    <DashboardPage user={user} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                    <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}
