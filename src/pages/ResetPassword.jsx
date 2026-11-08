import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import "./student-pages.css";
import API from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
export default function ResetPassword() {
  const { user, logout: logoutSession } = useAuth();
  const navigate = useNavigate();
  const [sessionMessage, setSessionMessage] = useState("");
  async function handleLogout() {
    try { await logoutSession(); setSessionMessage("You have signed out."); navigate("/login", { replace: true }); }
    catch (error) { setSessionMessage(error.message || "Could not log out."); }
  }
  const [params] = useSearchParams();
  const uid = params.get("uid"),
    token = params.get("token");
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const endpoint = uid && token ? "confirm" : "request";
      if (endpoint === "confirm" && password !== confirm)
        throw new Error("Your passwords do not match.");
      const payload =
        endpoint === "confirm"
          ? { uid, token, password, new_password: password }
          : { email };
      const r = await fetch(`${API}/auth/password-reset/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok)
        throw new Error(
          d.detail || "Could not process your request. Please try again.",
        );
      setMessage(
        d.detail ||
          "If an account matches that email, reset instructions will be sent.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="reset-shell">
      {user && <div className="reset-session">
        <span>Signed in as <b>{user.first_name || user.username}</b></span>
        <Link to="/dashboard">Dashboard</Link>
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>}
      {sessionMessage && <p className="reset-session-message" role="status">{sessionMessage}</p>}
      <Link to={user ? "/dashboard" : "/login"} className="reset-back">
        <ArrowLeft size={16} /> {user ? "Back to dashboard" : "Back to sign in"}
      </Link>
      <section className="reset-card">
        <span className="reset-icon">
          {message ? <CheckCircle2 size={28} /> : <ShieldCheck size={28} />}
        </span>
        <span className="eyebrow">ACCOUNT RECOVERY</span>
        <h1>
          {uid && token ? "Choose a new password" : "Forgot your password?"}
        </h1>
        <p>
          {uid && token
            ? "Create a new password for your STar Academy account."
            : "Enter the email address linked to your account. If it matches, we'll send a secure reset link."}
        </p>
        <form onSubmit={submit}>
          {uid && token ? (
            <>
              <label>
                New password
                <input
                  type="password"
                  minLength="8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  minLength="8"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Enter it again"
                />
              </label>
            </>
          ) : (
            <label>
              Email address
              <span className="reset-input">
                <Mail size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </span>
            </label>
          )}
          {error && (
            <p className="reset-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="reset-success" role="status">
              {message}
            </p>
          )}
          <button className="auth-submit" disabled={busy}>
            {busy
              ? "Please wait…"
              : uid && token
                ? "Save new password"
                : "Send reset link"}
            <ArrowRight size={17} />
          </button>
        </form>
        <small className="reset-privacy">
          For your security, reset links are time-limited and can only be used
          once.
        </small>
      </section>
    </main>
  );
}
