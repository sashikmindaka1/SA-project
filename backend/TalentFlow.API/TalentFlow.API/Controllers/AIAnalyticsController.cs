using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;
using TalentFlow.API.Data;
using TalentFlow.API.Models;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIAnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AIAnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("kpis")]
        public async Task<IActionResult> GetAnalyticsKPIs(int? jobId = null)
        {
            int totalCandidates = await _context.CandidateProfiles.CountAsync();

            var scored = await GetScoredCandidatesAsync(jobId);

            double avgMatchScore = scored.Count > 0
                ? scored.Average(c => c.matchScore)
                : 0;

            return Ok(new
            {
                totalCandidates = totalCandidates,
                avgMatchScore = (int)Math.Round(avgMatchScore),
                resumesParsed = totalCandidates,
                placementRate = 75
            });
        }

        [HttpGet("ranking")]
        public async Task<IActionResult> GetAnalyticsRanking(int? jobId = null)
        {
            var candidates = await GetScoredCandidatesAsync(jobId);
            return Ok(candidates);
        }

        private async Task<List<ScoredCandidate>> GetScoredCandidatesAsync(int? jobId)
        {
            var rawCandidates = await _context.CandidateProfiles
                .Select(c => new { c.Id, c.FullName, c.Title, c.Skills })
                .ToListAsync();

            Job job = null;
            if (jobId.HasValue)
            {
                job = await _context.Jobs.FindAsync(jobId.Value);
            }
            else
            {
                job = await _context.Jobs.FirstOrDefaultAsync();
            }

            string[] requiredSkills = new string[0];
            if (job != null && job.Skills != null && job.Skills.Count > 0)
            {
                requiredSkills = job.Skills
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .Select(s => s.Trim().ToLowerInvariant())
                    .ToArray();
            }

            var candidates = rawCandidates.Select(c =>
            {
                var candidateSkills = ParseSkillsColumn(c.Skills);

                int score = 0;
                if (requiredSkills.Length > 0)
                {
                    var matchedCount = candidateSkills
                        .Select(s => s.ToLowerInvariant())
                        .Intersect(requiredSkills)
                        .Count();

                    score = (int)Math.Round((double)matchedCount / requiredSkills.Length * 100);
                }

                return new ScoredCandidate
                {
                    id = c.Id,
                    name = c.FullName,
                    role = c.Title,
                    matchScore = score,
                    parsedSkills = candidateSkills
                };
            })
            .OrderByDescending(c => c.matchScore)
            .ToList();

            return candidates;
        }

        private static string[] ParseSkillsColumn(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw))
                return Array.Empty<string>();

            try
            {
                var parsed = JsonSerializer.Deserialize<List<string>>(raw);
                if (parsed == null)
                    return Array.Empty<string>();

                return parsed
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .Select(s => s.Trim())
                    .ToArray();
            }
            catch (JsonException)
            {
                return raw.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            }
        }

        private class ScoredCandidate
        {
            public int id { get; set; }
            public string name { get; set; }
            public string role { get; set; }
            public int matchScore { get; set; }
            public string[] parsedSkills { get; set; }
        }
    }
}