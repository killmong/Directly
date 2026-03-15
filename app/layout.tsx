import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // <-- Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Portfolio SaaS",
  description: "Upload your resume, get a portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the children! */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
