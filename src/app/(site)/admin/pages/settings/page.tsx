"use client"

import { useState } from "react"

interface Category {
  id: number
  name: string
  subtitle: string
  image: string
  totalProducts: number
  totalEarning: number
}

interface PaymentStatus {
  id: number
  name: string
  color: string
  description: string
  isActive: boolean
  createdDate: string
}

interface DeliveryStatus {
  id: number
  name: string
  color: string
  description: string
  isActive: boolean
  createdDate: string
}

const categories: Category[] = [
  {
    id: 1,
    name: "iphone",
    subtitle: "Apple iPhone",
    image: "/placeholder.svg?height=40&width=40",
    totalProducts: 198784.0,
    totalEarning: 98784.0,
  },
  {
    id: 2,
    name: "iphone",
    subtitle: "Apple iPhone",
    image: "/placeholder.svg?height=40&width=40",
    totalProducts: 198784.0,
    totalEarning: 98784.0,
  },
]

const paymentStatuses: PaymentStatus[] = [
  {
    id: 1,
    name: "Pending",
    color: "yellow",
    description: "Payment is awaiting processing",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 2,
    name: "Paid",
    color: "green",
    description: "Payment completed successfully",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 3,
    name: "Failed",
    color: "red",
    description: "Payment processing failed",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 4,
    name: "Refunded",
    color: "blue",
    description: "Payment has been refunded",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 5,
    name: "Cancelled",
    color: "gray",
    description: "Payment was cancelled",
    isActive: false,
    createdDate: "2025-01-15",
  },
]

