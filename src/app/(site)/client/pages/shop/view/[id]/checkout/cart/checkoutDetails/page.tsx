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

  const [cartData, setCartData] = useState<{
    items: CartItem[];
    subtotal: number;
    shippingOption?: ShippingOption;
  } | null>(null);

  const [showProcessingScreen, setShowProcessingScreen] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(
    "Processing your payment...",
  );

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
    paymentMethod: "MasterCard",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    abaOption: "payway",
  });

  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleAbaOptionChange = (option: "payway" | "khqr") => {
    setPaymentMethods((prevData) => ({
      ...prevData,
      abaOption: option,
    }));
  };

  const handleAcledaOptionChange = (option: "payway" | "khqr") => {
    setPaymentMethods((prevData) => ({
      ...prevData,
      abaOption: option,
    }));
  };

  const processCardPayment = async () => {
    setIsProcessing(true);
    setProcessingMessage("Processing card payment...");
    try {
      // Simulate API call for card payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      console.error("Card payment failed", error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processAbaPayment = async () => {
    setIsProcessing(true);
    setProcessingMessage(
      paymentMethods.abaOption === "payway"
        ? "Redirecting to ABA Payway..."
        : "Waiting for KHQR payment confirmation...",
    );
    try {
      if (paymentMethods.abaOption === "payway") {
        // Simulate Payway processing
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } else {
        // Simulate KHQR processing with longer delay
        await new Promise((resolve) => setTimeout(resolve, 3500));
      }
      return true;
    } catch (error) {
      console.error("ABA payment failed", error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processAcledaPayment = async () => {
    setIsProcessing(true);
    setProcessingMessage(
      paymentMethods.abaOption === "payway"
        ? "Redirecting to ACLEDA Payway..."
        : "Waiting for KHQR payment confirmation...",
    );
    try {
      if (paymentMethods.abaOption === "payway") {
        // Simulate Payway processing
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } else {
        // Simulate KHQR processing with longer delay
        await new Promise((resolve) => setTimeout(resolve, 3500));
      }
      return true;
    } catch (error) {
      console.error("ACLEDA payment failed", error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethods.paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setShowProcessingScreen(true);

    let paymentSuccess = false;

    if (["MasterCard", "VisaCard"].includes(paymentMethods.paymentMethod)) {
      if (
        !paymentMethods.cardNumber ||
        !paymentMethods.expirationDate ||
        !paymentMethods.cvv
      ) {
        alert("Please enter complete card details");
        setShowProcessingScreen(false);
        return;
      }
      paymentSuccess = await processCardPayment();
    } else if (paymentMethods.paymentMethod === "ABA") {
      paymentSuccess = await processAbaPayment();
    } else if (paymentMethods.paymentMethod === "ACLEDA") {
      paymentSuccess = await processAcledaPayment();
    }

    if (paymentSuccess) {
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
    } else {
      setShowProcessingScreen(false);
      alert("Payment failed. Please try again.");
    }
  };

  if (!cartData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading cart data...
      </div>
    );
  }

  return (
    <>
      {showProcessingScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-r from-gray-300 to-gray-600 p-6 text-center text-white">
              <div className="flex justify-center">
                <svg
                  className="h-16 w-16 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="p-8 text-center">
              <motion.h3
                className="mb-2 text-2xl font-bold text-gray-900"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {processingMessage}
              </motion.h3>

              <motion.p
                className="text-gray-600"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your order is being processed securely
              </motion.p>

              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative h-2 rounded-full bg-gray-200">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-gray-200 to-gray-500"
                    style={{
                      width: isProcessing ? "80%" : "100%",
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>
              </motion.div>

              {paymentMethods.paymentMethod === "ABA" &&
                paymentMethods.abaOption === "khqr" && (
                  <motion.div
                    className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="ml-2 text-sm font-medium text-blue-700">
                        Keep the ABA Mobile app open to complete the payment
                      </span>
                    </div>
                  </motion.div>
                )}

              <motion.div
                className="mt-6 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p>Please don't close this window</p>
                <p className="mt-1">This may take a few moments</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

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
                onAbaOptionChange={handleAbaOptionChange}
                onAcledaOptionChange={handleAcledaOptionChange}
              />

              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full rounded-lg bg-black py-3 text-white transition-colors hover:bg-gray-800 ${
                    isProcessing ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
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
    </>
  );
};

export default CheckoutDetailPage;
