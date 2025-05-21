import React, { useState, useEffect } from "react";
import { getEmployees, addAttendance } from "../services/api";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const AttendanceForm = () => {
  const [attendance, setAttendance] = useState({
    employeeId: "",
    date: "",
    status: "",
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data));
  }, []);

  const handleChange = (e) =>
    setAttendance({ ...attendance, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAttendance({
      ...attendance,
      employeeId: parseInt(attendance.employeeId),
    });
    setAttendance({ employeeId: "", date: "", status: "" });
    alert("Attendance added!");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={4}>
      <Typography variant="h6" gutterBottom>
        Add Attendance
      </Typography>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Employee</InputLabel>
        <Select
          name="employeeId"
          value={attendance.employeeId}
          onChange={handleChange}
          label="Employee"
        >
          {employees.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.firstName} {e.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        type="date"
        name="date"
        value={attendance.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Status (e.g. Present)"
        name="status"
        value={attendance.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained">
        Add
      </Button>
    </Box>
  );
};

export default AttendanceForm;
