import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { Search, SlidersHorizontal, MapPin, Briefcase, Loader2 } from "lucide-react";
import type {
  Job,
  JobSearchFilters,
  EmploymentType,
  ExperienceLevel,
  WorkMode,
} from "../types/job";
import { EMPTY_FILTERS } from "../types/job";
import { searchJobs } from "../api/jobsApi";
import JobCard from "../components/job/JobCard";

const WORK_MODES: WorkMode[] = ["On-site", "Hybrid", "Remote"];
const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry", "Junior", "Mid", "Senior", "Lead"];

export default function CandidateJobSearchPage() {
  const [filters, setFilters] = useState<JobSearchFilters>(EMPTY_FILTERS);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Job | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      searchJobs(filters).then((results) => {
        setJobs(results);
        setLoading(false);
        setSelected((current) =>
          current && results.some((r) => r.id === current.id) ? current : results[0] ?? null
        );
      });
    }, 250); // debounce keyword typing
    return () => clearTimeout(handle);
  }, [filters]);

  const activeFilterCount = useMemo(
    () =>
      filters.workMode.length +
      filters.employmentType.length +
      filters.experienceLevel.length +
      (filters.minSalary > 0 ? 1 : 0),
    [filters]
  );

  function toggleArrayFilter<K extends "workMode" | "employmentType" | "experienceLevel">(
    key: K,
    value: JobSearchFilters[K][number]
  ) {
    setFilters((f) => {
      const current = f[key] as string[];
      const next = current.includes(value as string)
        ? current.filter((v) => v !== value)
        : [...current, value as string];
      return { ...f, [key]: next };
    });
  }

  function toggleSave(job: Job) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(job.id) ? next.delete(job.id) : next.add(job.id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#1A2126] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header>
          <h1 className="text-2xl font-semibold">Find your next role</h1>
          <p className="mt-1 text-sm text-[#8A9199]">
            {loading ? "Searching…" : `${jobs.length} open roles match your search`}
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5C636B]"
            />
            <input
              className="input pl-9"
              placeholder="Search by title or skill — e.g. React, Data Analyst"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
            />
          </div>
          <div className="relative sm:w-56">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5C636B]"
            />
            <input
              className="input pl-9"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium sm:w-auto ${
              activeFilterCount
                ? "border-[#0CF2F2]/40 bg-[#0CF2F2]/10 text-[#0CF2F2]"
                : "border-white/10 text-[#8A9199] hover:bg-white/5"
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[#0CF2F2] px-1.5 text-xs font-semibold text-[#0B1416]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            toggleArrayFilter={toggleArrayFilter}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-[#8A9199]">
                <Loader2 className="animate-spin" size={18} /> Loading roles…
              </div>
            ) : jobs.length === 0 ? (
              <EmptyResults onClear={() => setFilters(EMPTY_FILTERS)} />
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  selected={selected?.id === job.id}
                  saved={savedIds.has(job.id)}
                  onSelect={setSelected}
                  onToggleSave={toggleSave}
                />
              ))
            )}
          </div>

          <div className="hidden lg:block">
            {selected ? (
              <JobDetail job={selected} saved={savedIds.has(selected.id)} onToggleSave={toggleSave} />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-[#8A9199]">
                Select a role to see details
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: #20272D;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .input:focus { border-color: #0CF2F2; }
        .input::placeholder { color: #5C636B; }
      `}</style>
    </div>
  );
}

interface FilterPanelProps {
  filters: JobSearchFilters;
  setFilters: Dispatch<SetStateAction<JobSearchFilters>>;
  toggleArrayFilter: <K extends "workMode" | "employmentType" | "experienceLevel">(
    key: K,
    value: JobSearchFilters[K][number]
  ) => void;
  onClear: () => void;
}

function FilterPanel({ filters, setFilters, toggleArrayFilter, onClear }: FilterPanelProps) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-[#20272D] p-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FilterGroup label="Work mode">
          {WORK_MODES.map((mode) => (
            <Chip
              key={mode}
              label={mode}
              active={filters.workMode.includes(mode)}
              onClick={() => toggleArrayFilter("workMode", mode)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Employment type">
          {EMPLOYMENT_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              active={filters.employmentType.includes(type)}
              onClick={() => toggleArrayFilter("employmentType", type)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Experience level">
          {EXPERIENCE_LEVELS.map((level) => (
            <Chip
              key={level}
              label={level}
              active={filters.experienceLevel.includes(level)}
              onClick={() => toggleArrayFilter("experienceLevel", level)}
            />
          ))}
        </FilterGroup>
      </div>

      <div className="mt-5">
        <span className="mb-2 block text-xs font-medium text-[#8A9199]">
          Minimum salary — {filters.minSalary > 0 ? `$${filters.minSalary}/mo` : "Any"}
        </span>
        <input
          type="range"
          min={0}
          max={6000}
          step={100}
          value={filters.minSalary}
          onChange={(e) => setFilters((f) => ({ ...f, minSalary: Number(e.target.value) }))}
          className="w-full accent-[#0CF2F2]"
        />
      </div>

      <button
        onClick={onClear}
        className="mt-4 text-xs font-medium text-[#8A9199] hover:text-white"
      >
        Clear all filters
      </button>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium text-[#8A9199]">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-[#0CF2F2]/40 bg-[#0CF2F2]/10 text-[#0CF2F2]"
          : "border-white/10 text-[#8A9199] hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16 text-center">
      <div className="rounded-full bg-white/5 p-3 text-[#8A9199]">
        <Briefcase size={20} />
      </div>
      <h3 className="mt-3 text-sm font-semibold">No roles match your filters</h3>
      <p className="mt-1 max-w-xs text-xs text-[#8A9199]">
        Try widening your search or clearing a few filters.
      </p>
      <button onClick={onClear} className="mt-3 text-xs font-medium text-[#0CF2F2] hover:underline">
        Clear all filters
      </button>
    </div>
  );
}

function JobDetail({
  job,
  saved,
  onToggleSave,
}: {
  job: Job;
  saved: boolean;
  onToggleSave: (job: Job) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#20272D] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="mt-1 text-sm text-[#8A9199]">
            {job.department} · {job.location} · {job.workMode}
          </p>
        </div>
        <button
          onClick={() => onToggleSave(job)}
          className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium ${
            saved
              ? "border-[#D9B855]/40 bg-[#D9B855]/10 text-[#D9B855]"
              : "border-white/10 text-[#8A9199] hover:bg-white/5"
          }`}
        >
          {saved ? "Saved" : "Save role"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-[#27668C]/25 px-2 py-1 text-xs font-medium text-[#6FB4DD]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 text-lg font-semibold text-[#2CBFBF]">
        {job.salary.currency} {job.salary.min.toLocaleString()}–{job.salary.max.toLocaleString()}
        <span className="text-sm font-normal text-[#8A9199]"> /mo</span>
      </div>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-white">About the role</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#B4BAC1]">{job.description}</p>
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-semibold text-white">Requirements</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#B4BAC1]">{job.requirements}</p>
      </section>

      <button className="mt-6 w-full rounded-lg bg-[#0CF2F2] py-3 text-sm font-semibold text-[#0B1416] hover:opacity-90">
        Apply now
      </button>
    </div>
  );
}