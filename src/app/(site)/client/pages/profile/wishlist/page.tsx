"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

const wishlistItems = [
  {
    id: 1,
    title: "Skullcandy - Rail",
    color: "Black",
    price: "$159.19",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVGHL9r9OucwArH8yO3rEDPryG4V3tSCBw-w&s",
  },
  {
    id: 2,
    title: "Skullcandy - Rail",
    color: "Black",
    price: "$159.19",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVGHL9r9OucwArH8yO3rEDPryG4V3tSCBw-w&s",
  },
  {
    id: 3,
    title: "Skullcandy - Rail",
    color: "Black",
    price: "$159.19",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVGHL9r9OucwArH8yO3rEDPryG4V3tSCBw-w&s",
  },
  {
    id: 4,
    title: "Skullcandy - Rail True",
    color: "Black",
    price: "$159.19",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVGHL9r9OucwArH8yO3rEDPryG4V3tSCBw-w&s",
  },
];

const WishlistPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="space-y-6 font-poppins"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        Your Wishlist
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="w-10"></th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {wishlistItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  className="relative hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4">
                    <button className="hover:scale-10 transition">
                      <X className="h-4 w-4 text-gray-400 transition-colors duration-200 hover:text-red-500" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-12 rounded-md object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Color: {item.color}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {item.price}
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                    >
                      Add to cart
                    </motion.button>
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

export default WishlistPage;
