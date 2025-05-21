import React, { useEffect, useState } from "react";
import { getEmployees, getDepartmentById } from "../services/api";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees().then((res) => {
      const updatedEmployees = res.data.map((employee) =>
        getDepartmentById(employee.departmentId).then((res2) => {
          return { ...employee, department: res2.data };
        })
      );
      Promise.all(updatedEmployees).then((employeesWithDepartments) => {
        setEmployees(employeesWithDepartments);
      });
    });
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Employees
      </Typography>
      <Grid container spacing={2}>
        {employees.map((e) => (
          <Grid item xs={12} sm={6} md={4} key={e.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {e.firstName} {e.lastName}
                </Typography>
                <Typography color="text.secondary">{e.position}</Typography>
                <Typography variant="body2">
                  Department: {e.department?.name || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EmployeeList;
