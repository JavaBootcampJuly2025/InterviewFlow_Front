import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AnimatedBackground } from "./components/AnimatedBackground";
import "./components/globals.css";
import type { ReactElement } from "react";

function PrivateRoute({ isAuthenticated, children }: { isAuthenticated: boolean, children: ReactElement }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
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
          <main className="container mx-auto px-4 py-8 flex-1">
            <Routes>
              {!isAuthenticated ? (<Route path="/" element={<HomePage />} />) : (<Route
                path="/"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Dashboard user={user} />
                  </PrivateRoute>
                }
              />)}
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegistrationPage onLogin={handleLogin} />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Dashboard user={user} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
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
