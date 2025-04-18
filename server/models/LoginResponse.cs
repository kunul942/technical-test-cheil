namespace Server.Models
{
    public class LoginResponse
{
    public required string Token { get; set; }
    public required string Role { get; set; }
    public int UserId { get; set; }
    public DateTime Expires { get; set; }
}
}