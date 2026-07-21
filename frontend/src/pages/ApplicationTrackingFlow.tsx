import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import {
  Search,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Star,
  Mail,
  Briefcase,
  X,
  GripVertical,
  type LucideIcon,
} from "lucide-react";

import { NAV_ITEMS, type NavItem } from "../constants/navigation";

// ---------------------------------------------------------------------------
// Design tokens — TalentFlow AI palette
// ---------------------------------------------------------------------------
const C = {
  bg: "#14191D",
  panel: "#1A2126",
  panelAlt: "#1F2830",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.16)",
  text: "#E7ECEF",
  textDim: "#8B98A3",
  blue: "#27668C",
  cyan: "#0CF2F2",
  teal: "#2CBFBF",
  gold: "#D9B855",
  red: "#E0665A",
} as const;

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------
export type ApplicationStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface JobApplication {
  id: string;
  candidate: string;
  initials: string;
  email: string;
  role: string;
  matchScore: number;
  appliedOn: string; // ISO date
  status: ApplicationStatus;
  skills: string[];
  note: string;
}

interface StatusMeta {
  color: string;
  icon: LucideIcon;
}

const STAGES: ApplicationStatus[] = ["Applied", "Shortlisted", "Interview", "Offer"];
const KANBAN_COLUMNS: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  Applied: { color: C.blue, icon: Clock },
  Shortlisted: { color: C.teal, icon: Star },
  Interview: { color: C.cyan, icon: CalendarIcon },
  Offer: { color: C.gold, icon: CheckCircle2 },
  Rejected: { color: C.red, icon: XCircle },
};

// ---------------------------------------------------------------------------
// Mock data — replace with a fetch to /api/applications
// ---------------------------------------------------------------------------
const seedApplications: JobApplication[] = [
  {
    id: "APP-2201",
    candidate: "Sarah Perera",
    initials: "SP",
    email: "sarah.perera@mail.com",
    role: "Senior AI Developer",
    matchScore: 95,
    appliedOn: "2026-07-02",
    status: "Interview",
    skills: ["Python", "Data Structures", "TensorFlow"],
    note: "Interview scheduled for 2:00 PM Thu with the ML panel.",
  },
  {
    id: "APP-2202",
    candidate: "Dinuka Wijesinghe",
    initials: "DW",
    email: "dinuka.w@mail.com",
    role: "Backend Engineer",
    matchScore: 91,
    appliedOn: "2026-07-05",
    status: "Shortlisted",
    skills: ["C#", ".NET", "SQL Server"],
    note: "Recruiter shortlisted after resume screen.",
  },
  {
    id: "APP-2203",
    candidate: "Isuru Fernando",
    initials: "IF",
    email: "isuru.f@mail.com",
    role: "Frontend Engineer",
    matchScore: 88,
    appliedOn: "2026-07-08",
    status: "Applied",
    skills: ["React", "TypeScript", "Tailwind"],
    note: "Awaiting initial screening.",
  },
  {
    id: "APP-2204",
    candidate: "Nethmi Silva",
    initials: "NS",
    email: "nethmi.s@mail.com",
    role: "Senior AI Developer",
    matchScore: 82,
    appliedOn: "2026-06-29",
    status: "Rejected",
    skills: ["Python", "NLP"],
    note: "Did not meet minimum years of experience.",
  },
  {
    id: "APP-2205",
    candidate: "Kavindu Rathnayake",
    initials: "KR",
    email: "kavindu.r@mail.com",
    role: "DevOps Engineer",
    matchScore: 90,
    appliedOn: "2026-07-10",
    status: "Offer",
    skills: ["Docker", "Kubernetes", "Azure"],
    note: "Offer sent — awaiting candidate response.",
  },
  {
    id: "APP-2206",
    candidate: "Tharindu Perera",
    initials: "TP",
    email: "tharindu.p@mail.com",
    role: "Backend Engineer",
    matchScore: 76,
    appliedOn: "2026-07-11",
    status: "Applied",
    skills: ["Java", "Spring Boot"],
    note: "Awaiting initial screening.",
  },
];

// ---------------------------------------------------------------------------
// Shared UI bits
// ---------------------------------------------------------------------------
function Badge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}55` }}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sidebar — driven by the repo's NAV_ITEMS
// ---------------------------------------------------------------------------
interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

function Sidebar({ activePath, onNavigate }: SidebarProps) {
  return (
    <aside
      className="w-56 shrink-0 h-screen sticky top-0 flex flex-col px-3 py-5"
      style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div
          className="h-7 w-7 rounded-md flex items-center justify-center font-bold text-sm"
          style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`, color: "#0A0E11" }}
        >
          T
        </div>
        <span className="font-semibold tracking-tight" style={{ color: C.text }}>
          TalentFlow AI
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item: NavItem) => {
          const Icon = item.icon;
          const active = item.path === activePath;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors"
              style={{
                background: active ? `${C.cyan}18` : "transparent",
                color: active ? C.cyan : C.textDim,
                border: `1px solid ${active ? `${C.cyan}44` : "transparent"}`,
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-20 backdrop-blur"
      style={{ borderColor: C.border, background: `${C.bg}E6` }}
    >
      <div>
        <h1 className="text-lg font-semibold" style={{ color: C.text }}>{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Bell size={18} style={{ color: C.textDim }} />
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ background: C.blue, color: C.text }}
        >
          SP
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Candidate Application Tracking Dashboard  → route: /applications
// ---------------------------------------------------------------------------
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-4 flex-1 min-w-35" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="text-2xl font-semibold" style={{ color }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: C.textDim }}>{label}</div>
    </div>
  );
}

