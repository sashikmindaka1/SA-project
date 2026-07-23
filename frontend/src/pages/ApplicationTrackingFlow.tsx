import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Star,
  Briefcase,
  RefreshCw,
  Sparkles,
  Filter,
  ChevronRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import SideNav from "../components/common/SideNav";

// ---------------------------------------------------------------------------
// Design tokens — Ultra-dark cinematic luxury theme
// ---------------------------------------------------------------------------
const C = {
  bg: "#080c10",
  panel: "#0d1318",
  panelAlt: "#121922",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#FFFFFF",
  textDim: "#5c7086",
  teal: "#22d9d9",
  blue: "#27668C",
  gold: "#D9B855",
  red: "#E0665A",
} as const;

const API_BASE_URL = "http://localhost:5016";

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
  appliedOn: string;
  status: ApplicationStatus;
  skills: string[];
  note: string;
}

interface StatusMeta {
  color: string;
  icon: LucideIcon;
}

const STAGES: ApplicationStatus[] = ["Applied", "Shortlisted", "Interview", "Offer"];

const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  Applied: { color: "#3a86ff", icon: Clock },
  Shortlisted: { color: C.teal, icon: Star },
  Interview: { color: "#00f5d4", icon: CalendarIcon },
  Offer: { color: C.gold, icon: CheckCircle2 },
  Rejected: { color: C.red, icon: XCircle },
};

