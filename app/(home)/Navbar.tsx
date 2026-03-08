import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { SearchInput } from "./search-input";
import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-auto">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/g-doc.svg" alt="logo" width={34} height={34} />
            <span className="font-semibold text-lg text-gray-800">
              Quick-Docs
            </span>
          </Link>
        </div>

        <div>
          <SearchInput/>          
         </div>
 
     
      <UserButton/>
      </div>
    </nav>
  );
};