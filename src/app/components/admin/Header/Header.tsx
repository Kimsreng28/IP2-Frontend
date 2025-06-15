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
    <header className="flex items-center justify-between bg-white p-4 font-poppins shadow dark:bg-gray-900 dark:text-white">
      <h1 className="font-poppins text-xl font-bold">
        {userRole === "VENDOR" ? "VENDOR DASHBOARD" : "ADMIN DASHBOARD"}
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="rounded p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </button>

        <button className="relative rounded p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell className="h-6 w-6" />
          {notifications > 0 && (
            <span className="absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications}
            </span>
          )}
        </button>

        <button
          onClick={() => router.push(getSettingsPath())}
          className="flex items-center gap-2 rounded p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <User className="h-6 w-6" />
          <span className="hidden md:inline">Profile</span>
        </button>
      </div>
    </header>
  );
}
