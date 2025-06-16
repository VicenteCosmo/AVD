<<<<<<< HEAD
'use client'

=======
>>>>>>> 1043ec895e2d0dcdd4cbbb51dc83e9f9b0735970
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Navbar from "./components/Navbar";
import { FooterWithLogo } from "./components/Footer";
<<<<<<< HEAD
import React, { useState } from "react";

// export const metadata: Metadata = {
//   title: "Nome do teu site",
//   description: "Descrição do site",
// };
=======

export const metadata: Metadata = {
  title: "Nome do teu site",
  description: "Descrição do site",
};
>>>>>>> 1043ec895e2d0dcdd4cbbb51dc83e9f9b0735970

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD

  const [theme, setTheme] = React.useState<'light' | '#27282c'>('#27282c')

  const toggleTheme = () => {
    theme === 'light' ? setTheme('#27282c') : setTheme('light')
  }

  return (
    <html lang="pt">
      <body className={`${inter.className} bg-[${theme}]`}>
=======
  return (
    <html lang="pt">
      <body className={`${inter.className} bg-[#27282c]`}>
>>>>>>> 1043ec895e2d0dcdd4cbbb51dc83e9f9b0735970
        <Navbar />
        <main
          className="mx-auto flex min-h-screen w-full max-w-7xl flex-col 
          items-center justify-center px-4 py-20 xl:px-0"
          id="globalSection"
        >
<<<<<<< HEAD
          {/* <button onClick={toggleTheme} >click</button> */}
=======
>>>>>>> 1043ec895e2d0dcdd4cbbb51dc83e9f9b0735970
          {children}
        </main>
        <FooterWithLogo />
      </body>
    </html>
  );
}
