"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 24,
        background: "#ffffff",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={login} style={button}>
        Sign in
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
}

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 4,
  border: "1px solid #d1d5db",
};

const button = {
  width: "100%",
  padding: 12,
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
