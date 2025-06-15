"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  product_images: { url: string }[];
};

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingOption, setShippingOption] = useState("free");
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.API_BASE_URL}/client/shop/product/cart`,
        { headers },
      );

      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      setCartItems(data.data || []);
      calculateSubtotal(data.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setSubtotal(total);
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.API_BASE_URL}/client/shop/product/${productId}/cart`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        },
      );

      if (!response.ok) throw new Error("Failed to update cart");

      // Update local state
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
      calculateSubtotal(
        cartItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );

      // Update the count in navigation
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.API_BASE_URL}/client/shop/product/${productId}/cart`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to remove from cart");

      // Update local state
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId),
      );
      calculateSubtotal(
        cartItems.filter((item) => item.product_id !== productId),
      );

      // Update the count in navigation
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const handleShippingChange = (option: string) => {
    setShippingOption(option);
  };

  const getShippingCost = () => {
    switch (shippingOption) {
      case "express":
        return 15;
      case "pickup":
        return 21;
      default:
        return 0;
    }
  };

  const handleCheckout = () => {
    const checkoutData = {
      items: cartItems,
      subtotal,
      shipping: {
        option: shippingOption,
        cost: getShippingCost(),
      },
      total: subtotal + getShippingCost(),
    };

    router.push(
      `/client/checkout?data=${encodeURIComponent(JSON.stringify(checkoutData))}`,
    );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <div className="py-8 text-center">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {cartItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-lg">Your cart is empty</p>
          <button
            onClick={() => router.push("/client/pages/shop")}
            className="rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            <div className="divide-y rounded-lg border">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={
                      item.product_images[0]?.url || "/images/product/image.png"
                    }
                    alt={item.name}
                    className="h-24 w-24 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/product/image.png";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium">{item.name}</h3>
                    <p className="mb-2 text-lg font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity - 1)
                        }
                        className="rounded-l border px-3 py-1 transition-colors hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 border-b border-t px-4 py-1 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                        className="rounded-r border px-3 py-1 transition-colors hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="self-start p-2 text-gray-500 transition-colors hover:text-red-500 sm:self-center"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-4 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

              <div className="mb-4 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingOption === "free"}
                      onChange={() => handleShippingChange("free")}
                      className="h-4 w-4"
                    />
                    <span>Free Shipping (${0})</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingOption === "express"}
                      onChange={() => handleShippingChange("express")}
                      className="h-4 w-4"
                    />
                    <span>Express Shipping (${15})</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingOption === "pickup"}
                      onChange={() => handleShippingChange("pickup")}
                      className="h-4 w-4"
                    />
                    <span>Pick Up (${21})</span>
                  </label>
                </div>
              </div>

              <div className="my-4 border-t"></div>

              <div className="mb-6 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${(subtotal + getShippingCost()).toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded bg-black py-3 text-white transition-colors hover:bg-gray-800"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
