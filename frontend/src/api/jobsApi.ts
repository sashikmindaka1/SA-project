
import type { Job, JobFormValues, JobSearchFilters } from "../types/job";

const MOCK_JOBS: Job[] = [
  {
    id: "job_1",
    title: "Senior AI Developer",
    department: "Engineering",
    location: "Colombo, LK",
    workMode: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salary: { min: 3500, max: 5200, currency: "USD" },
    skills: ["Python", "Data Structures", "Machine Learning"],
    description:
      "Own the AI matching pipeline end to end, from resume parsing through candidate-job scoring.",
    requirements: "5+ years building production ML systems. Strong Python fundamentals.",
    status: "Open",
    postedBy: "Diluka Wijesinghe",
    postedAt: "2026-07-01T09:00:00Z",
    closingDate: "2026-08-15T00:00:00Z",
    applicantCount: 24,
  },
  {
    id: "job_2",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salary: { min: 2400, max: 3600, currency: "USD" },
    skills: ["React", "TypeScript", "Tailwind"],
    description: "Build the candidate and recruiter portals for TalentFlow AI.",
    requirements: "3+ years with React. Comfortable owning a feature end to end.",
    status: "Open",
    postedBy: "Diluka Wijesinghe",
    postedAt: "2026-07-05T09:00:00Z",
    closingDate: "2026-08-01T00:00:00Z",
    applicantCount: 41,
  },
  {
    id: "job_3",
    title: "QA Automation Intern",
    department: "Quality Assurance",
    location: "Negombo, LK",
    workMode: "On-site",
    employmentType: "Internship",
    experienceLevel: "Entry",
    salary: { min: 400, max: 600, currency: "USD" },
    skills: ["Postman", "Test Planning"],
    description: "Support API and integration test coverage across the platform.",
    requirements: "Final-year student or recent graduate. Basic scripting knowledge.",
    status: "Draft",
    postedBy: "Diluka Wijesinghe",
    postedAt: "2026-07-10T09:00:00Z",
    closingDate: null,
    applicantCount: 0,
  },
];

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// GET /api/jobs?recruiterId=...
export async function fetchRecruiterJobs(): Promise<Job[]> {
  return delay([...MOCK_JOBS]);
}

// GET /api/jobs/search?keyword=...&location=...&...
export async function searchJobs(filters: JobSearchFilters): Promise<Job[]> {
  const results = MOCK_JOBS.filter((job) => {
    if (job.status !== "Open") return false;
    if (
      filters.keyword &&
      !`${job.title} ${job.skills.join(" ")}`
        .toLowerCase()
        .includes(filters.keyword.toLowerCase())
    )
      return false;
    if (
      filters.location &&
      !job.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.workMode.length && !filters.workMode.includes(job.workMode)) return false;
    if (
      filters.employmentType.length &&
      !filters.employmentType.includes(job.employmentType)
    )
      return false;
    if (
      filters.experienceLevel.length &&
      !filters.experienceLevel.includes(job.experienceLevel)
    )
      return false;
    if (filters.minSalary && job.salary.max < filters.minSalary) return false;
    if (
      filters.skills.length &&
      !filters.skills.every((s) => job.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase()))
    )
      return false;
    return true;
  });
  return delay(results);
}

// POST /api/jobs
export async function createJob(values: JobFormValues): Promise<Job> {
  const job: Job = {
    ...values,
    id: `job_${Math.random().toString(36).slice(2, 9)}`,
    postedBy: "You",
    postedAt: new Date().toISOString(),
    applicantCount: 0,
  };
  MOCK_JOBS.unshift(job);
  return delay(job);
}

// PUT /api/jobs/{id}
export async function updateJob(id: string, values: JobFormValues): Promise<Job> {
  const idx = MOCK_JOBS.findIndex((j) => j.id === id);
  const updated: Job = { ...MOCK_JOBS[idx], ...values };
  if (idx >= 0) MOCK_JOBS[idx] = updated;
  return delay(updated);
}

// DELETE /api/jobs/{id}
export async function deleteJob(id: string): Promise<void> {
  const idx = MOCK_JOBS.findIndex((j) => j.id === id);
  if (idx >= 0) MOCK_JOBS.splice(idx, 1);
  return delay(undefined);
}
