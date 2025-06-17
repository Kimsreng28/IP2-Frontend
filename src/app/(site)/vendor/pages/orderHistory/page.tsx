"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export interface OrdersHistoryResponse {
  ordersHistories: OrderHistory[];
  totalItems: number;
  page: number;
  totalPages: number;
}

export interface OrderHistory {
  id: number;
  uuid: string;
  user_id: number;
  vendor_id: number;
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  shipping_method_id: number;
  created_at: string;
  user: User;
  vendor_orders: VendorOrder[];
  order_items: OrderItem[];
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface VendorOrder {
  id: number;
  vendor_id: number;
  order_id: number;
  status: string;
  vendor_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
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
  created_at: string;
}

export default function analysis() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersHistoryResponse, setOrdersHistoryResponse] = useState<OrdersHistoryResponse | null>(null);
  const [committedSearchTerm, setCommittedSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  const FILE_BASE_URL = process.env.FILE_BASE_URL;

  useEffect(() => {
    const fetchOrdersHistoryResponse = async () => {
      try {
        const url = new URL(`${API_BASE_URL}/vendor/orderhistory`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('sortByPrice', priceSort);
        if (committedSearchTerm) {
          url.searchParams.append('keySearch', committedSearchTerm);
        }

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
          throw new Error('Failed to fetch OrdersHistoryResponse');
        }
        const data: OrdersHistoryResponse = await response.json();
        console.log('Fetched OrdersHistoryResponse:', data);
        setOrdersHistoryResponse(data);

        // console.log('Recent Orders:', recentOrders);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersHistoryResponse();

  }, [API_BASE_URL, limit, page, priceSort, committedSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCommittedSearchTerm(searchTerm);
    setPage(1);
  };


  const togglePriceSort = () => {
    setPriceSort(prev => prev === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };

  return (
    <>
      <div className={`rounded-lg px-6 py-8  shadow-md flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
        <div className='flex gap-2'>
          {/* <Box className="h-8 w-8" /> */}
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto ">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Price:</span>
              <button
                onClick={togglePriceSort}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
              >
                {priceSort === 'asc' ? 'Low to High' : 'High to Low'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-1 ${priceSort === 'asc' ? '' : 'transform rotate-180'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`rounded-lg p-6 shadow-md flex flex-col gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <div className="overflow-auto overflow-x-auto " >
          <table className="w-full divide-y divide-gray-200 ">
            <thead className="bg-white text-center">
              <tr>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Method</th>
                <th className=" text-sm font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 overflow-auto">
              {/* {products.map((product) => {
                    const primaryImage = getPrimaryImage(product.product_images);
                    const imageUrl = primaryImage?.image_url
                      ? primaryImage.image_url.startsWith('https://') || primaryImage.image_url.startsWith('http://')
                        ? primaryImage.image_url  // already full URL
                        : `${FILE_BASE_URL}${primaryImage.image_url}`
                      : '/placeholder-product.png'; */}

              {ordersHistoryResponse?.ordersHistories.map((items) => (
                <tr key={items.id} className="text-center">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {items.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(items.order_date).format('DD-MM-YYYY')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {items.user.last_name} {items.user.first_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {items.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {items.payment_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {items.payment_method}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
