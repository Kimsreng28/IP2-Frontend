"use client";

import AccountSidebar from "@/src/app/components/Client/Profiles/Account/AccountSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } },
};

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
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
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
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
          aria-label="Toggle menu"
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
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className={`${mobileMenuOpen ? "block" : "hidden"} w-full md:block md:w-64`}
        >
          <AccountSidebar activePage={activePage} />
        </motion.div>

        <motion.div
          key={pathname}
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="flex-1"
        >
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
