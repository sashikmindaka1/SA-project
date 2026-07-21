export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type ExperienceLevel = "Entry" | "Junior" | "Mid" | "Senior" | "Lead";
export type JobStatus = "Draft" | "Open" | "Closed" | "Archived";
export type WorkMode = "On-site" | "Hybrid" | "Remote";

export interface SalaryRange {
  min: number;
  max: number;
  currency: string; // e.g. "USD"
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange;
  skills: string[];
  description: string;
  requirements: string;
  status: JobStatus;
  postedBy: string;
  postedAt: string; // ISO date
  closingDate: string | null; // ISO date
  applicantCount: number;
}

// Payload the recruiter form submits to create/update a job.
export type JobFormValues = Omit<
  Job,
  "id" | "postedBy" | "postedAt" | "applicantCount" | "status"
> & {
  status: JobStatus;
};

// Query params the candidate search/filter bar sends to the search endpoint.
export interface JobSearchFilters {
  keyword: string;
  location: string;
  workMode: WorkMode[];
  employmentType: EmploymentType[];
  experienceLevel: ExperienceLevel[];
  minSalary: number;
  skills: string[];
}

export const EMPTY_FILTERS: JobSearchFilters = {
  keyword: "",
  location: "",
  workMode: [],
  employmentType: [],
  experienceLevel: [],
  minSalary: 0,
  skills: [],
};
