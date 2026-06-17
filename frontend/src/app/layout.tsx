import type { Metadata } from "next";
import { Inter, Outfit, Urbanist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AdGravity AI - Next-Gen AI Ad Operations",
  description: "Boost your business outreach using AdGravity AI. Sign up for a 7-day trial subscription for just ₹1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${urbanist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
