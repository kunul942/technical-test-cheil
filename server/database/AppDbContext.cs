using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Userws { get; set; }
        public object Users { get; internal set; }
    }
}