"use client";

import homeClientApi from "@/src/app/server/client/home/home.route";
import { mdiCircle, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type NewArrival = {
  id: number;
  title: string;
  image: string;
  is_favorite: boolean;
  is_new: boolean;
  description: string;
  price: string;
  stars: number;
  created_at: string;
};

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchNewArrivals({ page });
  }, [page]);

  const fetchNewArrivals = async (params: { page?: number }) => {
    setLoading(true);
    try {
      const data = await homeClientApi.getNewArrivals(params);
      if ("error" in data) {
        setError(data.error);
        setNewArrivals([]); // clear on error
      } else {
        setNewArrivals(data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load new arrivals");
      setNewArrivals([]);
    } finally {
      setLoading(false);
    }
  };
  const toggleFavorite = async (id: number) => {
    const item = newArrivals.find((item) => item.id === id);
    const isFavorite = item?.is_favorite;

    // Optimistic UI update
    setNewArrivals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item,
      ),
    );

    try {
      await homeClientApi.updateFavoriteStatus(id);
      alert(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      setNewArrivals((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: !item.is_favorite } : item,
        ),
      );
      alert("Failed to update favorite status");
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-2xl font-semibold text-black dark:text-gray-300">
          New Arrivals
        </h2>
        <div className="flex gap-2">
          {[1, 2, 3].map((num) => (
            <motion.button
              key={num}
              onClick={() => setPage(num)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`rounded-full px-1 py-1 text-sm transition-all duration-200 ${
                page === num
                  ? "border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                  : "border-gray-300 text-gray-500 hover:text-black dark:border-gray-600 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <Icon path={mdiCircle} size={0.5} />
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : newArrivals.length === 0 ? (
        <p>No new arrivals available.</p>
      ) : (
        <div className="scrollbar-hide mb-4 overflow-x-auto pl-5">
          <div className="flex w-max gap-4">
            {newArrivals.map((item) => (
              <div className="flex gap-1">
                <div key={item.id} className="">
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
                      onClick={() => toggleFavorite(item.id)}
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 1 }}
                      animate={{ scale: item.is_favorite ? 1.2 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      {item.is_favorite ? (
                        <Icon
                          className="text-red-400"
                          path={mdiHeart}
                          size={1}
                        />
                      ) : (
                        <Icon
                          className="text-gray-400"
                          path={mdiHeartOutline}
                          size={1}
                        />
                      )}
                    </motion.div>

                    {/* Image Container with Hover Add to Cart */}
                    <div className="relative mb-4 h-[240px] w-full overflow-hidden rounded">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <button className="absolute inset-x-0 bottom-0 translate-y-full bg-black py-2 text-sm font-medium text-white opacity-0 transition-all duration-500 hover:bg-gray-800 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-300 dark:text-gray-700">
                        Add to cart
                      </button>
                    </div>
                  </div>

                  <div>
                    {/* Stars */}
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-2xl text-black dark:text-gray-300 ${
                            i < Math.floor(item.stars)
                              ? ""
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="mb-1 min-w-[220px] max-w-[220px] text-base font-semibold text-black dark:text-gray-300">
                      {item.title}
                    </h3>

                    {/* Price */}
                    <p className="text-[13px] font-bold text-black dark:text-gray-300">
                      ${item.price}
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
