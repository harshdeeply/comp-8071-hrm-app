using System.Text.Json.Serialization;

namespace HRMApp.Models;

public class Department
{
    public int DepartmentId { get; set; }
    public required string DepartmentName { get; set; }
    public string? Description { get; set; }
    public List<Employee>? Employees { get; set; }
}