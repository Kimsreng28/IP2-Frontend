"use client";

import env from "@/src/envs/env";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Forgot = () => {
  const [data, setData] = useState({
    email: "",
  });

  const [error, setError] = useState({
    email: "",
  });

  const validateInputs = () => {
    const newErrors = {
      email: "",
    };

    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    setError(newErrors);
    return !newErrors.email;
  };

  const router = useRouter();
  const fileUrl = `${env.FILE_BASE_URL}`;

  const handleForgot = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await fetch(
        `${env.API_BASE_URL}/account/auth/request-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Something went wrong");
      }

      const result = await res.json();

      console.log("Result:", result);

      router.push("/auth/verify");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="bg-light dark:bg-dark flex min-h-screen items-center justify-center px-4">
        <motion.div
          className="flex w-full max-w-[1000px] flex-col-reverse items-center justify-between overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-[#1E1E2F] md:flex-row"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Left side image */}
          <motion.div
            className="flex w-full items-center justify-center p-6 md:w-1/2"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/logo/LogoAuth.png"
              alt="Logo"
              width={400}
              height={400}
              className="h-auto w-full max-w-[300px] object-contain transition-transform duration-500 hover:scale-105 md:max-w-[400px]"
              priority
            />
          </motion.div>

          {/* Right side form */}
          <motion.div
            className="w-full px-6 py-8 md:w-1/2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="mb-6 text-center text-3xl font-semibold text-black dark:text-white">
              Forgot Password
            </h2>

            <form className="flex flex-col gap-5">
              {/* description */}
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Enter your email to verify and change the password.
              </p>

              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className={`w-full border-b px-2 py-2 pb-2 outline-none transition-all duration-300 ease-in-out focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                  error.email ? "border-red-500 " : "border-stroke"
                }`}
              />
              {error.email && (
                <p className="text-sm text-red-500 transition-all duration-300 ease-in-out">
                  {error.email}
                </p>
              )}

              {/* Submit */}
              <motion.button
                aria-label="signup"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgot();
                }}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition duration-300 hover:bg-black/90 dark:bg-btndark dark:hover:bg-blackho"
                whileTap={{ scale: 0.95 }}
              >
                Send
                <svg
                  className="fill-white"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                </svg>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Forgot;
