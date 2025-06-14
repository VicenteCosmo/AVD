import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Navbar from "./components/Navbar";
import { FooterWithLogo } from "./components/Footer";

export const metadata: Metadata = {
  title: "Nome do teu site",
  description: "Descrição do site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`${inter.className} bg-[#27282c]`}>
        <Navbar />
        <main
          className="mx-auto flex min-h-screen w-full max-w-7xl flex-col 
          items-center justify-center px-4 py-20 xl:px-0"
          id="globalSection"
        >
          {children}
        </main>
        <FooterWithLogo />
      </body>
    </html>
  );
}
