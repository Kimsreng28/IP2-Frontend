"use client";

import AccountSidebar from "@/src/app/components/Client/Profiles/Account/AccountSidebar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const activePage = pathname.split("/").pop() || "account";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mt-5 flex max-w-6xl flex-col space-y-5 bg-white px-4 py-6 font-poppins text-gray-900 dark:bg-gray-900 dark:text-white sm:px-6"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 pt-10 text-center text-4xl font-bold"
      >
        My Account
      </motion.h1>

      <div className="mb-6 flex items-center justify-between md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-2 text-gray-700 hover:text-black dark:text-white dark:hover:text-gray-300"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-10 pt-10 md:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`${mobileMenuOpen ? "block" : "hidden"} w-full md:block md:w-64`}
        >
          <AccountSidebar activePage={activePage} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
