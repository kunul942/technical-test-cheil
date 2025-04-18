namespace Server.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            // Use the full namespace path
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            // Use the full namespace path
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}