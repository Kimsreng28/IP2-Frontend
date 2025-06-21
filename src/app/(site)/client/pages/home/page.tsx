"use client";

import BestSeller from "@/src/app/components/Client/Home/BestSeller";
import NewArrivals from "@/src/app/components/Client/Home/NewArrivals";
import ServiceShop from "@/src/app/components/Client/Home/ServiceShop";
import ShopCollection from "@/src/app/components/Client/Home/ShopCollection";
import SharedFooterComponent from "@/src/app/components/shared/footer";
import { useEffect, useState } from "react";
import BannerRotator, { Banner } from "../../../../components/Client/Home/BannerRotator";
const mockData = [
  {
    id: 1,
    title: 'Enjoyed the electronic productsqqqq',
    image: '/images/product/image.png',
    color: '#377dff',
    description: 'Experience sale-online like never before',
  },
  {
    id: 2,
    title: 'Discover the latest trends',
    image: '/images/product/image1.png',
    color: '#377dff',
    description: 'Shop the latest trends in fashion and electronics',
  },
  {
    id: 3,
    title: 'Grab the best deals',
    image: '/images/product/image2.png',
    color: '#377dff',
    description: 'Find the best deals on electronics and fashion',
  },
];
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDataBanner();
  }, []);

  const fetchDataBanner = async () => {
    try {
      setBanners(mockData);
    } catch (err) {
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <BannerRotator banners={banners} />
          )}
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
      <SharedFooterComponent></SharedFooterComponent>
    </>
  );
}
