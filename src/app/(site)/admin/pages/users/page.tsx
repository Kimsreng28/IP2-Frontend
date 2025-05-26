"use client"

import { useState } from "react"

interface User {
  id: number
  fullName: string
  email: string
  location: string
  joinDate: string
  permission: "Admin" | "Vendor"
}

const users: User[] = [
  {
    id: 1,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Admin",
  },
  {
    id: 2,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
  {
    id: 3,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
  {
    id: 4,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
  {
    id: 5,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
  {
    id: 6,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
  {
    id: 7,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
  {
    id: 8,
    fullName: "KIM kim",
    email: "kim@gmail.com",
    location: "PP, St201, CAM",
    joinDate: "March 13, 2025",
    permission: "Vendor",
  },
]

export default function Users() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u.id))
  }

  const toggleDropdown = (userId: number) => {
    setOpenDropdown(openDropdown === userId ? null : userId)
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Management</h2>

            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search User..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔍</span>
              </div>

              <button className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <span>+</span>
                <span>Create User</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={toggleAllUsers}
                      className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                    Full Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Location</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Join</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                    Permission
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{user.fullName}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{user.location}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{user.joinDate}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.permission === "Admin"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {user.permission}
                      </span>
                    </td>
                    <td className="py-4 px-4 relative">
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {openDropdown === user.id && (
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              View Profile
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Edit User
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Change Permission
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Delete User
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center space-x-1">
              <span>←</span>
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 bg-blue-500 dark:bg-blue-600 text-white rounded flex items-center justify-center text-sm">
                01
              </button>
              <button className="w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center text-sm">
                02
              </button>
              <button className="w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center text-sm">
                03
              </button>
              <span className="text-gray-400 dark:text-gray-500">...</span>
              <button className="w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center text-sm">
                10
              </button>
              <button className="w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center text-sm">
                11
              </button>
            </div>

            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center space-x-1">
              <span>Next</span>
              <span>→</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-xl">
                  👥
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Admin Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {users.filter((user) => user.permission === "Admin").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-xl">
                  👑
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vendor Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {users.filter((user) => user.permission === "Vendor").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center text-xl">
                  🏪
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
