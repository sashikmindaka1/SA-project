import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import the router hook
import { COLORS } from "../../constants/theme";
import { NAV_ITEMS } from "../../constants/navigation";

export default function SideNav({ activeItem = "Profile" }: { activeItem?: string }) {
  const navigate = useNavigate(); // 2. Initialize the navigation function

  return (
    <div
      className="hidden md:flex flex-col w-48 py-4 px-3 gap-1 shrink-0"
      style={{ backgroundColor: COLORS.bg, borderRight: `1px solid ${COLORS.border}` }}
    >
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
        const isActive = label === activeItem;

        return (
          <div
            key={label}
            onClick={() => navigate(path)} // 3. Make the div actually switch pages!
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