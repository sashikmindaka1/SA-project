import React, { useState, useEffect } from 'react';

import UpcomingInterviews from '../components/hiring-manager/UpcomingInterviews';
import EvaluationForm from '../components/hiring-manager/EvaluationForm';
import ScheduleInterviewModal from '../components/hiring-manager/ScheduleInterviewModal';
import SideNav from '../components/common/SideNav'; // <-- 1. WE MUST IMPORT IT HERE
import { Search, Bell, User as UserIcon, CalendarDays, Clock, Target, TrendingUp } from 'lucide-react';

export default function HiringManagerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingEvaluations: 3,
    interviewsToday: 4,
    avgMatchScore: 82,
    conversionRate: 68
  });

  useEffect(() => {
    // 2. Ensuring it points to the correct HTTP port
    fetch('http://localhost:5016/api/Interview/stats') 
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error('Error loading dashboard stats:', err));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0b111a] text-white font-sans flex flex-col">
      
      {/* Top Application Nav Bar */}
      <nav className="w-full bg-[#131b26] border-b border-slate-800 px-8 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center font-bold text-[#0b111a]">TF</div>
          <span className="text-xl font-bold tracking-wider">TalentFlow <span className="text-cyan-400">AI</span></span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search candidates, interviews, or evaluations..." 
              className="w-full bg-[#0b111a] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-400 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#131b26]"></span>
          </button>
          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
            <div className="text-right">
              <div className="text-sm font-bold text-white">Nimsara Lakmal</div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest">Hiring Manager</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* 3. THIS IS THE NEW WRAPPER FOR THE SIDEBAR AND MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 4. WE PLACE THE SIDEBAR HERE */}
        <SideNav />

        {/* 5. MAIN CONTENT AREA (Now pushed to the right) */}
        <main className="p-8 flex-1 overflow-y-auto">
          
          {/* Header Section */}
          <div className="flex justify-between items-end pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Interview Management</h1>
              <p className="text-slate-400 mt-2 text-sm">Schedule, evaluate, and orchestrate candidate sequences.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-500/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0b111a] font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>

          {/* KPI Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Pending Evaluations', value: stats.pendingEvaluations, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { label: 'Interviews Today', value: stats.interviewsToday, icon: CalendarDays, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
              { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            ].map((kpi, index) => (
              <div key={index} className="bg-[#131b26] border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">{kpi.label}</div>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                </div>
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Grid Layout */}
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