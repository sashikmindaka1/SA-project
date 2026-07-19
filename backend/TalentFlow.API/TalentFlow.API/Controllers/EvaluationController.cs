using Microsoft.AspNetCore.Mvc;
using TalentFlow.API.Data;
using TalentFlow.API.Models;
using Microsoft.EntityFrameworkCore;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EvaluationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Evaluation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evaluation>>> GetEvaluations()
        {
            return await _context.Evaluations.ToListAsync();
        }

        // POST: api/Evaluation
        [HttpPost]
        public async Task<ActionResult<Evaluation>> PostEvaluation(Evaluation evaluation)
        {
            _context.Evaluations.Add(evaluation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEvaluations), new { id = evaluation.Id }, evaluation);
        }

        // DELETE: api/Evaluation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvaluation(int id)
        {
            var evaluation = await _context.Evaluations.FindAsync(id);
            if (evaluation == null) return NotFound();

            _context.Evaluations.Remove(evaluation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}