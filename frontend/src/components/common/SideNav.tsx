import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";

// ---------------------------------------------------------------------------
// Design tokens — Dark Cyberpunk Theme
// ---------------------------------------------------------------------------
const C = {
  panel: "#0d1318",
  panelAlt: "#121922",
  border: "rgba(255,255,255,0.06)",
  text: "#FFFFFF",
  textDim: "#5c7086",
  teal: "#22d9d9",
} as const;

interface SideNavProps {
  activeItem?: string;
  userRole?: string;
}

export default function SideNav({ activeItem }: SideNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-64 h-[calc(100vh-81px)] sticky top-[81px] py-6 px-3 justify-between shrink-0 z-30 shadow-2xl overflow-y-auto select-none"
      style={{
        background: C.panel,
        borderRight: `1px solid ${C.border}`,
      }}
    >
      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive = activeItem
            ? activeItem.toLowerCase() === label.toLowerCase()
            : location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all duration-200 outline-none"
              style={{
                background: isActive ? `${C.teal}15` : "transparent",
                color: isActive ? C.teal : C.textDim,
                border: `1px solid ${isActive ? `${C.teal}35` : "transparent"}`,
                boxShadow: isActive ? `0 0 12px ${C.teal}15` : "none",
              }}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all"
                  style={{ background: C.teal }}
                />
              )}

              <Icon
                size={18}
                className="transition-transform duration-200 group-hover:scale-110"
                style={{ color: isActive ? C.teal : C.textDim }}
              />
              <span className="truncate group-hover:text-white transition-colors">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Dedicated SideNav Footer */}
      <footer
        className="mt-6 pt-4 border-t flex flex-col gap-2 px-2"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-center justify-between text-[11px]" style={{ color: C.textDim }}>
          <span className="font-medium">System Status</span>
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>

        <div
          className="flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold mt-1"
          style={{ color: C.textDim }}
        >
          <span>© {new Date().getFullYear()} TalentFlow</span>
          <span style={{ color: C.teal }}>v1.0.0</span>
        </div>
      </footer>

      <style>{`
        /* Custom subtle scrollbar for SideNav */
        aside::-webkit-scrollbar {
          width: 4px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: ${C.teal}40;
        }
      `}</style>
    </aside>
  );
}