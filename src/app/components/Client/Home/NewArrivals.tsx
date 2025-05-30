"use client";

import homeClientApi from "@/src/app/server/client/home/home.route";
import { mdiCircle, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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
      <div className="flex items-center justify-between px-5 mb-4">
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
              className={`rounded-full px-1 py-1 text-sm transition-all duration-200 ${page === num
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
        <div className="pl-5 mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 w-max">
            {newArrivals.map((item) => (
              <div className="flex gap-1">
                <div key={item.id} className="">
                  <div className="group relative min-h-[20px] min-w-[260px] overflow-hidden rounded-xl border bg-gray-100 p-4 shadow-sm transition hover:shadow-md dark:bg-transparent">
                    {/* NEW Badge */}
                    {item.is_new && (
                      <div className="absolute px-2 py-1 text-xs font-bold text-black bg-white rounded left-2 top-2">
                        NEW
                      </div>
                    )}

                    {/* Favorite Icon */}
                    <motion.div
                      className="absolute z-10 cursor-pointer right-2 top-2"
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
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                      <button className="absolute inset-x-0 bottom-0 py-2 text-sm font-medium text-white transition-all duration-500 translate-y-full bg-black opacity-0 hover:bg-gray-800 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-gray-300 dark:text-gray-700">
                        Add to cart
                      </button>
                    </div>
                  </div>

                  <div>
                    {/* Stars */}
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const filled = i < Math.floor(item.stars);
                        return (
                          <span
                            key={i}
                            className={`inline-block ${filled ? "text-black dark:text-gray-300" : "text-gray-300 dark:text-gray-600"}`}
                          >
                            <Star
                              className={`w-5 h-5 ${filled ? "fill-current" : ""}`}
                              strokeWidth={filled ? 0 : 1.5}
                            />
                          </span>
                        );
                      })}
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
