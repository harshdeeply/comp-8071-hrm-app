import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Rehydrate user on app load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("/users/me");
          if (res.data) {
            setUser(res.data);
            navigate("/dashboard"); // Redirect to dashboard after login
            return;
          }
        } catch (err) {
          console.error("Invalid token", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
