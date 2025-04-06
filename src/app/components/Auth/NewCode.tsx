"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ChangeCode = () => {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const handleNewCode = () => {
    // Handle forgot password logic here, e.g., API call to send reset link
    router.push("/auth");
  };

  return (
    <section>
      <div className="bg-light dark:bg-dark flex min-h-screen items-center justify-center px-4">
        <div className="animate-fadeIn flex w-full max-w-[1000px] flex-col-reverse items-center justify-between overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-[#1E1E2F] md:flex-row">
          {/* Left side image */}
          <div className="flex w-full items-center justify-center p-6 md:w-1/2">
            <Image
              src="/images/logo/LogoAuth.png"
              alt="Logo"
              width={400}
              height={400}
              className="h-auto w-full max-w-[300px] object-contain transition-transform duration-500 hover:scale-105 md:max-w-[400px]"
              priority
            />
          </div>

          {/* Right side form */}
          <div className="w-full px-6 py-8 md:w-1/2">
            <h2 className="mb-6 text-center text-3xl font-semibold text-black dark:text-white">
              New Code
            </h2>

            <form className="flex flex-col gap-5">
              {/* description */}
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Enter new password and confirm.
              </p>

              {/* Password */}
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className="w-full border-b border-stroke bg-transparent pb-3.5 outline-none focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              />

              {/* Confirm Password */}
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className="w-full border-b border-stroke bg-transparent pb-3.5 outline-none focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              />

              {/* Submit */}
              <button
                aria-label="signup"
                onClick={(e) => {
                  e.preventDefault();
                  handleNewCode();
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeCode;
