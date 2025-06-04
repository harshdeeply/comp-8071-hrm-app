import { Typography, Paper, Box } from "@mui/material";
import { useAuth } from "../../auth/AuthProvider";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Box>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Role: {user?.role}</Typography>
        <Typography>ID: {user?.id}</Typography>
      </Box>
    </Paper>
  );
}
