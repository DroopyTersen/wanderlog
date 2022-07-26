import React, { useState } from "react";
import { AppBackground, Footer } from "global/components";
import "./auth.scss";
import { useAuth } from "./auth.provider";

export function LoginForm() {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let { login, status, error } = useAuth();
  const onSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username, password);
    }
  };
  return (
    <>
      <div className="login-form">
        <form
          className="login-form"
          autoComplete="new-password"
          aria-autocomplete="none"
          onSubmit={onSubmit}
        >
          {status === "ERRORED" && <div className="error">{error + "" || "Login Error"}</div>}
          <label htmlFor="username">
            Username
            <input
              autoFocus
              autoCapitalize="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="gold large"
            disabled={!username || !password || status === "AUTHENTICATING"}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
