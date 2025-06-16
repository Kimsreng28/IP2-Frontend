"use client"

import { useState, useEffect } from "react"

interface Order {
  trackingNo: string
  productName: string
  price: number
  totalOrder: number
  totalAmount: number
  icon: string
}

interface Product {
  id: number
  name: string
  rating: number
  price: number
  image: string
}

interface ApiResponse {
  products: {
    data: {
      id: number
      uuid: string
      name: string
      description: string
      price: number
      stock: number
      category_id: number
      stars: number
      brand_id: number
      is_new_arrival: boolean
      is_best_seller: boolean
      created_at: string
      category: {
        id: number
        name: string
      }
      brand: {
        id: number
        name: string
      },
      total_ordered: number
    }[]
    totalCount: number
  }
  users: {
    totalCount: number
  }
  sales: {
    totalOrders: number
  }
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("This week")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/admin/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data: ApiResponse = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ⭐
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-700 rounded-lg bg-gray-50 flex justify-center items-center">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen dark:bg-gray-700 rounded-lg bg-gray-50 flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-gray-700 rounded-lg bg-gray-50 flex">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.users.totalCount || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-xl">
                  🏪
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.products.totalCount || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-xl">
                  📦
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.sales.totalOrders || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center text-xl">
                  💰
                </div>
              </div>
            </div>
          </div>

          {/* Reports Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reports</h3>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("timeFilter")}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>{timeFilter}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === "timeFilter" && (
                  <div className="absolute right-0 top-12 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {["This week", "This month", "This year"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setTimeFilter(option)
                            setOpenDropdown(null)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>1000</span>
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>

                {/* Chart bars/area */}
                <div className="flex-1 ml-8 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 150 Q 50 120 100 140 T 200 100 T 300 120 T 400 80 L 400 200 L 0 200 Z"
                      fill="url(#gradient)"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                    />
                    {/* Data points */}
                    <circle cx="100" cy="140" r="4" fill="#8B5CF6" />
                    <circle cx="200" cy="100" r="4" fill="#8B5CF6" />
                    <circle cx="300" cy="120" r="4" fill="#8B5CF6" />
                  </svg>

                  {/* Tooltip */}
                  <div className="absolute top-16 left-48 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs">
                    580
                  </div>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                  <button
                    onClick={() => toggleDropdown("orders")}
                    className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-xs">
                        Tracking no.
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-xs">
                        Product Name
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-xs">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-xs">
                        Total Order
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-xs">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.products?.data.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100"> #{order.uuid.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {/* <span className="text-lg">{order.icon}</span> */}
                            <span className="text-sm text-gray-900 dark:text-gray-100">{order.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">${order.price}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-xs">
                            {order.total_ordered}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">${ (order.price * 0).toFixed(2) }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products New */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Products</h3>
                  <button
                    onClick={() => toggleDropdown("products")}
                    className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {dashboardData?.products.data.filter(product => product.is_new_arrival).slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(product.stars)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">${product.price}</p>
                    </div>
                  </div>
                ))}
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