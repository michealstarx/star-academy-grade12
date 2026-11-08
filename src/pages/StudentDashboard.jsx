import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, FileText, UserRound, LogOut, ArrowRight, GraduationCap,
  ShieldCheck, Clock3, Star, MessageCircle, CheckCircle2,
} from "lucide-react";
import "./student-pages.css";

import API from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";

async function getCsrf() {
  const response = await fetch(`${API}/auth/csrf/`, { credentials: "include" });
  const data = await response.json();
  if (!response.ok || !data.csrfToken) throw new Error("Could not start a secure session. Refresh and try again.");
  return data.csrfToken;
}

export default function StudentDashboard() {
  const nav = useNavigate();
  const { user, loading: authLoading, logout: logoutSession } = useAuth();
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [reviewType, setReviewType] = useState("experience");
  const [subjectId, setSubjectId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    setProfile(user);
    fetch(`${API}/subjects/`, { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Subjects could not be loaded.");
        const d = await r.json();
        setSubjects(Array.isArray(d) ? d : d.results || []);
      })
      .catch(() => setError((old) => old || "The subject list could not be loaded. Check that Django is running."));
  }, [authLoading, user]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError("");
    try {
      await logoutSession();
      nav("/login", { replace: true });
    } catch (e) {
      setError(e.message || "Could not contact the server to log out.");
      setLoggingOut(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewBusy(true);
    setReviewMessage("");
    try {
      const token = await getCsrf();
      const response = await fetch(`${API}/reviews/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-CSRFToken": token },
        body: JSON.stringify({
          review_type: reviewType,
          ...(reviewType === "subject" ? { subject: Number(subjectId) } : {}),
          rating,
          comment,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = data.detail || Object.values(data).flat().join(" ") || "Your rating could not be saved.";
        throw new Error(detail);
      }
      setReviewMessage("Thank you — your rating was saved and sent for moderation.");
      setComment("");
    } catch (e) {
      setReviewMessage(e.message || "Your rating could not be saved. Please try again.");
    } finally {
      setReviewBusy(false);
    }
  }

  const s = profile || user || {};
  const first = s.first_name || s.username || "Student";
  return (
    <div className="student-area">
      <header className="student-top">
        <Link to="/" className="auth-brand">
          <span className="auth-mark">ST</span>
          <span>STar <b>Academy</b><small>GRADE 12 · ECZ</small></span>
        </Link>
        <nav>
          <span className="student-session-label">Signed in as <b>{user?.first_name || user?.username || "Student"}</b></span>
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/past-papers">Past papers</Link>
          <button onClick={logout} disabled={loggingOut} aria-label="Log out of your student account">
            <LogOut size={16} /> {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </nav>
      </header>
      <main className="student-main">
        <div className="dash-welcome">
          <div>
            <span className="eyebrow">YOUR LEARNING SPACE</span>
            <h1>Welcome back, {first} <span>👋</span></h1>
            <p>Choose a subject, practise, and keep building your confidence.</p>
          </div>
          <div className="dash-avatar"><UserRound size={27} /></div>
        </div>
        {error && <p className="dash-note" role="alert">{error}</p>}
        <section className="dash-banner">
          <div>
            <span className="auth-kicker"><GraduationCap size={16} /> YOUR ECZ PREPARATION</span>
            <h2>Small steps. Strong results.</h2>
            <p>Explore your subjects, study topics, practise with available resources, and share feedback as you learn.</p>
            <Link className="dash-primary" to="/#subjects">Explore subjects <ArrowRight size={17} /></Link>
          </div>
          <div className="dash-banner-icon"><BookOpen size={66} /></div>
        </section>
        <div className="dash-section-title">
          <div><h2>Quick access</h2><p>Open the learning resources you need.</p></div>
        </div>
        <section className="dash-tiles">
          <Link to="/#subjects" className="dash-tile">
            <span className="dash-tile-icon blue"><BookOpen /></span>
            <div><h3>Courses & subjects</h3><p>Open the subject catalogue and select a subject to view its learning path.</p><b>Browse subjects <ArrowRight size={15} /></b></div>
          </Link>
          <Link to="/past-papers" className="dash-tile">
            <span className="dash-tile-icon green"><FileText /></span>
            <div><h3>Past papers</h3><p>Search papers by subject and year, then open their study links.</p><b>Open paper library <ArrowRight size={15} /></b></div>
          </Link>
          <Link to="/reset-password" className="dash-tile">
            <span className="dash-tile-icon gold"><ShieldCheck /></span>
            <div><h3>Account security</h3><p>Use the password reset flow if you need to regain access to your account.</p><b>Manage password <ArrowRight size={15} /></b></div>
          </Link>
        </section>

        <section className="rating-panel" id="student-rating">
          <div className="dash-section-title">
            <div><h2>Rate your learning experience</h2><p>Registered students can rate the platform or a subject they have studied.</p></div>
          </div>
          <form className="student-rating-form" onSubmit={submitReview}>
            <label>What would you like to rate?
              <select value={reviewType} onChange={(e) => { setReviewType(e.target.value); setReviewMessage(""); }}>
                <option value="experience">My overall STar Academy experience</option>
                <option value="subject">A subject I have studied</option>
              </select>
            </label>
            {reviewType === "subject" && (
              <label>Choose subject
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                </select>
              </label>
            )}
            <fieldset className="student-star-field">
              <legend>Your rating</legend>
              <div className="student-stars" role="group" aria-label="Rating out of five">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} className={n <= rating ? "selected" : ""} onClick={() => setRating(n)} aria-label={`${n} out of 5 stars`}>
                    <Star size={24} fill={n <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
                <span>{rating}/5</span>
              </div>
            </fieldset>
            <label>Comment (optional)
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={1000} placeholder="What worked well? What should we improve?" />
            </label>
            <button className="rating-submit" type="submit" disabled={reviewBusy || (reviewType === "subject" && !subjectId)}>
              <MessageCircle size={16} /> {reviewBusy ? "Saving rating…" : "Submit rating"}
            </button>
            {reviewMessage && <p className="rating-feedback" role="status">{reviewMessage}</p>}
            <small>Ratings are tied to your account and checked before they appear publicly. One rating is allowed per category/subject; contact support if you need it changed.</small>
          </form>
        </section>
        <section className="dash-tip">
          <Clock3 size={21} /><div><b>A study tip for today</b><p>Choose one topic, attempt a set of questions, then review every mistake.</p></div>
        </section>
        <footer className="student-foot">
          © {new Date().getFullYear()} STar Academy · Built for focused learning in Zambia.
          <button className="dashboard-logout-footer" onClick={logout} disabled={loggingOut}><LogOut size={14} /> Log out</button>
        </footer>
      </main>
    </div>
  );
}
