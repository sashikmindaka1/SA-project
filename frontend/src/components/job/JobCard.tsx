// src/components/JobCard.tsx
import { MapPin, Briefcase, Clock, Bookmark } from "lucide-react";
import type { Job } from "../../types/job";

interface JobCardProps {
  job: Job;
  matchScore?: number; // optional — wire up once Member 05's matching API exists
  selected?: boolean;
  saved?: boolean;
  onSelect: (job: Job) => void;
  onToggleSave?: (job: Job) => void;
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export default function JobCard({
  job,
  matchScore,
  selected,
  saved,
  onSelect,
  onToggleSave,
}: JobCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(job)}
      className={`w-full text-left rounded-xl border p-4 transition-colors ${
        selected
          ? "border-[#0CF2F2] bg-[#1E2A2E]"
          : "border-white/10 bg-[#20272D] hover:border-white/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-white">{job.title}</h3>
          <p className="mt-0.5 text-sm text-[#8A9199]">{job.department}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {typeof matchScore === "number" && (
            <span className="rounded-full bg-[#0CF2F2]/10 px-2.5 py-1 text-xs font-semibold text-[#0CF2F2]">
              {matchScore}% match
            </span>
          )}
          {onToggleSave && (
            <span
              role="button"
              aria-label={saved ? "Unsave job" : "Save job"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job);
              }}
              className="rounded-md p-1.5 text-[#8A9199] hover:bg-white/5 hover:text-[#D9B855]"
            >
              <Bookmark
                size={16}
                fill={saved ? "#D9B855" : "none"}
                color={saved ? "#D9B855" : "currentColor"}
              />
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8A9199]">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {job.location} · {job.workMode}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={13} /> {job.employmentType}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {timeAgo(job.postedAt)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-[#27668C]/25 px-2 py-0.5 text-[11px] font-medium text-[#6FB4DD]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-3 text-sm font-medium text-[#2CBFBF]">
        {job.salary.currency} {job.salary.min.toLocaleString()}–{job.salary.max.toLocaleString()}
        <span className="text-[#8A9199] font-normal"> /mo</span>
      </div>
    </button>
  );
}
