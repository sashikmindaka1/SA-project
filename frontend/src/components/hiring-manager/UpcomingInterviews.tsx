import React, { useState, useEffect } from 'react';
import { Video, Clock, ChevronRight, AlertCircle } from 'lucide-react';

export default function UpcomingInterviews() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // UPDATED: Now pointing to the correct HTTP port 5016!
    fetch('http://localhost:5016/api/Interview')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch interviews from backend.');
        return res.json();
      })
      .then((data) => {
        setInterviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not connect to the API server.');
        setTimeout(() => setLoading(false), 500); // Small delay to prevent flashing
      });
  }, []);

  // Filter based on active tab (assuming Status or date check)
  const filteredInterviews = interviews.filter((item) => {
    const isCompleted = item.status === 'Completed' || new Date(item.scheduledTime) < new Date();
    return activeTab === 'completed' ? isCompleted : !isCompleted;
  });

  return (
    <div className="bg-[#131b26] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Interview Pipeline</h3>
        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
          {filteredInterviews.length} {activeTab.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-8 border-b border-slate-800 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-semibold tracking-wider transition-all relative ${activeTab === 'upcoming' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          UPCOMING
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-semibold tracking-wider transition-all relative ${activeTab === 'completed' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          COMPLETED
          {activeTab === 'completed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
        </button>
      </div>

      <div className="grid grid-cols-12 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3 px-4">
        <div className="col-span-5">Candidate Profile</div>
        <div className="col-span-3">Pipeline Stage</div>
        <div className="col-span-4 text-right">Schedule & Join</div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-10 text-slate-500 text-sm">Syncing pipeline data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">No {activeTab} interviews found.</div>
        ) : (
          filteredInterviews.map((interview) => {
            const dateObj = new Date(interview.scheduledTime);
            const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const initials = interview.candidateName
              ? interview.candidateName.split(' ').map((n: string) => n[0]).join('')
              : 'TF';

            return (
              <div 
                key={interview.id} 
                className="group grid grid-cols-12 items-center bg-[#1e293b] hover:bg-[#253347] border border-slate-700 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold shadow-inner">
                    {initials}
                  </div>
                  <div>
                    <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">{interview.candidateName}</div>
                    <div className="text-xs text-slate-400">{interview.candidateRole}</div>
                  </div>
                </div>

                <div className="col-span-3">
                  <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {interview.pipelineStage}
                  </span>
                </div>

                <div className="col-span-4 flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {timeString} <span className="text-xs text-slate-500 font-normal">({interview.durationMinutes || 45} min)</span>
                  </div>
                  <button className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Video className="w-3 h-3" /> JOIN SESSION <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}