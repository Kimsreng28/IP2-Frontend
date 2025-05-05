"use client";
import { Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
const Navigation = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const router = useRouter();
  const pathUrl = usePathname();

  // Update the full current path (including hash fragment) when it changes
  const updatePath = (path) => {
    setCurrentPath(path);
    if (navigationOpen) {
      setNavigationOpen(false); // Close the menu after clicking a link
    }
  };

  const getAvatar = () => {
    // 1. First check standalone avatar in localStorage
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) return storedAvatar;

    // 2. Check user object in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.avatar) return user.avatar;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // 3. Check cookies as fallback
    try {
      const cookies = parseCookies();
      const userCookie = cookies.user_cookie;
      if (userCookie) {
        const user = JSON.parse(userCookie);
        if (user?.avatar) return user.avatar;
      }
    } catch (error) {
      console.error("Error parsing cookies:", error);
    }

    return null;
  };

  useEffect(() => {
    // Update path when it changes
    setCurrentPath(pathUrl);

    // Load avatar on component mount
    const currentAvatar = getAvatar();
    setAvatar(currentAvatar);

    // Listen for storage changes (in case avatar is updated in another tab)
    const handleStorageChange = () => {
      const newAvatar = getAvatar();
      if (newAvatar !== avatar) {
        setAvatar(newAvatar);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
              onClick={() => router.push("/client/pages/wishlist")}
              className="flex items-center gap-2 rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Profile Button */}
            <button
              onClick={handleProfileClick}
              aria-label="user profile"
              className="flex items-center gap-2 rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {avatar ? (
                <img
                  src={`${process.env.FILE_BASE_URL}/public/${avatar}`}
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
              onClick={() => router.push("/client/pages/cart")}
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
