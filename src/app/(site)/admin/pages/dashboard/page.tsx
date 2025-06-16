"use client";

import { useEffect, useState } from "react";

interface Order {
  trackingNo: string;
  productName: string;
  price: number;
  totalOrder: number;
  totalAmount: number;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  rating: number;
  price: number;
  image: string;
}

interface ApiResponse {
  products: {
    data: {
      id: number;
      uuid: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      category_id: number;
      stars: number;
      brand_id: number;
      is_new_arrival: boolean;
      is_best_seller: boolean;
      created_at: string;
      category: {
        id: number;
        name: string;
      };
      brand: {
        id: number;
        name: string;
      };
    }[];
    totalCount: number;
  };
  users: {
    totalCount: number;
  };
  sales: number;
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("This week");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/admin/dashboard",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data: ApiResponse = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentOrders: Order[] = [
    {
      trackingNo: "#ER5364",
      productName: "HeadPhones",
      price: 100,
      totalOrder: 100,
      totalAmount: 100,
      icon: "🎧",
    },
    {
      trackingNo: "#ER5368",
      productName: "Space Pro",
      price: 100,
      totalOrder: 20,
      totalAmount: 100,
      icon: "🎧",
    },
    {
      trackingNo: "#ER5412",
      productName: "SoundCore",
      price: 100,
      totalOrder: 52,
      totalAmount: 100,
      icon: "🎧",
    },
    {
      trackingNo: "#ER5621",
      productName: "EarBuds",
      price: 100,
      totalOrder: 48,
      totalAmount: 100,
      icon: "🎧",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen rounded-lg bg-gray-50 dark:bg-gray-700">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.users.totalCount || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Vendors
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl dark:bg-blue-900">
                  🏪
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.products.totalCount || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Products
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl dark:bg-green-900">
                  📦
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.sales || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Sales
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-xl dark:bg-orange-900">
                  💰
                </div>
              </div>
            </div>
          </div>

          {/* Reports Chart */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reports
              </h3>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("timeFilter")}
                  className="flex items-center space-x-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span>{timeFilter}</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDropdown === "timeFilter" && (
                  <div className="absolute right-0 top-12 z-10 w-32 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="py-1">
                      {["This week", "This month", "This year"].map(
                        (option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setTimeFilter(option);
                              setOpenDropdown(null);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {option}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>1000</span>
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>

                {/* Chart bars/area */}
                <div className="relative ml-8 h-full flex-1">
                  <svg className="h-full w-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8B5CF6"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="100%"
                          stopColor="#8B5CF6"
                          stopOpacity="0.1"
                        />
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
                  <div className="absolute left-48 top-16 rounded bg-gray-800 px-2 py-1 text-xs text-white dark:bg-gray-700">
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Orders */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => toggleDropdown("orders")}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                        Tracking no.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                        Product Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                        Total Order
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.products?.data.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {" "}
                          #{order.uuid.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {/* <span className="text-lg">{order.icon}</span> */}
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {order.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          ${order.price}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            {/* {order.totalOrder || 0} */} 0
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          ${(order.price * 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products New */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    New Products
                  </h3>
                  <button
                    onClick={() => toggleDropdown("products")}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {dashboardData?.products.data
                  .filter((product) => product.is_new_arrival)
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-600">
                        <span className="text-xl">📦</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </h4>
                        <div className="mt-1 flex items-center space-x-1">
                          {renderStars(product.stars)}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        ></div>
      )}
    </div>
  );
}
