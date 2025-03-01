"use client";
import { FaFacebook, FaTelegram, FaYoutube } from "react-icons/fa"; // Social media icons

const Footer = () => {
  return (
    <footer className=" bg-titlebgdark py-10 text-white dark:bg-[#181C31]">

      <div className="w-full border-t-[1px] border-white"></div>
      {/* Bottom section with copyright and social media icons */}
      <div className="mx-30 mt-8 flex flex-col items-center justify-between px-4 md:flex-row md:px-0">
        <p className="text-center text-lg md:text-left">
          © {"2024 GIC Team"}
        </p>
        <div className="mt-4 flex space-x-4 md:mt-0">
          <a
            target="_blank"
            href="#"
            aria-label="Facebook"
            className="text-white hover:text-gray-300"
          >
            <FaFacebook size={24} />
          </a>
          <a
            target="_blank"
            href="#"
            aria-label="Telegram"
            className="text-white hover:text-gray-300"
          >
            <FaTelegram size={24} />
          </a>
          <a
            target="_blank"
            href="#"
            aria-label="YouTube"
            className="text-white hover:text-gray-300"
          >
            <FaYoutube size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
