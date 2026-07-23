import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Bell,
  Filter,
  RefreshCw,
  MoreVertical,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";

import { NAV_ITEMS, type NavItem } from "../constants/navigation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

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

// ---------------------------------------------------------------------------
// Sidebar Component
// ---------------------------------------------------------------------------
interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

function Sidebar({ activePath, onNavigate }: SidebarProps) {
  return (
    <aside
      className="w-64 shrink-0 h-screen sticky top-0 flex flex-col py-6 z-30 shadow-2xl"
      style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-3 px-6 mb-8">
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

      <nav className="flex flex-col gap-1.5 px-3">
        {NAV_ITEMS.map((item: NavItem) => {
          const Icon = item.icon;
          const active = item.path === activePath;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all"
              style={{
                background: active ? `${C.teal}12` : "transparent",
                color: active ? C.teal : C.textDim,
                border: `1px solid ${active ? `${C.teal}30` : "transparent"}`,
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------
function StarRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold" style={{ color: C.textDim }}>{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className="cursor-pointer text-lg transition-transform hover:scale-110"
            onClick={() => onChange(n)}
            style={{ color: n <= value ? C.gold : C.borderStrong }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
export default function HiringManagerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const [scores, setScores] = useState({ technical: 4, teamFit: 3, communication: 4 });
  const [comment, setComment] = useState("");
  const [tab, setTab] = useState("Upcoming");
  const [kpiComment, setKpiComment] = useState("");
  const [toast, setToast] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const candidates = [
    { name: "Sarah Perera", role: "UI/UX Designer", time: "2:00 PM", initials: "SP" },
    { name: "Sashik Mindaka", role: "Senior Backend", time: "3:30 PM", initials: "SM" },
  ];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSendEvaluation = () => {
    if (!comment.trim()) return showToast("Please add a comment before sending.");
    showToast("Evaluation sent successfully.");
    setComment("");
  };

  const handleSendKpiComment = () => {
    if (!kpiComment.trim()) return showToast("Please add a comment before sending.");
    showToast("Comment sent successfully.");
    setKpiComment("");
  };

  const handleMenuAction = (action: string, candidateName: string) => {
    setOpenMenuIndex(null);
    showToast(`${action}: ${candidateName}`);
  };

  // --- Chart Data & Options ---
  const lineData = {
    labels: ["1 Wk", "2 Wk", "3 Wk", "4 Wk", "5 Wk"],
    datasets: [
      {
        data: [58, 92, 40, 100, 78],
        borderColor: C.teal,
        backgroundColor: (ctx: any) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
          g.addColorStop(0, `${C.teal}55`);
          g.addColorStop(1, `${C.teal}00`);
          return g;
        },
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: C.teal,
        pointBorderColor: C.bg,
        pointBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { intersect: false, mode: "index" as const } },
    scales: {
      x: { grid: { display: false }, ticks: { color: C.textDim, font: { size: 11 } } },
      y: { grid: { color: C.border }, ticks: { color: C.textDim, font: { size: 11 } } },
    },
  };

  const sourceData = {
    labels: ["LinkedIn", "Referral", "Job Board", "Career Site", "Other"],
    datasets: [{ data: [420, 300, 260, 180, 90], backgroundColor: C.teal, borderRadius: 6, maxBarThickness: 26 }],
  };

  const skillData = {
    labels: ["Python", "React", "Node", "SQL", "Design"],
    datasets: [{ data: [92, 78, 85, 70, 60], backgroundColor: C.teal, borderRadius: 6, maxBarThickness: 26 }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: C.textDim, font: { size: 10 } } },
      y: { grid: { color: C.border }, ticks: { color: C.textDim, font: { size: 10 } } },
    },
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: C.bg, fontFamily: "Inter, system-ui, sans-serif", color: C.text }}>
      <Sidebar activePath={activePath} onNavigate={navigate} />

      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Top Header matching Application UI */}
        <div className="flex items-center justify-between px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg" style={{ borderColor: C.border, background: `${C.bg}EE` }}>
          <div className="w-full max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates, interviews, or evaluations..."
              className="w-full bg-[#121922] border border-[rgba(255,255,255,0.06)] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#FFFFFF] placeholder-[#5c7086] outline-none focus:border-[#22d9d9]/50 transition-all shadow-inner"
            />
            <div className="absolute left-3.5 top-3 text-[#5c7086]"><Filter size={16} /></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative p-2.5 rounded-xl shadow-inner shrink-0 cursor-pointer" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <Bell size={18} style={{ color: C.textDim }} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: C.teal }} />
            </div>
            <div className="flex items-center gap-3 pl-3 border-l shrink-0" style={{ borderColor: C.border }}>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md" style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}>
                NL
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-bold" style={{ color: C.text }}>Nimsara Lakmal</div>
                <div className="text-[10px] font-semibold tracking-wider mt-0.5" style={{ color: C.teal }}>HIRING MANAGER</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="max-w-7xl w-full mx-auto px-10 py-10 flex-1 flex flex-col gap-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: C.text }}>Interview Management</h1>
            <p className="text-sm mt-1.5" style={{ color: C.textDim }}>Schedule, evaluate, and orchestrate candidate sequences.</p>
          </div>

          {/* Top Row: Interviews & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* My Interviews Panel */}
            <div className="lg:col-span-2 rounded-2xl p-6 shadow-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <h3 className="text-lg font-bold tracking-wide mb-4" style={{ color: C.text }}>Interview Pipeline</h3>
              
              {/* Tabs */}
              <div className="flex items-center gap-6 mb-6 border-b pb-3" style={{ borderColor: C.border }}>
                {["Upcoming", "Completed", "Events"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="text-xs font-bold tracking-wide uppercase transition-all"
                    style={{ color: tab === t ? C.teal : C.textDim, borderBottom: tab === t ? `2px solid ${C.teal}` : "none", paddingBottom: "12px", marginBottom: "-14px" }}
                  >
                    {t} {t === "Upcoming" ? `(${candidates.length})` : ""}
                  </button>
                ))}
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider mb-3 px-4" style={{ color: C.textDim }}>
                <div className="col-span-6">Candidate Profile</div>
                <div className="col-span-4">Pipeline Stage</div>
                <div className="col-span-2 text-right">Schedule</div>
              </div>

              {/* Candidate Rows */}
              <div className="space-y-3">
                {candidates.map((c, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 rounded-xl shadow-inner transition-all hover:border-[#22d9d9]/40 border relative" style={{ background: C.panelAlt, borderColor: C.border }}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md" style={{ background: `${C.teal}15`, color: C.teal }}>
                        {c.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: C.text }}>{c.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: C.textDim }}>{c.role}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm" style={{ background: `${C.teal}10`, color: C.teal, border: `1px solid ${C.teal}30` }}>
                        <CalendarIcon size={14} /> {c.time}
                      </div>
                      
                      <button onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: C.textDim }}>
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuIndex === i && (
                        <div className="absolute right-4 top-14 w-40 rounded-xl shadow-2xl py-2 z-10 border" style={{ background: C.panel, borderColor: C.borderStrong }}>
                          <div className="px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleMenuAction("Viewing profile", c.name)}>View Profile</div>
                          <div className="px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleMenuAction("Rescheduling", c.name)}>Reschedule</div>
                          <div className="px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-red-500/10 text-red-400 transition-colors" onClick={() => handleMenuAction("Cancelled", c.name)}>Cancel Interview</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Form Panel */}
            <div className="rounded-2xl p-6 shadow-2xl flex flex-col" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold tracking-wide" style={{ color: C.text }}>Live Evaluation</h3>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: `${C.teal}15`, color: C.teal }}>In Progress</span>
              </div>
              
              <StarRow label="Technical Assessment" value={scores.technical} onChange={(v) => setScores((s) => ({ ...s, technical: v }))} />
              <StarRow label="Culture & Team Fit" value={scores.teamFit} onChange={(v) => setScores((s) => ({ ...s, teamFit: v }))} />
              <StarRow label="Communication Skills" value={scores.communication} onChange={(v) => setScores((s) => ({ ...s, communication: v }))} />
              
              <div className="mt-4 mb-2 text-xs font-semibold" style={{ color: C.textDim }}>Interviewer Notes</div>
              <textarea
                className="w-full flex-1 min-h-[80px] bg-[#121922] border rounded-xl p-3 text-xs text-[#FFFFFF] placeholder-[#5c7086] outline-none focus:border-[#22d9d9]/50 transition-all shadow-inner resize-none"
                style={{ borderColor: C.border }}
                placeholder="Document key strengths, red flags, or specific feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleSendEvaluation} className="mt-4 w-full py-3 rounded-xl text-xs font-bold tracking-wide transition-all hover:opacity-90 active:scale-95 shadow-lg" style={{ background: C.teal, color: "#08101b" }}>
                Submit Evaluation
              </button>
            </div>
          </div>

          {/* Bottom Row: Analytics & KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="rounded-2xl p-6 shadow-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
               <h3 className="text-sm font-bold tracking-wide mb-4" style={{ color: C.text }}>Recruitment Analytics</h3>
               <div className="space-y-3">
                 {["Technical", "Team Fit", "Communication", "Applicant Score"].map((kpi) => (
                    <div key={kpi} className="flex items-center justify-between p-3 rounded-xl border shadow-inner text-xs" style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}>
                      <span className="font-semibold">{kpi}</span>
                      <ChevronDown size={14} style={{ color: C.textDim }} />
                    </div>
                 ))}
               </div>
            </div>

            <div className="rounded-2xl p-6 shadow-2xl flex flex-col" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <h3 className="text-sm font-bold tracking-wide mb-4" style={{ color: C.text }}>Time to Hire Trend</h3>
              <div className="flex-1 w-full relative min-h-[150px]">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            <div className="rounded-2xl p-6 shadow-2xl flex flex-col" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
              <h3 className="text-sm font-bold tracking-wide mb-4" style={{ color: C.text }}>Skill Match Success Rate</h3>
              <div className="flex-1 w-full relative min-h-[150px]">
                <Bar data={skillData} options={barOptions} />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 text-sm font-bold tracking-wide animate-bounce" style={{ background: C.teal, color: "#08101b" }}>
          {toast}
        </div>
      )}
    </div>
  );
}