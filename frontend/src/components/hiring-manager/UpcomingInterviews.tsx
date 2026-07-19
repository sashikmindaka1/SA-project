import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

export default function UpcomingInterviews() {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed'>('Upcoming');

  const upcomingInterviews = [
    { id: 1, name: 'Sarah Perera', role: 'Senior AI Developer', time: '2:00 PM', initials: 'SP' },
    { id: 2, name: 'Sarah Perera', role: 'Senior AI Developer', time: '2:00 PM', initials: 'SP' },
  ];

  return (
    <div className="bg-talent-panel/20 border border-gray-800 rounded-xl p-6 h-full flex flex-col shadow-lg shadow-black/20">
      <h3 className="text-white text-lg font-serif mb-6 text-center">My Interviews</h3>

      <div className="flex gap-6 border-b border-gray-800 mb-6 px-2">
        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'Upcoming' ? 'text-talent-cyan' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Upcoming
          {activeTab === 'Upcoming' && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-talent-cyan"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('Completed')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'Completed' ? 'text-talent-cyan' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Completed
          {activeTab === 'Completed' && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-talent-cyan"></span>
          )}
        </button>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-4 px-2">
        <span>Candidate</span>
        <span>Schedule</span>
      </div>

      <div className="flex flex-col gap-3">
        {activeTab === 'Upcoming' ? (
          upcomingInterviews.map((interview) => (
            <div key={interview.id} className="bg-[#2a3644]/50 hover:bg-[#324050] transition-colors rounded-lg p-3 flex items-center justify-between cursor-pointer border border-transparent hover:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                  {interview.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{interview.name}</p>
                  <p className="text-gray-400 text-xs">{interview.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-medium">{interview.time}</span>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 text-sm">
            No completed interviews to display.
          </div>
        )}
      </div>
    </div>
  );
}