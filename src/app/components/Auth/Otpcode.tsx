"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

const VerifyOTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    console.log("OTP Code:", code);
  };

  const handleNewPassword = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/verify-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: otp.join("") }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }

      router.push("/auth/changecode");
    } catch (error) {}
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(""); // Reset any previous error message

    try {
      const response = await fetch("http://localhost:3001/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP. Please try again.");
      }

      // If OTP is successfully resent
      alert("Code resent successfully!");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
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
            <h2 className="mb-4 text-center text-3xl font-semibold text-black dark:text-white">
              Verify Code
            </h2>

            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to your email.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    className="h-12 w-12 rounded-md border border-gray-300 bg-transparent text-center text-xl text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-manatee"
                  />
                ))}
              </div>

              <button
                type="submit"
                onClick={() => {
                  handleNewPassword();
                }}
                className="mt-4 w-full rounded-xl bg-black px-6 py-3 text-white transition duration-300 hover:bg-black/90 dark:bg-btndark dark:hover:bg-blackho"
              >
                Verify
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn’t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-primary hover:underline"
                >
                  {isResending ? "Resending..." : "Resend"}
                </button>
              </p>

              {error && (
                <p className="mt-3 text-center text-sm text-red-500">{error}</p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VerifyOTP;
