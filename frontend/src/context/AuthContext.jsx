import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API_BASE_URL = "https://commissionweb.wuaze.com";
const AUTH_KEY = "adminAuthData";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = async (email, password, remember) => {
    const res = await fetch(`${API_BASE_URL}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(data));

    setAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ user: auth?.user ?? null, token: auth?.token ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function RequireAdmin({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}