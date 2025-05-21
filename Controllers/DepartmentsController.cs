using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DepartmentsController(HRMContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await context.Departments.ToListAsync());


    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var department = await context.Departments
            .FirstOrDefaultAsync(e => e.DepartmentId == id);
        return department == null ? NotFound() : Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Department dept)
    {
        context.Departments.Add(dept);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = dept.DepartmentId }, dept);
    }
}