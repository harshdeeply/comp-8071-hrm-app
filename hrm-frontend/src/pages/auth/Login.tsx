import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Redirect to dashboard if already logged in
  //   if (user) {
  //     navigate("/dashboard");
  //     return;
  //   }
  // }, [user, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Login</Typography>

      {/* Password */}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Password */}
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Container>
  );
}
