"use client";

import env from "@/src/envs/env";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Signin = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const fileUrl = `${env.FILE_BASE_URL}`;

  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    if (!rememberMe) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };

  useEffect(() => {
    clearAuthStorage();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const avatar = urlParams.get("avatar");
    const role = urlParams.get("role");
    const user = urlParams.get("user");

    if (token) {
      localStorage.setItem("token", token);
      if (avatar) localStorage.setItem("avatar", avatar);

      if (user) {
        try {
          const userData = JSON.parse(user);
          localStorage.setItem("user", JSON.stringify(userData));
          if (userData.avatar && !avatar) {
            localStorage.setItem("avatar", userData.avatar);
          }
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }

      switch (role) {
        case "ADMIN":
          router.push("/admin/pages/dashboard");
          break;
        case "VENDOR":
          router.push("/vendor/pages/dashboard");
          break;
        default:
          router.push("/client/pages/home");
      }
    }

    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail && storedPassword) {
      setData({ email: storedEmail, password: storedPassword });
      setRememberMe(true);
    }
  }, []);

  const validateInputs = () => {
    const newErrors = { email: "", password: "" };

    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!data.password) {
      newErrors.password = "Password is required.";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setError(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await fetch(`${env.API_BASE_URL}/account/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Something went wrong");
      }

      const result = await res.json();

      clearAuthStorage();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (rememberMe) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
      }

      window.dispatchEvent(new Event("storage"));

      switch (result.user.role) {
        case "ADMIN":
          router.push("/admin/pages/dashboard");
          break;
        case "VENDOR":
          router.push("/vendor/pages/dashboard");
          break;
        default:
          router.push("/client/pages/home");
      }
    } catch (err: any) {
      alert("Login failed: " + err.message);
      console.error("Login error:", err);
    }
  };

  const handleGoogleSignin = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      clearAuthStorage();
      window.location.href = `${env.API_BASE_URL}/account/auth/google`;
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
          <motion.div
            className="flex w-full items-center justify-center p-6 transition-transform duration-500 hover:scale-105 md:w-1/2"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/images/logo/LogoAuth.png"
              alt="Logo"
              width={400}
              height={400}
              className="h-auto w-full max-w-[300px] object-contain md:max-w-[400px]"
              priority
            />
          </motion.div>

          <motion.div
            className="w-full px-6 py-8 md:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="mb-6 text-center text-3xl font-semibold text-black dark:text-white">
              Sign In
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleSignin}>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:underline dark:text-primary"
                >
                  Sign Up
                </Link>
              </p>

              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className={`w-full border-b px-2 py-2 outline-none focus:border-primary dark:border-strokedark dark:focus:border-manatee ${
                  error.email ? "border-red-500" : "border-stroke"
                }`}
              />
              {error.email && (
                <p className="text-sm text-red-500">{error.email}</p>
              )}

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  className={`w-full border-b px-2 py-2 outline-none focus:border-primary dark:border-strokedark dark:focus:border-manatee ${
                    error.password ? "border-red-500" : "border-stroke"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
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
                <p className="text-sm text-red-500">{error.password}</p>
              )}

              <div className="flex items-start justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  Remember me
                </label>

                <Link
                  href="/auth/forgotpassword"
                  className="text-primary hover:underline dark:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>

              <motion.button
                type="submit"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-black/90 dark:bg-btndark dark:hover:bg-blackho"
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

            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-gray-300 dark:border-gray-700" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                or
              </span>
              <hr className="w-full border-gray-300 dark:border-gray-700" />
            </div>

            <motion.button
              onClick={handleGoogleSignin}
              className="flex w-full items-center justify-center rounded-md border border-stroke bg-gray-50 px-4 py-3 text-gray-600 hover:border-primary hover:bg-primary/10 dark:bg-[#2C303B] dark:text-white"
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
