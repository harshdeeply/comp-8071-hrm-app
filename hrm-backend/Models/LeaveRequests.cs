using System.Text.Json.Serialization;

namespace HRMApp.Models;

public class LeaveRequest
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; }
    public LeaveRequestStatus Status { get; set; } // Approved, Denied, Pending

    public Employee? Employee { get; set; }
}

public enum LeaveRequestStatus
{
    Pending = 0,
    Approved = 1,
    Denied = 2
}