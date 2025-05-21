using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController(HRMContext context) : ControllerBase
{
    // Create a new user
    [HttpPost]
    public async Task<IActionResult> CreateUser(User user)
    {
        if (user == null)
            return BadRequest();

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
    }

    // Get a user by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // Update a user
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.UserId)
            return BadRequest();

        context.Entry(user).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
                return NotFound();
            else
                throw;
        }

        return NoContent();
    }

    // Check if user exists
    private bool UserExists(int id)
    {
        return context.Users.Any(e => e.UserId == id);
    }
}