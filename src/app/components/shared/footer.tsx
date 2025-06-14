import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export default function SharedFooterComponent() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
          {/* Brand section */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">Ele-Sale.</h2>
            <p className="mt-1 text-sm text-gray-400">Electronic Store</p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-wrap gap-8">
            <Link
              href="/client/pages/home"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/client/pages/shop"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Shop
            </Link>
            <Link
              href="/product"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Product
            </Link>
            <Link
              href="/blog"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Blog
            </Link>
            <Link
              href="/client/pages/contact"
              className="text-gray-300 transition-colors hover:text-white"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            {/* Copyright and legal links */}
            <div className="mb-4 flex flex-col items-center gap-4 md:mb-0 md:flex-row">
              <p className="text-sm text-gray-400">
                Copyright © 2025 Ele-Sale. All rights reserved
              </p>
              <div className="flex gap-4">
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Terms of Use
                </Link>
              </div>
            </div>

            {/* Social media icons */}
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
