import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { COLORS } from "../../constants/theme";
import { NAV_ITEMS } from "../../constants/navigation";

// 1. Props සඳහා Types define කරන්න
interface SideNavProps {
  activeItem?: string;
  userRole?: string;
}

// 2. Component එකට Props ගන්න
export default function SideNav({ activeItem, userRole }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="hidden md:flex flex-col w-48 py-4 px-3 gap-1 shrink-0"
      style={{ backgroundColor: COLORS.bg, borderRight: `1px solid ${COLORS.border}` }}
    >
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
        // activeItem එක pass කර ඇත්නම් එය බලයි, නැතහොත් URL එක බලයි
        const isActive = activeItem ? activeItem === label : location.pathname === path;

        return (
          <div
            key={label}
            onClick={() => navigate(path)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
            style={{
              backgroundColor: isActive ? "rgba(12,242,242,0.08)" : "transparent",
              color: isActive ? COLORS.cyan : COLORS.textSecondary,
              borderLeft: isActive ? `2px solid ${COLORS.cyan}` : "2px solid transparent",
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}