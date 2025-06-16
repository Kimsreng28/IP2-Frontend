"use client";

import env from "@/src/envs/env";
import { Product } from "@/src/interface/product.interface";
import { mdiCircle, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(3); // Default to 3, will be updated from API
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const fileUrl = `${env.FILE_BASE_URL}`;
  const router = useRouter();
  // Add this useEffect to NewArrivals component
  useEffect(() => {
    fetchNewArrivals({ page });
  }, [page]);

  // Helper function to get headers with token if available
  const getHeaders = () => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Get token from localStorage if available
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const fetchNewArrivals = async (params: { page?: number }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(
        `${env.API_BASE_URL}/client/home/new-arrival?page=${params.page ?? 1}&limit=10`,
        { headers },
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setNewArrivals([]);
      } else if (result.status === 200 && result.data) {
        const newArrivalsData = result.data
          .filter((item: Product) => item.is_new_arrival)
          .map((item: Product) => ({
            ...item,
            is_favorite: item.is_favorite || false,
            is_new: item.is_new || item.is_new_arrival || false,
            stars: item.stars ?? Math.floor(Math.random() * 5) + 1,
          }));

        setNewArrivals(newArrivalsData);
        setError(null);

        // Update pagination
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages ?? 3);
          setHasNextPage(result.pagination.hasNextPage ?? false);
        } else {
          setHasNextPage(newArrivalsData.length === 10);
        }
      } else {
        setNewArrivals([]);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load new arrivals",
      );
      setNewArrivals([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/client/auth");
        return;
      }

      // Get current favorite status
      const currentItem = newArrivals.find((item) => item.id === id);
      const isFavorite = currentItem?.is_favorite || false;

      // Optimistic UI update
      setNewArrivals((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: !isFavorite } : item,
        ),
      );

      // Use DELETE for removing, POST for adding
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(
        `${env.API_BASE_URL}/client/shop/wishlist/${id}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        // Revert on error
        setNewArrivals((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isFavorite } : item)),
        );
        throw new Error("Failed to update wishlist");
      }

      // Dispatch update event
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add to Cart
  const handleAddToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/client/auth");
        return;
      }

      const response = await fetch(`${env.API_BASE_URL}/client/shop/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to add to cart");
      }

      // Dispatch custom event with updated count
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: data.count }, // Ensure your API returns the new count
        }),
      );
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const getPageNumbers = () => {
    const pages: number[] = [];

    for (let i = 1; i <= 3; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-2xl font-semibold text-black dark:text-gray-300">
          New Arrivals
        </h2>
        <div className="flex gap-2">
          {getPageNumbers().map((num) => (
            <motion.button
              key={num}
              onClick={() => setPage(num)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              disabled={loading}
              className={`rounded-full px-1 py-1 text-sm transition-all duration-200 ${
                page === num
                  ? "border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                  : "border-gray-300 text-gray-500 hover:text-black dark:border-gray-600 dark:text-gray-400 dark:hover:text-white"
              } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <Icon path={mdiCircle} size={0.5} />
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : newArrivals.length === 0 ? (
        <p className="text-center text-gray-500">No new arrivals available.</p>
      ) : (
        <div className="scrollbar-hide mb-4 overflow-x-auto pl-5">
          <div className="flex w-max gap-4">
            {newArrivals.map((item) => (
              <div key={item.id} className="flex gap-1">
                <div className="">
                  <div className="group relative min-h-[20px] min-w-[260px] overflow-hidden rounded-xl border bg-gray-100 p-4 shadow-sm transition hover:shadow-md dark:bg-transparent">
                    {/* NEW Badge */}
                    {item.is_new && (
                      <div className="absolute left-2 top-2 rounded bg-white px-2 py-1 text-xs font-bold text-black">
                        NEW
                      </div>
                    )}
                    {/* Favorite Icon */}
                    <motion.div
                      className="absolute right-2 top-2 z-10 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: item.is_favorite ? [1, 1.2, 1] : 1,
                        color: item.is_favorite ? "#ef4444" : "#9ca3af",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      {item.is_favorite ? (
                        <Icon
                          className="text-red-500"
                          path={mdiHeart}
                          size={1}
                        />
                      ) : (
                        <Icon
                          className="text-gray-400 hover:text-gray-600"
                          path={mdiHeartOutline}
                          size={1}
                        />
                      )}
                    </motion.div>

                    {/* Image Container with Hover Add to Cart */}
                    <div className="relative mb-4 h-[240px] w-full overflow-hidden rounded">
                      <img
                        onClick={() =>
                          router.push(`/client/pages/shop/view/${item.id}`)
                        }
                        src={
                          item.product_images.length > 0
                            ? fileUrl + item.product_images[0].image_url
                            : "/images/product/image.png"
                        }
                        alt={item.name}
                        className="h-full w-full cursor-pointer object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/images/product/image.png";
                        }}
                      />
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="absolute inset-x-0 bottom-0 translate-y-full bg-black py-2 text-sm font-medium text-white opacity-0 transition-all duration-500 hover:bg-gray-800 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-300 dark:text-gray-700"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>

                  <div>
                    {/* Stars */}
                    <div className="mt-1 flex items-center">
                      {Array.from({ length: 5 }, (_, i) => {
                        const filled = i < Math.floor(item.stars || 0);
                        return (
                          <span
                            key={i}
                            className={`inline-block ${
                              filled
                                ? "text-black dark:text-gray-300"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          >
                            <Star
                              className={`h-5 w-5 ${filled ? "fill-current" : ""}`}
                              strokeWidth={filled ? 0 : 1.5}
                            />
                          </span>
                        );
                      })}
                    </div>

                    {/* Title */}
                    <h3 className="mb-1 min-w-[220px] max-w-[220px] text-base font-semibold text-black dark:text-gray-300">
                      {item.name}
                    </h3>

                    {/* Price */}
                    <p className="text-[13px] font-bold text-black dark:text-gray-300">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
