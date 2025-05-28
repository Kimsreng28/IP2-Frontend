"use client";
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
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();

  // Fetch the user role from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser?.role || "ADMIN");
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        setUserRole("ADMIN");
      }
    } else {
      setUserRole("ADMIN");
    }
  }, []);

  // Determine the title based on the role
  const title = userRole === "VENDOR" ? "VENDOR" : "ADNIN";

  return (
    <header className="flex items-center justify-between bg-white p-4 font-poppins shadow dark:bg-gray-900 dark:text-white">
      <h1 className="font-poppins text-xl font-bold">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
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

        {/* Notifications Button */}
        <button className="relative rounded p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell className="h-6 w-6" />
          {/* Display notification count */}
          {notifications > 0 && (
            <span className="absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => router.push("/admin/pages/settings")}
            className="flex  items-center gap-2 rounded p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <User className="h-6 w-6" />
            <span className="hidden md:inline">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
