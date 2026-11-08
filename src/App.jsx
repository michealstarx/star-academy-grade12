import { BrowserRouter, Navigate, Route, Routes, useSearchParams, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StudentAuth from "./pages/StudentAuth.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import PastPapers from "./pages/PastPapers.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";

function CheckingSession() {
  return (
    <main className="session-check" role="status" aria-live="polite">
      <span className="session-check-mark">ST</span>
      <p>Checking your STar Academy session…</p>
    </main>
  );
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  if (loading) return <CheckingSession />;
  if (user) {
    const requestedPath = params.get("next");
    const destination = requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/dashboard";
    return <Navigate to={destination} replace />;
  }
  return children;
}

function StudentOnly({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <CheckingSession />;
  if (!user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestOnly><StudentAuth /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><StudentAuth /></GuestOnly>} />
      <Route path="/dashboard" element={<StudentOnly><StudentDashboard /></StudentOnly>} />
      <Route path="/past-papers" element={<PastPapers />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
