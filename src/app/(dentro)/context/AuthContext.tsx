  'use client'
  import React, { createContext, useState, useEffect, ReactNode } from "react";

  interface AuthContextType {
    accessToken: string | null;
    userId: string | null;
    userName: string | null;
    setAccessToken: (token: string | null) => void;
  }

  export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    userId: null,
    userName: null,
    setAccessToken: () => {},
  });

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setAccessToken(token);
        // Busca perfil
        fetch("http://localhost:8000/api/funcionarios/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setUserId(data.id);
            setUserName(data.nome);
          })
          .catch(console.error);
      }
    }, []);

    return (
      <AuthContext.Provider value={{ accessToken, userId, userName, setAccessToken }}>
        {children}
      </AuthContext.Provider>
    );
  }
