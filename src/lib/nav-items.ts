import {
  LayoutDashboard,
  History,
  Gift,
  User,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

export const dashboardNavItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/history", label: "History", icon: History },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
];
