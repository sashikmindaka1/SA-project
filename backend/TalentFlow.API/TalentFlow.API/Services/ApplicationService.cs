using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;

namespace TalentFlow.API.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _context;

        public ApplicationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ApplicationDto>> GetAllApplications()
        {
            return await _context.Applications
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    JobId = a.JobId,
                    AppliedOn = a.AppliedOn,
                    Status = a.Status,
                    MatchScore = a.MatchScore,
                    Note = a.Note
                })
                .ToListAsync();
        }

        public async Task<ApplicationDto?> GetApplicationById(int id)
        {
            return await _context.Applications
                .Where(a => a.Id == id)
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    JobId = a.JobId,
                    AppliedOn = a.AppliedOn,
                    Status = a.Status,
                    MatchScore = a.MatchScore,
                    Note = a.Note
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<ApplicationDto>> GetApplicationsByCandidate(int candidateId)
        {
            return await _context.Applications
                .Where(a => a.CandidateId == candidateId)
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    CandidateId = a.CandidateId,
                    JobId = a.JobId,
                    AppliedOn = a.AppliedOn,
                    Status = a.Status,
                    MatchScore = a.MatchScore,
                    Note = a.Note
                })
                .ToListAsync();
        }

        public async Task<ApplicationDto> CreateApplication(
            CreateApplicationDto dto)
        {
            var application = new Application
            {
                CandidateId = dto.CandidateId,
                JobId = dto.JobId,
                MatchScore = dto.MatchScore,
                Note = dto.Note,
                AppliedOn = DateTime.UtcNow,
                Status = "Applied"
            };

            _context.Applications.Add(application);

            await _context.SaveChangesAsync();

            return new ApplicationDto
            {
                Id = application.Id,
                CandidateId = application.CandidateId,
                JobId = application.JobId,
                AppliedOn = application.AppliedOn,
                Status = application.Status,
                MatchScore = application.MatchScore,
                Note = application.Note
            };
        }

        public async Task<bool> UpdateStatus(
            int id,
            string status)
        {
            var application =
                await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return false;
            }

            application.Status = status;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}