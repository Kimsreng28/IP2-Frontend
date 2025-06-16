"use client";

import { motion } from "framer-motion";
import { PercentIcon } from "lucide-react";
import Image from "next/image"; // Import Next.js Image component
import { useState } from "react";

type ShippingOption = {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
};

type CartItem = {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  description: string;
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

type CartSummaryProps = {
  subtotal: number;
  onCheckout?: () => void;
  items: CartItem[];
  shippingOption?: ShippingOption;
};

export const OrderSummary = ({
  subtotal,
  onCheckout,
  items = [],
  shippingOption,
}: CartSummaryProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode === "SAVE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  const shippingCost = shippingOption ? shippingOption.price : 0;
  const total = subtotal + shippingCost - discount;

  return (
    <motion.div
      className="rounded-lg border border-gray-200 bg-gray-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="mb-4 font-poppins text-lg font-bold text-gray-700">
        Order summary
      </h3>

      <div className="flex flex-col space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm"
          >
            {/* Image Container */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
              {item.product_images ? (
                <Image
                  src={item.product_images[0].image_url}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/product/image.png";
                  }}
                />
              ) : (
                <Image
                  src="/images/product/image.png"
                  alt="Placeholder"
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-2"
                />
              )}
            </div>

            {/* Product Info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="whitespace-nowrap font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-500">Color:</span>
                <span className="text-sm font-medium text-gray-700">
                  {item.color}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex w-fit items-center rounded-md border">
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Qty: {item.quantity}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of the component remains the same */}
      <div className="my-4 border-t" />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <PercentIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full rounded-lg border p-2 pl-10 text-sm"
          />
        </div>
        <button
          onClick={handleApplyCoupon}
          className="rounded-lg bg-black px-4 text-sm text-white hover:bg-gray-800"
        >
          Apply
        </button>
      </div>

      {discount > 0 && (
        <div className="mt-4 flex justify-between text-lg font-bold text-green-600">
          <div className="flex items-center gap-1">
            <PercentIcon className="h-5 w-5 text-green-600" />
            <span>Coupon Applied</span>
          </div>
          <span>- ${discount.toFixed(2)}</span>
        </div>
      )}

      <div className="my-4 border-t" />

      <div className="flex justify-between font-normal text-gray-700">
        <span>Shipping</span>
        <span className="font-bold">${shippingCost.toFixed(2)}</span>
      </div>

      <div className="my-4 border-t" />

      <div className="flex justify-between font-medium text-gray-700">
        <span>Subtotal</span>
        <span className="font-bold">${subtotal.toFixed(2)}</span>
      </div>

      <div className="my-4 border-t" />

      <div className="flex justify-between text-xl font-bold text-gray-800">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </motion.div>
  );
};
