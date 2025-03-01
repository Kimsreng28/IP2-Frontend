"use client";


import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "/src/styles/globals.css";
const inter = Inter({ subsets: ["latin"] });

import Footer from "../components/Footer";
import Lines from "../components/Lines";
import Navigation from "../components/Navigation";
import ScrollToTop from "../components/ScrollToTop";
import ToasterContext from "../context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          <Lines />
          <Navigation />
          <ToasterContext />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
