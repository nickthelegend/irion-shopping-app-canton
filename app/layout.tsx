import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Irion Shopping App",
  description: "Demo storefront for Irion Buy-Now-Pay-Never checkout on Canton.",
};

import { CartProvider } from "@/lib/cart-context";
import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#020202] text-white min-h-screen">
        <Providers>
          <CartProvider>
            {children}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
