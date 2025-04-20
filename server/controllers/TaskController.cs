using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.database;
using Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks() =>
            await _context.Tasks.ToListAsync();

        // GET: api/tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTask>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();
            return task;
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TodoTask>> CreateTask(TodoTask task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TodoTask task)
        {
            if (id != task.Id) return BadRequest();
            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/tasks/5/assign/2
        [HttpPut("{id}/assign/{userId}")]
        public async Task<IActionResult> AssignTask(int id, int userId)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();
            task.UserId = userId;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/tasks/search?query=texto
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TodoTask>>> SearchTasks([FromQuery] string query) =>
            await _context.Tasks
                .Where(t => t.Title.Contains(query) || t.Description.Contains(query))
                .ToListAsync();

        // GET: api/tasks/filter/status?isCompleted=true
        [HttpGet("filter/status")]
        public async Task<ActionResult<IEnumerable<TodoTask>>> FilterByStatus([FromQuery] bool isCompleted) =>
            await _context.Tasks
                .Where(t => t.IsCompleted == isCompleted)
                .ToListAsync();

        // GET: api/tasks/reports/completed
        [HttpGet("reports/completed")]
        public async Task<ActionResult<int>> GetCompletedTasksReport() =>
            await _context.Tasks
                .Where(t => t.IsCompleted)
                .CountAsync();


        // DELETE: api/tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
    

}