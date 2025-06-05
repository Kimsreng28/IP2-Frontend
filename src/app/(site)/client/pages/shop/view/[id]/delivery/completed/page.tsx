"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  image: string;
  product: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
};

const Completed = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentChoose, setPaymentChoose] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (orderParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(orderParam));
        setItems(decoded.items || []);
        setSubtotal(decoded.subtotal || 0);
        setPaymentChoose(
          decoded.orderData?.paymentMethods?.paymentMethod || "",
        );
        setAddress(
          decoded.orderData?.deliveryAddress ||
            "847 Jewess Bridge Apt. 174, CAM, PP, 474-769-3919",
        );
      } catch (error) {
        console.error("Invalid order data", error);
      }
    }
    setLoading(false);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl px-4 py-4 font-poppins"
    >
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b pb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded border bg-[#F3F5F7]">
              <img
                src={item.image}
                alt={item.product}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex w-full flex-col justify-between">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {item.product}
                </p>
                <div className="flex flex-col space-y-4 text-right">
                  <p className="text-base font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </p>
                  <p className="flex gap-2 text-sm text-gray-500">
                    Qty:{" "}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs  text-white">
                      {item.quantity}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Color: {item.color}</p>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 gap-y-6 pt-6 text-sm font-medium text-gray-900 md:grid-cols-3 md:gap-x-8">
          {/* Payment Section */}
          <div>
            <p className="mb-1 font-semibold">Payment</p>
            <p className="text-gray-600">{paymentChoose}</p>
          </div>

          {/* Delivery Section */}
          <div>
            <p className="mb-1 font-semibold">Delivery</p>
            <p className="text-sm text-gray-600">Address</p>
            <p className="text-gray-600">847 Jewess Bridge Apt.</p>
            <p className="text-gray-600">174 CAM, PP</p>
            <p className="text-gray-600">474-769-3919</p>
          </div>

          {/* Total Section */}
          <div className="text-right">
            <p className="mb-1 font-semibold">Total</p>
            <p className="text-lg font-bold text-gray-900">
              $
              {items
                .reduce((total, item) => total + item.subtotal, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Completed;
