"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

const OrderHistoryPage = () => {
  const [dropdownId, setDropdownId] = useState(null);

  const orders = [
    {
      id: "#3456_768",
      date: "October 17, 2023",
      status: "Delivered",
      price: "$1234.00",
    },
    {
      id: "#3456_980",
      date: "October 11, 2023",
      status: "Delivered",
      price: "$345.00",
    },
    {
      id: "#3456_120",
      date: "August 24, 2023",
      status: "Delivered",
      price: "$2345.00",
    },
    {
      id: "#3456_030",
      date: "August 12, 2023",
      status: "Delivered",
      price: "$845.00",
    },
  ];

  const handleMoreClick = (id, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setDropdownId(dropdownId === id ? null : id);
  };

  const handleView = (id) => {
    console.log(`View order: ${id}`);
    setDropdownId(null);
  };

  const handleDelete = (id) => {
    console.log(`Delete order: ${id}`);
    setDropdownId(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setDropdownId(null);
  };

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onClick={handleClickOutside}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        Orders History
      </motion.h2>

      <motion.div
        className="space-y-6 font-poppins"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Number ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  className="relative hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {order.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {order.price}
                  </td>
                  <td className="relative whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <button
                      onClick={(e) => handleMoreClick(order.id, e)}
                      className="text-black hover:text-blue-900 dark:text-white dark:hover:text-blue-300"
                    >
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>

                    {/* Animated Dropdown */}
                    <AnimatePresence>
                      {dropdownId === order.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-5 top-8 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ul className="py-1">
                            <motion.li
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                onClick={() => handleView(order.id)}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                              >
                                View
                              </button>
                            </motion.li>
                            <motion.li
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                              >
                                Delete
                              </button>
                            </motion.li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderHistoryPage;
