"use client";

import { CartItems } from "@/src/app/components/Client/checkout/shopping/CartItem";
import { CartSummary } from "@/src/app/components/Client/checkout/shopping/CartSummary";
import env from "@/src/envs/env";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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

const ShoppingCartPage = ({ params }: { params: { id: string } }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [shippingOptions, setShippingOptions] = useState([
    { id: "free", name: "Free shipping", price: 0, selected: true },
    { id: "express", name: "Express shipping", price: 15, selected: false },
    { id: "pickup", name: "Pick Up", price: 21, selected: false },
  ]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/client/auth");
          return;
        }

        const response = await fetch(
          `${process.env.API_BASE_URL}/client/shop/cart`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        setItems(data);
        calculateSubtotal(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load cart",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const calculateSubtotal = (cartItems: CartItem[]) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setSubtotal(parseFloat(total.toFixed(2)));
  };

  const handleShippingSelect = (id: string) => {
    const updatedOptions = shippingOptions.map((option) => ({
      ...option,
      selected: option.id === id,
    }));
    setShippingOptions(updatedOptions);
  };

  // In ShoppingCartPage component
  const handleCheckout = () => {
    const selectedShipping = shippingOptions.find((option) => option.selected);
    const cartData = {
      items: items.map((item) => ({
        id: item.id,
        product_id: item.uuid,
        name: item.name,
        image:
          item.product_images?.[0]?.image_url || "/images/product/image.png",
        color: "Default", // You might want to get this from product details
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        stock: item.stock, // Include stock information
      })),
      subtotal,
      shippingOption: selectedShipping,
      // Include any additional metadata you need
      timestamp: new Date().toISOString(),
      cartId: params.id, // The cart ID from URL params
    };

    // Encode the cart data for URL
    const encodedCartData = encodeURIComponent(JSON.stringify(cartData));

    router.push(
      `/client/pages/shop/view/${params.id}/checkout/cart/checkoutDetails?cart=${encodedCartData}`,
    );
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/client/auth");
        return;
      }

      // Store current items for potential rollback
      const currentItems = [...items];

      // Optimistic update
      const updatedItems = items.filter((item) => item.id !== cartItemId);
      setItems(updatedItems);
      calculateSubtotal(updatedItems);

      const response = await fetch(
        `${env.API_BASE_URL}/client/shop/cart/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        // Revert on error
        setItems(currentItems);
        calculateSubtotal(currentItems);
        throw new Error((await response.text()) || "Failed to remove item");
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const onQuantityChange = async (cartItemId: number, delta: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/client/auth");
        return;
      }

      // Find the item to update
      const itemToUpdate = items.find((item) => item.id === cartItemId);
      if (!itemToUpdate) return;

      // Calculate new quantity
      const newQuantity = Math.max(1, itemToUpdate.quantity + delta);

      // Optimistic UI update
      const updatedItems = items.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
      );
      setItems(updatedItems);
      calculateSubtotal(updatedItems);

      // Update on server
      const response = await fetch(
        `${env.API_BASE_URL}/client/shop/cart/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading cart...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      className="space-y-6 font-poppins"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          <CartItems
            items={items.map((item) => ({
              id: item.id,
              product: item.name,
              image:
                item.product_images?.[0]?.image_url ||
                "/images/product/image.png",
              color: "Default", // You might want to get this from product details
              price: item.price,
              quantity: item.quantity,
              subtotal: item.price * item.quantity,
            }))}
            onRemove={handleRemove}
            onQuantityChange={onQuantityChange}
          />
        </div>

        <div className="lg:w-1/3">
          <CartSummary
            subtotal={subtotal}
            onCheckout={handleCheckout}
            shippingOptions={shippingOptions}
            onShippingSelect={handleShippingSelect}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ShoppingCartPage;
