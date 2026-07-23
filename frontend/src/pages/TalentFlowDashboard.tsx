import React, { useState, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import {
  Zap,
  Search,
  MapPin,
  Clock,
  Check,
  X,
  User,
  FileText,
  BarChart3,
  Bell,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  DollarSign,
  MessageCircle,
  Star,
  SlidersHorizontal,
  CalendarClock,
  TrendingUp,
  Building2,
  Lock,
  Quote,
  FileSearch,
  Gauge,
  ArrowRight,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";



const INK = "#1A2126";
const PANEL = "#212B33";
const PANEL2 = "#283441";
const STEEL = "#27668C";
const CYAN = "#0CF2F2";
const TEAL = "#2CBFBF";
const GOLD = "#D9B855";
const LINE = "#33404B";
const TXT = "#E7EDF0";
const TXTDIM = "#8B9AA5";

type Level = "Junior" | "Mid" | "Senior";
type Decision = "applied" | "ignored" | undefined;
type Decisions = Record<number, Decision>;
type SavedMap = Record<number, boolean>;

interface Job {
  id: number;
  title: string;
  dept: string;
  company: string;
  location: string;
  posted: string;
  match: number;
  matched: string[];
  skills: string[];
  level: Level;
  salary: string;
  equity: string;
}

interface CurrentUser {
  name: string;
  email: string;
}

interface InterviewItem {
  id: number;
  jobId: number;
  company: string;
  role: string;
  when: string;
  daysAway: number;
  stage: "Phone screen" | "Technical" | "Final round";
}

const JOBS: Job[] = [
  {
    id: 1,
    title: "Senior AI Developer",
    dept: "Machine Learning",
    company: "Nimbus Labs",
    location: "Colombo · Hybrid",
    posted: "2 days ago",
    match: 95,
    matched: ["Python", "TensorFlow", "Data Structures"],
    skills: ["Python", "TensorFlow", "Data Structures"],
    level: "Senior",
    salary: "LKR 350K–480K /mo",
    equity: "0.10%–0.30%",
  },
  {
    id: 2,
    title: "Frontend Engineer",
    dept: "Product Platform",
    company: "Loopway",
    location: "Remote · LK",
    posted: "5 days ago",
    match: 88,
    matched: ["React", "TypeScript"],
    skills: ["React", "TypeScript", "UI Systems"],
    level: "Mid",
    salary: "LKR 240K–320K /mo",
    equity: "0.05%–0.15%",
  },
  {
    id: 3,
    title: "Data Analyst — Talent Insights",
    dept: "People Analytics",
    company: "Signalworks",
    location: "Negombo · On-site",
    posted: "1 week ago",
    match: 76,
    matched: ["SQL", "Python"],
    skills: ["SQL", "Python", "Dashboards"],
    level: "Junior",
    salary: "LKR 150K–210K /mo",
    equity: "—",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    dept: "Infrastructure",
    company: "Kernel & Co.",
    location: "Colombo · Hybrid",
    posted: "3 days ago",
    match: 69,
    matched: ["AWS"],
    skills: ["AWS", "Kubernetes", "CI/CD"],
    level: "Mid",
    salary: "LKR 220K–300K /mo",
    equity: "0.02%–0.08%",
  },
  {
    id: 5,
    title: "QA Automation Engineer",
    dept: "Quality Engineering",
    company: "Verifyd",
    location: "Remote · LK",
    posted: "6 days ago",
    match: 82,
    matched: ["Java", "Test Design"],
    skills: ["Selenium", "Java", "Test Design"],
    level: "Mid",
    salary: "LKR 180K–240K /mo",
    equity: "0.01%–0.05%",
  },
];

const ANALYTICS: { label: string; v: number }[] = [
  { label: "Mon", v: 3 },
  { label: "Tue", v: 5 },
  { label: "Wed", v: 4 },
  { label: "Thu", v: 7 },
  { label: "Fri", v: 6 },
  { label: "Sat", v: 2 },
  { label: "Sun", v: 4 },
];

const FILTERS = ["Remote", "Senior", "Mid", "Junior", "Hybrid", "On-site"];

const POPULAR_TAGS = ["React", "Java", "Python", "Remote", "Intern"];

const FEATURED_COMPANIES = [
  "Google",
  "Microsoft",
  "WSO2",
  "IFS",
  "Sysco Labs",
  "Virtusa",
  "99X",
  "Surge",
  "Dialog",
];

interface TeaserJob {
  id: number;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary: string;
  gate: "open" | "match-locked" | "signup-locked";
  match?: number;
}

const TEASER_JOBS: TeaserJob[] = [
  {
    id: 101,
    title: "Senior React Developer",
    company: "Google",
    location: "Colombo",
    remote: true,
    salary: "LKR 300K",
    gate: "open",
  },
  {
    id: 102,
    title: "Java Backend Engineer",
    company: "IFS",
    location: "Colombo",
    remote: false,
    salary: "LKR 260K",
    gate: "match-locked",
    match: 94,
  },
  {
    id: 103,
    title: "Frontend Developer",
    company: "WSO2",
    location: "Colombo",
    remote: true,
    salary: "LKR 240K",
    gate: "signup-locked",
  },
];

const WHY_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: FileSearch, label: "AI resume analysis" },
  { icon: Gauge, label: "ATS resume score" },
  { icon: Sparkles, label: "Smart job matching" },
  { icon: Zap, label: "One-click apply" },
  { icon: CalendarClock, label: "Interview tracking" },
  { icon: DollarSign, label: "Salary prediction" },
];

