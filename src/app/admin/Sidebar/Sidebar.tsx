"use client";
import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { menuDashboardAdmin, menuDashboardVendor } from "./menuDashboard";

export default function Sidebar() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch the user role from localStorage after the component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole || "admin"); // Default to "admin" if no role is found
  }, []);

  // If userRole is not set yet, render a loading state
  if (userRole === null) {
    return (
      <div
        className={`font-poppins flex h-full w-64 flex-col justify-between p-5 shadow-md ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-600"
        }`}
      >
        {/* Loading state */}
        <h2
          className={`mb-6 text-lg font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Loading...
        </h2>
      </div>
    );
  }

  // Choose the appropriate menu based on the user role
  const menuItems =
    userRole === "admin" ? menuDashboardAdmin : menuDashboardVendor;

  const handleLogout = () => {
    // Clear user session or token here
    localStorage.removeItem("role"); // Remove role from localStorage (or clear session)
    // Redirect to the login page or homepage
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div
      className={`font-poppins flex h-full w-64 flex-col justify-between p-5 shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-600"
      }`}
    >
      {/* Title */}
      <h2
        className={`mb-6 text-lg font-bold ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        Ele-Sale
      </h2>

      {/* Menu Items */}
      <ul className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path || "#"}
              className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                pathname === item.path
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-200 hover:text-gray-900"
              }`}
              target={item.newTab ? "_blank" : "_self"}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button at the Bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-red-500 hover:text-white"
      >
        <LogOut className="h-5 w-5 text-gray-800 hover:bg-white" />
        Logout
      </button>
    </div>
  );
}