const deliveryStatuses: DeliveryStatus[] = [
  {
    id: 1,
    name: "Processing",
    color: "blue",
    description: "Order is being prepared",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 2,
    name: "Shipped",
    color: "purple",
    description: "Order has been shipped",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 3,
    name: "In Transit",
    color: "orange",
    description: "Order is on the way",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 4,
    name: "Delivered",
    color: "green",
    description: "Order has been delivered",
    isActive: true,
    createdDate: "2025-01-15",
  },
  {
    id: 5,
    name: "Returned",
    color: "red",
    description: "Order has been returned",
    isActive: true,
    createdDate: "2025-01-15",
  },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"categories" | "payment" | "delivery">("categories")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | PaymentStatus | DeliveryStatus | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const getCurrentData = () => {
    switch (activeTab) {
      case "categories":
        return categories
      case "payment":
        return paymentStatuses
      case "delivery":
        return deliveryStatuses
      default:
        return []
    }
  }

  const currentData = getCurrentData()

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const toggleAllItems = () => {
    setSelectedItems(selectedItems.length === currentData.length ? [] : currentData.map((item) => item.id))
  }

  const toggleDropdown = (itemId: number) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const getStatusColor = (color: string) => {
    const colors = {
      green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      orange: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      gray: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    }
    return colors[color as keyof typeof colors] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
  }

  const getColorIndicator = (color: string) => {
    const colorMap = {
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      gray: "bg-gray-500",
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500"
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const resetSelections = () => {
    setSelectedItems([])
    setSearchQuery("")
    setOpenDropdown(null)
  }

  const handleTabChange = (tab: "categories" | "payment" | "delivery") => {
    setActiveTab(tab)
    resetSelections()
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h2>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6 w-fit">
              <button
                onClick={() => handleTabChange("categories")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "categories"
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => handleTabChange("payment")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "payment"
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Payment Status
              </button>
              <button
                onClick={() => handleTabChange("delivery")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "delivery"
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Delivery Status
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${
                      activeTab === "categories"
                        ? "Category"
                        : activeTab === "payment"
                          ? "Payment Status"
                          : "Delivery Status"
                    }...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔍</span>
                </div>
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{selectedItems.length} selected</span>
                    <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <span>+</span>
                <span>
                  Create{" "}
                  {activeTab === "categories"
                    ? "Category"
                    : activeTab === "payment"
                      ? "Payment Status"
                      : "Delivery Status"}
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === currentData.length}
                      onChange={toggleAllItems}
                      className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    />
                  </th>
                  {activeTab === "categories" ? (
                    <>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        Categories
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        TOTAL PRODUCTS
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        TOTAL EARNING
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        Status Name
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        Color
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        Active
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">
                        Created Date
                      </th>
                    </>
                  )}
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      />
                    </td>
                    {activeTab === "categories" ? (
                      <>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={(item as Category).image || "/placeholder.svg"}
                                alt={(item as Category).name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{(item as Category).name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {(item as Category).subtitle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">
                          {formatNumber((item as Category).totalProducts)}
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">
                          {formatCurrency((item as Category).totalEarning)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              (item as PaymentStatus | DeliveryStatus).color,
                            )}`}
                          >
                            {(item as PaymentStatus | DeliveryStatus).name}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                          {(item as PaymentStatus | DeliveryStatus).description}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 rounded-full ${getColorIndicator(
                                (item as PaymentStatus | DeliveryStatus).color,
                              )}`}
                            ></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {(item as PaymentStatus | DeliveryStatus).color}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (item as PaymentStatus | DeliveryStatus).isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {(item as PaymentStatus | DeliveryStatus).isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                          {(item as PaymentStatus | DeliveryStatus).createdDate}
                        </td>
                      </>
                    )}
                    <td className="py-4 px-4 relative">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleDropdown(item.id)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openDropdown === item.id && (
                          <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                View Details
                              </button>
                              <button
                                onClick={() => setEditingItem(item)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Edit {activeTab === "categories" ? "Category" : "Status"}
                              </button>
                              {activeTab !== "categories" && (
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  {(item as PaymentStatus | DeliveryStatus).isActive ? "Deactivate" : "Activate"}
                                </button>
                              )}
                              {activeTab === "categories" && (
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  Manage Products
                                </button>
                              )}
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Delete {activeTab === "categories" ? "Category" : "Status"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {activeTab === "categories" ? (
              <>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Categories</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{categories.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-xl">
                      📁
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatNumber(categories.reduce((sum, cat) => sum + cat.totalProducts, 0))}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-xl">
                      📦
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(categories.reduce((sum, cat) => sum + cat.totalEarning, 0))}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-xl">
                      💰
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Statuses</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{currentData.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-xl">
                      📋
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Statuses</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {(currentData as (PaymentStatus | DeliveryStatus)[]).filter((item) => item.isActive).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-xl">
                      ✅
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Inactive Statuses</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {(currentData as (PaymentStatus | DeliveryStatus)[]).filter((item) => !item.isActive).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center text-xl">
                      ❌
                    </div>
                  </div>
                </div>
              </>
            )}
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

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingItem ? "Edit" : "Create"}{" "}
              {activeTab === "categories" ? "Category" : activeTab === "payment" ? "Payment Status" : "Delivery Status"}
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {activeTab === "categories" ? "Category Name" : "Status Name"}
                </label>
                <input
                  type="text"
                  defaultValue={
                    editingItem
                      ? activeTab === "categories"
                        ? (editingItem as Category).name
                        : (editingItem as PaymentStatus | DeliveryStatus).name
                      : ""
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={`Enter ${activeTab === "categories" ? "category" : "status"} name`}
                />
              </div>

              {activeTab === "categories" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    defaultValue={editingItem ? (editingItem as Category).subtitle : ""}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter category subtitle"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      defaultValue={editingItem ? (editingItem as PaymentStatus | DeliveryStatus).description : ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      rows={3}
                      placeholder="Enter status description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                    <select
                      defaultValue={editingItem ? (editingItem as PaymentStatus | DeliveryStatus).color : "blue"}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingItem ? (editingItem as PaymentStatus | DeliveryStatus).isActive : true}
                      className="rounded border-gray-300 dark:border-gray-600 mr-2 bg-white dark:bg-gray-700"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Active Status</label>
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {openDropdown && <div className="fixed inset-0 z-0" onClick={() => setOpenDropdown(null)}></div>}
    </div>
  )
}
