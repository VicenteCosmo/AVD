'use client'
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react"
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [abrirMenu, setabrirMenu]=useState(false)
  return (
    <div className="h-screen flex">
      
      <div className="flex-col w-[20%] md:w-[8%] hidden md:flex lg:w-[14%] xl:w-[3%] ">
        <Menu />
      </div>
        {abrirMenu && (
          <div className="inset-0 bg-white z-50 md:hidden w-[20%] shadow-lg p-4">
            <Menu/>
          </div>
        )}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-auto">
        <Navbar clicadoMenu={() => setabrirMenu(!abrirMenu)} />
        
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );

}
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { User } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='bg-[#27282c]' >
       <Navbar />
      <div 
      className='mx-auto flex min-h-screen w-full max-w-7xl flex-col 
      items-center justify-center px-4 py-20 xl:px-0 ' id='globalSection' >
      {children} </div>

      <Footer />

    </div>

  )
}

export default Layout
