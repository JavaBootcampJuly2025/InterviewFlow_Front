import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import "../App.css";

export default function DashboardPage({ setUser }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {user && (
        <div className="dashboard-container">
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.userName || "User"}!
          </Typography>

          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </>
  );
}
