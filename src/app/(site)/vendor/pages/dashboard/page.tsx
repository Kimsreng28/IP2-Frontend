
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DashboardTotals {
  message: string;
  totalVendor: number;
  totalProduct: number;
  totalSales: number;
}

export interface RecentOrderResponse {
  message: string;
  recentOrders: ProductOrderSummary[];
}

export interface ProductOrderSummary {
  product_id: number;
  product_name: string;
  product_price: number;
  totalOrder: number;
  totalAmount: number;
}


export default function Dashboard() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [committedSearchTerm, setCommittedSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  const FILE_BASE_URL = process.env.FILE_BASE_URL;

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
        const data: RecentOrderResponse = await response.json();
        // console.log('Fetched recentOrders:', data);
        setRecentOrders(data.recentOrders);

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
        const data: DashboardTotals = await response.json();
        console.log('Fetched DashboardTotals:', data);
        setTotals(data);
        // console.log('Dashboard Totals:', totals?.totalProduct);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };


    fetchRecentOrders();
    fetchTotals();

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
    <div className="">

      <h1 className="text-2xl font-bold">📊 Dashboard Overview</h1>
      <p className="mt-2 text-gray-600">Welcome to your vendor dashboard.</p>
      <div className="total flex justify-between gap-[5%]">

        <div className={`rounded-lg px-6 py-8  shadow-md flex flex-1 flex-col  justify-between items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>

          <div className="flex  w-full items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
              🥳
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals?.totalVendor}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</p>
            </div>
          </div>

        </div>

        <div className={`rounded-lg px-6 py-8  shadow-md flex flex-1 flex-col  justify-between items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>

          <div className="flex flex-1 w-full items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
              🥳
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals?.totalProduct}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
            </div>
          </div>

        </div>

        <div className={`rounded-lg px-6 py-8  shadow-md flex flex-1 flex-col  justify-between items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>

          <div className="flex flex-1 w-full items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
              🥳
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals?.totalSales}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
            </div>
          </div>

        </div>

      </div>

      <div className="dashboard">Chart</div>

      <div className="highlight">

        <div className={`rounded-lg px-6 py-8  shadow-md  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}>
          <div className="overflow-auto overflow-x-auto bg-pink-300" >
            <table className="w-full divide-y divide-gray-200 ">
              <thead className="bg-white">
                <tr className="text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <th className="  ">Tracking Id</th>
                  <th className="  ">Product Name</th>
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

                {recentOrders.map((items, index) => (
                  <tr key={items.product_id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {items.product_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
