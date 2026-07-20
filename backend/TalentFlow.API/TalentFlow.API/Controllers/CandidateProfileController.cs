using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.Models;

namespace TalentFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CandidateProfileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CandidateProfileController(
            AppDbContext context,
            IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateProfile>>> GetProfiles()
        {
            return await _context.CandidateProfiles
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<CandidateProfile>> GetProfile(int id)
        {
            var profile = await _context.CandidateProfiles.FindAsync(id);

            if (profile == null)
                return NotFound();

            return Ok(profile);
        }

        // CREATE PROFILE
        [HttpPost]
        public async Task<ActionResult<CandidateProfile>> PostProfile(
            [FromForm] CandidateProfileDto dto)
        {
            string? resumeFileName = null;
            string? resumeUrl = null;

            if (dto.Resume != null)
            {
                var uploadFolder = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"),
                    "uploads",
                    "resumes");

                Directory.CreateDirectory(uploadFolder);

                resumeFileName =
                    $"{Guid.NewGuid()}_{dto.Resume.FileName}";

                var filePath =
                    Path.Combine(uploadFolder, resumeFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Resume.CopyToAsync(stream);
                }

                resumeUrl = $"/uploads/resumes/{resumeFileName}";
            }

            var profile = new CandidateProfile
            {
                FullName = dto.FullName,
                Title = dto.Title,
                Email = dto.Email,
                Phone = dto.Phone,
                Location = dto.Location,
                YearsExperience = dto.YearsExperience,
                Summary = dto.Summary,
                Skills = dto.Skills ?? "[]",
                ResumeFileName = resumeFileName,
                ResumeUrl = resumeUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.CandidateProfiles.Add(profile);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProfile),
                new { id = profile.Id },
                profile);
        }

        // UPDATE PROFILE
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(
            int id,
            [FromBody] CandidateProfile updated)
        {
            var profile =
                await _context.CandidateProfiles.FindAsync(id);

            if (profile == null)
                return NotFound();

            profile.FullName = updated.FullName;
            profile.Title = updated.Title;
            profile.Email = updated.Email;
            profile.Phone = updated.Phone;
            profile.Location = updated.Location;
            profile.YearsExperience = updated.YearsExperience;
            profile.Summary = updated.Summary;
            profile.Skills = updated.Skills;
            profile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(profile);
        }

        // DELETE PROFILE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            var profile =
                await _context.CandidateProfiles.FindAsync(id);

            if (profile == null)
                return NotFound();

            _context.CandidateProfiles.Remove(profile);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CandidateProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int YearsExperience { get; set; }
        public string Summary { get; set; } = string.Empty;

        // React sends JSON string
        public string? Skills { get; set; }

        public IFormFile? Resume { get; set; }
    }
}