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

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var authorizationResult = await _authorizationService.AuthorizeAsync(
                    User, user, "AdminOrOwner");

                if (!authorizationResult.Succeeded)
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

        [HttpPut("{id}")]
        // public async Task<IActionResult> UpdateUser(int id, User user)
        // {
        //     try
        //     {
        //         if (user == null || id != user.Id)
        //         {
        //             return BadRequest(new { message = "Invalid user data" });
        //         }

        //         var existingUser = await _context.Users.FindAsync(id);
        //         if (existingUser == null)
        //         {
        //             return NotFound(new { message = "User not found" });
        //         }

        //         var authorizationResult = await _authorizationService.AuthorizeAsync(
        //             User, existingUser, "AdminOrOwner");

        //         if (!authorizationResult.Succeeded)
        //         {
        //             return Forbid();
        //         }

        //         // Update fields
        //         existingUser.FirstName = user.FirstName;
        //         existingUser.LastName = user.LastName;
        //         existingUser.Email = user.Email;
        //         existingUser.Role = user.Role;
                
        //         if (!string.IsNullOrEmpty(user.Password) && 
        //             !PasswordHasher.VerifyPassword(user.Password, existingUser.Password))
        //         {
        //             existingUser.Password = PasswordHasher.HashPassword(user.Password);
        //         }

        //         try
        //         {
        //             await _context.SaveChangesAsync();
        //         }
        //         catch (DbUpdateConcurrencyException ex)
        //         {
        //             if (!UserExists(id))
        //             {
        //                 return NotFound(new { message = "User no longer exists" });
        //             }
        //             _logger.LogError(ex, $"Concurrency error updating user {id}");
        //             throw;
        //         }

        //         return NoContent();
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, $"Error updating user {id}");
        //         return StatusCode(500, new { message = "An error occurred while updating the user" });
        //     }
        // }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            try
            {
                if (user == null || id != user.Id)
                {
                    return BadRequest(new { message = "Invalid user data" });
                }

                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Authorization check
                var authorizationResult = await _authorizationService.AuthorizeAsync(
                    User, existingUser, "AdminOrOwner");

                if (!authorizationResult.Succeeded)
                {
                    return Forbid();
                }

                // Get current user info
                var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var isAdmin = User.IsInRole("Admin");

                // Regular users can't change their role
                if (!isAdmin && existingUser.Role != user.Role)
                {
                    return BadRequest(new { message = "Only admins can change roles" });
                }

                // Prevent removing the last admin
                if (isAdmin && existingUser.Role == "Admin" && user.Role == "User")
                {
                    var adminCount = await _context.Users
                        .Where(u => u.Role == "Admin" && u.Id != id)
                        .CountAsync();

                    if (adminCount == 0)
                    {
                        return BadRequest(new { message = "Cannot degrade the last admin" });
                    }
                }

                // Update fields
                existingUser.FirstName = user.FirstName;
                existingUser.LastName = user.LastName;
                existingUser.Email = user.Email;
                
                // Only admins can change roles
                if (isAdmin)
                {
                    existingUser.Role = user.Role;
                }

                // Password update (if provided)
                if (!string.IsNullOrEmpty(user.Password) && 
                    !PasswordHasher.VerifyPassword(user.Password, existingUser.Password))
                {
                    existingUser.Password = PasswordHasher.HashPassword(user.Password);
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user {id}");
                return StatusCode(500, new { message = "An error occurred while updating the user" });
            }
        }

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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}