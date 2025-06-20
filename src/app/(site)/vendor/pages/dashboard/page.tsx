"use client";
import { useTheme } from "next-themes";
import Image from 'next/image';
import { useEffect, useState } from "react";
import {
  FaBoxes, // For Total Products (Font Awesome) 
  FaDollarSign // For Total Sales (Font Awesome)
  ,

  FaUsers
} from 'react-icons/fa';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// or Material Design icons:

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
  product_image: string;
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
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string; // ISO date string
}

// interfaces/VendorSalesChart.ts

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
  const [newProducts, setNewProducts] = useState<NewVendorProducts | null>(null);
  const [recentOrders, setRecentOrders] = useState<ProductOrderSummary[]>([]);
  // const [committedSearchTerm, setCommittedSearchTerm] = useState('');
  // const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  // const [page, setPage] = useState<number>(1);
  // const [limit, setLimit] = useState<number>(10);
  // const [totalPages, setTotalPages] = useState<number>(1);

  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  const FILE_BASE_URL = process.env.FILE_BASE_URL;

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
        const url = new URL(`${API_BASE_URL}/vendor/dashboard/recentOrders`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

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
        const url = new URL(`${API_BASE_URL}/vendor/dashboard/total`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

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
        const url = new URL(`${API_BASE_URL}/vendor/dashboard/newProducts`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

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
        setNewProducts(newProductsData);
        // console.log('Dashboard Totals:', totals?.totalProduct);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchChart = async () => {
      try {
        const url = new URL(`${API_BASE_URL}/vendor/dashboard/chartData`);

        // Get the JWT token from where you store it (localStorage, cookies, etc.)
        const token = localStorage.getItem('token'); // Adjust based on your auth storage

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

  }, [API_BASE_URL]);

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
    <div className=" flex flex-col space-y-[2%]">
      <div className={`rounded-lg px-6 py-6  shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
        {/* <Box className="h-8 w-8" /> */}
        <h1 className="text-2xl font-bold">📊 Dashboard Overview</h1>


      </div>
      <div className="total flex justify-between gap-[5%]">

        <div className={`rounded-lg px-6 py-6  shadow-md flex flex-1 flex-col  justify-between items-center  gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>

          <div className="flex w-full items-center space-x-[10%] justify-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
              <FaUsers className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals?.totalVendor}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</p>
            </div>
          </div>

        </div>

        <div className={`rounded-lg px-6 py-6  shadow-md flex flex-1 flex-col  space-x-[10%] justify-center items-center  gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>

          <div className="flex flex-1 w-full items-center space-x-[10%] justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xl">
              <FaBoxes className="w-8 h-8 text-green-500" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals?.totalProduct}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
            </div>
          </div>

        </div>

        <div className={`rounded-lg px-6 py-6  shadow-md flex flex-1 flex-col  space-x-[10%] justify-center items-center  gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>

          <div className="flex flex-1 w-full items-center space-x-[10%] justify-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-xl">
              <FaDollarSign className="w-8 h-8 text-orange-500" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals?.totalSales}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
            </div>
          </div>

        </div>

      </div>

      <div className="chart">

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Reports</h2>
            <h3 className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded">This Year</h3>
            {/* <button className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded">This week</button> */}
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="month" tick={{ fill: '#94a3b8' }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                {/* <Tooltip content={<CustomTooltip />} /> */}
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

      <div className="highlight">

        <div className={`rounded-lg px-6 py-6  shadow-md  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h2>
          <div className="overflow-auto overflow-x-auto bg-pink-300" >
            <table className="w-full divide-y divide-gray-200 ">
              <thead className="bg-white">
                <tr className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <th className="  ">Tracking Id</th>
                  <th className="  "></th>
                  <th className=" px-6 text-left ">Product Name</th>
                  <th className="  ">Price</th>
                  <th className="  ">Total Order</th>
                  <th className="  ">Total Amount</th>
                </tr>
              </thead>
              {/* {products.map((product) => {
                    const primaryImage = getPrimaryImage(product.product_images);
                    const imageUrl = primaryImage?.image_url
                      ? primaryImage.image_url.startsWith('https://') || primaryImage.image_url.startsWith('http://')
                        ? primaryImage.image_url  // already full URL
                        : `${FILE_BASE_URL}${primaryImage.image_url}`
                      : '/placeholder-product.png'; */}
              <tbody className="bg-white divide-y divide-gray-200 overflow-auto">

                {recentOrders.map((items) => (
                  <tr key={items.product_id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {items.product_id}
                    </td>
                    <td className=" py-4 flex  justify-end whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="relative h-10 w-10 rounded overflow-hidden">
                          <Image
                            src={`${FILE_BASE_URL}${items.product_image}`}
                            alt={items.product_name}
                            fill
                            className="rounded-lg object-cover border-2 border-gray-300"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4  text-left whitespace-nowrap text-sm text-gray-500">
                      {items.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {items.product_price} $
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {items.totalOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {items.totalAmount}
                    </td>
                  </tr>
                ))}


              </tbody>
            </table>
          </div>
        </div>

        <div>

        </div>

      </div>
    </div>
  );
}
