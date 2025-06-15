"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type WishlistItem = {
  id: number;
  product_id: number;
  name: string;
  color: string;
  price: string;
  image: string;
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get Products from the API Wishlist
        const response = await fetch(
          `${process.env.API_BASE_URL}/vendor/product`, // Adjust example catch from products automatically
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();
        console.log("Fetched wishlist data:", data);

        setWishlistItems(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router]);

  const removeFromWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");

      // Optimistic UI update
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );

      const response = await fetch(
        `${process.env.API_BASE_URL}/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const navigateToProduct = (productId: number) => {
    // Navigate to the product details page
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
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
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Your wishlist is empty. Start adding some products!
          </p>
        ) : (
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
                      <button
                        className="hover:scale-10 transition"
                        onClick={() => removeFromWishlist(item.product_id)}
                      >
                        <X className="h-4 w-4 text-gray-400 transition-colors duration-200 hover:text-red-500" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex cursor-pointer items-center gap-4"
                        onClick={() => navigateToProduct(item.product_id)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-md object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default WishlistPage;
