using HRMApp.Models.DTOs.Auth;
using HRMApp.Models.DTOs.User;
using Microsoft.AspNetCore.Mvc;

namespace HRMApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register([FromBody] UserDTO userDTO)
    {
        try
        {
            var user = authService.RegisterUser(userDTO);
            var token = authService.GenerateJwtToken(user);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO loginDTO)
    {
        var user = authService.Authenticate(loginDTO.Username, loginDTO.Password);
        if (user == null) return Unauthorized("Invalid credentials");
        var userData =
            new
            {
                id = user.UserId,
                username = user.Username,
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                role = user.Role.RoleName,
            };

        var token = authService.GenerateJwtToken(user);
        return Ok(new { Token = token, User = userData });
    }
}