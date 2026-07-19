using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Models; // This MUST match the folder name "Models"

namespace TalentFlow.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Interview> Interviews { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
    }
}