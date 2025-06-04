using HRMApp.Data;
using HRMApp.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Services;

public class LeaveRequestService(HRMContext context)
{
    public async Task<bool> ApproveLeaveRequest(int leaveRequestId, int managerId)
    {
        var leaveRequest = await context.LeaveRequests
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.LeaveRequestId == leaveRequestId);

        if (leaveRequest is not { Status: LeaveRequestStatus.Pending })
        {
            return false; // No, pending leave request found
        }

        // Ensure the employee requesting leave is managed by the manager
        if (leaveRequest.Employee?.ManagerId != managerId)
        {
            return false; // Manager is not authorized to approve this request
        }

        leaveRequest.Status = LeaveRequestStatus.Approved;
        context.LeaveRequests.Update(leaveRequest);
        await context.SaveChangesAsync();

        return true; // Leave request approved
    }

    public async Task<bool> DenyLeaveRequest(int leaveRequestId, int managerId)
    {
        var leaveRequest = await context.LeaveRequests
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.LeaveRequestId == leaveRequestId);

        if (leaveRequest is not { Status: LeaveRequestStatus.Pending })
        {
            return false; // No, pending leave request found
        }

        // Ensure the employee requesting leave is managed by the manager
        if (leaveRequest.Employee?.ManagerId != managerId)
        {
            return false; // Manager is not authorized to deny this request
        }

        leaveRequest.Status = LeaveRequestStatus.Denied;
        context.LeaveRequests.Update(leaveRequest);
        await context.SaveChangesAsync();

        return true; // Leave request denied
    }
}