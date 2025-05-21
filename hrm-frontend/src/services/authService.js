import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "./api";

// Register User
export const register = async (user) => {
  const response = await axios.post(`${API_BASE}/register`, user);
  localStorage.setItem("token", response.data.token); // Store JWT token
  return response.data;
};

// Login User
export const login = async (user) => {
  const response = await axios.post(`${API_BASE}/login`, user);
  localStorage.setItem("token", response.data.token); // Store JWT token
  return response.data;
};

// Get User Data from Token
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
