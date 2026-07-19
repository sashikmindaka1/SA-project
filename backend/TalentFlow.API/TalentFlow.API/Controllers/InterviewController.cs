using Microsoft.AspNetCore.Mvc;
using TalentFlow.API.Data;
using TalentFlow.API.Models; // Ensure your Interview model is in this namespace
using Microsoft.EntityFrameworkCore;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InterviewController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Interview
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Interview>>> GetInterviews()
        {
            return await _context.Interviews.ToListAsync();
        }

        // POST: api/Interview
        [HttpPost]
        public async Task<ActionResult<Interview>> PostInterview(Interview interview)
        {
            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetInterviews), new { id = interview.Id }, interview);
        }
    }
}