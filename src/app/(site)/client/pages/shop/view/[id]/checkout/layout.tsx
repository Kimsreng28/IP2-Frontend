"use client";

import SharedFooterComponent from "@/src/app/components/shared/footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export default function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const productId = params.id;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const steps = [
    { id: "cart", name: "Shopping Cart", path: "shopping" },
    { id: "checkout", name: "Checkout", path: "checkoutDetails" },
    { id: "complete", name: "Complete", path: "orderComplete" },
  ];

  const currentStep =
    steps.find((step) => pathname.includes(step.path)) || steps[0];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen bg-gray-50 font-poppins dark:bg-gray-900"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 pt-10 text-center text-4xl font-bold text-black"
        >
          Cart
        </motion.h1>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="mt-10 flex items-center justify-between">
                {steps.map((step, index) => {
                  const isActive = currentStep.id === step.id;
                  const isCompleted = steps.indexOf(currentStep) > index;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <Link
                        href={`/client/pages/shop/view/${productId}/checkout/cart/${step.path}`}
                        className="group relative flex flex-row items-center gap-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors
              ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-700"
              }`}
                        >
                          {isCompleted ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </motion.div>
                        <span
                          className={`mt-2 text-sm font-medium
              ${
                isCompleted
                  ? "text-green-500"
                  : isActive
                    ? "text-black dark:text-white"
                    : "text-gray-500"
              }`}
                        >
                          {step.name}
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-4">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200"></div>
                <div
                  className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-black transition-all duration-500 dark:bg-white"
                  style={{
                    width: `${(steps.indexOf(currentStep) / (steps.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-6xl"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
      <SharedFooterComponent />
    </>
  );
}
