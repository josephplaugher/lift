import { useState } from "react";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

export function useEmailAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  function setLoading(value: boolean) {
    setAuth({
      user: auth.user,
      loading: value,
      error: auth.error,
    });
  }

  function setError(message: string | null) {
    setAuth({
      user: auth.user,
      loading: false,
      error: message,
    });
  }

  async function createAccount(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Failed to create account");
      }

      const data = await res.json();
      setAuth({ user: data.user, loading: false, error: null });
      return data;
    } catch (err: any) {
      setAuth({ user: null, loading: false, error: err.message });
      throw err;
    }
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      setAuth({ user: data.user, loading: false, error: null });
      return data;
    } catch (err: any) {
      setAuth({ user: null, loading: false, error: err.message });
      throw err;
    }
  }

  async function verifyEmail(token: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-email?token=" + token, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Invalid or expired token");
      }

      const data = await res.json();
      setAuth({ user: data.user, loading: false, error: null });
      return data;
    } catch (err: any) {
      setAuth({ user: auth.user, loading: false, error: err.message });
      throw err;
    }
  }

  async function resetPassword(email: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Unable to send password reset email");
      }

      const data = await res.json();
      setAuth({ user: auth.user, loading: false, error: null });
      return data;
    } catch (err: any) {
      setAuth({ user: auth.user, loading: false, error: err.message });
      throw err;
    }
  }

  function signOut() {
    setAuth({ user: null, loading: false, error: null });
    // optionally, call backend logout endpoint
  }

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    createAccount: createAccount,
    signIn: signIn,
    verifyEmail: verifyEmail,
    resetPassword: resetPassword,
    signOut: signOut,
  };
}