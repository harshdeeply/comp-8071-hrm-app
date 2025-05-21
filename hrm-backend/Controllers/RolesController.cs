using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RolesController(HRMContext context) : ControllerBase
{
    // Get all roles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
    {
        return await context.Roles.ToListAsync();
    }

    // Get a role by id
    [HttpGet("{id}")]
    public async Task<ActionResult<Role>> GetRole(int id)
    {
        var role = await context.Roles.FindAsync(id);

        if (role == null)
            return NotFound();

        return role;
    }

    // Create a new role
    [HttpPost]
    public async Task<ActionResult<Role>> CreateRole(Role role)
    {
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRole), new { id = role.RoleId }, role);
    }
}