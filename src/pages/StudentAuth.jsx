import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./student-pages.css";
import API from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
async function csrf() {
  const r = await fetch(`${API}/auth/csrf/`, { credentials: "include" });
  const d = await r.json();
  if (!r.ok || !d.csrfToken)
    throw new Error(
      "Could not connect securely. Check that Django is running.",
    );
  return d.csrfToken;
}
export default function StudentAuth() {
  const [mode, setMode] = useState(
      window.location.pathname === "/signup" ? "signup" : "login",
    ),
    [form, setForm] = useState({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone_number: "",
      identifier: "",
      password: "",
    }),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [show, setShow] = useState(false);
  const nav = useNavigate();
  const { acceptUser } = useAuth();
  const [params] = useSearchParams();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const token = await csrf(),
        signup = mode === "signup",
        endpoint = signup ? "signup" : "login";
      const payload = signup
        ? {
            first_name: form.first_name,
            last_name: form.last_name,
            username: form.username,
            email: form.email,
            phone_number: form.phone_number,
            password: form.password,
          }
        : { identifier: form.identifier, password: form.password };
      const r = await fetch(`${API}/auth/${endpoint}/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRFToken": token },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok)
        throw new Error(
          [
            d.detail,
            ...Object.entries(d)
              .filter(([k]) => k !== "detail")
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`),
          ]
            .filter(Boolean)
            .join(" ") || "Please check your details.",
        );
      // Django has created the session cookie; update shared auth state for every page.
      acceptUser(d.user);
      const requestedPath = params.get("next");
      const destination = requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : "/dashboard";
      nav(destination, { replace: true });
    } catch (err) {
      setMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-shell">
      <section className="auth-promo">
        <Link to="/" className="auth-brand">
          <span className="auth-mark">ST</span>
          <span>
            STar <b>Academy</b>
            <small>GRADE 12 · ECZ</small>
          </span>
        </Link>
        <div className="auth-promo-copy">
          <span className="auth-kicker">
            <GraduationCap size={16} /> YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1>
            Prepare with purpose.
            <br />
            <em>Excel with confidence.</em>
          </h1>
          <p>
            A focused study space for Zambia's Grade 12 learners. Build your
            confidence one topic and one paper at a time.
          </p>
          <div className="auth-points">
            <span>
              <ShieldCheck /> Secure student account
            </span>
            <span>
              <BookOpen /> Exam-focused resources
            </span>
          </div>
        </div>
        <div className="auth-promo-foot">
          Made for learners in Zambia <span>●</span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="auth-mark">ST</span> STar Academy
          </div>
          <span className="eyebrow">WELCOME TO STar ACADEMY</span>
          <h2>
            {mode === "login"
              ? "Good to see you again"
              : "Create your student account"}
          </h2>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to continue your preparation."
              : "Join other learners preparing for ECZ."}
          </p>
          <div className="auth-switch">
            <button
              className={mode === "login" ? "selected" : ""}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Sign in
            </button>
            <button
              className={mode === "signup" ? "selected" : ""}
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
            >
              Create account
            </button>
          </div>
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <>
                <div className="auth-two">
                  <label>
                    First name
                    <input
                      name="first_name"
                      value={form.first_name}
                      onChange={change}
                      autoComplete="given-name"
                      required
                      placeholder="e.g. Chipo"
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      name="last_name"
                      value={form.last_name}
                      onChange={change}
                      autoComplete="family-name"
                      required
                      placeholder="Your surname"
                    />
                  </label>
                </div>
                <label>
                  Username
                  <input
                    name="username"
                    value={form.username}
                    onChange={change}
                    autoComplete="username"
                    required
                    placeholder="Choose a username"
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={change}
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={change}
                    autoComplete="tel"
                    required
                    placeholder="0971234567"
                  />
                </label>
              </>
            )}
            {mode === "login" && (
              <label>
                Email, username or phone number
                <input
                  name="identifier"
                  value={form.identifier}
                  onChange={change}
                  autoComplete="username"
                  required
                  placeholder="Enter your login details"
                />
              </label>
            )}
            <label>
              Password
              <span className="password-wrap">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={change}
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  minLength={mode === "signup" ? 8 : 1}
                  required
                  placeholder={
                    mode === "signup"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>
            {mode === "login" && (
              <div className="auth-forgot">
                <Link to="/reset-password">Forgot password?</Link>
              </div>
            )}
            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
            <button className="auth-submit" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in to your account"
                  : "Create my account"}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-terms">
            By continuing, you agree to use STar Academy respectfully and
            responsibly.
          </p>
          <p className="auth-back">
            <Link to="/">← Back to STar Academy home</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
