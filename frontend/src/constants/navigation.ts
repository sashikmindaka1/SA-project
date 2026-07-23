import {
  LayoutDashboard,
  UserCircle2,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: UserCircle2, label: "Profile", path: "/candidate/profile" }, 
  { icon: Users, label: "Candidates", path: "/newCandidates" },
  { icon: Briefcase, label: "Applications", path: "/applications" },
  { icon: Calendar, label: "Interviews", path: "/manager/dashboard" }, 
  { icon: BarChart3, label: "AI Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];