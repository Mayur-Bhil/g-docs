import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { NavbarCreateButton } from "./navbar-create-button";

export const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 gap-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/g-doc.svg" alt="logo" width={34} height={34} />
          <span className="font-semibold text-lg text-gray-800 hidden sm:block">
            Quick-Docs
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 m-10">
          <SearchInput />
        </div>

        {/* Right side */}
        <div className="shrink-0 flex items-center gap-3">
          <NavbarCreateButton />
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            afterSelectPersonalUrl="/"
          />
          <div className="ml-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
};