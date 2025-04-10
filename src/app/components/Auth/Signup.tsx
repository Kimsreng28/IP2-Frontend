"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
              Sign Up
            </h2>

            <form className="flex flex-col gap-5">
              {/* Or login */}
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth"
                  className="text-primary hover:underline dark:text-primary"
                >
                  Sign In
                </Link>
              </p>

              <input
                name="firstName"
                type="text"
                placeholder="First name"
                value={data.firstName}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className="w-full border-b border-stroke bg-transparent pb-3.5 outline-none focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              />

              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={data.lastName}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className="w-full border-b border-stroke bg-transparent pb-3.5 outline-none focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className="w-full border-b border-stroke bg-transparent pb-3.5 outline-none focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
              />

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

              {/* Terms */}
              <div className="flex items-start gap-3 text-sm">
                <input id="terms" type="checkbox" />
                <label
                  htmlFor="terms"
                  className="text-gray-600 dark:text-gray-300"
                >
                  I agree to the <b>Privacy Policy</b> and <b>Terms</b> of Use
                </label>
              </div>

              {/* Submit */}
              <button
                aria-label="signup"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition duration-300 hover:bg-black/90 dark:bg-btndark dark:hover:bg-blackho"
              >
                Sign Up
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

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-gray-300 dark:border-gray-700" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                or
              </span>
              <hr className="w-full border-gray-300 dark:border-gray-700" />
            </div>

            {/* Google Sign up */}
            <button
              aria-label="signup with Google"
              className="flex w-full items-center justify-center rounded-md border border-stroke bg-gray-50 px-4 py-3 text-gray-600 transition duration-300 hover:border-primary hover:bg-primary/10 dark:bg-[#2C303B] dark:text-white"
            >
              <Image
                src="/images/icon/icons8-google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-3"
              />
              Signup with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
