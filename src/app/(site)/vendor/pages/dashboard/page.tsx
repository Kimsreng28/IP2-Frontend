"use client";
import env from "@/src/envs/env";
import { useTheme } from "next-themes";
import Image from 'next/image';
import { useEffect, useState } from "react";
import {
  FaBoxes, 
  FaDollarSign, 
  FaUsers
} from 'react-icons/fa';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardTotals {
  message: string;
  totalVendor: number;
  totalProduct: number;
  totalSales: number;
}

export interface RecentOrders {
  message: string;
  recentOrders: ProductOrderSummary[];
}

export interface ProductOrderSummary {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  totalOrder: number;
  totalAmount: number;
}

export interface NewVendorProducts {
  message: string;
  newProducts: vendorProduct[];
}

export interface vendorProduct {
  id: number;
  vendor_id: number;
  product_id: number;
  created_at: string; // ISO date string
  product: Product;
}

export interface Product {
  id: number;
  uuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  stars: number;
  brand_id: number;
  product_images: { image_url: string }[];
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string; // ISO date string
}


export interface ChartDataItem {
  month: string;
  totalSales: number;
  percent: number;
}

export interface VendorSalesChart {
  message: string;
  chartData: ChartDataItem[];
}


export default function Dashboard() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [chart, setChart] = useState<ChartDataItem[]>();
  const [newProducts, setNewProducts] = useState<vendorProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<ProductOrderSummary[]>([]);
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-200 text-center px-3 py-1 rounded shadow">
          <p className="text-sm text-gray-800">Total Sales</p>
          <p className="font-bold text-lg text-gray-900">{payload[0].value} $ </p>
        </div>
      );
    }

    return null;
  };


  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const url = new URL(`${env.API_BASE_URL}/vendor/dashboard/recentOrders`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch recentOrders');
        }
        const recentOrdersData: RecentOrders = await response.json();
        console.log('Fetched recentOrders:', recentOrdersData);
        setRecentOrders(recentOrdersData.recentOrders);

        // console.log('Recent Orders:', recentOrders);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchTotals = async () => {
      try {
        const url = new URL(`${env.API_BASE_URL}/vendor/dashboard/total`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); 

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch DashboardTotals');
        }
        const totalsData: DashboardTotals = await response.json();
        console.log('Fetched DashboardTotals:', totalsData);
        setTotals(totalsData);
        // console.log('Dashboard Totals:', totals?.totalProduct);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchNewProducts = async () => {
      try {
        const url = new URL(`${env.API_BASE_URL}/vendor/dashboard/newProducts`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); 

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch NewVendorProducts');
        }
        const newProductsData: NewVendorProducts = await response.json();
        console.log('Fetched NewVendorProducts:', newProductsData);
        setNewProducts(newProductsData.newProducts);
        console.log('New Products:', newProductsData.newProducts);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchChart = async () => {
      try {
        const url = new URL(`${env.API_BASE_URL}/vendor/dashboard/chartData`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); 

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch ChartDataItem');
        }
        const newChartsData: VendorSalesChart = await response.json();
        console.log('Fetched ChartDataItem:', newChartsData);
        console.log('Fetched ChartDataItem:', newChartsData.chartData);
        setChart(newChartsData.chartData);
        // console.log('Dashboard Totals:', totals?.totalProduct);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };


    fetchRecentOrders();
    fetchTotals();
    fetchChart();
    fetchNewProducts();

  }, [env.API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className=" overflow-y-auto overflow-auto overflow-x-auto h-[calc(100vh-7.75rem)] ">
        <div className=" flex flex-col space-y-[2%]   ">

          <div className="total flex justify-between gap-[5%] ">

            <div className={`rounded-lg px-4 py-3  shadow-md flex flex-1 flex-col  justify-between items-center  gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}>

              <div className="flex w-full items-center space-x-[10%] justify-center">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
                  <FaUsers className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{totals?.totalVendor}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</p>
                </div>
              </div>

            </div>

            <div className={`rounded-lg px-4 py-3  shadow-md flex flex-1 flex-col  space-x-[10%] justify-center items-center  gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}>

              <div className="flex flex-1 w-full items-center space-x-[10%] justify-center">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xl">
                  <FaBoxes className="w-8 h-8 text-green-500" />
                </div>

                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{totals?.totalProduct}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                </div>
              </div>

            </div>

            <div className={`rounded-lg px-4 py-3  shadow-md flex flex-1 flex-col  space-x-[10%] justify-center items-center  gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}>

              <div className="flex flex-1 w-full items-center space-x-[10%] justify-center">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-xl">
                  <FaDollarSign className="w-8 h-8 text-orange-500" />
                </div>

                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{totals?.totalSales}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                </div>
              </div>

            </div>

          </div>

          <div className="chart">

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow px-6 py-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Reports</h2>
                <h3 className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded">This Year</h3>
                {/* <button className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded">This week</button> */}
              </div>

              <div className="w-full h-50">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip content={CustomTooltip} />
                    <Area
                      type="monotone"
                      dataKey="totalSales"
                      stroke="#ec4899"
                      fillOpacity={1}
                      fill="url(#colorCustomers)"
                      dot={{ fill: '#ec4899', r: 5, stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          <div className="highlight flex justify-between w-full gap[3%]">

            <div className={`rounded-lg px-6 py-6 shadow-md w-[67%] ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}>
              <h2 className="text-lg font-semibold  dark:text-white text-gray-700 mb-4">Most Ordered Products</h2>
              <div className="overflow-auto overflow-x-auto bg-pink-300" >
                <table className="w-full divide-y  divide-gray-200 ">
                  <thead className="bg-white dark:bg-gray-800">
                    <tr className="text-center text-[12px] font-bold dark:text-white text-gray-500 uppercase tracking-wider">
                      <th className="  ">Tracking Id</th>
                      <th className="  "></th>
                      <th className=" px-6 text-left ">Product Name</th>
                      <th className="  ">Price</th>
                      <th className="  ">Total Order</th>
                      <th className="  ">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:bg-gray-800  divide-gray-200 overflow-auto">

                    {recentOrders.map((items) => (
                      <tr key={items.product_id} className="text-center ">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                          {items.product_id}
                        </td>
                        <td className=" py-4 flex  justify-end whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="relative h-10 w-10 rounded overflow-hidden">
                              <Image
                                src={`${env.FILE_BASE_URL}${items.product_image}`}
                                alt={items.product_name}
                                fill
                                className="rounded-lg object-cover border-2 border-gray-300"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[12px]  text-left whitespace-nowrap text-sm text-gray-500 dark:text-white">
                          {items.product_name}
                        </td>
                        <td className="px-6 py-4 text-[12px] whitespace-nowrap text-sm text-gray-500 dark:text-white">
                          {items.product_price} $
                        </td>
                        <td className="px-6 py-4 text-[12px] whitespace-nowrap text-sm text-gray-500 dark:text-white">
                          {items.totalOrder}
                        </td>
                        <td className="px-6 py-4 text-[12px] whitespace-nowrap text-sm text-gray-500 dark:text-white">
                          {items.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`rounded-lg px-6 py-6 w-[27%] shadow-md  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold dark:text-white text-gray-700">Recent Products</h2>
              </div>
              <div className="flex flex-col gap-4">
                {newProducts.map((items) => (
                  <div className="flex gap-4">

                    <div className="flex-shrink-0 h-10 w-10 m-1">
                      <div className="relative h-10 w-10 rounded overflow-hidden">
                        <Image
                          src={`${env.FILE_BASE_URL}${items.product.product_images[0].image_url}`}
                          alt={items.product.name}
                          fill
                          className="rounded-lg object-cover border-2 border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm dark:text-white text-gray-700">{items.product.name}</h2>
                      </div>
                      <div className="flex justify-between items-center ">
                        <h2 className="text-sm dark:text-white text-gray-700">{items.product.price} $</h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
