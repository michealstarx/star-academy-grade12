import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import API from "../api.js";


const AuthContext = createContext(null);
const CACHE_KEY = "starStudent";

function saveCachedUser(user) {
  try {
    if (user) sessionStorage.setItem(CACHE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Session storage may be unavailable; the Django session remains authoritative.
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const acceptUser = useCallback((nextUser) => {
    setUserState(nextUser || null);
    saveCachedUser(nextUser || null);
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await fetch(`${API}/auth/profile/`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (response.status === 401 || response.status === 403) {
      acceptUser(null);
      return null;
    }
    if (!response.ok) throw new Error("Your sign-in status could not be checked.");
    const profile = await response.json();
    acceptUser(profile);
    return profile;
  }, [acceptUser]);

  useEffect(() => {
    let alive = true;
    refreshUser()
      .catch(() => {
        if (alive) acceptUser(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [refreshUser, acceptUser]);

  // Recheck the server session when returning to this tab (for example, after
  // signing out in another tab or after the session expires).
  useEffect(() => {
    const verifySessionOnFocus = () => { refreshUser().catch(() => {}); };
    window.addEventListener("focus", verifySessionOnFocus);
    return () => window.removeEventListener("focus", verifySessionOnFocus);
  }, [refreshUser]);

  const logout = useCallback(async () => {
    const csrfResponse = await fetch(`${API}/auth/csrf/`, { credentials: "include" });
    const csrfData = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok || !csrfData.csrfToken) {
      throw new Error("Could not start a secure logout. Please try again.");
    }
    const response = await fetch(`${API}/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRFToken": csrfData.csrfToken },
    });
    if (!response.ok && response.status !== 401) {
      throw new Error("Logout failed. Please try again.");
    }
    acceptUser(null);
  }, [acceptUser]);

  const value = useMemo(() => ({ user, loading, acceptUser, refreshUser, logout }), [user, loading, acceptUser, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
