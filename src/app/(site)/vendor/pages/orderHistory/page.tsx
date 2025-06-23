"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { LuHistory } from "react-icons/lu";
import { EyeIcon } from 'lucide-react';
import Image from 'next/image';
import ViewOrder from './view';
import env from '@/src/envs/env';
export interface OrdersHistories {
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

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
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
  product_images: ProductImage[];
}

export default function analysis() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersHistories, setOrdersHistories] = useState<OrdersHistories | null>(null);
  const [committedSearchTerm, setCommittedSearchTerm] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showViewForm, setShowViewForm] = useState<boolean>(false);
  const [orderToView, setOrderToView] = useState<OrderHistory | null>(null);

  useEffect(() => {
    const fetchOrdersHistories = async () => {
      try {
        const url = new URL(`${env.API_BASE_URL}/vendor/orderhistory`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('sort', sort);
        if (committedSearchTerm) {
          url.searchParams.append('keySearch', committedSearchTerm);
        }

        console.log(limit);
        console.log(page);


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
          throw new Error('Failed to fetch OrdersHistories');
        }
        const data: OrdersHistories = await response.json();
        // console.log('Fetched response:', response);
        setOrdersHistories(data);
        console.log('Fetched OrdersHistories:', data);
        setTotalPages(data.totalPages);
        console.log(limit);
        console.log(page);


        // console.log('Recent Orders:', recentOrders);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersHistories();

  }, [env.API_BASE_URL, limit, page, sort, committedSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCommittedSearchTerm(searchTerm);
    setPage(1);
  };


  const toggleSort = () => {
    setSort(prev => prev === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };

  const handleViewClick = (ordersHistory: OrderHistory) => {
    setOrderToView(ordersHistory);
    console.log('Viewing ordersHistory:', ordersHistory);
    setShowViewForm(true);
  };


  const handleViewCancel = () => {
    setShowViewForm(false);
  };

  return (
    <>


      <div className={`rounded-lg px-6 py-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}>
        <div className='flex gap-2'>
          <LuHistory className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto ">
          <form onSubmit={handleSearch} className="flex text-sm">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none  focus:border-indigo-500"
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
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 "
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 dark:text-white">Order Id :</span>
              <button
                onClick={toggleSort}
                className="px-4 py-2 text-sm dark:text-white dark:bg-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50  flex items-center"
              >
                {sort === 'asc' ? 'Low to High' : 'High to Low'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-1 ${sort === 'asc' ? '' : 'transform rotate-180'}`}
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

      {showViewForm ? (
        orderToView ? (
          <ViewOrder
            orderHistory={orderToView}
            onClose={handleViewCancel}
          />
        ) : null
      ) : (
        <div className={`rounded-lg p-6 shadow-md flex flex-col gap-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
          <div className="overflow-auto overflow-x-auto h-[calc(100vh-22.25rem)] " >
            <table className="w-full divide-y divide-gray-200 ">
              <thead className="bg-white dark:bg-gray-800 text-center ">
                <tr>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Order Id</th>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Date</th>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Customer</th>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Payment</th>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Status</th>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Method</th>
                  <th className=" text-sm font-bold text-gray-500 dark:text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 overflow-auto">

                {ordersHistories?.ordersHistories.map((items) => (

                  <tr key={items.id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {items.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {dayjs(items.order_date).format('DD-MM-YYYY')}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 justify-center whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          className="h-10 w-10 rounded-full object-cover border-2 border-gray-500"
                          src={`${items.user.avatar}` || `${env.FILE_BASE_URL}${items.user.avatar}`}
                          alt={items.user.first_name}
                          width={40}
                          height={40}
                          unoptimized={true}
                        />
                      </div>
                      <div className="">
                        {items.user.last_name} {items.user.first_name}
                      </div>

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {items.payment_status === "paid" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : items.payment_status === "unpaid" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Unpaid
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {items.payment_status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {items.status === "pending" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      ) : items.status === "shipped" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Shipped
                        </span>
                      ) : items.status === "delivered" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Delivered
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {items.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {items.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      <button
                        className="flex items-center justify-center px-4 py-2 text-sm text-blue-600 dark:text-blue-300 hover:rounded-md hover:bg-gray-100 w-full"
                        onClick={() => handleViewClick(items)}
                      >
                        <EyeIcon className="h-5 w-5" />
                        <span className="ml-2">View</span>
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <nav className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                {/* <span className="text-sm">Items per page:</span> */}
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 border rounded-md text-sm"
                >
                  {[ 5, 10, 15, 20].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-md ${page === pageNum ? 'bg-indigo-600 text-white' : 'border border-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}




    </>
  );
}
