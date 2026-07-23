import React, { useState, useEffect } from 'react';

import UpcomingInterviews from '../components/hiring-manager/UpcomingInterviews';
import EvaluationForm from '../components/hiring-manager/EvaluationForm';
import ScheduleInterviewModal from '../components/hiring-manager/ScheduleInterviewModal';
import SideNav from '../components/common/SideNav';
import { Search, Bell, CalendarDays, Clock, Target, TrendingUp } from 'lucide-react';

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

export default function HiringManagerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingEvaluations: 3,
    interviewsToday: 4,
    avgMatchScore: 82,
    conversionRate: 68
  });

  useEffect(() => {
    fetch('http://localhost:5016/api/Interview/stats') 
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error('Error loading dashboard stats:', err));
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      
      {/* Top Application Nav Bar */}
      <nav className="w-full px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg flex justify-between items-center" style={{ borderColor: C.border, background: `${C.bg}EE` }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg" style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}>
            TF
          </div>
          <span className="font-extrabold tracking-tight text-lg" style={{ color: C.text }}>
            Talent<span style={{ color: C.teal }}>Flow</span> AI
          </span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Search candidates, interviews, or evaluations..." 
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
              <div className="text-[10px] font-semibold tracking-wider mt-0.5" style={{ color: C.teal }}>HIRING MANAGER</div>
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
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: C.text }}>Interview Management</h1>
              <p className="mt-1.5 text-sm" style={{ color: C.textDim }}>Schedule, evaluate, and orchestrate candidate sequences.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-6 rounded-xl text-xs font-bold tracking-wide transition-all hover:opacity-90 active:scale-95 shadow-lg flex items-center gap-2"
              style={{ background: C.teal, color: "#08101b" }}
            >
              <CalendarDays className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>

          {/* KPI Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Pending Evaluations', value: stats.pendingEvaluations, icon: Clock, color: C.gold },
              { label: 'Interviews Today', value: stats.interviewsToday, icon: CalendarDays, color: C.teal },
              { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: Target, color: "#3a86ff" },
              { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: "#00f5d4" },
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
                <div className="text-3xl font-extrabold tracking-tight relative z-10" style={{ color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Grid Layout (Child Components) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="col-span-2">
                <UpcomingInterviews />
             </div>
             <div>
                <EvaluationForm />
             </div>
          </div>
        </main>
      </div>

      <ScheduleInterviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}