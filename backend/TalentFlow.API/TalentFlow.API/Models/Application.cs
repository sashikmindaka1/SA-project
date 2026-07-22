using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TalentFlow.API.Models
{
    [Table("Applications")]
    public class Application
    {
        [Key]
        public int Id { get; set; } // Changed back to int to fix the "==" string/int error

        // --- Original Database Foreign Keys (Restored for ApplicationService) ---
        public int CandidateId { get; set; } 
        public int JobId { get; set; } 
        public double MatchScore { get; set; } // Changed back to double to fix the conversion error

        // --- New UI Properties (Added for the React Frontend) ---
        public string Candidate { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime AppliedOn { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Applied"; 
        public string Skills { get; set; } = string.Empty; 
        public string Note { get; set; } = string.Empty;
    }
}