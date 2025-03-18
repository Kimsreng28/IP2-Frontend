import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ele-Sale",
  description:
    "Ele-Sale is an innovative e-commerce platform offering a seamless shopping experience. Explore a wide range of electronics, gadgets, and accessories at unbeatable prices. Shop with confidence and enjoy fast delivery, secure payment options, and exceptional customer service.",
};

export default function Home() {
  return (
    <main>
      <h1 className="flex h-screen items-center justify-center text-center text-3xl">
        Hello
      </h1>
    </main>
  );
}
