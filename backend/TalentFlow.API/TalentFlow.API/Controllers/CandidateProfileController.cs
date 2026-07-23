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

            string? photoFileName = null;
            string? photoUrl = null;

            if (dto.Photo != null)
            {
                var photoFolder = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"),
                    "uploads",
                    "photos");

                Directory.CreateDirectory(photoFolder);

                photoFileName =
                    $"{Guid.NewGuid()}_{dto.Photo.FileName}";

                var photoPath =
                    Path.Combine(photoFolder, photoFileName);

                using (var stream = new FileStream(photoPath, FileMode.Create))
                {
                    await dto.Photo.CopyToAsync(stream);
                }

                photoUrl = $"/uploads/photos/{photoFileName}";
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
                PhotoFileName = photoFileName,
                PhotoUrl = photoUrl,
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
        public async Task<ActionResult<CandidateProfile>> UpdateProfile(
            int id,
            [FromForm] CandidateProfileDto dto)
        {
            var profile =
                await _context.CandidateProfiles.FindAsync(id);

            if (profile == null)
                return NotFound();

            if (dto.Resume != null)
            {
                var uploadFolder = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"),
                    "uploads",
                    "resumes");

                Directory.CreateDirectory(uploadFolder);

                var resumeFileName =
                    $"{Guid.NewGuid()}_{dto.Resume.FileName}";

                var filePath =
                    Path.Combine(uploadFolder, resumeFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Resume.CopyToAsync(stream);
                }

                profile.ResumeFileName = resumeFileName;
                profile.ResumeUrl = $"/uploads/resumes/{resumeFileName}";
            }

            if (dto.Photo != null)
            {
                var photoFolder = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"),
                    "uploads",
                    "photos");

                Directory.CreateDirectory(photoFolder);

                var photoFileName =
                    $"{Guid.NewGuid()}_{dto.Photo.FileName}";

                var photoPath =
                    Path.Combine(photoFolder, photoFileName);

                using (var stream = new FileStream(photoPath, FileMode.Create))
                {
                    await dto.Photo.CopyToAsync(stream);
                }

                profile.PhotoFileName = photoFileName;
                profile.PhotoUrl = $"/uploads/photos/{photoFileName}";
            }

            profile.FullName = dto.FullName;
            profile.Title = dto.Title;
            profile.Email = dto.Email;
            profile.Phone = dto.Phone;
            profile.Location = dto.Location;
            profile.YearsExperience = dto.YearsExperience;
            profile.Summary = dto.Summary;
            profile.Skills = dto.Skills ?? profile.Skills;
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
        public IFormFile? Photo { get; set; }
    }
}