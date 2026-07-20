using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Models;

namespace TalentFlow.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Interview> Interviews { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
    }
}