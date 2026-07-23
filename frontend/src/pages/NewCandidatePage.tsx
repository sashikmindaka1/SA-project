import React, { useState, useEffect } from "react";
import TopBar from "../components/common/TopBar";
import SideNav from "../components/common/SideNav";
import { COLORS } from "../constants/theme";
import {
  Search,
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
  Loader2,
  FileText,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5016"; // Update port if needed

interface Candidate {
  id: number;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  yearsExperience: number;
  summary: string;
  skills: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  createdAt: string;
  status: string; // Defaults to Screening if not in DB schema
  matchScore: number;
}

export default function NewCandidatePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Fetch Candidates Data from ASP.NET Core API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/CandidateProfile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load candidates. Status: ${response.status}`);
        }

        const data = await response.json();

        // Safe Skill Parser Logic (Handles JSON Array String or Comma-Separated String)
        const mappedData: Candidate[] = data.map((item: any) => {
          let parsedSkills: string[] = [];

          if (typeof item.skills === "string") {
            try {
              const jsonParsed = JSON.parse(item.skills);
              if (Array.isArray(jsonParsed)) {
                parsedSkills = jsonParsed;
              } else {
                parsedSkills = item.skills.split(",").map((s: string) => s.trim());
              }
            } catch {
              parsedSkills = item.skills.split(",").map((s: string) => s.trim());
            }
          } else if (Array.isArray(item.skills)) {
            parsedSkills = item.skills;
          }

          return {
            id: item.id,
            fullName: item.fullName || "Applicant",
            title: item.title || "Software Engineer",
            email: item.email || "N/A",
            phone: item.phone || "N/A",
            location: item.location || "Not Specified",
            yearsExperience: item.yearsExperience || 0,
            summary: item.summary || "No candidate summary provided.",
            skills: parsedSkills.filter((s) => s.length > 0),
            resumeUrl: item.resumeUrl,
            resumeFileName: item.resumeFileName,
            createdAt: item.createdAt,
            status: item.status || "Screening",
            matchScore: item.matchScore || Math.floor(Math.random() * (98 - 75 + 1)) + 75, // AI Score fallback
          };
        });

        setCandidates(mappedData);
      } catch (err: any) {
        console.error("Error fetching candidates:", err);
        setErrorMsg(err.message || "Failed to fetch candidate records from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filter Logic
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = activeTab === "All" || candidate.status.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Interviewing: "bg-[#0CF2F2]/10 text-[#0CF2F2] border-[#0CF2F2]/30",
      Offered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Screening: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    };

    return (
      <span
        className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
          styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleDownloadResume = (resumeUrl?: string) => {
    if (!resumeUrl) {
      alert("No resume uploaded for this candidate.");
      return;
    }
    const fullUrl = `${API_BASE_URL}${resumeUrl}`;
    window.open(fullUrl, "_blank");
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
                  Managing database profiles from TalentFlow API (`api/CandidateProfile`).
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs text-center">
                {errorMsg}
              </div>
            )}

            {/* Stats Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatWidget title="Total Candidates" count={candidates.length} icon={<UserCheck size={18} className="text-[#0CF2F2]" />} />
              <StatWidget title="In Screening" count={candidates.filter((c) => c.status.toLowerCase() === "screening").length} icon={<Clock size={18} className="text-amber-400" />} />
              <StatWidget title="Interview Scheduled" count={candidates.filter((c) => c.status.toLowerCase() === "interviewing").length} icon={<Sparkles size={18} className="text-[#0CF2F2]" />} />
              <StatWidget title="Offers Extended" count={candidates.filter((c) => c.status.toLowerCase() === "offered").length} icon={<CheckCircle2 size={18} className="text-emerald-400" />} />
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#20272D] p-3 rounded-xl border border-white/10">
              
              {/* Tabs */}
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

              {/* Search & Layout */}
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

            {/* Candidates Content */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-[#0CF2F2] gap-3">
                <Loader2 size={30} className="animate-spin" />
                <p className="text-xs text-[#8A9199]">Loading profiles from CandidateProfile API...</p>
              </div>
            ) : viewMode === "grid" ? (
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
                          {c.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-[#0CF2F2] transition-colors">{c.fullName}</h3>
                          <p className="text-xs text-[#8A9199]">{c.title}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5 text-xs text-[#B4BAC1]">
                        <div className="flex items-center gap-2"><Briefcase size={13} className="text-[#5C636B]" /> {c.yearsExperience} Years Exp</div>
                        <div className="flex items-center gap-2"><MapPin size={13} className="text-[#5C636B]" /> {c.location}</div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {c.skills.map((s, idx) => (
                          <span key={idx} className="rounded-md bg-[#27668C]/20 border border-[#27668C]/40 px-2 py-0.5 text-[10px] font-medium text-[#6FB4DD]">
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
                            {c.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{c.fullName}</p>
                            <p className="text-[11px] text-[#8A9199]">{c.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-[#0CF2F2]">{c.matchScore}%</td>
                        <td className="p-4">{getStatusBadge(c.status)}</td>
                        <td className="p-4 text-[#B4BAC1]">{c.yearsExperience} Years</td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {c.skills.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-[#6FB4DD] text-[10px]">{s}</span>
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

            {!loading && filteredCandidates.length === 0 && (
              <div className="py-12 text-center text-xs text-[#8A9199] border border-dashed border-white/10 rounded-xl">
                No candidate profiles found in database.
              </div>
            )}

          </div>
        </main>

        {/* CANDIDATE DETAIL DRAWER */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-[#20272D] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-[#8A9199] tracking-wider uppercase">Candidate Details</span>
                  <button onClick={() => setSelectedCandidate(null)} className="p-1 rounded hover:bg-white/10 text-[#8A9199] hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#0CF2F2]/10 border-2 border-[#0CF2F2]/40 flex items-center justify-center font-bold text-[#0CF2F2] text-xl">
                    {selectedCandidate.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedCandidate.fullName}</h2>
                    <p className="text-xs text-[#0CF2F2] font-medium">{selectedCandidate.title}</p>
                    <div className="mt-1">{getStatusBadge(selectedCandidate.status)}</div>
                  </div>
                </div>

                <div className="bg-[#1A2126] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs text-[#B4BAC1]">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-[#5C636B]" /> {selectedCandidate.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-[#5C636B]" /> {selectedCandidate.phone}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-[#5C636B]" /> {selectedCandidate.location}</div>
                  <div className="flex items-center gap-2"><Briefcase size={14} className="text-[#5C636B]" /> {selectedCandidate.yearsExperience} Years Experience</div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#0CF2F2]" /> Professional Summary
                  </h4>
                  <p className="text-xs text-[#B4BAC1] leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                    {selectedCandidate.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-[#27668C]/30 text-[#6FB4DD] text-xs font-medium border border-[#27668C]/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCandidate.resumeFileName && (
                  <div className="p-3 bg-[#1A2126] rounded-lg border border-white/5 flex items-center gap-3">
                    <FileText size={20} className="text-[#0CF2F2]" />
                    <div className="overflow-hidden">
                      <p className="text-xs text-white truncate font-medium">{selectedCandidate.resumeFileName}</p>
                      <p className="text-[10px] text-[#8A9199]">Uploaded Resume Document</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => handleDownloadResume(selectedCandidate.resumeUrl)}
                  disabled={!selectedCandidate.resumeUrl}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-opacity flex items-center justify-center gap-2 ${
                    selectedCandidate.resumeUrl
                      ? "bg-[#0CF2F2] text-[#0B1416] hover:opacity-90 cursor-pointer"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Download size={14} /> {selectedCandidate.resumeUrl ? "Download Resume" : "No Resume Available"}
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