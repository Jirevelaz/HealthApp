import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  isAuthEnabled,
  loginWithEmail,
  logout,
  subscribeToAuthChanges,
} from "@/services/authClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isAuthEnabled());
  const [error, setError] = useState(null);
  const authAvailable = isAuthEnabled();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    setError(null);
    try {
      const authenticatedUser = await loginWithEmail(email, password);
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setError(null);
    await logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login: handleLogin,
      logout: handleLogout,
      authAvailable,
    }),
    [user, loading, error, handleLogin, handleLogout, authAvailable]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return context;
}

