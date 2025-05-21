namespace HRMApp.Models;

public class Timesheet
{
    public int TimesheetId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime DateWorked { get; set; }
    public decimal HoursWorked { get; set; }
    public required string Project { get; set; }

    public required Employee Employee { get; set; }
}