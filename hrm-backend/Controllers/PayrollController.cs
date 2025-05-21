using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PayrollController(HRMContext context) : ControllerBase
{
    // Create a new payroll record
    [HttpPost]
    public async Task<ActionResult<Payroll>> CreatePayroll(Payroll payroll)
    {
        context.Payrolls.Add(payroll);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPayroll), new { id = payroll.PayrollId }, payroll);
    }

    // Get payroll details for an employee
    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<Payroll>>> GetPayroll(int employeeId)
    {
        var payroll = await context.Payrolls.Where(p => p.EmployeeId == employeeId).ToListAsync();

        if (payroll == null || !payroll.Any())
            return NotFound();

        return Ok(payroll);
    }
}