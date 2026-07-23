import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";

// ---------------------------------------------------------------------------
// Design tokens — Ultra-dark cinematic luxury theme
// ---------------------------------------------------------------------------
const C = {
  panel: "#0d1318",
  border: "rgba(255,255,255,0.06)",
  text: "#FFFFFF",
  textDim: "#5c7086",
  teal: "#22d9d9",
};

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-64 h-full py-6 z-30 shadow-2xl shrink-0 overflow-y-auto"
      style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}
    >
      <nav className="flex flex-col gap-1.5 px-3">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          // DYNAMIC CHECK: Does the current browser URL match this item's path?
          const isActive = location.pathname === path;

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all"
              style={{
                background: isActive ? `${C.teal}12` : "transparent",
                color: isActive ? C.teal : C.textDim,
                border: `1px solid ${isActive ? `${C.teal}30` : "transparent"}`,
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}