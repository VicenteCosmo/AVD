import React from "react";
import Link from "next/link";
import Image from "next/image";

import { User } from "@deemlol/next-icons";
import Navbar from "./components/Navbar";
import { FooterWithLogo } from "./components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#27282c]">
      <Navbar />
      <div
        className="mx-auto flex min-h-screen w-full max-w-7xl flex-col 
      items-center justify-center px-4 py-20 xl:px-0 "
        id="globalSection"
      >
        {children}{" "}
      </div>

      <FooterWithLogo />
    </div>
  );
};

export default Layout;
