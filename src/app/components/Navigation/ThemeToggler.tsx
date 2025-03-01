import { useTheme } from "next-themes";
import Image from "next/image";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-gray-2 dark:bg-dark-bg absolute right-17 mr-1.5 flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white lg:static"
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
