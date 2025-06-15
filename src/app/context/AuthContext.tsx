  'use client'
  import React, { createContext, useState, useEffect, ReactNode } from "react";

  interface AuthContextType {
    accessToken: string | null;
    userId: string | null;
    userName: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
  }

  export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    userId: null,
    userName: null,
    setAccessToken: () => {},
    logout: () => {}
  });

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setAccessToken(token);
        fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/me/", {
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
const logout = () => {
    localStorage.removeItem("access_token");  
    setAccessToken(null);                      
    setUserId(null);                           
    setUserName(null);                         
  };
    return (
      <AuthContext.Provider value={{ accessToken, userId, userName, setAccessToken, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }