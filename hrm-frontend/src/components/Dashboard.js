import React from "react";
import { Container, Typography, Box, Button, Grid, Paper } from "@mui/material";

const Dashboard = () => {
  return (
    <Container>
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                User Stats
              </Typography>
              <Button variant="contained" color="primary">
                View Stats
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Manage Users
              </Typography>
              <Button variant="contained" color="primary">
                Manage Users
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <Button variant="contained" color="primary">
                Configure Settings
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
