import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/g-doc.svg" alt="logo" width={34} height={34} />
            <span className="font-semibold text-lg text-gray-800">
              Quick-Docs
            </span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/docs/123"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Docs
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            About
          </Link>
        </div>

      </div>
    </nav>
  );
};