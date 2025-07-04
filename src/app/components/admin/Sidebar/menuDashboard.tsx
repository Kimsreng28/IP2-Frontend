import {
  BarChart,
  Box,
  LayoutDashboard,
  Settings,
  Shield,
  Users
} from "lucide-react";
import { LuHistory } from "react-icons/lu";

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
    title: "Products",
    path: "/vendor/pages/products",
    icon: Box,
    newTab: false,
  },
  {
    id: 3,
    title: "Order History",
    path: "/vendor/pages/orderHistory",
    icon: LuHistory,
    newTab: false,
  },
  {
    id: 4,
    title: "Settings",
    path: "/vendor/pages/settings",
    icon: Settings,
    newTab: false,
  },
];

export { menuDashboardAdmin, menuDashboardVendor };
