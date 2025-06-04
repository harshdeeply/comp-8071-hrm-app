import { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "../../api/axios";
import dayjs from "dayjs";

export default function TeamLeaveRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get("/leaverequests/team").then((res) => setRequests(res.data));
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Team Leave Requests
      </Typography>
      <Grid container spacing={2}>
        {requests.map((req: any) => (
          <Grid display={{ xs: "12", sm: "6" }} key={req.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{req.employeeName}</Typography>
                <Typography>Status: {req.status}</Typography>
                <Typography>
                  From: {dayjs(req.startDate).format("YYYY-MM-DD")}
                </Typography>
                <Typography>
                  To: {dayjs(req.endDate).format("YYYY-MM-DD")}
                </Typography>
                <Typography>Reason: {req.reason}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
