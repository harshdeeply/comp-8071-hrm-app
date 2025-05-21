using System.Text.Json.Serialization;

namespace HRMApp.Models;

public class Role
{
    public int RoleId { get; set; }
    public required string RoleName { get; set; }

    [JsonIgnore] public ICollection<User>? Users { get; set; }
}