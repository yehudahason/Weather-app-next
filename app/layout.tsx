import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Weather Now",
  description:
    "Check real-time weather forecasts, temperature, and conditions for any city worldwide.",
};
import { dmSans } from "./fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
