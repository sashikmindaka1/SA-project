import React from 'react';
import TopBar from '../components/common/TopBar';
import SideNav from '../components/common/SideNav';
import { COLORS } from '../constants/theme';
import UpcomingInterviews from '../components/hiring-manager/UpcomingInterviews';
import EvaluationForm from '../components/hiring-manager/EvaluationForm';

export default function HiringManagerDashboard() {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      
      <TopBar userName="Hiring Manager" userInitials="HM" title="Interviews & Evaluations" /> 
      
      <div className="flex flex-1">
        <SideNav activeItem="Interviews" /> 
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            
            <header className="mb-10 border-b border-gray-800 pb-6 flex justify-between items-end">
              <div>
                <h1 
                  className="text-4xl mb-2 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] bg-clip-text text-transparent" 
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Interview Management
                </h1>
                <p className="text-gray-400 text-sm tracking-wide">
                  Schedule, manage, and submit candidate evaluations.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <UpcomingInterviews />
              </div>
              <div className="lg:col-span-5 flex flex-col gap-6">
                <EvaluationForm />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}