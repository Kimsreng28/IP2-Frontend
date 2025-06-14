"use client";

import { CartItems } from "@/src/app/components/Client/checkout/shopping/CartItem";
import { CartSummary } from "@/src/app/components/Client/checkout/shopping/CartSummary";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ShoppingCartPage = ({ params }: { params: { id: string } }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      product: "Skulicandy - Rail True Wireless Earbuds",
      image: "/images/product/image.png",
      color: "Black",
      price: 79.99,
      quantity: 2,
      subtotal: 159.98,
    },
    {
      id: 2,
      product: "Skulicandy - Rail True Wireless Earbuds",
      image: "/images/product/image.png",
      color: "Black",
      price: 79.99,
      quantity: 2,
      subtotal: 159.98,
    },
    {
      id: 3,
      product: "Skulicandy - Rail True Wireless Earbuds",
      image: "/images/product/image.png",
      color: "Black",
      price: 79.99,
      quantity: 2,
      subtotal: 159.98,
    },
  ]);

  const router = useRouter();

  const [subtotal, setSubtotal] = useState(476.94);
  const [shippingOptions, setShippingOptions] = useState([
    { id: "free", name: "Free shipping", price: 0, selected: true },
    { id: "express", name: "Express shipping", price: 15, selected: false },
    { id: "pickup", name: "Pick Up", price: 21, selected: false },
  ]);

  const handleShippingSelect = (id: string) => {
    const updatedOptions = shippingOptions.map((option) => ({
      ...option,
      selected: option.id === id,
    }));
    setShippingOptions(updatedOptions);
  };

  const handleCheckout = () => {
    const selectedShipping = shippingOptions.find((option) => option.selected);
    const cartData = {
      items,
      subtotal,
      shippingOption: selectedShipping,
    };

    // Encode the cart data for URL
    const encodedCartData = encodeURIComponent(JSON.stringify(cartData));

    router.push(
      `/client/pages/shop/view/${params.id}/checkout/cart/checkoutDetails?cart=${encodedCartData}`,
    );
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    updateSubtotal(newItems);
  };

  const onQuantityChange = (id: number, delta: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        const newSubtotal = parseFloat((item.price * newQuantity).toFixed(2));
        return { ...item, quantity: newQuantity, subtotal: newSubtotal };
      }
      return item;
    });
    setItems(updatedItems);
    updateSubtotal(updatedItems);
  };

  const updateSubtotal = (items: any[]) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(newSubtotal);
  };

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
            items={items}
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
