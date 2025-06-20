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
      className="flex flex-col items-center justify-center w-full h-screen p-10 md:flex-row dark:bg-transparent"
      style={{ backgroundColor: banner.color }}
      initial={{ opacity: 0.5, y: 40 }}         // Start lower & invisible
      animate={{ opacity: 1, y: 0.5 }}          // Move to center & fade in
      exit={{ opacity: 0, y: -30 }}           // Fade out & move up slightly
      transition={{ duration: 1, ease: 'easeInOut' }}  // Smooth and natural
    >
      <div className="flex items-center justify-center w-full h-screen">

      </div>
      {/* Banner Image */}
      <div className="w-full h-[300px] md:h-full flex justify-center xl:justify-end md:justify-end items-center xl:mt-[130px] sm:mt-[130px] md:mt-[130px] mt-0">
        <img
          src={banner.image}
          alt={banner.title}
          className="h-full object-contain max-h-[400px] md:max-h-full"
        />
      </div>

      {/* Banner Content */}
      <div className="flex flex-col items-center justify-center w-full gap-6 px-4 text-center md:px-8">
        <h2 className="text-3xl sm:text-5xl md:text-7xl md:w-[500px] font-semibold leading-tight break-words text-gray-100">
          {banner.title}
        </h2>
        <p className="text-base text-gray-100 md:text-lg">{banner.description}</p>
        <button
          type="button"
          className="px-6 py-3 text-sm text-white transition-all duration-200 bg-black rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Shopping Now
        </button>
      </div>
    </motion.div>
  );
}
