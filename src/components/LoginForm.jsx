import { useState } from "react";
import "./AuthForm.css";

export default function LoginForm({ onSubmit, errors = {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password });
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <div className="error">{errors.email}</div>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
        {errors.general && <div className="error">{errors.general}</div>}
        <button type="submit">Login</button>
        <a href="/register">Don't have an account? Register</a>
      </form>
    </div>
  );
}
