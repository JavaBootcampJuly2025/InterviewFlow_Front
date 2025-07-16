import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async ({ email, password, username }) => {
    const newErrors = {};
    if (!username || username.length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email.";
    if (!password || password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || "Registration failed" });
        }
        return;
      }

      navigate("/login", {
        state: { feedback: "Registration successful! Please log in." },
      });
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return <RegisterForm onSubmit={handleRegister} errors={errors} />;
}
