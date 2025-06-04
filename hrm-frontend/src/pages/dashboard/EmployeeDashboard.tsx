import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import axios from "../../api/axios";
import dayjs from "dayjs";

export const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Denied";
    default:
      return "Unknown";
  }
};

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("/users/me")
      .then((res) => setEmployeeId(res.data.id))
      .catch(console.error);

    axios
      .get("/leaverequests/my")
      .then((res) => setLeaves(res.data))
      .catch(console.error);
  }, []);

  const handleApply = async () => {
    try {
      await axios.post("/leaverequests", {
        employeeId,
        startDate,
        endDate,
        reason,
        status: 0, // Pending
      });
      setOpen(false);
      setReason("");
      setStartDate("");
      setEndDate("");

      const res = await axios.get("/leaverequests/my");
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to apply for leave:", err);
    }
  };

  return (
    <>
      {/* Header Row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Leave Requests</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Apply for Leave
        </Button>
      </Box>

      {/* Leave Cards */}
      <Grid container spacing={2}>
        {leaves.map((leave: any) => (
          <Grid
            display={{ xs: "12", sm: "6", md: "4" }}
            key={leave.leaveRequestId}
          >
            <Card>
              <CardContent>
                <Typography style={{ fontWeight: "bold" }}>
                  Reason: {leave.reason}
                </Typography>
                <Typography>Status: {getStatusText(leave.status)}</Typography>
                <Typography>
                  From: {dayjs(leave.startDate).format("YYYY-MM-DD")}
                </Typography>
                <Typography>
                  To: {dayjs(leave.endDate).format("YYYY-MM-DD")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog to Apply for Leave */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!startDate || !endDate || !reason}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
