"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Signup = () => {
  // State for form data
  const [data, setData] = useState({
    firstName: "",
    lastName: "",

    email: "",
    password: "",
  });

  // State for error messages
  const [error, setError] = useState({
    firstName: "",
    lastName: "",

    email: "",
    password: "",
  });

  // Router for navigation
  const router = useRouter();

  // State for terms and conditions checkbox
  // State for password visibility toggle
  const [termPolicy, setTermPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for token in URL and redirect if present
  // This effect runs once when the component mounts
  useEffect(() => {
    // check for token in url
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const avatar = urlParams.get("avatar");

    if (token && avatar) {
      localStorage.setItem("token", token);
      router.push("/client/pages/home");
    }
  }, []);

  // Validate form inputs
  const validateInputs = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };

    // Check if each field is empty or invalid
    // firstName
    if (!data.firstName) {
      newErrors.firstName = "First name is required.";
    } else if (data.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }

    // lastName
    if (!data.lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (data.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    }

    // email
    if (!data.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    // password
    if (!data.password) {
      newErrors.password = "Password is required.";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setError(newErrors);
    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.firstName &&
      !newErrors.lastName
    );
  };

  // Handle form submission
  // This function is called when the user clicks the "Sign Up" button
  const handleSignup = async () => {
    // Prevent default form submission behavior check if inputs are valid
    if (!validateInputs()) return;

    // Check if terms and conditions are accepted
    if (!termPolicy) {
      alert("Please agree to the Privacy Policy and Terms of Use.");
      return;
    }

    // Prepare data for signup request
    try {
      // Send signup request to the server
      const response = await fetch(
        "http://localhost:3001/api/account/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      // Check if the response is ok (status code 200-299)
      const result = await response.json();

      // Optionally store token in localStorage
      localStorage.setItem("token", result.token);

      // Optionally store avatar in localStorage
      localStorage.setItem("avatar", result.user.avatar);

      console.log("Status:", response.status);
      console.log("Result:", result);

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      alert("Signup successful!");
      router.push("/auth");
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    try {
      // Redirect to Google authentication URL
      window.location.href = "http://localhost:3001/api/account/auth/google";
    } catch (err: any) {
      alert("Google Sign-in failed: " + err.message);
      console.error("Google Sign-in error:", err);
    }
  };

  return (
    <section>
      <div className="bg-light dark:bg-dark flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex w-full max-w-[1000px] flex-col-reverse items-center justify-between overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-[#1E1E2F] md:flex-row"
        >
          {/* Left side image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-full items-center justify-center p-6 md:w-1/2"
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full px-6 py-8 md:w-1/2"
          >
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

              {/* First name inputs */}
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                value={data.firstName}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className={`w-full border-b px-2 py-2 pb-2 outline-none transition-all duration-300 ease-in-out focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                  error.email ? "border-red-500 " : "border-stroke"
                }`}
              />
              {error.firstName && (
                <p className="text-sm text-red-500 transition-all duration-300 ease-in-out">
                  {error.firstName}
                </p>
              )}

              {/* Last name inputs */}
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={data.lastName}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                className={`w-full border-b px-2 py-2 pb-2 outline-none transition-all duration-300 ease-in-out focus:border-primary focus:placeholder:text-black dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white ${
                  error.email ? "border-red-500 " : "border-stroke"
                }`}
              />
              {error.lastName && (
                <p className="text-sm text-red-500 transition-all duration-300 ease-in-out">
                  {error.lastName}
                </p>
              )}

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

              {/* Terms */}
              <div className="flex items-start gap-3 text-sm">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-1"
                  checked={termPolicy}
                  onChange={() => setTermPolicy(!termPolicy)}
                />
                <label
                  htmlFor="terms"
                  className="text-gray-600 dark:text-gray-300"
                >
                  I agree to the{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Terms of Use
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                aria-label="signup"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
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
              onClick={(e) => {
                e.preventDefault();
                handleGoogleSignup();
              }}
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-stroke bg-gray-50 px-4 py-3 text-gray-600 transition duration-300 hover:border-primary hover:bg-primary/10 dark:bg-[#2C303B] dark:text-white"
            >
              <Image
                src="/images/icon/icons8-google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-3"
              />
              SignUp with Google
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Signup;
