using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Models;

namespace TalentFlow.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Interview> Interviews { get; set; }
    }
}