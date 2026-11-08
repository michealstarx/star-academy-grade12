import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Atom,
  Globe2,
  Landmark,
  Languages,
  BriefcaseBusiness,
  GraduationCap,
  Menu,
  X,
  CircleHelp,
} from "lucide-react";
import "../styles.css";
import HomeLanding from "./HomeLanding.jsx";
import SubjectsPage from "./Subjects.jsx";
import SubjectDetailPage from "./SubjectDetail.jsx";
import PracticePage from "./Practice.jsx";
import ReviewsPage from "./Reviews.jsx";
import HowItWorksPage from "./HowItWorks.jsx";


import API from "../api.js";
import { useAuth } from "../auth/AuthContext.jsx";
const iconForSubject = (subject) => {
  const name = (subject.name || "").toLowerCase();
  if (name.includes("math") || name.includes("account")) return Calculator;
  if (name.includes("biology") || name.includes("chemistry")) return FlaskConical;
  if (name.includes("physics")) return Atom;
  if (name.includes("geography")) return Globe2;
  if (name.includes("history")) return Landmark;
  if (name.includes("english") || name.includes("language")) return Languages;
  if (name.includes("commerce")) return BriefcaseBusiness;
  if (name.includes("civic")) return GraduationCap;
  return BookOpen;
};
const colorForSubject = (subject) => {
  const colors = { Core: "blue", Science: "green", Languages: "pink", Humanities: "teal", Business: "purple" };
  return colors[subject.category] || "blue";
};

