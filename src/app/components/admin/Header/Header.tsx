"use client";

import { getUserRole } from "@/src/utils/auth";
import { Bell, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({
  toggleDarkMode,
  darkMode,
}: {
  toggleDarkMode: () => void;
  darkMode: boolean;
}) {
  const [notifications, setNotifications] = useState(3);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  const getSettingsPath = () => {
    switch (userRole) {
      case "ADMIN":
        return "/admin/pages/settings";
      case "VENDOR":
        return "/vendor/pages/settings";
      default:
        return "/login";
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow font-poppins dark:bg-gray-900 dark:text-white">
      <h1 className="text-xl font-bold font-poppins">
        {userRole === "VENDOR" ? "VENDOR DASHBOARD" : "ADMIN DASHBOARD"}
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 transition rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>

        <button className="relative p-2 transition rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell className="w-6 h-6" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-3 h-3 text-xs text-white bg-red-500 rounded-full">
              {notifications}
            </span>
          )}
        </button>

        <button
          onClick={() => router.push(getSettingsPath())}
          className="flex items-center gap-2 p-2 transition rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <User className="w-6 h-6" />
          <span className="hidden md:inline">Profile</span>
        </button>
      </div>
    </header>
  );
}
