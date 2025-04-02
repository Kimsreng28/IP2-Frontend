"use client";

import Navigation from "../../components/Navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />

      <main className="p-6">{children}</main>
    </div>
  );
}
