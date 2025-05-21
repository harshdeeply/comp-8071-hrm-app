using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HRMApp.Data;
using HRMApp.Models;
using HRMApp.Models.DTOs.User;
using Microsoft.EntityFrameworkCore;

public class AuthService
{
    private readonly HRMContext _context;
    private readonly IConfiguration _config;

    public AuthService(HRMContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    private string HashPassword(string password)
    {
        var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    public string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.RoleName) // Reference RoleName from Role entity
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public User RegisterUser(UserDTO userDTO)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Email == userDTO.Email);
        if (existingUser != null) throw new Exception("User already exists");

        var hashedPassword = HashPassword(userDTO.Password);

        // Fetch the role by name or other logic (assuming the role name is part of UserDTO)
        var role = _context.Roles.FirstOrDefault(r => r.RoleName == userDTO.Role);
        if (role == null) throw new Exception("Invalid role");

        var user = new User
        {
            Username = userDTO.Username,
            Email = userDTO.Email,
            PasswordHash = hashedPassword,
            RoleId = role.RoleId, // Store the RoleId, not the Role object
            DateCreated = DateTime.Now
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return user;
    }

    public User? Authenticate(string username, string password)
    {
        var user = _context.Users.Include(u => u.Role).FirstOrDefault(u => u.Username == username);
        if (user == null || user.PasswordHash != password) return null;

        return user;
    }
}