import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    password: "",
    departmentId: "",
    dateOfBirth: "",
    dateHired: "",
    roleName: "",
    isManager: false,
  });

  useEffect(() => {
    axios
      .get("/employees")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddEmployee = async () => {
    const payload = {
      address: form.address,
      dateOfBirth: form.dateOfBirth,
      dateHired: form.dateHired,
      departmentId: Number(form.departmentId),
      isManager: form.isManager,
      managerId: null,
      user: {
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        passwordHash: form.password,
        email: form.email,
        dateCreated: new Date().toISOString(),
        role: {
          roleName: form.roleName,
        },
      },
    };

    try {
      await axios.post("/employees", payload);
      setOpen(false);
      setForm({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        password: "",
        departmentId: "",
        dateOfBirth: "",
        dateHired: "",
        roleName: "",
        isManager: false,
      });
      const res = await axios.get("/employees");
      setUsers(res.data);
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Box>
      {/* Header Row */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid>
          <Typography variant="h4">All Employees</Typography>
        </Grid>
        <Grid>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Employee
          </Button>
        </Grid>
      </Grid>

      {/* Employee Cards */}
      <Grid container spacing={2}>
        {users.map((user: any) => (
          <Grid display={{ xs: "12", sm: "6" }} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography>Email: {user?.email}</Typography>
                <Typography>Role: {user?.role}</Typography>
                <Typography>Department: {user.departmentName}</Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  Edit Info
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Employee Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Department ID"
            name="departmentId"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Role"
            name="roleName"
            fullWidth
            margin="dense"
            onChange={handleChange}
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            label="Date Hired"
            name="dateHired"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEmployee}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