const STATS: { value: string; label: string }[] = [
  { value: "15,000+", label: "Active jobs" },
  { value: "5,000+", label: "Companies" },
  { value: "80,000+", label: "Candidates" },
  { value: "92%", label: "Hiring success" },
];

const TESTIMONIAL = {
  quote: "Found my dream job within two weeks.",
  name: "Sarah Perera",
  role: "Frontend Engineer, hired at Loopway",
};

// SeekOut-style stage pipeline. Static demo counts for stages ahead of
// "applied", since those only exist once a recruiter acts on the other end.
const PIPELINE_STAGES: { key: string; label: string; extra: number }[] = [
  { key: "applied", label: "Applied", extra: 0 },
  { key: "screening", label: "Screening", extra: 3 },
  { key: "interview", label: "Interview", extra: 2 },
  { key: "offer", label: "Offer", extra: 0 },
];

const INTERVIEWS: InterviewItem[] = [
  {
    id: 1,
    jobId: 1,
    company: "Nimbus Labs",
    role: "Senior AI Developer",
    when: "Tomorrow, 10:30 AM",
    daysAway: 1,
    stage: "Technical",
  },
  {
    id: 2,
    jobId: 2,
    company: "Loopway",
    role: "Frontend Engineer",
    when: "Monday, 2:00 PM",
    daysAway: 4,
    stage: "Phone screen",
  },
  {
    id: 3,
    jobId: 5,
    company: "Verifyd",
    role: "QA Automation Engineer",
    when: "Jul 28, 11:00 AM",
    daysAway: 5,
    stage: "Final round",
  },
];

/* --- Signature element: circular match ring, reused everywhere --- */
function MatchRing({
  value,
  size = 46,
  stroke = 4,
  color = CYAN,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LINE} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .6s ease" }}
      />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.28}
        fontWeight="700"
        fill={TXT}
      >
        {value}
      </text>
    </svg>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${CYAN}, ${STEEL})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Zap size={16} color={INK} strokeWidth={2.5} />
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 800, fontSize: 16.5, letterSpacing: "-0.02em", color: TXT }}>
          TalentFlow <span style={{ color: CYAN }}>AI</span>
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            color: TXTDIM,
            textTransform: "uppercase",
          }}
        >
          Recruitment &amp; Talent Platform
        </div>
      </div>
    </div>
  );
}

