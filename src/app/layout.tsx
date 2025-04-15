import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminPage from "./(dashboard)/admin/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AVD",
  description: "Next.js AVD Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
  );
}