function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout: logoutSession } = useAuth();
  const [page, setPage] = useState("home");
  const [subjects, setSubjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState("");
  const [activeSubject, setActiveSubject] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadSubjects = async () => {
      setSubjectsLoading(true);
      setSubjectsError("");
      try {
        const response = await fetch(`${API}/subjects/`, { credentials: "include", signal: controller.signal });
        if (!response.ok) throw new Error("Subjects could not be loaded. Check that Django is running.");
        const body = await response.json();
        const rows = Array.isArray(body) ? body : body.results || [];
        const mapped = rows.map((subject) => ({
          ...subject,
          desc: subject.description || "Explore published topics and practice resources for this subject.",
          topics: Number(subject.topic_count || 0),
          icon: iconForSubject(subject),
          color: colorForSubject(subject),
        }));
        setSubjects(mapped);
        setActiveSubject((current) => current ? (mapped.find((item) => item.id === current.id) || current) : (mapped[0] || null));
      } catch (error) {
        if (error.name !== "AbortError") setSubjectsError(error.message || "Subjects could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setSubjectsLoading(false);
      }
    };
    const loadReviews = async () => {
      try {
        const response = await fetch(`${API}/reviews/`, { credentials: "include", signal: controller.signal });
        if (!response.ok) throw new Error("Student reviews could not be loaded.");
        const body = await response.json();
        setReviews(Array.isArray(body) ? body : body.results || []);
      } catch (error) {
        if (error.name !== "AbortError") setReviews([]);
      }
    };
    loadSubjects();
    loadReviews();
    return () => controller.abort();
  }, []);

  const go = (nextPage) => {
    setPage(nextPage);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openSubject = (subject) => {
    setActiveSubject(subject);
    setPage("subject");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const filtered = useMemo(() => subjects.filter((subject) =>
    (category === "All" || subject.category === category) &&
    subject.name.toLowerCase().includes(query.toLowerCase())
  ), [subjects, category, query]);
  const categories = useMemo(() => ["All", ...new Set(subjects.map((subject) => subject.category).filter(Boolean))], [subjects]);

  const NavLink = ({ to, children }) => (
    <button className={`navlink ${page === to ? "active" : ""}`} onClick={() => go(to)}>{children}</button>
  );
  const SubjectCard = ({ s }) => {
    const Icon = s.icon || BookOpen;
    return (
      <article className="subject-card" onClick={() => openSubject(s)} tabIndex="0" role="button"
        onKeyDown={(event) => event.key === "Enter" && openSubject(s)}>
        <div className={`subject-icon ${s.color || "blue"}`}><Icon size={23} /></div>
        <div className="subject-card-top">
          <span className="eyebrow">{s.category || "Subject"}</span>
          <span className="price-pill">Free</span>
        </div>
        <h3>{s.name}</h3>
        <p>{s.desc}</p>
        <div className="card-meta">
          <span><BookOpen size={15} />{s.topics} published topics</span>
          <span className="card-arrow"><ArrowRight size={18} /></span>
        </div>
      </article>
    );
  };

  async function handleLogout() {
    try {
      await logoutSession();
      setNotice("You have signed out successfully.");
    } catch (error) {
      setNotice(error.message || "Could not log out. Please try again.");
    }
  }

  const displayName = user?.first_name || user?.username || "Student";

  const pageProps = {
    go,
    Footer,
    SubjectCard,
    subjects,
    reviews,
    categories,
    subjectsLoading,
    subjectsError,
    category,
    filtered,
    query,
    setCategory,
    setQuery,
    activeSubject,
    openSubject,
    setNotice,
  };

  return (
    <>
      <header className="header">
        <div className="nav-wrap">
          <button className="brand" onClick={() => go("home")}>
            <span className="brand-mark star-mark">ST</span>
            <span>STar<span className="brand-accent"> Academy</span><small>GRADE 12 · ECZ</small></span>
          </button>
          <nav className={mobileNav ? "nav-links open" : "nav-links"}>
            <NavLink to="home">Home</NavLink>
            <NavLink to="subjects">Subjects & topics</NavLink>
            <NavLink to="reviews">Student reviews</NavLink>
            <button className="navlink" onClick={() => navigate("/past-papers")}>Past papers</button>
            <NavLink to="how">How it works</NavLink>
            {user && <button className="navlink mobile-session-link" onClick={() => navigate("/dashboard")}>My dashboard · {displayName}</button>}
            {user && <button className="navlink mobile-session-link" onClick={handleLogout}>Log out</button>}
            {!user && !authLoading && <button className="navlink mobile-session-link" onClick={() => navigate("/login")}>Log in</button>}
            {!user && !authLoading && <button className="navlink mobile-session-link" onClick={() => navigate("/signup?next=/dashboard")}>Register free</button>}
          </nav>
          <div className="nav-actions">
            {authLoading ? (
              <span className="nav-session-status">Checking session…</span>
            ) : user ? (
              <>
                <span className="nav-session-status">Signed in as <b>{displayName}</b></span>
                <button className="text-login" onClick={() => navigate("/dashboard")}>Dashboard</button>
                <button className="btn btn-primary btn-small" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <button className="text-login" onClick={() => navigate("/login")}>Log in</button>
                <button className="btn btn-primary btn-small" onClick={() => navigate("/signup?next=/dashboard")}>
                  Register free <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
          <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">
            {mobileNav ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {page === "home" && <HomeLanding {...pageProps} />}
      {page === "subjects" && <SubjectsPage {...pageProps} />}
      {page === "subject" && activeSubject && <SubjectDetailPage {...pageProps} />}
      {page === "prep" && <PracticePage {...pageProps} />}
      {page === "reviews" && <ReviewsPage {...pageProps} />}
      {page === "how" && <HowItWorksPage {...pageProps} />}
      {page === "subject" && !activeSubject && <main className="page-main"><h1>No subjects are published yet.</h1><p>Add a subject in Django admin and mark it as published.</p></main>}
      {notice && <div className="toast" role="status"><CircleHelp size={18} /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16} /></button></div>}
    </>
  );
}

function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <button className="brand footer-brand-button" onClick={() => go("home")}>
            <span className="brand-mark star-mark">ST</span><span>STar<span className="brand-accent"> Academy</span><small>GRADE 12 · ECZ</small></span>
          </button>
          <p>Helping Zambia ECZ Grade 12 learners prepare with clarity, confidence and purpose.</p>
        </div>
        <div><b>Explore</b><button onClick={() => go("subjects")}>Subjects & topics</button><button onClick={() => go("how")}>How it works</button><button onClick={() => go("reviews")}>Student reviews</button></div>
        <div><b>Study tools</b><button onClick={() => go("prep")}>Practice questions</button><button onClick={() => go("subjects")}>Revision library</button><button onClick={() => go("subjects")}>Browse topics</button></div>
        <div className="footer-help"><b>Keep moving forward.</b><p>One topic. One session. One step closer.</p><button className="btn btn-white btn-small" onClick={() => go("subjects")}>Start learning free <ArrowRight size={15} /></button></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} STar Academy. Built for focused learning.</span><span>Made for learners in Zambia <span className="zambia-dot">●</span></span></div>
    </footer>
  );
}

export default Home;
