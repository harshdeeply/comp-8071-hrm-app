import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Button, Grid } from "@mui/material";
import axios from "../../api/axios";
import { getStatusText } from "./EmployeeDashboard";

type LeaveRequest = {
  leaveRequestId: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: number; // 0 = Pending, 1 = Approved, 2 = Denied
  employee: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
};

export default function ManagerDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  const fetchRequests = () => {
    axios
      .get("/leaverequests/team")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = (id: number, approve: boolean) => {
    axios
      .post(`/leaverequests/${approve ? "approve" : "deny"}/${id}`)
      .then(() => {
        // Update the status of the specific request in state
        setRequests((prev) =>
          prev.map((req) =>
            req.leaveRequestId === id
              ? {
                  ...req,
                  status: approve ? 1 : 2,
                }
              : req
          )
        );
      })
      .catch(console.error);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}
    >
      <Grid display={{ xs: "12" }} sx={{ width: "100%" }}>
        <Typography variant="h4">Team Leave Requests</Typography>
      </Grid>

      {requests.length === 0 && (
        <Grid display={{ xs: "12" }} sx={{ width: "100%" }}>
          <Typography variant="h6">No leave requests</Typography>
        </Grid>
      )}

      {requests.map((req) => (
        <Grid
          display={{ xs: "12", sm: "6" }}
          key={req.leaveRequestId}
          sx={{ width: { xs: "100%", sm: "48%" }, m: "1%" }}
        >
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">
                {req.employee.user.firstName} {req.employee.user.lastName}
              </Typography>
              <Typography>Reason: {req.reason}</Typography>
              <Typography>Status: {getStatusText(req.status)}</Typography>
              <Typography>From: {req.startDate}</Typography>
              <Typography>To: {req.endDate}</Typography>

              {req.status === 0 && (
                <>
                  <Button
                    onClick={() => handleDecision(req.leaveRequestId, true)}
                    color="success"
                    variant="contained"
                    sx={{ mr: 1, mt: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleDecision(req.leaveRequestId, false)}
                    color="error"
                    variant="contained"
                    sx={{ mt: 1 }}
                  >
                    Deny
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
