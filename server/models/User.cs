namespace Server.Models
{
    public class User

    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }  // Will hash later
        public required string Role { get; set; }      // "Admin" or "User"
        
    }
}