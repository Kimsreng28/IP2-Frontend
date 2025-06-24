"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserRole {
  id: number
  name: string
  icon: string
  total: number
  updateDate: string
}
interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  created_at: string
  updated_at: string
  avatar: string
}

interface RoleUsersResponse {
  role: {
    name: string
  }
  users: {
    data: User[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
    lastUpdated: string
  }
}
interface ApiResponse {
  data: UserRole[];
  stats: {
    totalUsers: number;
    lastUpdated: string;
  };
}

interface UserRole {
  id: number;
  name: string;
  icon: string;
  total: number;
  updateDate: string;
}

export default function Permission() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [roleUsers, setRoleUsers] = useState<User[]>([])
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fetch all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://api.ele-sale.shop/api/admin/permission/roles');
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const apiResponse: ApiResponse = await response.json();
        console.log('API Response:', apiResponse);
        setUserRoles(apiResponse.data); // Store only the data array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch users for a specific role when dialog opens
  useEffect(() => {
    if (isDialogOpen && selectedRole) {
      const fetchRoleUsers = async () => {
        try {
          const response = await fetch(
            `https://api.ele-sale.shop/api/admin/permission/roles/${selectedRole.id}`
          )
          if (!response.ok) {
            throw new Error('Failed to fetch role users')
          }
          const data: RoleUsersResponse = await response.json()
          console.log("Role users data:", data)
          setRoleUsers(data.users.data || []) // Store only the users array
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred')
        }
      }

      fetchRoleUsers()
    }
  }, [isDialogOpen, selectedRole])

  const toggleDropdown = (roleId: number) => {
    setOpenDropdown(openDropdown === roleId ? null : roleId)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleViewDetails = (role: UserRole) => {
    setSelectedRole(role)
    setIsDialogOpen(true)
    setOpenDropdown(null)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedRole(null)
    setRoleUsers([])
  }
  const calculateTotalUsers = () => {
    if (!userRoles || !Array.isArray(userRoles)) return 0
    return userRoles.reduce((sum, role) => sum + (role?.total || 0), 0)
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
                {userRoles && userRoles.length > 0 ? (
                  userRoles.map((role, index) => (
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
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(role.updateDate).toLocaleDateString()}
                          </span>
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
                              <button 
                                onClick={() => handleViewDetails(role)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                View Details
                              </button>
                              {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Edit Role
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Manage Users
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Delete Role
                              </button> */}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500 dark:text-gray-400">
                      {loading ? 'Loading roles...' : 'No roles found'}
                    </td>
                  </tr>
                )}
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
                    {calculateTotalUsers()}
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

      {/* Role Details Dialog */}
      {isDialogOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedRole.name} Details
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role ID: {selectedRole.id}
                  </p>
                </div>
                <button
                  onClick={closeDialog}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                    {selectedRole.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold">{selectedRole.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="text-lg">
                      {new Date(selectedRole.updateDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Users with this role ({roleUsers.length})
                </h3>

                {roleUsers.length > 0 ? (
                  <div className="overflow-y-auto max-h-64">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Avatar
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Joined
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {roleUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <img 
                                src={user.avatar} 
                                alt={`${user.first_name} ${user.last_name}`}
                                className="w-8 h-8 rounded-full"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No users found with this role.</p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenDropdown(null)}></div>
      )}
    </div>
  )
}