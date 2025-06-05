"use client";

import { motion } from "framer-motion";

type CartItem = {
  id: number;
  image: string;
  product: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type CartItemsProps = {
  items: CartItem[];
  onRemove: (index: number) => void;
  onQuantityChange: (id: number, delta: number) => void;
};

export const CartItems = ({
  items,
  onRemove,
  onQuantityChange,
}: CartItemsProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b font-poppins text-gray-700">
            <th className="px-2 py-4 text-left font-medium">Product</th>
            <th className="px-2 py-4 text-left font-medium">Quantity</th>
            <th className="px-2 py-4 text-left font-medium">Price</th>
            <th className="px-2 py-4 text-left font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <motion.tr
              key={index}
              className="border-b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="px-2 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-20 w-20 items-center justify-center rounded border bg-[#F3F5F7]">
                    <img
                      src={item.image}
                      alt={item.product}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-poppins text-base font-bold text-gray-700">
                      {item.product}
                    </p>
                    <p className="text-sm text-gray-400">Color: {item.color}</p>
                    <button
                      onClick={() => onRemove(index)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      X Remove
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-2 py-4">
                <div className="flex items-center justify-center gap-2 rounded-lg border">
                  <button
                    onClick={() => onQuantityChange(item.id, -1)}
                    className="px-2 py-1"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(item.id, 1)}
                    className="px-2"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-2 py-4">${item.price.toFixed(2)}</td>
              <td className="px-2 py-4 font-bold text-gray-700">
                ${item.subtotal.toFixed(2)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
