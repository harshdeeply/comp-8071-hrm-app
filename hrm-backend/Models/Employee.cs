using System.Text.Json.Serialization;

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
    [JsonIgnore] public Employee? Manager { get; set; }
    [JsonIgnore] public ICollection<Employee>? ManagedEmployees { get; set; } = new List<Employee>();
    public User? User { get; set; }
    public Department? Department { get; set; }
    [JsonIgnore] public List<Timesheet>? Timesheets { get; set; }
    [JsonIgnore] public List<LeaveRequest>? LeaveRequests { get; set; }
    [JsonIgnore] public List<Payroll>? Payroll { get; set; }
}