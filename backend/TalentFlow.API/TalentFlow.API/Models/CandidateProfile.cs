using System.ComponentModel.DataAnnotations;

namespace TalentFlow.API.Models
{
    public class CandidateProfile
    {
        [Key]
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int YearsExperience { get; set; }

        public string Summary { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty;           // comma separated or JSON

        public string? ResumeFileName { get; set; }
        public string? ResumeUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}