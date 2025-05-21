using HRMApp.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApp.Data;

public class HRMContext(DbContextOptions<HRMContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Timesheet> Timesheets { get; set; }
    public DbSet<LeaveRequest> LeaveRequests { get; set; }
    public DbSet<Payroll> Payrolls { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    // Override OnModelCreating to configure entity relationships and seed roles
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed Roles
        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, RoleName = "Admin" },
            new Role { RoleId = 2, RoleName = "Manager" },
            new Role { RoleId = 3, RoleName = "Employee" }
        );

        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                FirstName = "System",
                LastName = "Admin",
                Email = "admin@hrm.local",
                Username = "admin",
                PasswordHash = "Admin@123", // In a real app, use hashed passwords
                RoleId = 1, // Admin role
                DateCreated = new DateTime(2025, 05, 01),
            },
            new User
            {
                UserId = 2,
                FirstName = "John",
                LastName = "Doe",
                Email = "employee@hrm.local",
                Username = "jdoe",
                PasswordHash = "Employee@123", // In a real app, use hashed passwords
                RoleId = 3, // Employee role
                DateCreated = new DateTime(2025, 05, 01),
            },
            new User
            {
                UserId = 3,
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@hrm.local",
                Username = "jsmith",
                PasswordHash = "Employee@123", // In a real app, use hashed passwords
                RoleId = 3, // Employee role
                DateCreated = new DateTime(2025, 05, 01),
            },
            new User
            {
                UserId = 4,
                FirstName = "Alice",
                LastName = "Johnson",
                Email = "alice.johnson@hrm.local",
                Username = "alicej",
                PasswordHash = "Manager@123", // In a real app, use hashed passwords
                RoleId = 2, // Manager role
                DateCreated = new DateTime(2025, 05, 01),
            },
            new User
            {
                UserId = 5,
                FirstName = "Bob",
                LastName = "Williams",
                Email = "bob.williams@hrm.local",
                Username = "bobw",
                PasswordHash = "Employee@123", // In a real app, use hashed passwords
                RoleId = 3, // Employee role
                DateCreated = new DateTime(2025, 05, 01),
            }
        );

        // Seed Department
        modelBuilder.Entity<Department>().HasData(
            new Department
            {
                DepartmentId = 1,
                DepartmentName = "Human Resources",
                Description = "Handles HR and admin tasks"
            }
        );

        // Seed Employees
        modelBuilder.Entity<Employee>().HasData(
            // Manager Employee
            new Employee
            {
                EmployeeId = 1,
                UserId = 1, // UserId of the Admin
                DepartmentId = 1,
                DateHired = new DateTime(2025, 05, 01),
                Address = "123 Example St.",
                IsManager = true,
                ManagerId = null // This employee is a manager, so no manager
            },
            // Employee under Manager 1
            new Employee
            {
                EmployeeId = 2,
                UserId = 2, // UserId of Employee 2
                DepartmentId = 1,
                DateHired = new DateTime(2025, 05, 01),
                Address = "123 Sample Ave.",
                IsManager = false,
                ManagerId = 1 // This employee reports to Manager 1 (Employee 1)
            },
            // Another Employee under Manager 1
            new Employee
            {
                EmployeeId = 3,
                UserId = 3, // UserId of Employee 3
                DepartmentId = 1,
                DateHired = new DateTime(2025, 05, 01),
                Address = "456 Another St.",
                IsManager = false,
                ManagerId = 1 // This employee also reports to Manager 1 (Employee 1)
            },
            // Another Manager (Employee 4)
            new Employee
            {
                EmployeeId = 4,
                UserId = 4, // UserId of Manager 4
                DepartmentId = 1,
                DateHired = new DateTime(2025, 05, 01),
                Address = "789 Another Ave.",
                IsManager = true,
                ManagerId = null // This employee is also a manager, no manager
            },
            // Employee under Manager 4
            new Employee
            {
                EmployeeId = 5,
                UserId = 5, // UserId of Employee 5
                DepartmentId = 1,
                DateHired = new DateTime(2025, 05, 01),
                Address = "101 Some St.",
                IsManager = false,
                ManagerId = 4 // This employee reports to Manager 4 (Employee 4)
            }
        );

        // Self-referencing relationship for Manager-Employee
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Manager)
            .WithMany(m => m.ManagedEmployees)
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.NoAction); // Prevent cycles or cascading issues

        // User-Role relationship
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);

        // Employee-User relationship
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.User)
            .WithOne()
            .HasForeignKey<Employee>(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        // Employee-Department relationship (fixed)
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.NoAction);

        // Timesheet-Employee relationship
        modelBuilder.Entity<Timesheet>()
            .HasOne(t => t.Employee)
            .WithMany(e => e.Timesheets)
            .HasForeignKey(t => t.EmployeeId)
            .OnDelete(DeleteBehavior.NoAction); // Prevents cascading if employee is deleted


        // LeaveRequest-Employee relationship
        modelBuilder.Entity<LeaveRequest>()
            .HasOne(lr => lr.Employee)
            .WithMany(e => e.LeaveRequests)
            .HasForeignKey(lr => lr.EmployeeId)
            .OnDelete(DeleteBehavior.NoAction); // Prevents cascading if employee is deleted


        // Payroll entity properties
        modelBuilder.Entity<Payroll>(entity =>
        {
            entity.Property(p => p.Salary).HasPrecision(18, 2);
            entity.Property(p => p.Bonus).HasPrecision(18, 2);
            entity.Property(p => p.Deductions).HasPrecision(18, 2);
            entity.Property(p => p.NetPay).HasPrecision(18, 2);
        });

        // Payroll-Employee relationship
        modelBuilder.Entity<Payroll>()
            .HasOne(p => p.Employee)
            .WithMany(e => e.Payroll)
            .HasForeignKey(p => p.EmployeeId)
            .OnDelete(DeleteBehavior.NoAction); // Prevents cascading if employee is deleted

        // Timesheet precision
        modelBuilder.Entity<Timesheet>()
            .Property(t => t.HoursWorked)
            .HasPrecision(5, 2);

        // AuditLog-User relationship
        modelBuilder.Entity<AuditLog>()
            .HasOne(al => al.User)
            .WithMany()
            .HasForeignKey(al => al.UserId);
    }
}