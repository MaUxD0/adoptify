import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../api/supabase";
import type { User, LoginFormData, RegisterFormData } from "../types/auth.types";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = (session.user.user_metadata?.role ?? "ADOPTER").toUpperCase() as User['role'];
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name ?? "",
          role,
          shelter_id: role === 'SHELTER' ? (session.user.user_metadata?.shelter_id ?? session.user.id) : undefined,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        };

        setUser(mappedUser);
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("user", JSON.stringify(mappedUser));

        console.log("USER SAVED:", mappedUser);
        console.log("TOKEN SAVED:", session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      setLoading(false);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const login = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });
      console.log("LOGIN RESPONSE:", authData);
      console.log("LOGIN ERROR:", error);
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(msg);
      setLoading(false);
      throw err;
    }
  };

  const register = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
          },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al registrarse";
      setError(msg);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};