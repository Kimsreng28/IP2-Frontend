"use client";

import ContactInformation from "@/src/app/components/Client/checkout/checkDetail/ContactInformation";
import { OrderSummary } from "@/src/app/components/Client/checkout/checkDetail/OrderSummary";
import PaymentMethods from "@/src/app/components/Client/checkout/checkDetail/PaymentMethod";
import ShippingAddress from "@/src/app/components/Client/checkout/checkDetail/ShippingAddress";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
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

type ShippingOption = {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
};

const CheckoutDetailPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse cart data from URL
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    subtotal: number;
    shippingOption?: ShippingOption;
  } | null>(null);

  useEffect(() => {
    const cartParam = searchParams.get("cart");
    if (cartParam) {
      try {
        const data = JSON.parse(decodeURIComponent(cartParam));
        setCartData(data);
      } catch (error) {
        console.error("Error parsing cart data", error);
      }
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: "",
    state: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [paymentMethods, setPaymentMethods] = useState({
    paymentMethod: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentMethods((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckout = () => {
    const orderData = {
      items: cartData?.items,
      subtotal: cartData?.subtotal,
      shippingOption: cartData?.shippingOption,
      formData,
      shippingAddress,
      paymentMethods,
    };

    const encoded = encodeURIComponent(JSON.stringify(orderData));
    router.push(
      `/client/pages/shop/view/${params.id}/checkout/cart/orderComplete?order=${encoded}`,
    );
  };

  if (!cartData) {
    return <div>Loading cart data...</div>;
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
          <div className="flex flex-col space-y-5">
            <ContactInformation
              formData={formData}
              handleChange={handleChange}
            />
            <ShippingAddress
              formData={shippingAddress}
              handleChange={handleAddressChange}
            />
            <PaymentMethods
              formData={paymentMethods}
              handleChange={handlePaymentChange}
            />

            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full rounded-lg bg-black py-2 text-white transition-colors hover:bg-gray-800"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <OrderSummary
            subtotal={cartData.subtotal}
            onCheckout={handleCheckout}
            items={cartData.items}
            shippingOption={cartData.shippingOption}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutDetailPage;
