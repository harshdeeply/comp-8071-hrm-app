using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TimesheetsController(HRMContext context) : ControllerBase
{
    // Get timesheets for an employee
    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<Timesheet>>> GetTimesheets(int employeeId)
    {
        var timesheets = await context.Timesheets.Where(t => t.EmployeeId == employeeId).ToListAsync();

        if (timesheets == null || !timesheets.Any())
            return NotFound();

        return Ok(timesheets);
    }

    // Create a new timesheet
    [HttpPost]
    public async Task<ActionResult<Timesheet>> CreateTimesheet(Timesheet timesheet)
    {
        context.Timesheets.Add(timesheet);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTimesheets), new { employeeId = timesheet.EmployeeId }, timesheet);
    }
}