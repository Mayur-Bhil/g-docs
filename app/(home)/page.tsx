"use client";

import { usePaginatedQuery } from "convex/react";
import { Navbar } from "./Navbar";
import { DocumentsTable } from "./DocumentsTable";
import { TemplatesGallery } from "./TemplatesGallery";
import { api } from "../../convex/_generated/api";

const Page = () => {
  const {results, status,loadMore} = usePaginatedQuery(api.documents.get , { }, {initialNumItems: 10});


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
        <DocumentsTable 
        documents={results} 
        loadmore={loadMore}
        status = {status}  
          />
      </main>
    </div>
  );
};

export default Page;