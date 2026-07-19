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
  path: string; // Added the path property here
}

export const NAV_ITEMS: NavItem[] = [
  // Mapped out the paths for you and your team
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: UserCircle2, label: "Profile", path: "/candidate/profile" }, 
  { icon: Users, label: "Candidates", path: "/candidates" },
  { icon: Briefcase, label: "Applications", path: "/applications" },
  { icon: Calendar, label: "Interviews", path: "/manager/dashboard" }, // Maps directly to your page
  { icon: BarChart3, label: "AI Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];