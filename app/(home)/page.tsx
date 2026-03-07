"use client";

import { useQuery } from "convex/react";


import Link from "next/link";
import { Navbar } from "./Navbar";
import { TemplatesGallery } from "./TemplatesGallery";
import { api } from "../../convex/_generated/api";
// D:\projects\g-docs\convex\_generated\api.js

const Page = () => {
  const documents = useQuery(api.documents.get);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white border-b">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center">
          <Navbar />
        </div>
      </div>

      {/* Hero Section */}
      <main className="mt-16 ">
        <TemplatesGallery />
        {
          documents?.map((doc) => (
            <div key={doc._id} className="p-4 bg-white rounded shadow mb-4">
              <h2 className="text-lg font-semibold">{doc.name}</h2>
              <p>{doc.content}</p>
            </div>
          ))
        }
      </main>
    </div>
  );
};

export default Page;