function Pill({
  children,
  tone = "steel",
}: {
  children: ReactNode;
  tone?: "steel" | "teal" | "gold";
}) {
  const tones = {
    steel: { bg: "rgba(39,102,140,0.25)", fg: "#8FC5E8", bd: STEEL },
    teal: { bg: "rgba(44,191,191,0.15)", fg: TEAL, bd: TEAL },
    gold: { bg: "rgba(217,184,85,0.15)", fg: GOLD, bd: GOLD },
  } as const;
  const t = tones[tone];
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}55`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: 14,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- LANDING PAGE (pre-login home) ---------------- */
function LandingPage({
  onSearch,
  onLoginClick,
  onBrowseAll,
  onViewJob,
}: {
  onSearch: (q: string) => void;
  onLoginClick: () => void;
  onBrowseAll: () => void;
  onViewJob: () => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div>
      {/* Hero — the AI match ring is the page's signature element, reused
          at a large scale so the same motif that drives every job card
          also anchors the very first thing a visitor sees. */}
      <section
        style={{
          position: "relative",
          padding: "64px 40px 56px",
          borderBottom: `1px solid ${LINE}`,
          overflow: "hidden",
          background: `radial-gradient(90% 120% at 82% 8%, rgba(12,242,242,0.09), transparent 55%),
                       radial-gradient(70% 90% at 6% 100%, rgba(217,184,85,0.06), transparent 60%)`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr",
            gap: 40,
            alignItems: "center",
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div>
            <Pill tone="teal">
              <Sparkles size={11} style={{ marginRight: 5, verticalAlign: -2 }} />
              AI-powered job recommendations
            </Pill>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: TXT,
                margin: "16px 0 10px",
                maxWidth: 560,
              }}
            >
              Find your dream job, <span style={{ color: CYAN }}>matched by AI</span>
            </h1>
            <p style={{ color: TXTDIM, fontSize: 15, maxWidth: 480, margin: 0 }}>
              15,000+ active roles across 5,000+ companies, ranked by fit before you ever
              write a cover letter.
            </p>

            {/* Search */}
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                onSearch(query);
              }}
              style={{ marginTop: 26, maxWidth: 560 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: PANEL,
                  border: `1px solid ${LINE}`,
                  borderRadius: 12,
                  padding: "6px 6px 6px 16px",
                }}
              >
                <Search size={16} color={TXTDIM} style={{ flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Search jobs, skills, or companies"
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: TXT,
                    fontSize: 13.5,
                    width: "100%",
                    padding: "8px 0",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    flexShrink: 0,
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: `linear-gradient(135deg, ${CYAN}, ${TEAL})`,
                    color: INK,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Search
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, color: TXTDIM }}>Popular:</span>
                {POPULAR_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setQuery(t);
                      onSearch(t);
                    }}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: "4px 11px",
                      borderRadius: 999,
                      border: `1px solid ${LINE}`,
                      background: "transparent",
                      color: TXTDIM,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Signature match-ring visual */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 220, height: 220 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `radial-gradient(closest-side, rgba(12,242,242,0.14), transparent 72%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MatchRing value={95} size={160} stroke={10} />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: TXTDIM,
                  whiteSpace: "nowrap",
                }}
              >
                average candidate match
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured companies */}
      <section style={{ padding: "28px 40px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TXTDIM,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            Featured companies hiring now
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {FEATURED_COMPANIES.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 14px",
                  borderRadius: 9,
                  border: `1px solid ${LINE}`,
                  color: TXT,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                <Building2 size={13} color={TXTDIM} />
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended jobs teaser */}
      <section style={{ padding: "40px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 18,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: TXT, margin: 0 }}>
              Recommended for you
            </h2>
            <button
              onClick={onBrowseAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "none",
                border: "none",
                color: CYAN,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse all jobs <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {TEASER_JOBS.map((job) => (
              <div
                key={job.id}
                style={{
                  background: PANEL,
                  border: `1px solid ${LINE}`,
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: PANEL2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={15} color={TXTDIM} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TXT }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: TXTDIM }}>{job.company}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, fontSize: 12, color: TXTDIM, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} /> {job.location}
                  </span>
                  {job.remote && <Pill tone="steel">Remote</Pill>}
                </div>

                <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
                  {job.gate === "open" && (
                    <>
                      <div style={{ color: GOLD, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                        {job.salary}
                      </div>
                      <button
                        onClick={onViewJob}
                        style={{
                          width: "100%",
                          padding: "9px 0",
                          borderRadius: 8,
                          border: "none",
                          background: `linear-gradient(135deg, ${CYAN}, ${TEAL})`,
                          color: INK,
                          fontWeight: 800,
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        View details
                      </button>
                    </>
                  )}

                  {job.gate === "match-locked" && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <MatchRing value={job.match ?? 0} size={30} stroke={3} color={GOLD} />
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: GOLD }}>
                          {job.match}% match available
                        </span>
                      </div>
                      <button
                        onClick={onLoginClick}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "9px 0",
                          borderRadius: 8,
                          border: `1px solid ${LINE}`,
                          background: "transparent",
                          color: TXTDIM,
                          fontWeight: 700,
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        <Lock size={12} /> Log in to view
                      </button>
                    </>
                  )}

                  {job.gate === "signup-locked" && (
                    <>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: TXTDIM,
                          marginBottom: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Lock size={12} /> Salary hidden until sign up
                      </div>
                      <button
                        onClick={onLoginClick}
                        style={{
                          width: "100%",
                          padding: "9px 0",
                          borderRadius: 8,
                          border: `1px solid ${GOLD}`,
                          background: "rgba(217,184,85,0.1)",
                          color: GOLD,
                          fontWeight: 800,
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        Apply after sign up
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TalentFlow AI */}
      <section style={{ padding: "40px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: TXT, margin: "0 0 18px" }}>
            Why TalentFlow AI?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {WHY_FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 18px",
                  borderRadius: 12,
                  background: PANEL,
                  border: `1px solid ${LINE}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "rgba(12,242,242,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} color={CYAN} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: TXT }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success statistics */}
      <section
        style={{
          padding: "40px",
          borderBottom: `1px solid ${LINE}`,
          background: PANEL,
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: CYAN, letterSpacing: "-0.02em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12.5, color: TXTDIM, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI features preview */}
      <section style={{ padding: "40px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: TXT, margin: "0 0 18px" }}>
            See your AI profile before you apply
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 14 }}>
            <Card style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11.5, color: TXTDIM, marginBottom: 10 }}>Resume score</div>
              <MatchRing value={92} size={72} stroke={6} color={TEAL} />
            </Card>
            <Card style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11.5, color: TXTDIM, marginBottom: 10 }}>Top job match</div>
              <MatchRing value={95} size={72} stroke={6} color={CYAN} />
            </Card>
            <Card style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: 11.5, color: TXTDIM, marginBottom: 10 }}>Missing skills</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", filter: "blur(3px)", opacity: 0.6 }}>
                {["Docker", "AWS", "Kubernetes"].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 11,
                      color: GOLD,
                      border: `1px solid ${GOLD}55`,
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "rgba(33,43,51,0.55)",
                }}
              >
                <Lock size={13} color={TXT} />
                <span style={{ fontSize: 12, fontWeight: 700, color: TXT }}>Log in to unlock</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "44px 40px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Quote size={22} color={GOLD} style={{ marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 14 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} color={GOLD} fill={GOLD} />
            ))}
          </div>
          <p
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: TXT,
              lineHeight: 1.4,
              margin: "0 0 14px",
            }}
          >
            “{TESTIMONIAL.quote}”
          </p>
          <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{TESTIMONIAL.name}</div>
          <div style={{ fontSize: 12, color: TXTDIM }}>{TESTIMONIAL.role}</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "28px 40px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <Logo />
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {["About", "Contact", "Privacy", "Terms"].map((l) => (
              <span key={l} style={{ fontSize: 12.5, color: TXTDIM, cursor: "pointer" }}>
                {l}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 11.5, color: TXTDIM }}>© 2026 TalentFlow AI</span>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- GUEST VIEW ---------------- */
function GuestView({
  onLoginClick,
  onRegisterClick,
  decisions,
  setDecision,
  saved,
  toggleSave,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  decisions: Decisions;
  setDecision: (id: number, val: Decision) => void;
  saved: SavedMap;
  toggleSave: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleFilter = (f: string) =>
    setActiveFilters((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]));

  const filtered = useMemo(
    () =>
      JOBS.filter((j) => {
        const text = (j.title + j.dept + j.location + j.level).toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesFilters =
          activeFilters.length === 0 || activeFilters.some((f) => text.includes(f.toLowerCase()));
        return matchesQuery && matchesFilters;
      }),
    [query, activeFilters]
  );

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: "44px 40px 32px",
          borderBottom: `1px solid ${LINE}`,
          background: `radial-gradient(120% 140% at 10% 0%, rgba(12,242,242,0.06), transparent 55%)`,
        }}
      >
        <Pill tone="teal">
          <Sparkles size={11} style={{ marginRight: 5, verticalAlign: -2 }} />
          AI-matched openings, ranked for you
        </Pill>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: TXT,
            margin: "14px 0 8px",
            maxWidth: 620,
          }}
        >
          Open vacancies at TalentFlow partner companies
        </h1>
        <p style={{ color: TXTDIM, fontSize: 14.5, maxWidth: 540, margin: 0 }}>
          Salary and equity shown upfront, no cover letters required. Register to unlock your
          match score, message hiring teams directly, and track every application in one place.
        </p>

        <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={onRegisterClick}
            style={{
              padding: "11px 20px",
              borderRadius: 10,
              border: "none",
              background: `linear-gradient(135deg, ${CYAN}, ${TEAL})`,
              color: INK,
              fontWeight: 800,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Create free account
          </button>
          <button
            onClick={onLoginClick}
            style={{
              padding: "11px 20px",
              borderRadius: 10,
              border: `1px solid ${LINE}`,
              background: "transparent",
              color: TXT,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            I already have an account
          </button>
        </div>

        {/* Search + smart filters (SeekOut-style) */}
        <div style={{ marginTop: 24, maxWidth: 620 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: PANEL,
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            <Search size={15} color={TXTDIM} />
            <input
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search role, department, or try “remote senior”"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: TXT,
                fontSize: 13.5,
                width: "100%",
              }}
            />
          </div>
          <div
            style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}
          >
            <SlidersHorizontal size={13} color={TXTDIM} />
            {FILTERS.map((f) => {
              const on = activeFilters.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: "5px 11px",
                    borderRadius: 999,
                    border: `1px solid ${on ? CYAN : LINE}`,
                    background: on ? "rgba(12,242,242,0.12)" : "transparent",
                    color: on ? CYAN : TXTDIM,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job list */}
      <section style={{ padding: "26px 40px 48px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, color: TXT, margin: 0 }}>
            {filtered.length} open position{filtered.length !== 1 ? "s" : ""}
          </h2>
          <span style={{ fontSize: 12, color: TXTDIM }}>Updated today</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((job) => {
            const decision = decisions[job.id];
            const isSaved = !!saved[job.id];
            const isOpen = expanded === job.id;
            return (
              <div
                key={job.id}
                style={{
                  background: PANEL,
                  border: `1px solid ${LINE}`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  opacity: decision === "ignored" ? 0.45 : 1,
                  transition: "opacity .2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : job.id)}
                    title="Why this match"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <MatchRing value={job.match} />
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 15.5, color: TXT }}>{job.title}</span>
                      <Pill tone="steel">{job.company}</Pill>
                      {decision === "applied" && <Pill tone="teal">Applied</Pill>}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 6,
                        color: TXTDIM,
                        fontSize: 12.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={12.5} /> {job.location}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={12.5} /> Posted {job.posted}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, color: GOLD }}>
                        <DollarSign size={12.5} /> {job.salary}
                        {job.equity !== "—" && <span style={{ color: TXTDIM }}>· {job.equity} equity</span>}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                    <button
                      onClick={() => toggleSave(job.id)}
                      title="Save role"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        border: `1px solid ${isSaved ? GOLD : LINE}`,
                        background: "transparent",
                        color: isSaved ? GOLD : TXTDIM,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Star size={15} fill={isSaved ? GOLD : "none"} />
                    </button>
                    <button
                      onClick={() => setDecision(job.id, "ignored")}
                      title="Ignore"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        border: `1px solid ${LINE}`,
                        background: "transparent",
                        color: TXTDIM,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={onRegisterClick}
                      title="Register to apply"
                      style={{
                        height: 36,
                        padding: "0 16px",
                        borderRadius: 9,
                        border: "none",
                        background:
                          decision === "applied"
                            ? "rgba(44,191,191,0.15)"
                            : `linear-gradient(135deg, ${CYAN}, ${TEAL})`,
                        color: decision === "applied" ? TEAL : INK,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {decision === "applied" ? (
                        <>
                          <Check size={14} /> Applied
                        </>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  <ChevronDown
                    size={16}
                    color={TXTDIM}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform .15s ease",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                    onClick={() => setExpanded(isOpen ? null : job.id)}
                  />
                </div>

                {isOpen && (
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: `1px solid ${LINE}`,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: CYAN,
                          marginBottom: 8,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Why {job.match}% match
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {job.skills.map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: 11,
                              color: job.matched.includes(s) ? TEAL : TXTDIM,
                              border: `1px solid ${job.matched.includes(s) ? TEAL : LINE}`,
                              borderRadius: 6,
                              padding: "2px 8px",
                              background: job.matched.includes(s) ? "rgba(44,191,191,0.1)" : "transparent",
                            }}
                          >
                            {job.matched.includes(s) ? "✓ " : ""}
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={onRegisterClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        height: 32,
                        padding: "0 14px",
                        borderRadius: 8,
                        border: `1px solid ${LINE}`,
                        background: "transparent",
                        color: TXTDIM,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        alignSelf: "flex-start",
                      }}
                    >
                      <MessageCircle size={13} /> Message hiring team
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Pipeline funnel (SeekOut-style stage counts) --- */
function PipelineFunnel({ appliedCount }: { appliedCount: number }) {
  const counts = PIPELINE_STAGES.map((s, i) =>
    i === 0 ? appliedCount : Math.min(appliedCount, appliedCount ? s.extra + 1 : 0)
  );
  // Keep it monotonically non-increasing so the funnel always reads
  // left-to-right as a narrowing pipeline, even with the demo counts.
  for (let i = 1; i < counts.length; i++) {
    counts[i] = Math.min(counts[i], counts[i - 1]);
  }
  const max = Math.max(1, counts[0]);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TXT, margin: 0 }}>Your pipeline</h3>
        <span style={{ fontSize: 11.5, color: TXTDIM }}>by stage</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {PIPELINE_STAGES.map((s, i) => {
          const count = counts[i];
          const heightPct = Math.max(10, (count / max) * 100);
          const colors = [STEEL, TEAL, CYAN, GOLD];
          return (
            <div key={s.key} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 64, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 46,
                    height: `${heightPct}%`,
                    borderRadius: "6px 6px 3px 3px",
                    background: count > 0 ? colors[i] : LINE,
                    opacity: count > 0 ? 1 : 0.4,
                    transition: "height .4s ease",
                  }}
                />
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TXT, marginTop: 8 }}>{count}</div>
              <div style={{ fontSize: 10.5, color: TXTDIM, marginTop: 2 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---------------- Upcoming interviews panel ---------------- */
function UpcomingInterviews() {
  return (
    <Card>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}
      >
        <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TXT, margin: 0 }}>Upcoming interviews</h3>
        <CalendarClock size={15} color={TXTDIM} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {INTERVIEWS.map((iv) => (
          <div
            key={iv.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              background: PANEL2,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                background: "rgba(12,242,242,0.1)",
                border: `1px solid ${CYAN}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 800,
                color: CYAN,
                flexShrink: 0,
              }}
            >
              {iv.daysAway}d
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: TXT }}>
                {iv.company} — {iv.role}
              </div>
              <div style={{ fontSize: 11.5, color: TXTDIM }}>{iv.when}</div>
            </div>
            <Pill tone={iv.stage === "Final round" ? "gold" : "teal"}>{iv.stage}</Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Skill match + skill-gap panel ---------------- */
function SkillMatchPanel({ topJob }: { topJob: Job | undefined }) {
  const owned: [string, number][] = [
    ["Python", 92],
    ["Data Structures", 81],
    ["React", 70],
  ];
  const missing = topJob ? topJob.skills.filter((s) => !topJob.matched.includes(s)) : [];

  return (
    <Card>
      <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TXT, margin: "0 0 12px" }}>
        Top matched skill
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {owned.map(([s, pct], i) => (
          <div key={s}>
            <div
              style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: TXTDIM, marginBottom: 4 }}
            >
              <span>{s}</span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: LINE, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: i === 0 ? CYAN : i === 1 ? TEAL : GOLD,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {missing.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, marginBottom: 8 }}>
            <TrendingUp size={13} color={GOLD} />
            <span style={{ fontSize: 12, fontWeight: 700, color: TXT }}>
              To reach {topJob?.match}% on {topJob?.title}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {missing.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  color: GOLD,
                  border: `1px solid ${GOLD}55`,
                  borderRadius: 6,
                  padding: "2px 8px",
                  background: "rgba(217,184,85,0.1)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

/* ---------------- SIGNED-IN VIEW ---------------- */
function CandidateView({
  user,
  decisions,
  setDecision,
}: {
  user: CurrentUser;
  decisions: Decisions;
  setDecision: (id: number, val: Decision) => void;
}) {
  const applied = JOBS.filter((j) => decisions[j.id] === "applied");
  const maxV = Math.max(...ANALYTICS.map((a) => a.v));
  const topOpenJob = JOBS.filter(
    (j) => decisions[j.id] !== "applied" && decisions[j.id] !== "ignored"
  ).sort((a, b) => b.match - a.match)[0];

  const navItems: { icon: LucideIcon; label: string; active?: boolean }[] = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: User, label: "Profile" },
    { icon: Users, label: "Candidates" },
    { icon: FileText, label: "Applications" },
    { icon: CalendarClock, label: "Interviews" },
    { icon: Gauge, label: "AI Analytics" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          borderRight: `1px solid ${LINE}`,
          padding: "24px 14px",
          flexShrink: 0,
          minHeight: 640,
        }}
      >
        {navItems.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 9,
              marginBottom: 4,
              color: active ? TXT : TXTDIM,
              background: active ? PANEL2 : "transparent",
              borderLeft: active ? `2px solid ${CYAN}` : "2px solid transparent",
              fontSize: 13.5,
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
            }}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: TXT, margin: 0 }}>
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p style={{ color: TXTDIM, fontSize: 13, margin: "4px 0 0" }}>
              Here's how your job search is tracking this week.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          {[
            { label: "Applications sent", value: String(applied.length), tone: TEAL },
            {
              label: "Avg. match score",
              value: applied.length
                ? Math.round(applied.reduce((a, b) => a + b.match, 0) / applied.length) + "%"
                : "—",
              tone: CYAN,
            },
            { label: "Interviews booked", value: String(INTERVIEWS.length), tone: GOLD },
            { label: "Profile strength", value: "82%", tone: STEEL },
          ].map((s) => (
            <div
              key={s.label}
              style={{ background: PANEL, border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px" }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: s.tone }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: TXTDIM, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          {/* Left: profile + applications */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <Card style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${STEEL}, ${TEAL})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: INK,
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: TXT, fontSize: 15 }}>{user.name}</div>
                <div style={{ color: TXTDIM, fontSize: 12.5 }}>{user.email}</div>
              </div>
              <FileText size={17} color={TXTDIM} />
            </Card>

            <PipelineFunnel appliedCount={applied.length} />

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TXT, margin: 0 }}>Your applications</h3>
                <span style={{ fontSize: 12, color: TXTDIM }}>{applied.length} active</span>
              </div>

              {applied.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: TXTDIM, fontSize: 13 }}>
                  No applications yet — apply to a role from Vacancies to see it tracked here.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {applied.map((job) => (
                    <div
                      key={job.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: PANEL2,
                      }}
                    >
                      <MatchRing value={job.match} size={34} stroke={3} color={TEAL} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: TXT }}>{job.title}</div>
                        <div style={{ fontSize: 11.5, color: TXTDIM }}>{job.dept}</div>
                      </div>
                      <Pill tone="teal">Under review</Pill>
                      <ChevronRight size={15} color={TXTDIM} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Vacancy list, still actionable */}
            <Card>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TXT, margin: "0 0 12px" }}>
                Recommended vacancies
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {JOBS.filter((j) => decisions[j.id] !== "ignored").map((job) => {
                  const decision = decisions[job.id];
                  return (
                    <div
                      key={job.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1px solid ${LINE}`,
                        opacity: decision ? 0.55 : 1,
                      }}
                    >
                      <MatchRing value={job.match} size={34} stroke={3} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: TXT }}>{job.title}</div>
                        <div style={{ fontSize: 11.5, color: TXTDIM }}>{job.location}</div>
                      </div>
                      <button
                        onClick={() => setDecision(job.id, "ignored")}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: `1px solid ${LINE}`,
                          background: "transparent",
                          color: TXTDIM,
                          cursor: "pointer",
                        }}
                      >
                        <X size={13} />
                      </button>
                      <button
                        onClick={() => setDecision(job.id, "applied")}
                        style={{
                          padding: "0 12px",
                          height: 28,
                          borderRadius: 7,
                          border: "none",
                          background:
                            decision === "applied"
                              ? "rgba(44,191,191,0.15)"
                              : `linear-gradient(135deg, ${CYAN}, ${TEAL})`,
                          color: decision === "applied" ? TEAL : INK,
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {decision === "applied" ? "Applied" : "Apply"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right: analytics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <Card>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TXT, margin: "0 0 14px" }}>
                Activity this week
              </h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                {ANALYTICS.map((a) => (
                  <div key={a.label} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        height: `${(a.v / maxV) * 76}px`,
                        borderRadius: "5px 5px 2px 2px",
                        background: `linear-gradient(180deg, ${CYAN}, ${STEEL})`,
                      }}
                    />
                    <div style={{ fontSize: 10, color: TXTDIM, marginTop: 6 }}>{a.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <UpcomingInterviews />

            <SkillMatchPanel topJob={topOpenJob} />
          </div>
        </div>
      </main>
    </div>
  );
}


/* ---------------- ROOT ---------------- */
export default function TalentFlowDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(
  localStorage.getItem("isLoggedIn")
    ? {
        name: "User",
        email: "user@gmail.com",
      }
    : null
);
  const [decisions, setDecisions] = useState<Decisions>({});
  const [saved, setSaved] = useState<SavedMap>({});
  const [screen, setScreen] = useState<"landing" | "jobs">("landing");

 const setDecision = (id: number, val: Decision) => {
  if (!user) {
    navigate("/login");
    return;
  }
    setDecisions((d) => ({ ...d, [id]: val }));
  };

  const toggleSave = (id: number) => {
  if (!user) {
    navigate("/login");
    return;
  }
    setSaved((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: INK,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 32px",
          borderBottom: `1px solid ${LINE}`,
          position: "sticky",
          top: 0,
          background: INK,
          zIndex: 10,
        }}
      >
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {!user && (
            <nav style={{ display: "flex", gap: 18 }}>
              <span
                onClick={() => setScreen("landing")}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: screen === "landing" ? TXT : TXTDIM,
                  cursor: "pointer",
                }}
              >
                Home
              </span>
              <span
                onClick={() => setScreen("jobs")}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: screen === "jobs" ? TXT : TXTDIM,
                  cursor: "pointer",
                }}
              >
                Jobs
              </span>
            </nav>
          )}
          {user && (
            <>
              <Bell size={17} color={TXTDIM} />
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${STEEL}, ${TEAL})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: INK,
                }}
              >
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
            </>
          )}
          {user ? (
            <button
              onClick={() => setUser(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 9,
                border: `1px solid ${LINE}`,
                background: "transparent",
                color: TXTDIM,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <LogOut size={14} /> Log out
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "9px 18px",
                borderRadius: 9,
                border: "none",
                background: `linear-gradient(135deg, ${CYAN}, ${STEEL})`,
                color: INK,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Log in
            </button>
          )}
        </div>
      </header>

      {user ? (
        <CandidateView user={user} decisions={decisions} setDecision={setDecision} />
      ) : screen === "landing" ? (
        <LandingPage
          onSearch={() => setScreen("jobs")}
          onLoginClick={() => navigate("/login")}
          onBrowseAll={() => setScreen("jobs")}
          onViewJob={() => setScreen("jobs")}
        />
      ) : (
        <GuestView
          onLoginClick={() => navigate("/login")}
          onRegisterClick={() => navigate("/register")}
          decisions={decisions}
          setDecision={setDecision}
          saved={saved}
          toggleSave={toggleSave}
        />
      )}

    
    </div>
  );
}
