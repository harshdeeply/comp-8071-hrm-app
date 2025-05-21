using HRMApp.Data;
using HRMApp.Models;
using HRMApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LeaveRequestsController(HRMContext context, LeaveRequestService leaveRequestService)
    : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<LeaveRequest>> GetLeaveRequest(int id)
    {
        var leaveRequest = await context.LeaveRequests.FindAsync(id);

        if (leaveRequest == null)
        {
            return NotFound();
        }

        return leaveRequest;
    }

    // Create a leave request
    [HttpPost]
    public async Task<ActionResult<LeaveRequest>> CreateLeaveRequest(LeaveRequest leaveRequest)
    {
        context.LeaveRequests.Add(leaveRequest);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLeaveRequest), new { id = leaveRequest.LeaveRequestId }, leaveRequest);
    }

    // Get leave requests for an employee
    [HttpGet("employee/{employeeId:int}")]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequests(int employeeId)
    {
        var leaveRequests = await context.LeaveRequests.Where(lr => lr.EmployeeId == employeeId).ToListAsync();

        if (!leaveRequests.Any())
            return NotFound();

        return Ok(leaveRequests);
    }

    [HttpPost("approve/{id:int}")]
    public async Task<IActionResult> ApproveLeaveRequest(int id)
    {
        var managerId = GetManagerIdFromClaims(); // Get current manager ID from the user's session/claims

        if (await leaveRequestService.ApproveLeaveRequest(id, managerId))
        {
            return Ok("Leave request approved");
        }

        return BadRequest(new
        {
            error = "Unable to approve leave request."
        });
    }

    [HttpPost("deny/{id:int}")]
    public async Task<IActionResult> DenyLeaveRequest(int id)
    {
        var managerId = GetManagerIdFromClaims(); // Get current manager ID from the user's session/claims

        if (await leaveRequestService.DenyLeaveRequest(id, managerId))
        {
            return Ok("Leave request denied");
        }


        return BadRequest(new
        {
            error = "Unable to approve leave request."
        });
    }

    // Helper method to extract manager ID from session/claims
    private static int GetManagerIdFromClaims()
    {
        // Logic to extract manager's ID from the current user claims
        return 1; // Placeholder for actual logic
    }
}