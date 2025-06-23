"use client";

import env from "@/src/envs/env";
import { useTheme } from "next-themes";
import { useState } from "react";
import Image from 'next/image';
import { IoClose } from "react-icons/io5";

export interface OrderHistoryResponse {
    orderHistory: OrderHistory;
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
    product_images: ProductImage[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    is_primary: boolean;
    created_at: string;
}

interface OrderDetailViewProps {
    orderHistory: OrderHistory;
    onClose: () => void; // Only output prop needed
}

const ViewOrder: React.FC<OrderDetailViewProps> = ({
    orderHistory,
    onClose
}) => {
    const { theme } = useTheme();
    const [error, setError] = useState<string | null>(null);

    const getPrimaryImage = (images: ProductImage[]) => {
        const primaryImage = images.find(img => img.is_primary);

        return primaryImage || images[0] || { image_url: '/placeholder-product.png' };
    };

    return (
        <div className={`rounded-lg p-6 shadow-md  ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex items-center justify-end">
                {/* <h2 className="text-lg font-semibold mb-4  ">View Order</h2> */}
                <button
                    onClick={onClose}
                    className="mb-4 w-7 h-7 flex justify-center items-center hover:bg-gray-300 hover:rounded-full">
                    <IoClose className="w-5 h-5 " />
                </button>
            </div>
            <div className="overflow-auto overflow-x-auto h-[calc(100vh-20.5rem)] flex flex-row justify-between " >
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="orderItems w-[70%]">
                    <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                    <table className="w-full divide-y  divide-gray-200 ">
                        <thead className="bg-white dark:text-white dark:bg-gray-800 ">
                            <tr className="text-sm">
                                <th className="px-6 py-3 text-left  font-bold text-gray-500 dark:text-white uppercase tracking-wider"></th>
                                <th className=" py-3 text-left  font-bold text-gray-500 dark:text-white uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left  font-bold text-gray-500 dark:text-white uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-center  font-bold text-gray-500 dark:text-white uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-center  font-bold text-gray-500 dark:text-white uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:text-white dark:bg-gray-800 divide-gray-200 overflow-auto">
                            {orderHistory.order_items.map((item) => {
                                const primaryImage = getPrimaryImage(item.product.product_images);
                                const imageUrl = `${env.FILE_BASE_URL}${primaryImage.image_url}`;

                                return (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <Image
                                                    className="h-10 w-10 rounded-lg object-cover border-2 border-gray-500"
                                                    src={imageUrl}
                                                    alt={item.product.name}
                                                    width={40}
                                                    height={40}
                                                    unoptimized={true}
                                                />
                                            </div>
                                        </td>
                                        <td className="px- py-4 whitespace-nowrap text-sm font-medium dark:text-white text-gray-900 ">
                                            {item.product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-white">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {item.product.is_new_arrival && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    New
                                                </span>
                                            )}
                                            {item.product.is_best_seller && (
                                                <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-700">
                                                    Best Seller
                                                </span>
                                            )}
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="customer w-[25%] border-l-2">
                    <h2 className="text-lg font-semibold text-center mb-4">Customer</h2>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex-shrink-0 h-15 w-15">
                            <Image
                                className="h-15 w-15 rounded-full object-cover border-2 border-gray-500"
                                src={`${orderHistory.user.avatar}` || `${env.FILE_BASE_URL}${orderHistory.user.avatar}`}
                                alt={orderHistory.user.first_name}
                                width={40}
                                height={40}
                                unoptimized={true}
                            />
                        </div>
                        <div className="text-center border-b-2">
                            <p className="text-sm pb-3  font-semibold">{orderHistory.user.first_name} {orderHistory.user.last_name}</p>
                            <p className="text-sm pb-2 text-gray-600 dark:text-white">{orderHistory.user.email}</p>
                            <p className="text-sm pb-2 text-gray-600 dark:text-white">{orderHistory.shipping_address}</p>
                        </div>
                        <div className="flex flex-row">

                            <div className="text-right">
                                <p className="text-sm pb-2 text-gray-600 dark:text-white"> Order On</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">Payment Status</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">Total Amount</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">By</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">Delivery Status</p>
                            </div>
                            <div className="px-2">
                                <p className="text-sm pb-2 text-gray-600 dark:text-white"> : </p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white"> : </p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white"> : </p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white"> : </p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white"> : </p>
                            </div>
                            <div className="text-left">
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">
                                    {new Date(orderHistory.order_date).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">{orderHistory.payment_status}</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">{orderHistory.total_amount} $</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">{orderHistory.payment_method}</p>
                                <p className="text-sm pb-2 text-gray-600 dark:text-white">{orderHistory.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrder;

