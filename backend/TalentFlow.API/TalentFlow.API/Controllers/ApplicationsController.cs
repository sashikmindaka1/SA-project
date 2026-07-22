using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TalentFlow.API.Data;
using TalentFlow.API.Models;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetApplications()
        {
            var applications = await _context.Applications.ToListAsync();

            var result = applications.Select(app => new
            {
                id = app.Id.ToString(),
                candidate = app.Candidate,
                initials = app.Initials,
                email = app.Email,
                role = app.Role,
                matchScore = app.MatchScore,
                appliedOn = app.AppliedOn,
                status = app.Status,
                skills = ParseSkills(app.Skills),
                note = app.Note
            }).ToList();

            return Ok(result);
        }

        // Helper method to safely parse skills whether they are stored as JSON or comma-separated text
        private List<string> ParseSkills(string? skillsStr)
        {
            if (string.IsNullOrEmpty(skillsStr))
                return new List<string>();

            skillsStr = skillsStr.Trim();

            // If it starts with '[', try parsing it as a JSON array
            if (skillsStr.StartsWith("["))
            {
                try
                {
                    return JsonSerializer.Deserialize<List<string>>(skillsStr) ?? new List<string>();
                }
                catch
                {
                    // Fallback if JSON parsing fails
                }
            }

            // Otherwise, treat it as a standard comma-separated string (e.g. "React, Spring Boot")
            return skillsStr.Split(',').Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s)).ToList();
        }

        // POST: api/Applications
        [HttpPost]
        public async Task<ActionResult<Application>> PostApplication(Application application)
        {
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApplications), new { id = application.Id }, application);
        }
    }
}