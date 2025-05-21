import React, { useState } from "react";
import { addDepartment } from "../services/api";
import { TextField, Button, Box, Typography } from "@mui/material";

const DepartmentForm = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDepartment({ name });
    setName("");
    alert("Department added!");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={4}>
      <Typography variant="h6" gutterBottom>
        Add Department
      </Typography>
      <TextField
        label="Department Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Add
      </Button>
    </Box>
  );
};

export default DepartmentForm;
