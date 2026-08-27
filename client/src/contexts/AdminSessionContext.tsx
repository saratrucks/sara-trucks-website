import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AdminSessionContextValue = {
  isAdmin: boolean;
  isChecking: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);
const SESSION_HINT_KEY = "sara-admin-session-hint";

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const isLocalAdminPreview = import.meta.env.DEV && import.meta.env.VITE_ADMIN_PREVIEW === "true";
  const [isAdmin, setIsAdmin] = useState(isLocalAdminPreview);
  const [isChecking, setIsChecking] = useState(!isLocalAdminPreview);

  const refresh = useCallback(async () => {
    if (isLocalAdminPreview) {
      setIsAdmin(true);
      setIsChecking(false);
      return;
    }

    const isAdminPath = window.location.pathname.startsWith("/admin");
    const hasSessionHint = window.localStorage.getItem(SESSION_HINT_KEY) === "1";

    if (!isAdminPath && !hasSessionHint) {
      setIsAdmin(false);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as { authenticated?: boolean };
      const authenticated = response.ok && data.authenticated === true;
      setIsAdmin(authenticated);
      if (!authenticated) window.localStorage.removeItem(SESSION_HINT_KEY);
    } catch {
      setIsAdmin(false);
    } finally {
      setIsChecking(false);
    }
  }, [isLocalAdminPreview]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (password: string) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json()) as { authenticated?: boolean; error?: string };
    if (!response.ok || !data.authenticated) {
      throw new Error(data.error || "تعذر تسجيل الدخول.");
    }
    window.localStorage.setItem(SESSION_HINT_KEY, "1");
    setIsAdmin(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } finally {
      window.localStorage.removeItem(SESSION_HINT_KEY);
      setIsAdmin(false);
    }
  }, []);

  const value = useMemo(
    () => ({ isAdmin, isChecking, login, logout, refresh }),
    [isAdmin, isChecking, login, logout, refresh],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) throw new Error("useAdminSession must be used inside AdminSessionProvider");
  return context;
}
