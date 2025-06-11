import { useEffect, useRef, useState } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "../../api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface LeaveRequestSummary {
  departmentName: string;
  status: string;
  requestCount: number;
}

const statusLabels: Record<number, string> = {
  0: "Pending",
  1: "Approved",
  2: "Denied",
};

export default function Reports() {
  const [data, setData] = useState<LeaveRequestSummary[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get("/leaverequests/summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch summary:", err));
  }, []);

  const departments = [...new Set(data.map((d) => d.departmentName))];
  const statuses = ["Pending", "Approved", "Denied"];

  const chartData = {
    labels: departments,
    datasets: statuses.map((status, i) => ({
      label: status,
      data: departments.map(
        (dept) =>
          data.find((d) => d.departmentName === dept && d.status === status)
            ?.requestCount || 0
      ),
      backgroundColor: ["#facc15", "#22c55e", "#ef4444"][i],
    })),
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToExcel = async () => {
    // Convert chart to image
    const canvas = chartRef.current?.firstChild as HTMLCanvasElement;
    const chartImg = await html2canvas(canvas);
    const imgData = chartImg.toDataURL("image/png");

    const ws = XLSX.utils.aoa_to_sheet([
      ["Department", "Status", "Request Count"],
      ...data.map((d) => [d.departmentName, d.status, d.requestCount]),
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leave Summary");

    const imgSheet = wb.Sheets["Leave Summary"];
    XLSX.utils.sheet_add_aoa(imgSheet, [["Chart Below"]], { origin: -1 });

    const blob = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
    const buffer = new ArrayBuffer(blob.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < blob.length; ++i) view[i] = blob.charCodeAt(i) & 0xff;

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "LeaveReport.xlsx"
    );
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Reports
      </Typography>

      <div ref={chartRef} style={{ maxWidth: 800, margin: "auto" }}>
        <Bar data={chartData} />
      </div>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Request Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.departmentName}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.requestCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: 20, display: "flex", gap: "1rem" }}>
        <Button variant="outlined" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="outlined" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>
    </div>
  );
}
