"use client"

import { useState } from "react"

interface UserRole {
  id: number
  name: string
  icon: string
  total: number
  updateDate: string
}

const userRoles: UserRole[] = [
  {
    id: 1,
    name: "Admin",
    icon: "👤",
    total: 1,
    updateDate: "2025-12-01",
  },
  {
    id: 2,
    name: "Vendor",
    icon: "🏷️",
    total: 3,
    updateDate: "2025-12-01",
  },
  {
    id: 3,
    name: "User",
    icon: "🔍",
    total: 10,
    updateDate: "2025-12-01",
  },
]

export default function Permission() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDropdown = (roleId: number) => {
    setOpenDropdown(openDropdown === roleId ? null : roleId)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

        {/* Page Content */}
        <main className="flex-1 p-6">
          {/* User Roles Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-sm w-16">#</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-sm">Name</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-sm">Total</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-sm">Update</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-sm w-16"></th>
                </tr>
              </thead>
              <tbody>
                {userRoles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm">{role.icon}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{role.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 dark:text-gray-500">👥</span>
                        <span className="text-gray-700 dark:text-gray-300">{role.total}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 dark:text-gray-500">📅</span>
                        <span className="text-gray-700 dark:text-gray-300">{role.updateDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 relative">
                      <button
                        onClick={() => toggleDropdown(role.id)}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openDropdown === role.id && (
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              View Details
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Edit Role
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Manage Users
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Delete Role
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Roles</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{userRoles.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-xl">
                  🎭
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {userRoles.reduce((sum, role) => sum + role.total, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-xl">
                  👥
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">Today</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-xl">
                  🕒
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && <div className="fixed inset-0 z-0" onClick={() => setOpenDropdown(null)}></div>}
    </div>
  )
}
