import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../api/supabase";
import type {
  User,
  LoginFormData,
  RegisterFormData,
} from "../types/auth.types";

import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ FIX PRINCIPAL: onAuthStateChange como ÚNICA fuente de verdad.
    //
    // Supabase dispara el evento INITIAL_SESSION automáticamente al montar,
    // con la sesión guardada en localStorage — sin llamada remota al servidor.
    //
    // El bug original tenía DOS problemas:
    //   1. loadSession() + onAuthStateChange corriendo en paralelo
    //   2. getCurrentUser() hacía supabase.auth.getUser() que valida el token
    //      remotamente — y esa llamada se bloqueaba por los errores de Amplitude
    //      en el SDK interno de Supabase, dejando loading=true para siempre.
    //
    // La solución: callback SÍNCRONO que lee los datos del session local
    // directamente, sin ningún await que pueda bloquearse.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Leemos user_metadata directamente del objeto session (local, sin red)
        const mappedUser: User = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name ?? "",
          role: session.user.user_metadata?.role ?? "adopter",
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        };

        setUser(mappedUser);
        localStorage.setItem("token", session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      // ✅ Siempre se ejecuta — no hay async que pueda colgarse
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      // ✅ En éxito NO hacemos setLoading(false) aquí:
      // onAuthStateChange lo hará al recibir el evento SIGNED_IN
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(msg);
      setLoading(false); // Solo en error, porque onAuthStateChange no se dispara
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
          data: { full_name: data.full_name, role: data.role },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al registrarse";
      setError(msg);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // onAuthStateChange recibirá SIGNED_OUT y limpiará localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};