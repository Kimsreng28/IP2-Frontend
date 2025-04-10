import { useTheme } from "next-themes";
import Image from "next/image";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-gray-2  dark:bg-dark-bg absolute right-17 mr-1.5 flex cursor-pointer items-center justify-center rounded-full p-2 text-black transition hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 lg:static"
    >
      <Image
        src="/images/icon/icon-moon.svg"
        alt="logo"
        width={30}
        height={30}
        className="dark:hidden"
      />

      <Image
        src="/images/icon/icon-sun.svg"
        alt="logo"
        width={30}
        height={30}
        className="hidden dark:block"
      />
    </button>
  );
};

export default ThemeToggler;
