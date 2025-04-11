import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures theme is loaded before accessing it (avoids hydration mismatch)
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex w-full items-center gap-2 rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <Image
        src={
          theme === "dark"
            ? "/images/icon/icon-sun.svg"
            : "/images/icon/icon-moon.svg"
        }
        alt="Theme Icon"
        width={30}
        height={30}
        className="h-5 w-5"
      />
    </button>
  );
};

export default ThemeToggler;
