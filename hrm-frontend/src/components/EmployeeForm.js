import React, { useState, useEffect } from "react";
import { addEmployee, getDepartments } from "../services/api";
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

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getDepartments().then((res) => setDepartments(res.data));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmployee({
      ...formData,
      departmentId: parseInt(formData.departmentId),
    });
    setFormData({
      firstName: "",
      lastName: "",
      position: "",
      departmentId: "",
    });
    alert("Employee added!");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={4}>
      <Typography variant="h6" gutterBottom>
        Add Employee
      </Typography>
      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Position"
        name="position"
        value={formData.position}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Department</InputLabel>
        <Select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          label="Department"
        >
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained">
        Add
      </Button>
    </Box>
  );
};

export default EmployeeForm;
