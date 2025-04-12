'use client';

import homeClientApi from '@/src/app/server/client/home/home.route';
import { mdiHeart, mdiHeartOutline } from '@mdi/js';
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold">New Arrivals</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`text-sm px-3 py-1 rounded border ${page === num
                ? 'bg-black text-white'
                : 'text-gray-500 hover:text-black border-gray-300'
                } transition`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : newArrivals.length === 0 ? (
        <p>No new arrivals available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newArrivals.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl shadow-sm p-4 hover:shadow-md transition relative"
            >
              {/* NEW Badge */}
              {item.is_new && (
                <div className="absolute top-2 left-2 text-black bg-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
              {/* Favorite Icon */}
              <motion.div
                className="absolute top-2 right-2 cursor-pointer"
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

              {/* Product Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-contain mb-4"
              />

              {/* Title */}
              <h3 className="text-lg font-semibold">{item.title}</h3>

              {/* Stars */}
              <div className="flex items-center mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-yellow-500 text-sm ${i < Math.floor(item.stars) ? '' : 'text-opacity-30'
                      }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 text-sm text-gray-600">
                  {item.stars}
                </span>
              </div>

              {/* Price */}
              <p className="text-lg font-bold">${item.price}</p>

              {/* Add to Cart Button */}
              <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