function Badge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status] || STATUS_META.Applied;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide shadow-sm"
      style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}40` }}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function StatCard({ label, value, color, icon: Icon, subtext }: { label: string; value: number; color: string; icon: LucideIcon; subtext?: string }) {
  return (
    <div 
      className="rounded-2xl p-6 flex-1 min-w-[220px] shadow-2xl relative overflow-hidden transition-all group" 
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <div className="absolute -right-3 -bottom-3 opacity-[0.04] transition-transform group-hover:scale-110 pointer-events-none">
        <Icon size={96} style={{ color }} />
      </div>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>{label}</span>
        <div className="p-2.5 rounded-xl shadow-inner" style={{ background: `${color}15`, color }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-extrabold tracking-tight mb-1 relative z-10" style={{ color }}>{value}</div>
      {subtext && <div className="text-[11px] relative z-10" style={{ color: C.textDim }}>{subtext}</div>}
    </div>
  );
}

function Stepper({ status }: { status: ApplicationStatus }) {
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-xl shadow-inner" style={{ background: `${C.red}15`, color: STATUS_META.Rejected.color, border: `1px solid ${C.red}33` }}>
        <XCircle size={16} /> Application closed — Candidate not selected for this vacancy.
      </div>
    );
  }
  const currentIdx = STAGES.indexOf(status);
  return (
    <div className="flex items-center w-full my-3">
      {STAGES.map((stage, i) => {
        const done = i <= currentIdx;
        const isCurrent = i === currentIdx;
        const isLast = i === STAGES.length - 1;
        return (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center gap-2" style={{ minWidth: 70 }}>
              <div
                className="h-4 w-4 rounded-full flex items-center justify-center transition-all shadow-md"
                style={{
                  background: done ? C.teal : "transparent",
                  border: `2px solid ${done ? C.teal : C.borderStrong}`,
                  boxShadow: isCurrent ? `0 0 12px ${C.teal}66` : "none",
                }}
              >
                {done && <div className="h-1.5 w-1.5 rounded-full bg-[#08101b]" />}
              </div>
              <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: done ? C.text : C.textDim }}>
                {stage}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-1 mx-2 rounded-full transition-all shadow-inner" style={{ background: i < currentIdx ? C.teal : C.border }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function ApplicationTrackingnew() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Dynamic Profile Header State
  const [userProfile, setUserProfile] = useState({
    fullName: "Candidate User",
    title: "CANDIDATE",
  });

  // Load User Profile dynamically from LocalStorage or Backend API
  useEffect(() => {
    const loadUserProfile = async () => {
      const possibleKeys = ["candidate_profile_draft", "userProfile", "user"];
      
      for (const key of possibleKeys) {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            const foundName = parsed.fullName || parsed.name || parsed.userName;
            const foundTitle = parsed.title || parsed.jobTitle || parsed.role;

            if (foundName) {
              setUserProfile({
                fullName: foundName,
                title: (foundTitle || "CANDIDATE").toUpperCase(),
              });
              return;
            }
          } catch (e) {
            console.error(`Error reading key ${key} from LocalStorage`, e);
          }
        }
      }

      // Fallback API Fetch
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/CandidateProfile`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setUserProfile({
            fullName: response.data[0].fullName || "Candidate User",
            title: (response.data[0].title || "CANDIDATE").toUpperCase(),
          });
        }
      } catch (err) {
        console.error("Failed to load user profile from API", err);
      }
    };

    loadUserProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "CU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const fetchApplications = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/Applications`)
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching live applications:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const counts = useMemo(() => {
    const c = { total: applications.length, active: 0, offers: 0, rejected: 0 };
    applications.forEach((a) => {
      if (a.status === "Offer") c.offers++;
      else if (a.status === "Rejected") c.rejected++;
      else c.active++;
    });
    return c;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const roleTitle = app.role || (app as any).jobTitle || "";
      const matchesSearch = roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const avgMatchScore = useMemo(() => {
    if (applications.length === 0) return 0;
    const total = applications.reduce((acc, curr) => acc + (curr.matchScore || 85), 0);
    return Math.round(total / applications.length);
  }, [applications]);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      
      {/* Top Header */}
      <nav className="w-full px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg flex justify-between items-center" style={{ borderColor: C.border, background: `${C.bg}EE` }}>
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg shrink-0" style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}>
            TF
          </div>
          <span className="font-extrabold tracking-tight text-lg flex items-center hidden sm:block" style={{ color: C.text }}>
            Talent<span style={{ color: C.teal }}>Flow</span> AI
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, pipeline stages, or IDs..."
            className="w-full bg-[#121922] border border-[rgba(255,255,255,0.06)] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#5c7086] outline-none focus:border-[#22d9d9]/50 transition-all shadow-inner"
          />
          <div className="absolute left-3.5 top-3 text-[#5c7086]">
            <Filter size={16} />
          </div>
        </div>

        {/* Actions & Dynamic Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={fetchApplications}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95 shadow-md shrink-0"
            style={{ background: C.panelAlt, border: `1px solid ${C.borderStrong}`, color: C.teal }}
            title="Sync Database"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Sync Live Data</span>
          </button>
          
          <div className="relative p-2.5 rounded-xl shadow-inner shrink-0 cursor-pointer transition-all hover:bg-white/5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <Bell size={18} style={{ color: C.textDim }} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full shadow-[0_0_8px_#22d9d9]" style={{ background: C.teal }}></span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l shrink-0" style={{ borderColor: C.border }}>
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md" style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}>
              {getInitials(userProfile.fullName)}
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>{userProfile.fullName}</div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5 uppercase" style={{ color: C.teal }}>{userProfile.title}</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <SideNav />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-10 py-10">
          <div className="max-w-6xl w-full mx-auto">
            
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: C.text }}>My Applications</h1>
                <p className="text-sm mt-1.5" style={{ color: C.textDim }}>
                  Track the status of every role you've applied to, in real time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.teal }}>
                  <TrendingUp size={14} /> Avg AI Match: {avgMatchScore}%
                </span>
              </div>
            </div>

            {/* 4 Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard label="TOTAL APPLICATIONS" value={counts.total} color={C.teal} icon={Briefcase} subtext="Lifetime submissions" />
              <StatCard label="IN PROGRESS" value={counts.active} color="#3a86ff" icon={Clock} subtext="Active pipelines" />
              <StatCard label="OFFERS EXTENDED" value={counts.offers} color={C.gold} icon={CheckCircle2} subtext="Action required" />
              <StatCard label="CLOSED / REJECTED" value={counts.rejected} color={C.red} icon={XCircle} subtext="Archived roles" />
            </div>

            {/* Active Career Pipeline Section */}
            <div className="rounded-2xl p-6 shadow-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b flex-wrap gap-4" style={{ borderColor: C.border }}>
                <div>
                  <h2 className="text-lg font-bold tracking-wide" style={{ color: C.text }}>Active Career Pipeline</h2>
                  <p className="text-xs mt-0.5" style={{ color: C.textDim }}>Real-time synchronization with Neon PostgreSQL database</p>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 bg-[#080c10] p-1.5 rounded-xl border" style={{ borderColor: C.border }}>
                  {["All", "Applied", "Shortlisted", "Interview", "Offer", "Rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: statusFilter === status ? C.panelAlt : "transparent",
                        color: statusFilter === status ? C.teal : C.textDim,
                        border: statusFilter === status ? `1px solid ${C.borderStrong}` : "1px solid transparent",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-20 rounded-2xl shadow-inner flex flex-col items-center justify-center gap-3 border border-dashed" style={{ background: C.panelAlt, borderColor: C.border }}>
                    <Sparkles size={40} style={{ color: C.teal, opacity: 0.6 }} />
                    <div className="text-sm font-bold" style={{ color: C.text }}>No matching applications found in the database.</div>
                    <p className="text-xs max-w-sm leading-relaxed" style={{ color: C.textDim }}>
                      Try adjusting your search query or filter criteria, or submit a new application to populate your pipeline.
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((app) => {
                    const appId = app.id || (app as any).applicationId;
                    const roleTitle = app.role || (app as any).jobTitle || "Position";
                    const appliedDate = app.appliedOn || (app as any).date || new Date().toISOString();
                    const noteText = app.note || (app as any).comments || "Application actively under review by hiring committee.";
                    const skillsList = app.skills || [];

                    return (
                      <div 
                        key={appId} 
                        className="rounded-2xl p-6 shadow-xl transition-all hover:border-[#22d9d9]/40 group" 
                        style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-xl shadow-inner transition-transform group-hover:scale-105" style={{ background: `${C.teal}15`, color: C.teal }}>
                                <Briefcase size={20} />
                              </div>
                              <div>
                                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: C.text }}>
                                  {roleTitle}
                                  <ChevronRight size={16} className="text-[#5c7086] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h3>
                                <div className="text-xs mt-1 flex items-center gap-2.5" style={{ color: C.textDim }}>
                                  <span>Applied on {new Date(appliedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                                  <span>•</span>
                                  <span className="font-mono">{appId}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge status={app.status || "Applied"} />
                        </div>

                        <div className="mt-6 p-4 rounded-xl shadow-inner" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                          <Stepper status={app.status || "Applied"} />
                        </div>

                        {skillsList.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {skillsList.map((s) => (
                              <span
                                key={s}
                                className="text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm"
                                style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}35` }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-5 pt-4 border-t text-xs flex items-center justify-between flex-wrap gap-2" style={{ borderColor: C.border, color: C.textDim }}>
                          <span className="italic">{noteText}</span>
                          <span className="font-bold px-3 py-1.5 rounded-xl shadow-inner" style={{ background: `${C.teal}10`, color: C.teal, border: `1px solid ${C.teal}30` }}>
                            AI Match Score: {app.matchScore || 85}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}