import React, { useState } from "react";
import TopBar from "../components/common/TopBar";
import SideNav from "../components/common/SideNav";
import { COLORS } from "../constants/theme";
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  Mail,
  MapPin,
  Briefcase,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Phone,
  UserCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Candidate Interface
interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  location: string;
  skills: string[];
  status: "Screening" | "Interviewing" | "Offered" | "Rejected";
  email: string;
  phone: string;
  matchScore: number;
  appliedDate: string;
  summary: string;
}

// Mock Data
const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Sashik Mindaka",
    role: "Full Stack Engineer",
    experience: "2 Years",
    location: "Colombo, LK",
    skills: ["React", "Spring Boot", "C#", "PostgreSQL"],
    status: "Interviewing",
    email: "sashik@example.com",
    phone: "+94 77 123 4567",
    matchScore: 95,
    appliedDate: "2026-07-20",
    summary:
      "Passionate developer focused on full-stack web platforms and high-performance system architectures.",
  },
  {
    id: "2",
    name: "Kamal Perera",
    role: "Frontend Engineer",
    experience: "3 Years",
    location: "Kandy, LK",
    skills: ["React", "TypeScript", "Tailwind", "Redux"],
    status: "Screening",
    email: "kamal@example.com",
    phone: "+94 71 987 6543",
    matchScore: 84,
    appliedDate: "2026-07-21",
    summary: "Specialized in responsive web interfaces, design systems, and micro-frontend architecture.",
  },
  {
    id: "3",
    name: "Nimali Silva",
    role: "Backend Specialist",
    experience: "1.5 Years",
    location: "Remote",
    skills: ["Java", "Spring Boot", "Docker", "AWS"],
    status: "Offered",
    email: "nimali@example.com",
    phone: "+94 75 456 7890",
    matchScore: 91,
    appliedDate: "2026-07-18",
    summary: "Backend specialist experienced in microservices, cloud deployments, and REST API design.",
  },
];

