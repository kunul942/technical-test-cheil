using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<TodoTask> Tasks { get; set; }
    }
}