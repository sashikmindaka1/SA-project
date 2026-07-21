namespace TalentFlow.API.DTOs
{
    public class ApplicationDto
    {
        public int Id { get; set; }

        public int CandidateId { get; set; }

        public int JobId { get; set; }

        public DateTime AppliedOn { get; set; }

       public string Status { get; set; } = string.Empty;


        public double MatchScore { get; set; }

        public string? Note { get; set; }
    }
}