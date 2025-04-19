using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.database;
using Server.Models;
using Server.Utilities;

namespace Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UsersController> _logger;
        private readonly IAuthorizationService _authorizationService;

        public UsersController(
            AppDbContext context, 
            ILogger<UsersController> logger,
            IAuthorizationService authorizationService)
        {
            _context = context;
            _logger = logger;
            _authorizationService = authorizationService;
        }

        //Get users 
        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                return await _context.Users.AsNoTracking().ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                return StatusCode(500, new { message = "An error occurred while retrieving users" });
            }
        }

        // Get user by ID 
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminAndUser")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole("Admin");

                if (!isAdmin && currentUserId != id.ToString())
                {
                    return Forbid();
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting user with ID {id}");
                return StatusCode(500, new { message = "An error occurred while retrieving the user" });
            }
        }

        // Create new user
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest(new { message = "User data is required" });
                }

                if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                {
                    return Conflict(new { message = "Email already exists" });
                }

                user.Password = PasswordHasher.HashPassword(user.Password);
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new user");
                return StatusCode(500, new { message = "An error occurred while creating the user" });
            }
        }

        public record UserWithHttpContext(User User, HttpContext HttpContext);


        // Update user
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminAndUser")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            try
            {
                // Search for existing user
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Get current user ID and role
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole("Admin");

                // Only the user themselves or an admin can update the user
                if (!isAdmin && currentUserId != id.ToString())
                {
                    return Forbid();
                }

                // Users cannot change their own role
                if (!isAdmin && existingUser.Role != user.Role)
                {
                    return BadRequest(new { message = "Only admins can change roles" });
                }

                // Cannot degrade the last admin
                if (isAdmin && existingUser.Role == "Admin" && user.Role != "Admin")
                {
                    var adminCount = await _context.Users
                        .Where(u => u.Role == "Admin" && u.Id != id)
                        .CountAsync();

                    if (adminCount == 0)
                    {
                        return BadRequest(new { message = "Cannot degrade the last admin" });
                    }
                }

                // Fields everyone can update
                existingUser.FirstName = user.FirstName;
                existingUser.LastName = user.LastName;
                existingUser.Email = user.Email;

                // Only admin can update the role
                if (isAdmin)
                {
                    existingUser.Role = user.Role;
                }

                // Only update password if provided and different from existing
                if (!string.IsNullOrEmpty(user.Password) && 
                    !PasswordHasher.VerifyPassword(user.Password, existingUser.Password))
                {
                    existingUser.Password = PasswordHasher.HashPassword(user.Password);
                }

                await _context.SaveChangesAsync();
                return Ok(existingUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user {id}");
                return StatusCode(500, new { message = "An error occurred while updating the user" });
            }
        }

        // Delete user
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting user {id}");
                return StatusCode(500, new { message = "An error occurred while deleting the user" });
            }
        }
    }
}