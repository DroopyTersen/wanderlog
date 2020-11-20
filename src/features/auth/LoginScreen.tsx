import React, { useState } from "react";
import { AppBackground } from "global/components";
import "./auth.scss";
import { useAuth } from "./auth.provider";

export function LoginScreen() {
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
      <AppBackground variant="sharp" />
      <div className="home content centered login-screen">
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline">Lust less. Remember more.</h3>
        <div className="card">
          <form
            className="login-form"
            autoComplete="new-password"
            aria-autocomplete="none"
            onSubmit={onSubmit}
          >
            <label htmlFor="username">
              Username
              <input
                name="username"
                type="username"
                autoFocus
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
            {status === "ERRORED" && <div className="error">{error + "" || "Login Error"}</div>}
            <button
              className="gold"
              disabled={!username || !password || status === "AUTHENTICATING"}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
