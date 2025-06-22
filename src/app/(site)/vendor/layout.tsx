"use client";
import { useTheme } from "next-themes"; // Import the useTheme hook
import Header from "../../components/admin/Header/Header";
import Sidebar from "../../components/admin/Sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme(); // Get current theme and setTheme function

  const toggleDarkMode = () => {
    if (theme === "dark") {
      setTheme("light"); // Set theme to light
    } else {
      setTheme("dark"); // Set theme to dark
    }
  };

  return (
    <div
      className={`flex h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Sidebar */}
      <div className="flex w-52 h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header toggleDarkMode={toggleDarkMode} darkMode={theme === "dark"} />
        <main className="p-6  ">{children}</main>
      </div>
    </div>
  );
}
