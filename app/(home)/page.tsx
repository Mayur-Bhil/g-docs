import Link from "next/link";
import { Navbar } from "./Navbar";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white border-b">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center">
          <Navbar />
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center mt-16 px-6">
        <div className="text-center max-w-2xl">

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Quick-Docs
          </h1>

          <p className="text-lg text-gray-600 mb-10">
            A collaborative document editor where you can write, edit and
            share documents instantly.
          </p>

          <Link
            href="/docs/123"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Start Writing
          </Link>

        </div>
      </main>
    </div>
  );
};

export default Page;