export default function NewCandidatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Filter Logic
  const filteredCandidates = SAMPLE_CANDIDATES.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "All" || candidate.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: Candidate["status"]) => {
    const styles = {
      Interviewing: "bg-[#0CF2F2]/10 text-[#0CF2F2] border-[#0CF2F2]/30",
      Offered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Screening: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    };
    return (
      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <TopBar userName="Recruiter Portal" userInitials="RP" />

      <div className="flex flex-1 relative overflow-x-hidden">
        <SideNav activeItem={"Candidates" as any} userRole="EMPLOYER" />
        <main className="flex-1 p-6 text-white overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Candidates Directory</h1>
                <p className="text-sm text-[#8A9199] mt-0.5">
                  Manage applicant profiles, check AI match scores, and organize hiring pipelines.
                </p>
              </div>
            </div>

            {/* Stats Metrics Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatWidget title="Total Applicants" count={SAMPLE_CANDIDATES.length} icon={<UserCheck size={18} className="text-[#0CF2F2]" />} />
              <StatWidget title="In Screening" count={SAMPLE_CANDIDATES.filter(c => c.status === "Screening").length} icon={<Clock size={18} className="text-amber-400" />} />
              <StatWidget title="Interview Scheduled" count={SAMPLE_CANDIDATES.filter(c => c.status === "Interviewing").length} icon={<Sparkles size={18} className="text-[#0CF2F2]" />} />
              <StatWidget title="Offers Extended" count={SAMPLE_CANDIDATES.filter(c => c.status === "Offered").length} icon={<CheckCircle2 size={18} className="text-emerald-400" />} />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#20272D] p-3 rounded-xl border border-white/10">
              
              {/* Status Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {["All", "Screening", "Interviewing", "Offered", "Rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      activeTab === tab
                        ? "bg-[#0CF2F2]/10 text-[#0CF2F2] border border-[#0CF2F2]/30"
                        : "text-[#8A9199] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search & Layout Switcher */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C636B]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search candidate or skill..."
                    className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                  />
                </div>

                <div className="flex items-center bg-[#1A2126] border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#0CF2F2]/20 text-[#0CF2F2]" : "text-[#8A9199]"}`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#0CF2F2]/20 text-[#0CF2F2]" : "text-[#8A9199]"}`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content View */}
            {viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map((c) => (
                  <div
                    key={c.id}
                    className="group rounded-xl border border-white/10 bg-[#20272D] p-5 flex flex-col justify-between hover:border-[#0CF2F2]/40 transition-all cursor-pointer relative"
                    onClick={() => setSelectedCandidate(c)}
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-semibold text-[#0CF2F2] bg-[#0CF2F2]/10 px-2 py-0.5 rounded-full border border-[#0CF2F2]/20">
                      <Sparkles size={12} /> {c.matchScore}% Match
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#0CF2F2]/20 to-[#27668C]/30 border border-[#0CF2F2]/40 flex items-center justify-center font-bold text-[#0CF2F2] text-sm">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-[#0CF2F2] transition-colors">{c.name}</h3>
                          <p className="text-xs text-[#8A9199]">{c.role}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5 text-xs text-[#B4BAC1]">
                        <div className="flex items-center gap-2"><Briefcase size={13} className="text-[#5C636B]" /> {c.experience}</div>
                        <div className="flex items-center gap-2"><MapPin size={13} className="text-[#5C636B]" /> {c.location}</div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {c.skills.map((s) => (
                          <span key={s} className="rounded-md bg-[#27668C]/20 border border-[#27668C]/40 px-2 py-0.5 text-[10px] font-medium text-[#6FB4DD]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      {getStatusBadge(c.status)}
                      <span className="text-xs font-medium text-[#0CF2F2] flex items-center gap-1 group-hover:underline">
                        Profile <Eye size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="border border-white/10 rounded-xl bg-[#20272D] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1A2126] text-[#8A9199] border-b border-white/10 uppercase font-medium">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Match Score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Skills</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedCandidate(c)}>
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0CF2F2]/10 border border-[#0CF2F2]/30 flex items-center justify-center font-bold text-[#0CF2F2]">
                            {c.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-[11px] text-[#8A9199]">{c.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-[#0CF2F2]">{c.matchScore}%</td>
                        <td className="p-4">{getStatusBadge(c.status)}</td>
                        <td className="p-4 text-[#B4BAC1]">{c.experience}</td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {c.skills.slice(0, 2).map(s => (
                              <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 text-[#6FB4DD] text-[10px]">{s}</span>
                            ))}
                            {c.skills.length > 2 && <span className="text-[#8A9199] text-[10px]">+{c.skills.length - 2}</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-1.5 hover:bg-white/10 rounded text-[#0CF2F2]"><Eye size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredCandidates.length === 0 && (
              <div className="py-12 text-center text-xs text-[#8A9199] border border-dashed border-white/10 rounded-xl">
                No matching candidates found.
              </div>
            )}

          </div>
        </main>

        {/* SIDE DRAWER MODAL */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-[#20272D] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-[#8A9199] tracking-wider uppercase">Candidate Profile</span>
                  <button onClick={() => setSelectedCandidate(null)} className="p-1 rounded hover:bg-white/10 text-[#8A9199] hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0CF2F2]/10 border-2 border-[#0CF2F2]/40 flex items-center justify-center font-bold text-[#0CF2F2] text-xl">
                    {selectedCandidate.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedCandidate.name}</h2>
                    <p className="text-xs text-[#0CF2F2] font-medium">{selectedCandidate.role}</p>
                    <div className="mt-1">{getStatusBadge(selectedCandidate.status)}</div>
                  </div>
                </div>

                <div className="bg-[#1A2126] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs text-[#B4BAC1]">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-[#5C636B]" /> {selectedCandidate.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-[#5C636B]" /> {selectedCandidate.phone}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-[#5C636B]" /> {selectedCandidate.location}</div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#0CF2F2]" /> Summary
                  </h4>
                  <p className="text-xs text-[#B4BAC1] leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                    {selectedCandidate.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white">Top Technical Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-[#27668C]/30 text-[#6FB4DD] text-xs font-medium border border-[#27668C]/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button className="w-full py-2.5 rounded-lg bg-[#0CF2F2] text-[#0B1416] text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Download size={14} /> Download Resume PDF
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function StatWidget({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="bg-[#20272D] border border-white/10 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-[#8A9199]">{title}</p>
        <p className="text-xl font-bold text-white mt-1">{count}</p>
      </div>
      <div className="p-2.5 rounded-lg bg-white/5">{icon}</div>
    </div>
  );
}