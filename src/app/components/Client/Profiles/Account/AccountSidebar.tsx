"use client";

import { motion } from "framer-motion";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

const AccountSidebar = ({ activePage }: { activePage: string }) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3001/api/account/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setAvatar(data.avatar || null);
        setDisplayName(data.display_name || "User");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:3001/api/account/auth/upload-avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const result = await res.json();
      setAvatar(result.avatar);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="h-auto w-[262px] rounded-lg bg-gray-100 p-6 font-poppins dark:bg-gray-900"
    >
      <div className="flex flex-col items-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="relative"
        >
          {avatar ? (
            <Image
              src={avatar}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-md"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700">
              <span className="text-white">No Avatar</span>
            </div>
          )}
          <label className="absolute bottom-0 right-0 cursor-pointer">
            <CameraIcon className="h-6 w-6 rounded-full bg-white p-1 text-black shadow-md dark:bg-gray-800 dark:text-white dark:shadow" />
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-3 text-lg font-semibold text-black dark:text-white"
        >
          {displayName}
        </motion.h2>
      </div>

      <motion.div
        className="mt-6 border-t border-gray-300 pt-4 dark:border-gray-700"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0.4}
      >
        <ul className="space-y-5">
          {["account", "address", "orders", "wishlist"].map((item, i) => (
            <motion.li
              key={item}
              variants={fadeInUp}
              custom={i + 1}
              className={`cursor-pointer border-b-2 ${
                pathname.includes(item)
                  ? "border-black text-black dark:border-white dark:text-white"
                  : "border-transparent text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              <Link href={`/client/pages/profile/${item}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            </motion.li>
          ))}
          <motion.li
            variants={fadeInUp}
            custom={5}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth";
            }}
            className="cursor-pointer text-red-600 hover:text-red-800"
          >
            Log Out
          </motion.li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default AccountSidebar;
