"use client";
import { useTheme } from "next-themes"; // Import the useTheme hook

export default function Dashboard() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div
      className={`rounded-lg p-6 shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold">📊 Dashboard Overview</h1>
      <p className="mt-2 text-gray-600">Welcome to your admin dashboard.</p>
    </div>
  );
}
