'use client';

import homeClientApi from '@/src/app/server/client/home/home.route';
import { mdiHeart, mdiHeartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export type BestSeller = {
  id: number;
  title: string;
  image: string;
  is_favorite: boolean;
  is_hot: boolean;
  description: string;
  price: string;
  stars: number;
  created_at: string;
};

export default function BestSeller() {
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBestSellers();
  }, [page]);

  const fetchBestSellers = async () => {
    setLoading(true);
    try {
      const data = await homeClientApi.getBestSellers();
      if ('error' in data) {
        setError(data.error);
        setBestSellers([]);
      } else {
        setBestSellers(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load best sellers');
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: number) => {
    setBestSellers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      )
    );
    try {
      await homeClientApi.updateFavoriteStatus(id);
    } catch (error) {
      // Revert change on error
      setBestSellers((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
        )
      );
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex items-center justify-between px-5 mb-4">
        <h2 className="text-2xl font-semibold text-black dark:text-gray-300">Best Sellers</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : bestSellers.length === 0 ? (
        <p className="text-center text-gray-500">No best sellers available.</p>
      ) : (
        <div className="w-full px-5">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {bestSellers.map((item) => (
              <div
                key={item.id}
              >
                <div className='border bg-gray-100 dark:bg-transparent rounded-xl shadow-sm p-4 hover:shadow-md transition relative overflow-hidden group min-h-[20px]'>
                  {/* Hot Badge */}
                  {item.is_hot && (
                    <div className="absolute px-2 py-1 text-xs font-bold text-black bg-white rounded top-2 left-2">
                      HOT
                    </div>
                  )}

                  {/* Favorite Icon */}
                  <motion.div
                    className="absolute z-10 cursor-pointer top-2 right-2"
                    onClick={() => toggleFavorite(item.id)}
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    initial={{ scale: 1 }}
                    animate={{ scale: item.is_favorite ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    {item.is_favorite ? (
                      <Icon className="text-red-400" path={mdiHeart} size={1} />
                    ) : (
                      <Icon className="text-gray-400" path={mdiHeartOutline} size={1} />
                    )}
                  </motion.div>

                  {/* Image Container with Hover Add to Cart */}
                  <div className="relative w-full h-[240px] mb-4 overflow-hidden rounded">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <button className="absolute inset-x-0 bottom-0 py-2 text-sm font-medium text-white transition-all duration-500 translate-y-full bg-black opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-700">
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
                  <h3 className="text-black max-w-[220px] dark:text-gray-300 text-base font-semibold mb-1">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <p className="text-black dark:text-gray-300 text-[13px] font-bold">
                    ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
