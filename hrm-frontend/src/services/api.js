import axios from "../api/axios";

export const getEmployees = () => axios.get(`/employees`);
export const addEmployee = (employee) => axios.post(`/employees`, employee);

export const getDepartments = () => axios.get(`/departments`);
export const addDepartment = (department) =>
  axios.post(`/departments`, department);
export const getDepartmentById = (id) => axios.get(`/departments/${id}`);

export const getAttendances = () => axios.get(`/attendances`);
export const addAttendance = (attendance) =>
  axios.post(`/attendances`, attendance);
