namespace HRMApp.Models;

public class AuditLog
{
    public int AuditLogId { get; set; }
    public required string Action { get; set; } // e.g., Created, Updated, Deleted
    public required string Entity { get; set; } // e.g., User, Employee, LeaveRequest
    public int EntityId { get; set; }
    public required string Description { get; set; }
    public DateTime Timestamp { get; set; }
    public int UserId { get; set; }

    public required User User { get; set; }
}