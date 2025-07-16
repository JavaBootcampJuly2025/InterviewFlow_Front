import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [feedback] = useState(location.state?.feedback || "");

  useEffect(() => {
    if (location.state?.feedback) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async ({ email, password }) => {
    setErrors({});
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || "Login failed" });
        }
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.data));
      navigate("/dashboard");
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <>
      {feedback && (
        <div
          style={{ color: "green", marginBottom: "1rem", textAlign: "center" }}
        >
          {feedback}
        </div>
      )}
      <LoginForm onSubmit={handleLogin} errors={errors} />
    </>
  );
}
