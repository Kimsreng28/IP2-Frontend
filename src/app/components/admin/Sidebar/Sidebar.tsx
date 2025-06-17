"use client";

import { getUserRole } from "@/src/utils/auth";
import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { menuDashboardAdmin, menuDashboardVendor } from "./menuDashboard";

export default function Sidebar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = getUserRole();
    if (!role) {
      router.push("/login");
    }
    setUserRole(role);
  }, [router]);

  if (!userRole) {
    return (
      <div
        className={`flex h-full w-64 flex-col justify-between p-5 font-poppins shadow-md ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-600"
        }`}
      >
        <h2 className="mb-6 text-lg font-bold">Loading...</h2>
      </div>
    );
  }

  const menuItems =
    userRole === "ADMIN" ? menuDashboardAdmin : menuDashboardVendor;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div
      className={`flex h-full w-64 flex-col justify-between p-5 font-poppins shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-600"
      }`}
    >
      <h2 className="mb-6 text-lg font-bold">Ele-Sale</h2>

      <ul className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all ${
                pathname === item.path
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-200 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium hover:bg-red-500 hover:text-white"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
}
