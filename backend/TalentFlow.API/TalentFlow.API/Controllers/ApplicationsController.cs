using Microsoft.AspNetCore.Mvc;
using TalentFlow.API.DTOs;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _service;

        public ApplicationsController(
            IApplicationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(
                await _service.GetAllApplications());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var application =
                await _service.GetApplicationById(id);

            if (application == null)
            {
                return NotFound();
            }

            return Ok(application);
        }

        [HttpGet("candidate/{candidateId}")]
        public async Task<IActionResult> GetByCandidate(
            int candidateId)
        {
            return Ok(
                await _service.GetApplicationsByCandidate(
                    candidateId));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            CreateApplicationDto dto)
        {
            var result =
                await _service.CreateApplication(dto);

            return Ok(result);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            UpdateApplicationStatusDto dto)
        {
            var updated =
                await _service.UpdateStatus(
                    id,
                    dto.Status);

            if (!updated)
            {
                return NotFound();
            }

            return Ok(new
            {
                Message = "Status updated successfully"
            });
        }
    }
}