using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmployeesController(HRMContext context) : ControllerBase
{
    // Create a new employee
    [HttpPost]
    public async Task<ActionResult<Employee>> CreateEmployee(Employee? employee)
    {
        if (employee == null)
            return BadRequest();

        context.Employees.Add(employee);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
    }

    // Get an employee by id
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var employee = await context.Employees.Include(e => e.User).Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.EmployeeId == id);
        if (employee == null)
            return NotFound();

        return Ok(employee);
    }

    // GET all employees
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllEmployees()
    {
        var employees = await context.Employees
            .Include(e => e.Department)
            .Include(e => e.User)
            .Select(e => new
                {
                    e.User.UserId,
                    e.User.FirstName,
                    e.User.LastName,
                    e.User.Username,
                    e.User.Email,
                    Role = e.User.Role.RoleName,
                    e.Department.DepartmentName,
                }
            )
            .ToListAsync();

        return Ok(employees);
    }

    // Update an employee
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
    {
        if (id != employee.EmployeeId)
            return BadRequest();

        context.Entry(employee).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EmployeeExists(id))
                return NotFound();
            else
                throw;
        }

        return NoContent();
    }

    // Check if employee exists
    private bool EmployeeExists(int id)
    {
        return context.Employees.Any(e => e.EmployeeId == id);
    }

    // GET all employees
    [Authorize(Roles = "Manager")]
    [HttpGet("myteam")]
    public async Task<IActionResult> GetMyTeam()
    {
        // Extract the manager's employee ID from the claims
        var managerIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(managerIdClaim) || !int.TryParse(managerIdClaim, out var managerId))
        {
            return Unauthorized(new { error = "Manager ID not found in token claims." });
        }

        var team = await context.Employees
            .Where(e => e.ManagerId == managerId)
            .Include(e => e.Department)
            .Include(e => e.User)
            .ThenInclude(u => u!.Role)
            .Select(e => new
            {
                e.User!.UserId,
                e.User.FirstName,
                e.User.LastName,
                e.User.Username,
                e.User.Email,
                Role = e.User.Role.RoleName,
                e.Department!.DepartmentName,
            })
            .ToListAsync();

        return Ok(team);
    }
}