namespace HRMApp.Models;

public class Employee
{
    public int EmployeeId { get; set; }
    public int UserId { get; set; }
    public int DepartmentId { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DateTime DateHired { get; set; }
    public string Address { get; set; }
    public bool IsManager { get; set; }
    public int? ManagerId { get; set; }
    public Employee Manager { get; set; }
    public ICollection<Employee> ManagedEmployees { get; set; } = new List<Employee>();
    public User User { get; set; }
    public Department Department { get; set; }
    public List<Timesheet> Timesheets { get; set; }
    public List<LeaveRequest> LeaveRequests { get; set; }
    public List<Payroll> Payroll { get; set; }
}