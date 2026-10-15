import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, AUTH_KEY, getStoredAuth } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = async (email, password, remember) => {
    const data = await api("/api/auth/login", { method: "POST", body: { email, password } });
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, JSON.stringify(data));
    setAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  return <AuthContext.Provider value={{ user: auth?.user ?? null, login, logout }}>{children}</AuthContext.Provider>;
}

export function RequireAdmin({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
