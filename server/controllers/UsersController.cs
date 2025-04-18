using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.database;
using Server.Models;
using Server.Utilities;
using System.Security.Claims;

namespace Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(currentUserIdClaim, out var currentUserId))
            {
                return BadRequest("Invalid or missing user ID claim.");
            }
            
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserRole != "Admin" && currentUserId != id)
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // POST: api/users
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.Password = PasswordHasher.HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserRole != "Admin" && currentUserId != id)
            {
                return Forbid();
            }

            if (id != user.Id) return BadRequest();

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound();

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Email = user.Email;
            
            // Only update password if it's provided and different
            if (!string.IsNullOrEmpty(user.Password) && 
                !PasswordHasher.VerifyPassword(user.Password, existingUser.Password))
            {
                existingUser.Password = PasswordHasher.HashPassword(user.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}