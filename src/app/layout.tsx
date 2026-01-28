import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gul Plaza Marketplace - Shop Online with Ease",
  description: "Your trusted online marketplace for quality products from Gul Plaza. Shop with confidence, pay cash on delivery.",
  keywords: ["Gul Plaza", "Marketplace", "Pakistan", "Online Shopping", "Cash on Delivery", "Shop Online"],
  authors: [{ name: "Gul Plaza Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Gul Plaza Marketplace",
    description: "Shop online with ease from Pakistan's trusted marketplace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gul Plaza Marketplace",
    description: "Shop online with ease from Pakistan's trusted marketplace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
