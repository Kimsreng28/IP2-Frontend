"use client";

import { motion } from "framer-motion";
import { PercentIcon } from "lucide-react";
import { useState } from "react";

type ShippingOption = {
  id: string;
  name: string;
  price: number;
  selected: boolean;
};

type CartSummaryProps = {
  subtotal: number;
  onCheckout: () => void;
  shippingOptions: ShippingOption[];
  onShippingSelect: (id: string) => void;
};

export const CartSummary = ({
  subtotal,
  onCheckout,
  shippingOptions,
  onShippingSelect,
}: CartSummaryProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState(
    shippingOptions.find((opt) => opt.selected) || shippingOptions[0],
  );

  const handleShippingSelect = (id: string) => {
    const option = shippingOptions.find((opt) => opt.id === id);
    if (option) {
      setSelectedShipping(option);
      onShippingSelect(id);
    }
  };

  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingCost;

  return (
    <motion.div
      className="rounded-lg border border-gray-200 bg-gray-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="mb-4 font-poppins text-lg font-bold text-gray-700">
        Cart summary
      </h3>

      <div className="mb-6 space-y-3">
        {shippingOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center rounded-lg border p-4"
          >
            <input
              type="radio"
              id={option.id}
              name="shipping"
              checked={selectedShipping?.id === option.id}
              onChange={() => handleShippingSelect(option.id)}
              className="mr-2"
            />
            <label htmlFor={option.id} className="flex-1">
              {option.name}
            </label>
            <span>
              {option.price > 0 ? `+$${option.price.toFixed(2)}` : "$0.00"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between pb-2 font-medium text-gray-700">
        <span>Subtotal</span>
        <span className="font-bold">${subtotal.toFixed(2)}</span>
      </div>

      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-lg font-bold text-gray-700">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onCheckout}
          className="w-full rounded-lg bg-black py-3 text-white transition-colors hover:bg-gray-800"
        >
          Checkout
        </button>
      </div>

      <div className="mt-4">
        <div className="flex flex-col">
          <span className="mb-2 font-semibold text-gray-700">
            Have a coupon?
          </span>
          <span className="mb-2 text-xs text-gray-500">
            Add your code for an instant cart discount
          </span>
          <div className="flex">
            <div className="relative flex-1">
              <PercentIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full rounded-l border p-2 pl-10"
              />
            </div>
            <button className="rounded-r bg-gray-100 px-4 hover:bg-gray-300">
              Apply
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
