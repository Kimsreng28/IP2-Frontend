"use client";
import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
const Navigation = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  const router = useRouter();
  const pathUrl = usePathname();

  // Update the full current path (including hash fragment) when it changes
  const updatePath = (path) => {
    setCurrentPath(path);
    if (navigationOpen) {
      setNavigationOpen(false); // Close the menu after clicking a link
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.API_BASE_URL}/vendor/product`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      console.log("Fetched wishlist data:", data);

      setWishlistCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const getAvatar = async (): Promise<string | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await fetch(
        `${process.env.API_BASE_URL}/account/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        console.error("Failed to fetch profile:", res.status);
        return null;
      }

      const data = await res.json();

      return data?.avatar || null;
    } catch (error) {
      console.error("Error fetching avatar from API:", error);
      return null;
    }
  };

  useEffect(() => {
    setCurrentPath(pathUrl);

    const fetchAvatar = async () => {
      const currentAvatar = await getAvatar();
      setAvatar(currentAvatar);
    };

    fetchAvatar();

    fetchWishlist();

    // Listen for custom avatar update event
    const handleAvatarUpdated = async (e: Event) => {
      const currentAvatar = await getAvatar();
      setAvatar(currentAvatar);
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdated);
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
    };
  }, [pathUrl]);

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  const handleProfileClick = () => {
    if (!avatar || avatar) {
      router.push("/client/pages/profile/account"); // Navigate to profile page if avatar exists
    } else {
      router.push("/auth"); // Navigate to auth page if no avatar
    }
  };

  const handleWishlistClick = () => {
    router.push("/client/pages/profile/wishlist"); // Navigate to wishlist page if avatar exists
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full bg-white transition duration-100 dark:bg-black ${
        stickyMenu ? "-py-4" : "py-2"
      }`}
    >
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4  xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          {/* shop logo  */}
          <a href="/" className="smt-2 text-xl">
            {/* Light Mode Logo */}
            <img
              src="/images/logo/shop_logo.png"
              className="block h-[60px] scale-150 dark:hidden"
              alt="Shop_Logo_Light"
            />

            {/* Dark Mode Logo */}
            <img
              src="/images/logo/shop_logo_dark.png"
              className="hidden h-[60px] scale-150 dark:block"
              alt="Shop_Logo_Dark"
            />
          </a>

          {/* Hamburger Toggle Button */}
          <button
            aria-label="hamburger Toggler"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!w-full delay-300" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "delay-400 !w-full" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!w-full delay-500" : "w-0"
                  }`}
                ></span>
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!h-0 delay-[0]" : "h-full"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "!h-0 delay-200" : "h-0.5"
                  }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div
          className={`invisible h-0 w-full items-center justify-center xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen &&
            "navbar !visible mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {menuData.map((menuItem, key) => (
                <li key={key} className={"group relative"}>
                  <Link
                    href={menuItem.path || "#"}
                    onClick={() => updatePath(menuItem.path)} // Update path on click and close menu
                    className={
                      currentPath === menuItem.path
                        ? "rounded-full font-semibold"
                        : ""
                    }
                  >
                    {menuItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="relative hidden items-center gap-2 sm:hidden md:hidden xl:block">
          <div className="flex items-center gap-2">
            <div className="min-w-[36px]">
              <ThemeToggler />
            </div>
            {/* Heart Icon */}
            <button
              aria-label="wishlist"
              onClick={handleWishlistClick}
              className="flex items-center gap-2 rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <div className="relative">
                <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </button>

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              aria-label="user profile"
              className="flex items-center gap-2 rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {avatar ? (
                <img
                  src={`${process.env.FILE_BASE_URL}/api/file/${avatar}`}
                  alt="Profile"
                  className="h-8 w-22 rounded-full object-cover"
                  onError={() => setAvatar(null)} // Fallback if image fails to load
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              aria-label="cart"
              onClick={() =>
                router.push(
                  "/client/pages/shop/view/${productId}/checkout/cart/shopping",
                )
              }
              className="flex items-center gap-2 rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
