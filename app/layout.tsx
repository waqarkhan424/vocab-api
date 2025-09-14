import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Vocab API" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: 16 }}>{children}</body>
    </html>
  );
}
