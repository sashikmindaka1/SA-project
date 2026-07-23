import React, { useState, useEffect } from 'react';
import SideNav from './common/SideNav';
import { Search, Bell, Brain, FileText, Target, TrendingUp, Zap, AlertCircle } from 'lucide-react';

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

interface KpiData {
  TotalCandidates: number;
  AvgMatchScore: number;
  ResumesParsed: number;
  PlacementRate: number;
}

interface RankedCandidate {
  id: number;
  name: string;
  role: string;
  matchScore: number;
  parsedSkills: string[];
}

export default function RecruiterRankingScreen() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [rankedCandidates, setRankedCandidates] = useState<RankedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5016/api/aianalytics/kpis").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch KPIs");
        return res.json();
      }),
      fetch("http://localhost:5016/api/aianalytics/ranking").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rankings");
        return res.json();
      }),
    ])
      .then(([kpiData, rankingData]) => {
        setKpis(kpiData);
        setRankedCandidates(rankingData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error communicating with backend:", err);
        setError("Failed to synchronize with backend services. Please ensure your C# API is running.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      
      {/* Top Application Nav Bar — Integrated natively like your HiringManagerDashboard */}
      <nav className="w-full px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg flex justify-between items-center" style={{ borderColor: C.border, background: `${C.bg}EE` }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg" style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}>
            TF
          </div>
          <span className="font-extrabold tracking-tight text-lg" style={{ color: C.text }}>
            Talent<span style={{ color: C.teal }}>Flow</span> AI
          </span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search AI insights, rankings, or candidate metrics..." 
            className="w-full bg-[#121922] border border-[rgba(255,255,255,0.06)] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#5c7086] outline-none focus:border-[#22d9d9]/50 transition-all shadow-inner"
          />
          <div className="absolute left-3.5 top-3 text-[#5c7086]">
            <Search size={16} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative p-2.5 rounded-xl shadow-inner shrink-0 cursor-pointer" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <Bell size={18} style={{ color: C.textDim }} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: C.teal }}></span>
          </div>
          <div className="flex items-center gap-3 pl-3 border-l shrink-0" style={{ borderColor: C.border }}>
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md" style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}>
              NL
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>Nimsara Lakmal</div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5" style={{ color: C.teal }}>RECRUITER / AI</div>
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
                <Brain size={32} style={{ color: C.teal }} />
                AI Insights & Analytics
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: C.textDim }}>Automated resume parsing, intelligent skill extraction, and candidate-job matching algorithms.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl flex items-center gap-3 text-sm border mb-6 shadow-xl" style={{ background: "rgba(224,102,90,0.1)", borderColor: "rgba(224,102,90,0.3)", color: C.red }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* KPI Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Total Candidates', value: kpis ? kpis.TotalCandidates : "—", icon: Target, color: "#3a86ff" },
              { label: 'Avg Match Score', value: kpis ? `${kpis.AvgMatchScore}%` : "—", icon: Zap, color: C.teal },
              { label: 'Resumes Parsed', value: kpis ? kpis.ResumesParsed : "—", icon: FileText, color: C.gold },
              { label: 'Placement Rate', value: kpis ? `${kpis.PlacementRate}%` : "—", icon: TrendingUp, color: "#00f5d4" },
            ].map((kpi, index) => (
              <div key={index} className="rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all group" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <div className="absolute -right-3 -bottom-3 opacity-[0.04] transition-transform group-hover:scale-110 pointer-events-none">
                  <kpi.icon size={96} style={{ color: kpi.color }} />
                </div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>{kpi.label}</span>
                  <div className="p-2.5 rounded-xl shadow-inner" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                    <kpi.icon size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold tracking-tight relative z-10" style={{ color: kpi.color }}>
                  {loading ? "..." : kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Recruiter AI Ranking Screen Section */}
          <div className="rounded-2xl p-6 shadow-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: C.border }}>
              <div>
                <h2 className="text-lg font-bold tracking-wide" style={{ color: C.text }}>Recruiter AI Ranking & Skill Extraction</h2>
                <p className="text-xs mt-0.5" style={{ color: C.textDim }}>Live candidate pipeline sorted by automated matching algorithms</p>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-16 text-sm" style={{ color: C.textDim }}>
                  Fetching live data from backend API endpoints...
                </div>
              ) : rankedCandidates.length === 0 ? (
                <div className="text-center py-16 text-sm" style={{ color: C.textDim }}>
                  No candidate records found in the database.
                </div>
              ) : (
                rankedCandidates.map((candidate, index) => (
                  <div 
                    key={candidate.id} 
                    className="flex items-center justify-between p-5 rounded-xl shadow-inner border flex-wrap gap-4 transition-all hover:border-[#22d9d9]/40" 
                    style={{ background: C.panelAlt, borderColor: C.border }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="text-2xl font-black italic opacity-20 w-8 text-center" style={{ color: C.textDim }}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: C.text }}>{candidate.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: C.textDim }}>{candidate.role}</div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {candidate.parsedSkills?.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide uppercase"
                              style={{ background: `${C.teal}15`, color: C.teal, border: `1px solid ${C.teal}35` }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>Match Score</span>
                      <div className="px-4 py-2 rounded-xl text-lg font-extrabold shadow-inner" style={{ background: `${C.teal}10`, color: C.teal, border: `1px solid ${C.teal}30` }}>
                        {candidate.matchScore}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}