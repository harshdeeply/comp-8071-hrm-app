namespace HRMApp.Models;

public class Payroll
{
    public int PayrollId { get; set; }
    public int EmployeeId { get; set; }
    public decimal Salary { get; set; }
    public DateTime PayDate { get; set; }
    public decimal Bonus { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetPay { get; set; }

    public required Employee Employee { get; set; }
}