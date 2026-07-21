namespace TalentFlow.API.DTOs
{
    public class CreateApplicationDto
    {
        public int CandidateId { get; set; }

        public int JobId { get; set; }

        public double MatchScore { get; set; }

        public string? Note { get; set; }
    }
}