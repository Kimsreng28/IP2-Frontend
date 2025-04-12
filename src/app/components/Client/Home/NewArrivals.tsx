'use client';

import homeClientApi from '@/src/app/server/client/home/home.route';
import { mdiCircle, mdiHeart, mdiHeartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
      if ('error' in data) {
        setError(data.error);
        setNewArrivals([]); // clear on error
      } else {
        setNewArrivals(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load new arrivals');
      setNewArrivals([]);
    } finally {
      setLoading(false);
    }
  };
  const toggleFavorite = async (id: number) => {
    // Optimistic UI update
    setNewArrivals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      )
    );
    try {
      await homeClientApi.updateFavoriteStatus(id);
    } catch (error) {
      setNewArrivals((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
        )
      );
    }
  };


  return (
    <div className="container mx-auto mt-6">
      <div className="flex items-center justify-between mb-4 px-5">
        <h2 className="text-2xl text-black dark:text-gray-300 font-semibold">New Arrivals</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map((num) => (
            <motion.button
              key={num}
              onClick={() => setPage(num)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={`text-sm px-1 py-1 rounded-full transition-all duration-200 ${page === num
                ? 'bg-white text-black dark:bg-black dark:text-white border border-black dark:border-white'
                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white border-gray-300 dark:border-gray-600'
                }`}
            >
              <Icon
                path={mdiCircle}
                size={0.5}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : newArrivals.length === 0 ? (
        <p>No new arrivals available.</p>
      ) : (
        <div className="pl-5 overflow-x-auto scrollbar-hide mb-4">
          <div className="flex gap-4 w-max">
            {newArrivals.map((item) => (
              <div className='flex gap-1'>
                <div
                  key={item.id}
                  className=""
                >
                  <div className='border bg-gray-100 dark:bg-transparent rounded-xl shadow-sm p-4 hover:shadow-md transition relative overflow-hidden group min-h-[20px]'>
                    {/* NEW Badge */}
                    {item.is_new && (
                      <div className="absolute top-2 left-2 text-black bg-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </div>
                    )}

                    {/* Favorite Icon */}
                    <motion.div
                      className="absolute top-2 right-2 cursor-pointer z-10"
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
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <button className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-black text-white py-2 text-sm font-medium transition-all duration-500 hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-700">
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
                          className={`text-black dark:text-gray-300 text-2xl ${i < Math.floor(item.stars)
                            ? ''
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-black max-w-[220px] min-w-[220px] dark:text-gray-300 text-base font-semibold mb-1">
                      {item.title}
                    </h3>

                    {/* Price */}
                    <p className="text-black dark:text-gray-300 text-[13px] font-bold">
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
