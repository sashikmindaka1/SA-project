using TalentFlow.API.DTOs;

namespace TalentFlow.API.Services
{
    public interface IApplicationService
    {
        Task<List<ApplicationDto>> GetAllApplications();

        Task<ApplicationDto?> GetApplicationById(int id);

        Task<List<ApplicationDto>> GetApplicationsByCandidate(int candidateId);

        Task<ApplicationDto> CreateApplication(CreateApplicationDto dto);

        Task<bool> UpdateStatus(int id, string status);
    }
}