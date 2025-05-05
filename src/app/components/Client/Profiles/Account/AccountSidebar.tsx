"use client";

import { motion } from "framer-motion";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
          `${process.env.API_BASE_URL}/api/account/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setAvatar(data.avatar || null);
        setDisplayName(data.display_name || "User");

        // Update localStorage with current avatar
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.avatar = data.avatar || null;
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WEBP, GIF)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      // Upload to file service
      const uploadRes = await fetch(
        `${process.env.FILE_BASE_URL}/api/file/upload-single`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(
          errorData.error || uploadRes.statusText || "Upload failed",
        );
      }

      const uploadResult = await uploadRes.json();

      // Update profile with new avatar URL
      const updateRes = await fetch(
        `${process.env.API_BASE_URL}/api/account/auth/update-avatar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatar: uploadResult.path,
          }),
        },
      );

      if (!updateRes.ok) {
        throw new Error("Failed to update profile");
      }

      const updateResult = await updateRes.json();
      setAvatar(updateResult.user.avatar);
      toast.success("Avatar updated successfully");

      // Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.avatar = updateResult.user.avatar;
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const renderAvatar = () => {
    if (!avatar) {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700">
          <span className="text-white">No Avatar</span>
        </div>
      );
    }

    // Check if avatar is an external URL
    const isExternalUrl =
      avatar.startsWith("http://") || avatar.startsWith("https://");

    if (isExternalUrl) {
      return (
        <img
          src={avatar}
          alt="User Avatar"
          className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
          onError={() => setAvatar(null)}
        />
      );
    }

    // Handle local files
    return (
      <Image
        src={`${process.env.FILE_BASE_URL}/public/${avatar}`}
        alt="User Avatar"
        width={80}
        height={80}
        className="rounded-full border-4 border-white shadow-md"
        priority
      />
    );
  };

  // Update your profile fetching logic
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.API_BASE_URL}/api/account/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        // Store the avatar URL exactly as returned by the server
        setAvatar(data.avatar || null);
        setDisplayName(data.display_name || "User");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

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
          {renderAvatar()}
          <label className="absolute bottom-0 right-0 cursor-pointer">
            {uploading ? (
              <div className="h-6 w-6 rounded-full bg-white p-1 shadow-md dark:bg-gray-800">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-t-white"></div>
              </div>
            ) : (
              <>
                <CameraIcon className="h-6 w-6 rounded-full bg-white p-1 text-black shadow-md dark:bg-gray-800 dark:text-white dark:shadow" />
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/gif"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </>
            )}
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
              localStorage.removeItem("user");
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
