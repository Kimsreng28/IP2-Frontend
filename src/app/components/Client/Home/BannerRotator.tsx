'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type Banner = {
  id: number;
  title: string;
  image: string;
  color: string;
  description: string;
};

type Props = {
  banners: Banner[];
};

export default function BannerRotator({ banners }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 10000); // 10 seconds for banner change

      return () => clearInterval(interval);
    }
  }, [banners]);

  if (banners.length === 0) {
    return <p>No banners available.</p>;
  }

  const banner = banners[currentIndex];

  return (
    <motion.div
      key={banner.id} // This key will trigger motion animation on data change
      className="w-full h-screen flex flex-col md:flex-row items-center dark:bg-transparent justify-center p-10"
      style={{ backgroundColor: banner.color }}
      initial={{ opacity: 0.5, y: 40 }}         // Start lower & invisible
      animate={{ opacity: 1, y: 0.5 }}          // Move to center & fade in
      exit={{ opacity: 0, y: -30 }}           // Fade out & move up slightly
      transition={{ duration: 1, ease: 'easeInOut' }}  // Smooth and natural
    >
      {/* Banner Image */}
      <div className="w-full h-[300px] md:h-full flex justify-center xl:justify-end md:justify-end items-center xl:mt-[130px] sm:mt-[130px] md:mt-[130px] mt-0">
        <img
          src={banner.image}
          alt={banner.title}
          className="h-full object-contain max-h-[400px] md:max-h-full"
        />
      </div>

      {/* Banner Content */}
      <div className="w-full flex flex-col justify-center items-center text-center px-4 md:px-8 gap-6">
        <h2 className="text-3xl sm:text-5xl md:text-7xl md:w-[500px] font-semibold leading-tight break-words text-gray-100">
          {banner.title}
        </h2>
        <p className="text-base md:text-lg text-gray-100">{banner.description}</p>
        <button
          type="button"
          className="bg-black hover:bg-blue-700 text-white rounded-lg text-sm px-6 py-3 transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Shopping Now
        </button>
      </div>
    </motion.div>
  );
}
