import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Search,
  ArrowLeft,
  Download,
  Link2,
} from "lucide-react";
import "./student-pages.css";
import API from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
export default function PastPapers() {
  const { user, loading: authLoading, logout: logoutSession } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  async function handleLogout() {
    setLogoutError("");
    try { await logoutSession(); navigate("/", { replace: true }); }
    catch (error) { setLogoutError(error.message || "Could not log out. Please try again."); }
  }
  const [subjects, setSubjects] = useState([]),
    [query, setQuery] = useState(""),
    [subject, setSubject] = useState("All subjects"),
    [year, setYear] = useState("All years"),
    [papers, setPapers] = useState([]),
    [notice, setNotice] = useState("Loading available papers…");
  useEffect(() => {
    fetch(`${API}/subjects/`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Subjects could not be loaded.");
        return r.json();
      })
      .then((d) => {
        const rows = Array.isArray(d) ? d : d.results || [];
        setSubjects(rows);
        setNotice(
          rows.length
            ? "Choose a subject to view its available study resources."
            : "No published subjects are available yet.",
        );
      })
      .catch(() =>
        setNotice(
          "Could not connect to the library. Check that Django is running.",
        ),
      );
    fetch(`${API}/past-papers/`, { credentials: "include" })
      .then(async (r) => {
        if (r.ok) {
          const d = await r.json();
          setPapers(Array.isArray(d) ? d : d.results || []);
        }
      })
      .catch(() => {});
  }, []);
  const names = subjects.map((s) => s.name);
  const shown = useMemo(
    () =>
      names.filter(
        (n) =>
          (subject === "All subjects" || subject === n) &&
          n.toLowerCase().includes(query.toLowerCase()),
      ),
    [names, subject, query],
  );
  const filteredPapers = papers.filter(
    (p) =>
      (subject === "All subjects" ||
        p.subject_name === subject ||
        p.subject === subject) &&
      (year === "All years" || String(p.year) === year) &&
      `${p.title} ${p.subject_name || ""} ${p.year}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="student-area">
      <header className="student-top">
        <Link to="/" className="auth-brand">
          <span className="auth-mark">ST</span>
          <span>
            STar <b>Academy</b>
            <small>GRADE 12 · ECZ</small>
          </span>
        </Link>
        <nav>
          {user ? (
            <>
              <span className="student-session-label">Signed in as <b>{user.first_name || user.username}</b></span>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/past-papers" className="active">Past papers</Link>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/past-papers" className="active">Past papers</Link>
              {!authLoading && <Link to="/login">Sign in</Link>}
            </>
          )}
        </nav>
      </header>
      <main className="student-main papers-main">
        {logoutError && <p className="auth-message" role="alert">{logoutError}</p>}
        <Link className="back-link" to={user ? "/dashboard" : "/"}>
          <ArrowLeft size={16} /> {user ? "Back to dashboard" : "Back to home"}
        </Link>
        <div className="papers-heading">
          <span className="eyebrow">PRACTISE WITH PURPOSE</span>
          <h1>Past paper library</h1>
          <p>
            Prepare for ECZ with focused practice. Find papers by subject and
            year.
          </p>
        </div>
        <div className="papers-search">
          <Search size={19} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects or papers…"
            aria-label="Search past papers"
          />
        </div>
        <div className="papers-filters">
          <label>
            Subject
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option>All subjects</option>
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            Year
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>All years</option>
              {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map(
                (y) => (
                  <option key={y}>{y}</option>
                ),
              )}
            </select>
          </label>
        </div>
        {papers.length > 0 ? (
          <section className="paper-grid">
            {filteredPapers.map((p) => (
              <article className="paper-card" key={p.id}>
                <span className="paper-file">
                  <FileText size={22} />
                </span>
                <div>
                  <span className="paper-meta">
                    {p.year || "ECZ"} · {p.exam_type || "Past paper"}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.subject_name || p.subject}</p>
                </div>
                {p.resource_url || p.file_url || p.file ? (
                  <a
                    className="paper-open"
                    href={p.resource_url || p.file_url || p.file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={16} /> Open link
                  </a>
                ) : (
                  <span className="paper-unavailable">
                    <Link2 size={15} /> Link not added
                  </span>
                )}
              </article>
            ))}
          </section>
        ) : (
          <>
            <div className="papers-subject-head">
              <h2>Browse by subject</h2>
              <span>{shown.length} subjects</span>
            </div>
            <section className="paper-subject-grid">
              {shown.map((name, i) => (
                <article className="paper-subject" key={name}>
                  <span className={`paper-subject-icon color-${i % 4}`}>
                    <BookOpen size={22} />
                  </span>
                  <div>
                    <h3>{name}</h3>
                    <p>ECZ Grade 12 resources</p>
                  </div>
                  <span className="paper-count">Library</span>
                </article>
              ))}
            </section>
            <div className="papers-empty">
              <FileText size={23} />
              <div>
                <b>{subjects.length ? "Past paper links will appear here" : "No published subjects are available"}</b>
                <p>
                  {notice} The administrator adds a Google Drive or document link in Django admin before a paper appears here.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
