"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  stock: number;
  category_id: number;
  stars: number;
  brand_id: number;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_favorite: boolean;
  created_at: string;
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  product_images: Array<{
    id: number;
    image_url: string;
  }>;
  discounts: Array<{
    id: number;
    discount_percentage: number;
    start_date: string;
    end_date: string;
  }>;
  color: string;
};

const OrderCompletePage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(476.94);
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);

  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const [orderData, setOrderData] = useState<any>(null);

  const handleGoToDelivery = () => {
    const encodedOrderData = encodeURIComponent(
      JSON.stringify({
        items,
        subtotal,
        orderData,
      }),
    );

    router.push(
      `/client/pages/shop/view/${params.id}/delivery/completed?order=${encodedOrderData}`,
    );
  };

  const handleGoToPurchaseHistory = () => {
    // Navigate to the purchase history page
    router.push(`/client/pages/profile/orders`);
  };

  useEffect(() => {
    if (orderParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(orderParam));
        setOrderData(decoded);
        setItems(decoded.items || []);
        setSubtotal(decoded.subtotal || 0);
        setLoading(false); // Make sure loading is set to false once data is parsed
      } catch (error) {
        console.error("Invalid order data", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [orderParam]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center justify-center pt-10">
        {/* Thank  */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold text-[#6C7275] dark:text-gray-100">
            Thank you! 🎉
          </h1>
          <p className="pt-10 text-3xl text-gray-900 dark:text-gray-400">
            Your order has been received
          </p>
        </div>

        <div className="flex flex-row space-x-4 pt-10">
          {items.map((item) => (
            <div key={item.id} className="relative flex gap-2">
              {/* Quantity badge */}
              <span className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs  text-white">
                {item.quantity}
              </span>

              {/* Image container */}
              <div className="flex h-20 w-20 items-center justify-center rounded border border-gray-700 bg-[#F3F5F7]">
                <img
                  src={
                    item.product_images?.[0]?.image_url ||
                    "/images/product/image.png"
                  }
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div className="mt-6  text-sm text-gray-700">
          <div className="flex justify-between gap-4 py-2">
            <span className="text-gray-500">Order code:</span>
            <span className="font-bold">{params.id}</span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-gray-500">Date:</span>
            <span className="font-bold">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-gray-500">Total:</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-gray-500">Payment method:</span>
            <span className="font-bold">
              {orderData?.paymentMethods?.paymentMethod ||
                (orderData?.paymentMethods?.cardNumber
                  ? `**** **** **** ${orderData.paymentMethods.cardNumber.slice(-4)}`
                  : "-")}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-2 pt-6">
          <button
            className="w-full rounded-3xl border border-gray-400 px-4 py-3 text-sm font-normal text-black hover:bg-gray-200"
            onClick={handleGoToDelivery}
          >
            Go to Delivery
          </button>
          <button
            className="w-full rounded-3xl bg-black px-4 py-3 text-sm font-normal text-white hover:bg-gray-700"
            onClick={handleGoToPurchaseHistory}
          >
            Purchase History
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCompletePage;
