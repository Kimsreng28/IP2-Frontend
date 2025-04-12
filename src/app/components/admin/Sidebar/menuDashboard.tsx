import {
  BarChart,
  Box,
  LayoutDashboard,
  Settings,
  Shield,
  TicketPercent,
  Users,
} from "lucide-react";

const menuDashboardAdmin = [
  {
    id: 1,
    title: "Dashboard",
    path: "/admin/pages/dashboard",
    icon: LayoutDashboard,
    newTab: false,
  },
  {
    id: 2,
    title: "Permissions",
    path: "/admin/pages/permissions",
    icon: Shield,
    newTab: false,
  },
  {
    id: 3,
    title: "Manage Users",
    path: "/admin/pages/users",
    icon: Users,
    newTab: false,
  },
  {
    id: 4,
    title: "Analytics",
    path: "/admin/pages/analysis",
    icon: BarChart,
    newTab: false,
  },
  {
    id: 5,
    title: "Settings",
    path: "/admin/pages/settings",
    icon: Settings,
    newTab: false,
  },
];

const menuDashboardVendor = [
  {
    id: 1,
    title: "Dashboard",
    path: "/vendor/pages/dashboard",
    icon: LayoutDashboard,
    newTab: false,
  },
  {
    id: 2,
    title: "Create Product",
    path: "/vendor/pages/products",
    icon: Box,
    newTab: false,
  },
  {
    id: 3,
    title: "Event",
    path: "/vendor/pages/event",
    icon: TicketPercent,
    newTab: false,
  },
  {
    id: 4,
    title: "Report",
    path: "/vendor/pages/report",
    icon: BarChart,
    newTab: false,
  },
  {
    id: 5,
    title: "Settings",
    path: "/vendor/pages/settings",
    icon: Settings,
    newTab: false,
  },
];

export { menuDashboardAdmin, menuDashboardVendor };
