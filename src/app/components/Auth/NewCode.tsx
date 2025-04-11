"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ChangeCode = () => {
  const [data, setData] = useState({
    newPassword: "",
    confirmedPassword: "",
  });

  const [error, setError] = useState({
    newPassword: "",
    confirmedPassword: "",
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = () => {
    const newErrors = {
      newPassword: "",
      confirmedPassword: "",
    };

    if (!data.newPassword) {
      newErrors.newPassword = "Password is required.";
    } else if (data.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters.";
    }

    if (!data.confirmedPassword) {
      newErrors.confirmedPassword = "Password is required.";
    } else if (data.confirmedPassword.length < 6) {
      newErrors.confirmedPassword = "Password must be at least 6 characters.";
    }

    setError(newErrors);
    return !newErrors.newPassword && !newErrors.confirmedPassword;
  };
  const handleNewPass = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/auth/complete-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }
      const result = await res.json();
      console.log("Result:", result);
      router.push("/auth");
    } catch (error) {}
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
              New Code
            </h2>

            <form className="flex flex-col gap-5">
              {/* description */}
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Enter new password and confirm.
              </p>

              {/* Password input */}
              <div className="relative">
                <input
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="newPassword"
                  value={data.newPassword}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  className={`w-full border-b px-2 py-2 pb-2 outline-none transition-all duration-300 ease-in-out focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                    error.newPassword ? "border-red-500" : "border-stroke"
                  }`}
                />
                {/* Toggle password visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={
                      showPassword
                        ? "/images/icon/eye-closed-svgrepo-com.svg"
                        : "/images/icon/eye-svgrepo-com.svg"
                    }
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={20}
                    height={20}
                    className={`${
                      showPassword
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-300"
                    }`}
                  />
                </button>
              </div>
              {error.newPassword && (
                <p className="text-sm text-red-500 transition-all duration-300 ease-in-out">
                  {error.newPassword}
                </p>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <input
                  name="confirmedPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="confirmedPassword"
                  value={data.confirmedPassword}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  className={`w-full border-b px-2 py-2 pb-2 outline-none transition-all duration-300 ease-in-out focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                    error.confirmedPassword ? "border-red-500" : "border-stroke"
                  }`}
                />
                {/* Toggle password visibility */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={
                      showPassword
                        ? "/images/icon/eye-closed-svgrepo-com.svg"
                        : "/images/icon/eye-svgrepo-com.svg"
                    }
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={20}
                    height={20}
                    className={`${
                      showPassword
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-300"
                    }`}
                  />
                </button>
              </div>
              {error.confirmedPassword && (
                <p className="text-sm text-red-500 transition-all duration-300 ease-in-out">
                  {error.confirmedPassword}
                </p>
              )}

              {/* Submit */}
              <button
                aria-label="signup"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewPass();
                }}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition duration-300 hover:bg-black/90 dark:bg-btndark dark:hover:bg-blackho"
              >
                Enter
                <svg
                  className="fill-white"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                </svg>
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChangeCode;
