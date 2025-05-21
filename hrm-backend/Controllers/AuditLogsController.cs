using HRMApp.Data;
using HRMApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AuditLogsController(HRMContext context) : ControllerBase
{
    // Get all audit logs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs()
    {
        return await context.AuditLogs.ToListAsync();
    }

    // Create a new audit log
    [HttpPost]
    public async Task<ActionResult<AuditLog>> CreateAuditLog(AuditLog auditLog)
    {
        context.AuditLogs.Add(auditLog);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAuditLogs), new { id = auditLog.AuditLogId }, auditLog);
    }
}