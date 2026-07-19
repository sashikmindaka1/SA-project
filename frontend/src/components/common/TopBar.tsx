import React from "react";
import { Bell } from "lucide-react";
import { COLORS } from "../../constants/theme";

// 1. Add the title prop to the interface
interface TopBarProps {
  userName: string;
  userInitials: string;
  title?: string; 
}

// 2. Add 'title' to the function parameters, with a fallback default for your friend's page
export default function TopBar({ 
  userName, 
  userInitials, 
  title = "Candidate Portal \u00B7 Profile & Resume" 
}: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: COLORS.cyan, color: COLORS.bg }}
        >
          T
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">TalentFlow AI</span>
        <span className="mx-3 h-4 w-px" style={{ backgroundColor: COLORS.border }} />
        
        {/* 3. Swap the hardcoded string for your dynamic {title} variable */}
        <span className="text-xs" style={{ color: COLORS.textSecondary }}>
          {title}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <Bell size={16} style={{ color: COLORS.textSecondary }} />
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ backgroundColor: COLORS.blue, color: "white" }}
          >
            {userInitials}
          </div>
          <span className="text-xs text-white">{userName}</span>
        </div>
      </div>
    </div>
  );
}