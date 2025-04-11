'use client';

import { useEffect, useState } from 'react';
import { getBanners } from '../../../../server/client/home/banner';

type Banner = {
  id: number;
  title: string;
  image: string;
  color: string;
  button_title: string;
};

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getBanners().then((data) => {
      // Check if there was an error from the API
      if (data.error) {
        setError(data.error);
      } else {
        setBanners(data);
      }
      setLoading(false);
    })
    .catch((error) => {
      setError('Failed to load banners');
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🔥 Hot Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4 w-full max-w-md">
          {banners.map((banner) => (
            <li key={banner.id} className="p-4 border rounded shadow">
              <div className="font-semibold">{banner.title}</div>
              <div className="text-gray-500">{banner.button_title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
