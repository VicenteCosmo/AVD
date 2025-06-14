import Menu1 from "@/components/Menu1";
import Navbar from "@/components/Navbar1";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { AuthProvider } from "@/app/context/AuthContext";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">

      
      <div className="w-[20%] md:w-[8%] lg:w-[20%] xl:w-[10%] p-1">
        <Link
          href="/"
          className="flex items-center justify-center"
        >
          <Image src="/Onono.png" alt="logo" width={150} height={180} />
        </Link>
        <Menu1/>
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
