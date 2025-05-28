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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const base64Url = token.split(".")[1]; // Get payload
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));

        const role = decodedPayload.role; // Assumes token has `role`
        setUserRole(role || ""); // fallback in case role is missing
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  // Determine the title based on the role
  const title = userRole === "VENDOR" ? "VENDOR" : "ADMIN";

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
          {notifications > 0 && (
            <span className="absolute right-0 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => router.push("/admin/pages/settings")}
            className="flex items-center gap-2 rounded p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <User className="h-6 w-6" />
            <span className="hidden md:inline">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
