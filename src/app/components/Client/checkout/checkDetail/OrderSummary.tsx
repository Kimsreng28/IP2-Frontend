"use client";

import { motion } from "framer-motion";
import { PercentIcon } from "lucide-react";
import { useState } from "react";

type ShippingOption = {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
};

type CartItem = {
  id: number;
  image: string;
  product: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
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

      <div className="flex flex-col space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded border bg-[#F3F5F7]">
              <img
                src={item.image}
                alt={item.product}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex w-full justify-between">
                <p className="font-poppins text-sm text-gray-700">
                  {item.product}
                </p>
                <p className="font-poppins text-base font-bold text-gray-700">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-400">Color: {item.color}</p>
              <div className="flex w-15 items-center justify-between gap-1 rounded-md border px-2 py-0.5">
                <span className="text-xs font-medium">{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
