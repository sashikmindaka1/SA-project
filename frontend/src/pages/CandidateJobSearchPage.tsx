import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { Search, SlidersHorizontal, MapPin, Briefcase, Loader2, Bookmark, Bell, CheckCircle } from "lucide-react";
import SideNav from "../components/common/SideNav";
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

// ---------------------------------------------------------------------------
// Design tokens — Dark Cyberpunk Theme
// ---------------------------------------------------------------------------
const C = {
  bg: "#080c10",
  panel: "#0d1318",
  panelAlt: "#121922",
  border: "rgba(255,255,255,0.06)",
  text: "#FFFFFF",
  textDim: "#5c7086",
  teal: "#22d9d9",
} as const;

const API_BASE_URL = "http://localhost:5016";
const SAVED_PROFILE_ID_KEY = "candidateProfileId";

const WORK_MODES: WorkMode[] = ["On-site", "Hybrid", "Remote"];
const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry", "Junior", "Mid", "Senior", "Lead"];

export default function CandidateJobSearchPage() {
  const [filters, setFilters] = useState<JobSearchFilters>(EMPTY_FILTERS);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Job | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set()); // Applied Jobs Track කරන්න
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Dynamic Profile State
  const [userProfile, setUserProfile] = useState({
    fullName: "Candidate User",
    title: "CANDIDATE",
    photoUrl: null as string | null,
  });

  // Load User Profile dynamically from LocalStorage or Backend API
  const loadUserProfile = async () => {
    // 1. Try saved candidateProfileId first
    const savedId = localStorage.getItem(SAVED_PROFILE_ID_KEY);
    if (savedId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/CandidateProfile/${savedId}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            fullName: data.fullName || "Candidate User",
            title: (data.title || "CANDIDATE").toUpperCase(),
            photoUrl: data.photoUrl ? `${API_BASE_URL}${data.photoUrl}` : null,
          });
          return;
        }
      } catch (err) {
        console.error("Failed to load profile by saved ID:", err);
      }
    }

    // 2. Fallback to LocalStorage JSON items
    const possibleKeys = ["candidate_profile_draft", "userProfile", "user", "candidate_profile"];
    for (const key of possibleKeys) {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const foundName = parsed.fullName || parsed.name || parsed.userName;
          const foundTitle = parsed.title || parsed.jobTitle || parsed.role;
          const foundPhoto = parsed.photoUrl || parsed.avatar;

          if (foundName) {
            setUserProfile({
              fullName: foundName,
              title: (foundTitle || "CANDIDATE").toUpperCase(),
              photoUrl: foundPhoto ? (foundPhoto.startsWith("http") ? foundPhoto : `${API_BASE_URL}${foundPhoto}`) : null,
            });
            return;
          }
        } catch (e) {
          console.error(`Error reading key ${key} from LocalStorage`, e);
        }
      }
    }
  };

  useEffect(() => {
    loadUserProfile();

    // Event listeners to sync updates dynamically
    const handleStorageChange = () => loadUserProfile();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleStorageChange);
    };
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "CS";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      searchJobs(filters)
        .then((results) => {
          const safeResults = results || [];
          setJobs(safeResults);
          setSelected((current) =>
            current && safeResults.some((r) => r.id === current.id) ? current : safeResults[0] ?? null
          );
        })
        .catch((err) => console.error("Search failed:", err))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(handle);
  }, [filters]);

  const activeFilterCount = useMemo(
    () =>
      (filters.workMode?.length || 0) +
      (filters.employmentType?.length || 0) +
      (filters.experienceLevel?.length || 0) +
      (filters.minSalary > 0 ? 1 : 0),
    [filters]
  );

  function toggleArrayFilter<K extends "workMode" | "employmentType" | "experienceLevel">(
    key: K,
    value: JobSearchFilters[K][number]
  ) {
    setFilters((f) => {
      const current = (f[key] as string[]) || [];
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

  // Application Submit Handler
  function handleApply(job: Job) {
    setAppliedIds((prev) => new Set(prev).add(job.id));
    alert(`Successfully applied for ${job.title}!`);
  }

  return (
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      {/* Top Header / App Bar */}
      <nav
        className="w-full px-8 py-4 border-b sticky top-0 z-20 backdrop-blur-md flex justify-between items-center"
        style={{ borderColor: C.border, background: `${C.bg}EE` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg"
            style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}
          >
            TF
          </div>
          <span className="font-extrabold tracking-tight text-lg" style={{ color: C.text }}>
            Talent<span style={{ color: C.teal }}>Flow</span> AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="p-2.5 rounded-xl border shrink-0 cursor-pointer transition-all hover:bg-white/5"
            style={{ background: C.panel, borderColor: C.border }}
          >
            <Bell size={18} style={{ color: C.textDim }} />
          </div>
          <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: C.border }}>
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shadow-md"
              style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}
            >
              {userProfile.photoUrl ? (
                <img src={userProfile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(userProfile.fullName)
              )}
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>{userProfile.fullName}</div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5 uppercase" style={{ color: C.teal }}>
                {userProfile.title}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        <SideNav />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Title */}
            <header>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: C.text }}>
                Find your next role
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: C.textDim }}>
                {loading ? "Searching..." : `${jobs.length} open roles match your criteria`}
              </p>
            </header>

            {/* Search and Filters Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: C.textDim }}
                />
                <input
                  className="tf-input pl-10"
                  placeholder="Search by title or skill — e.g. React, Spring Boot"
                  value={filters.keyword}
                  onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
                />
              </div>

              <div className="relative sm:w-56">
                <MapPin
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: C.textDim }}
                />
                <input
                  className="tf-input pl-10"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                />
              </div>

              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all"
                style={{
                  background: activeFilterCount ? `${C.teal}15` : C.panel,
                  borderColor: activeFilterCount ? `${C.teal}40` : C.border,
                  color: activeFilterCount ? C.teal : C.text,
                }}
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                    style={{ background: C.teal, color: "#08101b" }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Expandable Filter Panel */}
            {filtersOpen && (
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                toggleArrayFilter={toggleArrayFilter}
                onClear={() => setFilters(EMPTY_FILTERS)}
              />
            )}

            {/* Content Area: Cards List + Selected Job Detail View */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] items-start">
              {/* Jobs List */}
              <div className="space-y-3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-20" style={{ color: C.teal }}>
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-xs font-semibold" style={{ color: C.textDim }}>
                      Fetching matching roles...
                    </span>
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

              {/* Selected Job Sticky Details */}
              <div className="hidden lg:block sticky top-6">
                {selected ? (
                  <JobDetail
                    job={selected}
                    saved={savedIds.has(selected.id)}
                    hasApplied={appliedIds.has(selected.id)}
                    onToggleSave={toggleSave}
                    onApply={handleApply}
                  />
                ) : (
                  <div
                    className="flex h-64 items-center justify-center rounded-2xl border border-dashed text-sm"
                    style={{ borderColor: C.border, color: C.textDim }}
                  >
                    Select a role to preview full details
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .tf-input {
          width: 100%;
          background: ${C.panelAlt};
          border: 1px solid ${C.border};
          border-radius: 0.75rem;
          padding: 0.65rem 0.85rem;
          font-size: 0.8125rem;
          color: ${C.text};
          outline: none;
          transition: all 0.2s ease;
        }
        .tf-input:focus {
          border-color: ${C.teal};
          box-shadow: 0 0 0 1px ${C.teal}40;
        }
        .tf-input::placeholder {
          color: ${C.textDim};
        }
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
    <div
      className="rounded-2xl border p-5 shadow-2xl transition-all"
      style={{ background: C.panel, borderColor: C.border }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FilterGroup label="Work mode">
          {WORK_MODES.map((mode) => (
            <Chip
              key={mode}
              label={mode}
              active={filters.workMode?.includes(mode)}
              onClick={() => toggleArrayFilter("workMode", mode)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Employment type">
          {EMPLOYMENT_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              active={filters.employmentType?.includes(type)}
              onClick={() => toggleArrayFilter("employmentType", type)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Experience level">
          {EXPERIENCE_LEVELS.map((level) => (
            <Chip
              key={level}
              label={level}
              active={filters.experienceLevel?.includes(level)}
              onClick={() => toggleArrayFilter("experienceLevel", level)}
            />
          ))}
        </FilterGroup>
      </div>

      <div className="mt-5 border-t pt-4" style={{ borderColor: C.border }}>
        <span className="mb-2 block text-xs font-semibold tracking-wider uppercase" style={{ color: C.textDim }}>
          Minimum Salary — {filters.minSalary > 0 ? `$${filters.minSalary}/mo` : "Any"}
        </span>
        <input
          type="range"
          min={0}
          max={6000}
          step={100}
          value={filters.minSalary || 0}
          onChange={(e) => setFilters((f) => ({ ...f, minSalary: Number(e.target.value) }))}
          className="w-full accent-teal-400 cursor-pointer"
        />
      </div>

      <button
        onClick={onClear}
        className="mt-4 text-xs font-semibold tracking-wide hover:underline"
        style={{ color: C.teal }}
      >
        Clear all filters
      </button>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold tracking-wider uppercase" style={{ color: C.textDim }}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all"
      style={{
        background: active ? `${C.teal}15` : C.panelAlt,
        borderColor: active ? `${C.teal}40` : C.border,
        color: active ? C.teal : C.textDim,
      }}
    >
      {label}
    </button>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center"
      style={{ borderColor: C.border, background: C.panel }}
    >
      <div className="rounded-xl p-3 border" style={{ background: C.panelAlt, borderColor: C.border }}>
        <Briefcase size={22} style={{ color: C.teal }} />
      </div>
      <h3 className="mt-4 text-sm font-bold" style={{ color: C.text }}>
        No roles match your search
      </h3>
      <p className="mt-1 max-w-xs text-xs" style={{ color: C.textDim }}>
        Try clearing some applied filters or searching with alternative keywords.
      </p>
      <button
        onClick={onClear}
        className="mt-4 text-xs font-semibold tracking-wider uppercase hover:underline"
        style={{ color: C.teal }}
      >
        Reset filters
      </button>
    </div>
  );
}

function JobDetail({
  job,
  saved,
  hasApplied,
  onToggleSave,
  onApply,
}: {
  job: Job;
  saved: boolean;
  hasApplied: boolean;
  onToggleSave: (job: Job) => void;
  onApply: (job: Job) => void;
}) {
  return (
    <div
      className="rounded-2xl border p-6 shadow-2xl space-y-5"
      style={{ background: C.panel, borderColor: C.border }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: C.text }}>
            {job.title}
          </h2>
          <p className="mt-1 text-xs" style={{ color: C.textDim }}>
            {job.department} · {job.location} · {job.workMode}
          </p>
        </div>
        <button
          onClick={() => onToggleSave(job)}
          className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all shrink-0"
          style={{
            background: saved ? "rgba(217, 184, 85, 0.1)" : C.panelAlt,
            borderColor: saved ? "rgba(217, 184, 85, 0.3)" : C.border,
            color: saved ? "#D9B855" : C.textDim,
          }}
        >
          <Bookmark size={14} />
          {saved ? "Saved" : "Save role"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(job.skills || []).map((skill) => (
          <span
            key={skill}
            className="rounded-lg px-2.5 py-1 text-xs font-semibold border"
            style={{
              background: `${C.teal}10`,
              borderColor: `${C.teal}30`,
              color: C.teal,
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Safe Salary Rendering */}
      <div className="text-xl font-extrabold tracking-tight" style={{ color: C.teal }}>
        {job.salary ? (
          <>
            {job.salary.currency || "$"} {job.salary.min?.toLocaleString() || 0} – {job.salary.max?.toLocaleString() || 0}
            <span className="text-xs font-normal" style={{ color: C.textDim }}> / mo</span>
          </>
        ) : (
          <span className="text-sm font-normal text-gray-400">Salary Undisclosed</span>
        )}
      </div>

      <div className="border-t pt-4 space-y-4" style={{ borderColor: C.border }}>
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textDim }}>
            About the role
          </h3>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: C.text }}>
            {job.description}
          </p>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textDim }}>
            Requirements
          </h3>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: C.text }}>
            {job.requirements}
          </p>
        </section>
      </div>

      {/* Apply Button Update */}
      <button
        disabled={hasApplied}
        onClick={() => onApply(job)}
        className="w-full rounded-xl py-3 text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
        style={{
          background: hasApplied
            ? "rgba(34, 217, 217, 0.2)"
            : `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
          color: hasApplied ? C.teal : "#08101b",
          cursor: hasApplied ? "not-allowed" : "pointer",
        }}
      >
        {hasApplied ? (
          <>
            <CheckCircle size={16} /> Applied
          </>
        ) : (
          "Apply for Position"
        )}
      </button>
    </div>
  );
}