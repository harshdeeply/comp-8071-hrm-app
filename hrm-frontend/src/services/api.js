import axios from "axios";

export const API_BASE = "http://localhost:5268/api";

export const getEmployees = () => axios.get(`${API_BASE}/employees`);
export const addEmployee = (employee) =>
  axios.post(`${API_BASE}/employees`, employee);

export const getDepartments = () => axios.get(`${API_BASE}/departments`);
export const addDepartment = (department) =>
  axios.post(`${API_BASE}/departments`, department);
export const getDepartmentById = (id) =>
  axios.get(`${API_BASE}/departments/${id}`);

export const getAttendances = () => axios.get(`${API_BASE}/attendances`);
export const addAttendance = (attendance) =>
  axios.post(`${API_BASE}/attendances`, attendance);
