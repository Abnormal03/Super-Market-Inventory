import React, { createContext, useContext, useState } from "react";
import { loginEmployee } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null); // { id, name, username, role_id, role_name, phone, status }
  const [loading, setLoading] = useState(false);

  async function login(username, password) {
    setLoading(true);
    try {
      const data = await loginEmployee(username, password);
      setEmployee(data);
      return data; // caller uses role_name to navigate
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setEmployee(null);
  }

  return (
    <AuthContext.Provider value={{ employee, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}