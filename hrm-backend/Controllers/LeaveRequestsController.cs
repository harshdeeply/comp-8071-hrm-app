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
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> ApproveLeaveRequest(int id)
    {
        var managerUserId = User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(managerUserId) || !int.TryParse(managerUserId, out var userId))
            return Unauthorized("Invalid user ID in token claims");

        var manager = await context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
        if (manager == null)
            return Unauthorized("Manager employee record not found");

        var leaveRequest = await context.LeaveRequests
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.LeaveRequestId == id);

        if (leaveRequest == null)
            return NotFound("Leave request not found");

        if (leaveRequest?.Employee?.ManagerId != manager.EmployeeId)
            return StatusCode(403, new { error = "You are not authorized to approve this request" });

        if (await leaveRequestService.ApproveLeaveRequest(id, manager.EmployeeId))
            return Ok("Leave request approved");

        return BadRequest("Unable to approve leave request");
    }

    [HttpPost("deny/{id:int}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DenyLeaveRequest(int id)
    {
        var managerUserId = User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(managerUserId) || !int.TryParse(managerUserId, out var userId))
            return Unauthorized("Invalid user ID in token claims");

        var manager = await context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
        if (manager == null)
            return Unauthorized("Manager employee record not found");

        var leaveRequest = await context.LeaveRequests
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.LeaveRequestId == id);

        if (leaveRequest == null)
            return NotFound("Leave request not found");

        if (leaveRequest.Employee?.ManagerId != manager.EmployeeId)
            return StatusCode(403, new { error = "You are not authorized to deny this request" });

        if (await leaveRequestService.DenyLeaveRequest(id, manager.EmployeeId))
            return Ok("Leave request denied");

        return BadRequest("Unable to deny leave request");
    }


    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetMyLeaveRequests()
    {
        // Extract employeeId from the user's claims
        var employeeIdClaim = User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out var employeeId))
        {
            return Unauthorized("Employee ID not found in token claims");
        }

        var leaveRequests = await context.LeaveRequests
            .Where(lr => lr.EmployeeId == employeeId)
            .ToListAsync();

        // Always return 200 OK, even if the list is empty
        return Ok(leaveRequests);
    }

    [HttpGet("team")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetMyTeamLeaveRequests()
    {
        // Get manager's user ID from claims
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized("Manager user ID not found in token claims");
        }

        // Find employee record for this user (assuming 1:1 mapping between User and Employee)
        var manager = await context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
        if (manager == null)
        {
            return Unauthorized("Manager employee record not found");
        }

        // Find employees under this manager
        var employeeIds = await context.Employees
            .Where(e => e.ManagerId == manager.EmployeeId)
            .Select(e => e.EmployeeId)
            .ToListAsync();

        // Get leave requests for those employees
        var leaveRequests = await context.LeaveRequests
            .Where(lr => employeeIds.Contains(lr.EmployeeId))
            .Include(lr => lr.Employee)
            .Include(lr => lr.Employee!.User)
            .ToListAsync();

        return Ok(leaveRequests);
    }
}