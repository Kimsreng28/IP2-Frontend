'use client';

import BestSeller from '@/src/app/components/Client/Home/BestSeller';
import NewArrivals from '@/src/app/components/Client/Home/NewArrivals';
import ServiceShop from '@/src/app/components/Client/Home/ServiceShop';
import ShopCollection from '@/src/app/components/Client/Home/ShopCollection';
import { useEffect, useState } from 'react';
import BannerRotator, { Banner } from '../../../../components/Client/Home/BannerRotator';
import homeClientApi from '../../../../server/client/home/home.route';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDataBanner();
  }, []);


  const fetchDataBanner = async () => {
    try {
      const data = await homeClientApi.getBanners();
      if ('error' in data) {
        setError(data.error);
      } else {
        setBanners(data);
      }
    } catch (err) {
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full'>
        <div className="flex flex-col items-center w-full justify-center min-h-screen">
          {loading ? (<p>Loading...</p>) : error ? (<p className="text-red-500">{error}</p>)
            : (<BannerRotator banners={banners} />)}
        </div>
        <div>
          <div className="flex flex-col items-center justify-center w-full ">
            {/* New Arrivals Component */}
            <NewArrivals />
          </div>
          <ShopCollection />
          <BestSeller />
          <ServiceShop />
        </div>
      </div>
    </>
  );
}