function Stepper({ status }: { status: ApplicationStatus }) {
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 text-xs" style={{ color: STATUS_META.Rejected.color }}>
        <XCircle size={14} /> Application closed — not selected
      </div>
    );
  }
  const currentIdx = STAGES.indexOf(status);
  return (
    <div className="flex items-center w-full">
      {STAGES.map((stage, i) => {
        const done = i <= currentIdx;
        const isLast = i === STAGES.length - 1;
        return (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 64 }}>
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background: done ? C.cyan : "transparent",
                  border: `2px solid ${done ? C.cyan : C.borderStrong}`,
                }}
              />
              <span className="text-[10px] whitespace-nowrap" style={{ color: done ? C.text : C.textDim }}>
                {stage}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mb-4" style={{ background: i < currentIdx ? C.cyan : C.border }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CandidateDashboard({ applications }: { applications: JobApplication[] }) {
  const counts = useMemo(() => {
    const c = { total: applications.length, active: 0, offers: 0, rejected: 0 };
    applications.forEach((a) => {
      if (a.status === "Offer") c.offers++;
      else if (a.status === "Rejected") c.rejected++;
      else c.active++;
    });
    return c;
  }, [applications]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex gap-3 flex-wrap">
        <StatCard label="Total applications" value={counts.total} color={C.cyan} />
        <StatCard label="In progress" value={counts.active} color={C.teal} />
        <StatCard label="Offers" value={counts.offers} color={C.gold} />
        <StatCard label="Not selected" value={counts.rejected} color={C.red} />
      </div>

      <div className="mt-8 space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="rounded-xl p-5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} style={{ color: C.textDim }} />
                  <span className="font-medium" style={{ color: C.text }}>{app.role}</span>
                </div>
                <div className="text-xs mt-1" style={{ color: C.textDim }}>
                  Applied{" "}
                  {new Date(app.appliedOn).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {app.id}
                </div>
              </div>
              <Badge status={app.status} />
            </div>

            <div className="mt-5">
              <Stepper status={app.status} />
            </div>

            <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: C.border, color: C.textDim }}>
              {app.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recruiter Application Review UI (kanban)  → route: /candidates
// ---------------------------------------------------------------------------
interface KanbanCardProps {
  app: JobApplication;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onOpen: (app: JobApplication) => void;
}

function KanbanCard({ app, onDragStart, onOpen }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, app.id)}
      onClick={() => onOpen(app)}
      className="rounded-lg p-3 mb-3 cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5"
      style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
            style={{ background: C.blue, color: C.text }}
          >
            {app.initials}
          </div>
          <div>
            <div className="text-sm font-medium leading-tight" style={{ color: C.text }}>{app.candidate}</div>
            <div className="text-[11px]" style={{ color: C.textDim }}>{app.role}</div>
          </div>
        </div>
        <GripVertical size={14} style={{ color: C.textDim, opacity: 0.5 }} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ color: C.cyan, background: `${C.cyan}18` }}>
          {app.matchScore}% match
        </span>
        <span className="text-[10px]" style={{ color: C.textDim }}>
          {new Date(app.appliedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  stage: ApplicationStatus;
  apps: JobApplication[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, stage: ApplicationStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onOpen: (app: JobApplication) => void;
}

function KanbanColumn({ stage, apps, onDrop, onDragOver, onDragStart, onOpen }: KanbanColumnProps) {
  const meta = STATUS_META[stage];
  return (
    <div
      onDrop={(e) => onDrop(e, stage)}
      onDragOver={onDragOver}
      className="rounded-xl p-3 flex-1 min-w-60 flex flex-col"
      style={{ background: C.panel, border: `1px solid ${C.border}`, maxHeight: "calc(100vh - 220px)" }}
    >
      <div className="flex items-center justify-between px-1 pb-3 mb-1 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
          <span className="text-sm font-medium" style={{ color: C.text }}>{stage}</span>
        </div>
        <span className="text-[11px] font-semibold rounded-full px-2 py-0.5" style={{ color: C.textDim, background: C.panelAlt }}>
          {apps.length}
        </span>
      </div>
      <div className="overflow-y-auto flex-1 pr-0.5">
        {apps.length === 0 ? (
          <div className="text-[11px] text-center py-6" style={{ color: C.textDim }}>
            No candidates here
          </div>
        ) : (
          apps.map((a) => <KanbanCard key={a.id} app={a} onDragStart={onDragStart} onOpen={onOpen} />)
        )}
      </div>
    </div>
  );
}

interface CandidateDrawerProps {
  app: JobApplication | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

function CandidateDrawer({ app, onClose, onStatusChange }: CandidateDrawerProps) {
  if (!app) return null;
  return (
    <div className="fixed inset-0 z-30 flex justify-end" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-sm p-6 overflow-y-auto"
        style={{ background: C.panel, borderLeft: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: C.textDim }}>{app.id}</span>
          <button onClick={onClose} aria-label="Close">
            <X size={18} style={{ color: C.textDim }} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ background: C.blue, color: C.text }}
          >
            {app.initials}
          </div>
          <div>
            <div className="font-semibold" style={{ color: C.text }}>{app.candidate}</div>
            <div className="text-xs flex items-center gap-1" style={{ color: C.textDim }}>
              <Mail size={11} /> {app.email}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-lg p-3" style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}>
          <div>
            <div className="text-xs" style={{ color: C.textDim }}>Applied for</div>
            <div className="text-sm font-medium" style={{ color: C.text }}>{app.role}</div>
          </div>
          <span className="text-sm font-semibold" style={{ color: C.cyan }}>{app.matchScore}%</span>
        </div>

        <div className="mt-5">
          <div className="text-xs mb-2" style={{ color: C.textDim }}>Key skills</div>
          <div className="flex flex-wrap gap-1.5">
            {app.skills.map((s) => (
              <span
                key={s}
                className="text-[11px] px-2 py-1 rounded-full"
                style={{ background: `${C.teal}18`, color: C.teal, border: `1px solid ${C.teal}44` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs mb-2" style={{ color: C.textDim }}>Current status</div>
          <Badge status={app.status} />
        </div>

        <div className="mt-6">
          <div className="text-xs mb-2" style={{ color: C.textDim }}>Move to</div>
          <div className="grid grid-cols-2 gap-2">
            {KANBAN_COLUMNS.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(app.id, s)}
                disabled={s === app.status}
                className="text-xs rounded-lg py-2 font-medium transition-opacity disabled:opacity-40"
                style={{
                  background: `${STATUS_META[s].color}1A`,
                  color: STATUS_META[s].color,
                  border: `1px solid ${STATUS_META[s].color}44`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecruiterBoard({
  applications,
  setApplications,
}: {
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
}) {
  const [openApp, setOpenApp] = useState<JobApplication | null>(null);
  const [query, setQuery] = useState("");

  const filtered = applications.filter(
    (a) =>
      a.candidate.toLowerCase().includes(query.toLowerCase()) ||
      a.role.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = useMemo(() => {
    const g: Record<ApplicationStatus, JobApplication[]> = {
      Applied: [],
      Shortlisted: [],
      Interview: [],
      Offer: [],
      Rejected: [],
    };
    filtered.forEach((a) => g[a.status].push(a));
    return g;
  }, [filtered]);

  const changeStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setOpenApp((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => e.dataTransfer.setData("text/plain", id);
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const onDrop = (e: React.DragEvent<HTMLDivElement>, stage: ApplicationStatus) => {
    const id = e.dataTransfer.getData("text/plain");
    if (id) changeStatus(id, stage);
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-end">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 w-full sm:w-64"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
        >
          <Search size={14} style={{ color: C.textDim }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidate or role"
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: C.text }}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
        {KANBAN_COLUMNS.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            apps={grouped[stage]}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onOpen={setOpenApp}
          />
        ))}
      </div>

      <CandidateDrawer app={openApp} onClose={() => setOpenApp(null)} onStatusChange={changeStatus} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page shell — swap this out for two separate route files if your router
// (Next.js app dir / React Router) expects one component per route.
// ---------------------------------------------------------------------------
export default function ApplicationTrackingFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname;

  const [applications, setApplications] =
    useState<JobApplication[]>([]);

  
useEffect(() => {
  axios
    .get("http://localhost:5016/api/Applications")
    .then((res) => {
      console.log("Applications:", res.data);
      setApplications(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

  const isRecruiterView =
    activePath === "/candidates";

  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        background: C.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Sidebar
        activePath={activePath}
        onNavigate={navigate}
      />

      <div className="flex-1 min-w-0">
        {isRecruiterView ? (
          <>
            <TopBar
              title="Application Review"
              subtitle="Drag a candidate card between columns, or click one for full details."
            />

            <RecruiterBoard
              applications={applications}
              setApplications={setApplications}
            />
          </>
        ) : (
          <>
            <TopBar
              title="My Applications"
              subtitle="Track the status of every role you've applied to, in real time."
            />

            <CandidateDashboard
              applications={applications}
            />
          </>
        )}
      </div>
    </div>
  );
}