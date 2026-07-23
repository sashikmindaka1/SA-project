import React, { useState, useEffect } from "react";
import SideNav from "../components/common/SideNav";
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
  Bell,
  AlertCircle,
  Users,
} from "lucide-react";

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
  status: string;
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

  // Profile Header State for Navbar
  const [userProfile, setUserProfile] = useState({
    fullName: "Recruiter Portal",
    title: "RECRUITER / HR",
  });

  // 1. Multi-fallback User Profile Loader (LocalStorage + API)
  useEffect(() => {
    const loadUserProfile = async () => {
      // Check multiple common storage keys for fallback
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
                title: foundTitle || "SOFTWARE ENGINEER",
              });
              return; // Found valid data, exit early
            }
          } catch (e) {
            console.error(`Error parsing ${key} from LocalStorage`, e);
          }
        }
      }

      // If LocalStorage is empty/invalid, fetch from ASP.NET Core API
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/CandidateProfile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Take the first profile from backend database
            setUserProfile({
              fullName: data[0].fullName || "Recruiter Portal",
              title: data[0].title || "RECRUITER / HR",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load user profile from API", err);
      }
    };

    loadUserProfile();
  }, []);

  // 2. Fetch All Candidates Data from ASP.NET Core API
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
            matchScore: item.matchScore || Math.floor(Math.random() * (98 - 75 + 1)) + 75,
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

  // Helper: Get Initials for User Avatar
  const getInitials = (name: string) => {
    if (!name) return "RP";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      Interviewing: { bg: `${C.teal}15`, text: C.teal, border: `${C.teal}35` },
      Offered: { bg: "rgba(16,185,129,0.15)", text: "#10b981", border: "rgba(16,185,129,0.35)" },
      Screening: { bg: `${C.gold}15`, text: C.gold, border: `${C.gold}35` },
      Rejected: { bg: `${C.red}15`, text: C.red, border: `${C.red}35` },
    };

    const style = styles[status] || { bg: "rgba(255,255,255,0.05)", text: C.textDim, border: C.border };

    return (
      <span
        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
        style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
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
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      
      {/* Top Application Nav Bar */}
      <nav
        className="w-full px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg flex justify-between items-center"
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

        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input
            type="text"
            placeholder="Search AI insights, candidate profiles, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all shadow-inner"
            style={{
              background: C.panelAlt,
              borderColor: C.border,
              color: C.text,
            }}
          />
          <div className="absolute left-3.5 top-3" style={{ color: C.textDim }}>
            <Search size={16} />
          </div>
        </div>

        {/* Dynamic User Profile Badge */}
        <div className="flex items-center gap-4">
          <div
            className="relative p-2.5 rounded-xl shadow-inner shrink-0 cursor-pointer"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <Bell size={18} style={{ color: C.textDim }} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: C.teal }}></span>
          </div>
          <div className="flex items-center gap-3 pl-3 border-l shrink-0" style={{ borderColor: C.border }}>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
              style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}
            >
              {getInitials(userProfile.fullName)}
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>
                {userProfile.fullName}
              </div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5 uppercase" style={{ color: C.teal }}>
                {userProfile.title}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Child Sidebar Component */}
        <SideNav />

        <main className="p-10 flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-end pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: C.text }}>
                <Users size={32} style={{ color: C.teal }} />
                Candidates Directory
              </h1>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div
              className="p-4 rounded-xl flex items-center gap-3 text-sm border mb-6 shadow-xl"
              style={{ background: `${C.red}15`, borderColor: `${C.red}40`, color: C.red }}
            >
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Stats KPI Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <StatWidget title="Total Candidates" count={candidates.length} icon={UserCheck} color="#3a86ff" />
            <StatWidget
              title="In Screening"
              count={candidates.filter((c) => c.status.toLowerCase() === "screening").length}
              icon={Clock}
              color={C.gold}
            />
            <StatWidget
              title="Interview Scheduled"
              count={candidates.filter((c) => c.status.toLowerCase() === "interviewing").length}
              icon={Sparkles}
              color={C.teal}
            />
            <StatWidget
              title="Offers Extended"
              count={candidates.filter((c) => c.status.toLowerCase() === "offered").length}
              icon={CheckCircle2}
              color="#00f5d4"
            />
          </div>

          {/* Controls Bar */}
          <div
            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl mb-6 shadow-2xl"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {["All", "Screening", "Interviewing", "Offered", "Rejected"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 tracking-wide uppercase"
                    style={{
                      background: isActive ? `${C.teal}20` : C.panelAlt,
                      color: isActive ? C.teal : C.textDim,
                      border: `1px solid ${isActive ? C.teal : C.border}`,
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Layout Mode & Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter name or skill..."
                  className="w-full rounded-xl py-2 pl-9 pr-3 text-xs outline-none transition-all shadow-inner"
                  style={{
                    background: C.panelAlt,
                    border: `1px solid ${C.border}`,
                    color: C.text,
                  }}
                />
                <Search size={14} className="absolute left-3 top-2.5" style={{ color: C.textDim }} />
              </div>

              <div className="flex items-center p-1 rounded-xl" style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: viewMode === "grid" ? `${C.teal}20` : "transparent",
                    color: viewMode === "grid" ? C.teal : C.textDim,
                  }}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: viewMode === "table" ? `${C.teal}20` : "transparent",
                    color: viewMode === "table" ? C.teal : C.textDim,
                  }}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Candidates Content Container */}
          <div className="rounded-2xl p-6 shadow-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3" style={{ color: C.teal }}>
                <Loader2 size={32} className="animate-spin" />
                <p className="text-xs" style={{ color: C.textDim }}>Fetching candidate profiles from database...</p>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCandidates.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className="group rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer relative shadow-xl hover:border-[#22d9d9]/40"
                    style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-inner" style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}30` }}>
                      <Sparkles size={12} /> {c.matchScore}%
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-md"
                          style={{ background: `linear-gradient(135deg, ${C.teal}40, ${C.blue}40)`, color: C.teal, border: `1px solid ${C.teal}50` }}
                        >
                          {c.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm transition-colors group-hover:text-[#22d9d9]" style={{ color: C.text }}>
                            {c.fullName}
                          </h3>
                          <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{c.title}</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5 text-xs" style={{ color: C.textDim }}>
                        <div className="flex items-center gap-2"><Briefcase size={13} style={{ color: C.teal }} /> {c.yearsExperience} Years Exp</div>
                        <div className="flex items-center gap-2"><MapPin size={13} style={{ color: C.teal }} /> {c.location}</div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {c.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide uppercase"
                            style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}35` }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                      {getStatusBadge(c.status)}
                      <span className="text-xs font-bold flex items-center gap-1 group-hover:underline" style={{ color: C.teal }}>
                        Profile <Eye size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <table className="w-full text-left text-xs">
                  <thead className="uppercase font-bold tracking-wider" style={{ background: C.panelAlt, color: C.textDim, borderBottom: `1px solid ${C.border}` }}>
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Match Score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Skills</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: C.border }}>
                    {filteredCandidates.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCandidate(c)}
                        className="transition-colors cursor-pointer hover:bg-white/[0.02]"
                        style={{ background: C.bg }}
                      >
                        <td className="p-4 flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                            style={{ background: `${C.teal}20`, color: C.teal, border: `1px solid ${C.teal}40` }}
                          >
                            {c.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: C.text }}>{c.fullName}</p>
                            <p className="text-[11px]" style={{ color: C.textDim }}>{c.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-extrabold" style={{ color: C.teal }}>{c.matchScore}%</td>
                        <td className="p-4">{getStatusBadge(c.status)}</td>
                        <td className="p-4" style={{ color: C.textDim }}>{c.yearsExperience} Years</td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {c.skills.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: `${C.teal}15`, color: C.teal }}>
                                {s}
                              </span>
                            ))}
                            {c.skills.length > 2 && <span className="text-[10px]" style={{ color: C.textDim }}>+{c.skills.length - 2}</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-1.5 rounded-lg" style={{ color: C.teal, background: `${C.teal}15` }}>
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredCandidates.length === 0 && (
              <div className="py-16 text-center text-sm border border-dashed rounded-2xl" style={{ color: C.textDim, borderColor: C.border }}>
                No candidate records found in database.
              </div>
            )}
          </div>
        </main>

        {/* CANDIDATE DETAIL DRAWER */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end">
            <div
              className="w-full max-w-md h-full p-8 flex flex-col justify-between overflow-y-auto shadow-2xl border-l"
              style={{ background: C.panel, borderColor: C.borderStrong }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: C.border }}>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: C.textDim }}>Candidate Profile Details</span>
                  <button onClick={() => setSelectedCandidate(null)} className="p-1 rounded-lg transition-colors hover:bg-white/10" style={{ color: C.textDim }}>
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}
                  >
                    {selectedCandidate.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-black" style={{ color: C.text }}>{selectedCandidate.fullName}</h2>
                    <p className="text-xs font-bold mt-0.5" style={{ color: C.teal }}>{selectedCandidate.title}</p>
                    <div className="mt-2">{getStatusBadge(selectedCandidate.status)}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl space-y-2.5 text-xs shadow-inner" style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-2.5" style={{ color: C.text }}><Mail size={14} style={{ color: C.teal }} /> {selectedCandidate.email}</div>
                  <div className="flex items-center gap-2.5" style={{ color: C.text }}><Phone size={14} style={{ color: C.teal }} /> {selectedCandidate.phone}</div>
                  <div className="flex items-center gap-2.5" style={{ color: C.text }}><MapPin size={14} style={{ color: C.teal }} /> {selectedCandidate.location}</div>
                  <div className="flex items-center gap-2.5" style={{ color: C.text }}><Briefcase size={14} style={{ color: C.teal }} /> {selectedCandidate.yearsExperience} Years Experience</div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: C.text }}>
                    <Sparkles size={14} style={{ color: C.teal }} /> Professional Summary
                  </h4>
                  <p className="text-xs leading-relaxed p-4 rounded-xl border shadow-inner" style={{ background: C.panelAlt, borderColor: C.border, color: C.textDim }}>
                    {selectedCandidate.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.text }}>Extracted Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-3 py-1 rounded-lg tracking-wide uppercase" style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}35` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCandidate.resumeFileName && (
                  <div className="p-4 rounded-xl flex items-center gap-3 shadow-inner" style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}>
                    <FileText size={22} style={{ color: C.teal }} />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate" style={{ color: C.text }}>{selectedCandidate.resumeFileName}</p>
                      <p className="text-[10px]" style={{ color: C.textDim }}>Uploaded Resume Document</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t" style={{ borderColor: C.border }}>
                <button
                  onClick={() => handleDownloadResume(selectedCandidate.resumeUrl)}
                  disabled={!selectedCandidate.resumeUrl}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    selectedCandidate.resumeUrl ? "cursor-pointer hover:opacity-90" : "opacity-40 cursor-not-allowed"
                  }`}
                  style={{
                    background: selectedCandidate.resumeUrl ? `linear-gradient(135deg, ${C.teal}, #0f5f5f)` : C.panelAlt,
                    color: selectedCandidate.resumeUrl ? "#08101b" : C.textDim,
                  }}
                >
                  <Download size={15} /> {selectedCandidate.resumeUrl ? "Download Resume" : "No Resume Available"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatWidget({ title, count, icon: Icon, color }: { title: string; count: number; icon: any; color: string }) {
  return (
    <div className="rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all group" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="absolute -right-3 -bottom-3 opacity-[0.04] transition-transform group-hover:scale-110 pointer-events-none">
        <Icon size={96} style={{ color }} />
      </div>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>{title}</span>
        <div className="p-2.5 rounded-xl shadow-inner" style={{ background: `${color}15`, color }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-extrabold tracking-tight relative z-10" style={{ color }}>
        {count}
      </div>
    </div>
  );
}