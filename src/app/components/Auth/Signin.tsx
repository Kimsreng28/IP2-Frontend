"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Signin = () => {
  // State for email and password inputs
  // and their error messages
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // State for error messages
  // for email and password inputs
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  // Initialize router for navigation
  const router = useRouter();

  // State for remember me functionality
  // and show password toggle
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // check for token in url
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const avatar = urlParams.get("avatar");

    // check for token in localStorage
    if (token) {
      localStorage.setItem("token", token);
      if (avatar) {
        localStorage.setItem("avatar", avatar);
      }
      router.push("/client/pages/home");
    }

    // check for user data in localStorage
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    // if user data exists, set it in state
    // and set rememberMe to true
    if (storedEmail && storedPassword) {
      setData({
        email: storedEmail,
        password: storedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  // Function to validate email and password inputs
  const validateInputs = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    // Check if email is valid
    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    // Check if password is valid
    if (!data.password) {
      newErrors.password = "Password is required.";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setError(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Function to handle sign in
  // with email and password
  const handleSignin = async () => {
    // Check if inputs are valid
    if (!validateInputs()) return;

    try {
      // Send POST request to the server
      // with email and password
      const res = await fetch("http://localhost:3001/api/account/auth", {
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

      // Optionally store token in localStorage
      localStorage.setItem("token", result.token);

      // Optionally store avatar in localStorage
      localStorage.setItem("avatar", result.user.avatar);

      //remember me functionality
      if (rememberMe) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      // Navigate to home page
      // after successful login
      router.push("/client/pages/home");
    } catch (err: any) {
      alert("Login failed: " + err.message);
      console.error("Login error:", err);
    }
  };

  // Function to handle Google Sign-in
  const handleGoogleSignin = async () => {
    try {
      // Redirect to Google authentication URL
      window.location.href = "http://localhost:3001/api/account/auth/google";
    } catch (err: any) {
      alert("Google Sign-in failed: " + err.message);
      console.error("Google Sign-in error:", err);
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="bg-light dark:bg-dark flex min-h-screen items-center justify-center px-4 transition-all duration-1000 ease-in-out">
        <motion.div
          className="flex w-full max-w-[1000px] flex-col-reverse items-center justify-between overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-[#1E1E2F] md:flex-row"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Left side image */}
          <motion.div
            className="flex w-full items-center justify-center p-6 transition-transform duration-500 hover:scale-105 md:w-1/2"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/logo/LogoAuth.png"
              alt="Logo"
              width={400}
              height={400}
              className="h-auto w-full max-w-[300px] object-contain transition-all duration-500 hover:scale-105 md:max-w-[400px]"
              priority
            />
          </motion.div>

          {/* Right side form */}
          <motion.div
            className="w-full px-6 py-8 md:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="mb-6 text-center text-3xl font-semibold text-black transition-all duration-500 ease-in-out dark:text-white">
              Sign In
            </h2>

            <form className="flex flex-col gap-5 transition-all duration-300 ease-in-out">
              {/* Or Signup */}
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:underline dark:text-primary"
                >
                  Sign Up
                </Link>
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

              {/* Password input */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  className={`w-full border-b px-2 py-2 pb-2 outline-none transition-all duration-300 ease-in-out focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                    error.password ? "border-red-500" : "border-stroke"
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
                  />
                </button>
              </div>
              {error.password && (
                <p className="text-sm text-red-500 transition-all duration-300 ease-in-out">
                  {error.password}
                </p>
              )}

              {/* Remember me */}
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-gray-600 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/auth/forgotpassword"
                  className="text-primary hover:underline dark:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                aria-label="signin"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignin();
                }}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition duration-300 hover:bg-black/90 dark:bg-btndark dark:hover:bg-blackho"
                whileTap={{ scale: 0.95 }}
              >
                Sign In
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

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-gray-300 dark:border-gray-700" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                or
              </span>
              <hr className="w-full border-gray-300 dark:border-gray-700" />
            </div>

            {/* Google Sign in */}
            <motion.button
              aria-label="signin with Google"
              onClick={(e) => {
                e.preventDefault();
                handleGoogleSignin();
              }}
              className="flex w-full items-center justify-center rounded-md border border-stroke bg-gray-50 px-4 py-3 text-gray-600 transition duration-300 hover:border-primary hover:bg-primary/10 dark:bg-[#2C303B] dark:text-white"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src="/images/icon/icons8-google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-3"
              />
              Sign In with Google
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Signin;
