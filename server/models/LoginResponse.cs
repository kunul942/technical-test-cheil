namespace Server.Models
{
    public class LoginResponse
    {
        public required string Token { get; set; }  // JWT token will go here
        public required string Role { get; set; }
    }
}