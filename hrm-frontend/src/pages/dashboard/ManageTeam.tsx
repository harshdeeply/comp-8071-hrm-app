import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "../../api/axios";

export default function ManageTeam() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    axios.get("/employees/myteam").then((res) => setTeam(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Team
      </Typography>

      <Grid container spacing={3}>
        {team.map((member: any) => (
          <Grid display={{ xs: "12", sm: "6", md: "4" }} key={member.userId}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Avatar>{member.firstName?.charAt(0).toUpperCase()}</Avatar>
                  <Typography variant="h6">
                    {member.firstName} {member.lastName}
                  </Typography>
                </Stack>
                <Typography>Email: {member.email}</Typography>
                <Typography>Role: {member.role}</Typography>
                <Typography>Department: {member.departmentName}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
