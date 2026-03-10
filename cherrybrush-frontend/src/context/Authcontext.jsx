import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get("/api/profile");

      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    await checkAuth();
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);