"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Room } from "./room";
import EditorPage from "./editor";
import ToolBar from "./ToolBar";
import { Navbar } from "./Navbar";
import { api } from "@/convex/_generated/api";

type DocumentProps = {
  preLoadedDocument: Preloaded<typeof api.documents.getById>;
};

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("async info that was not on the parent Suspense boundary")
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

export const Document = ({ preLoadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preLoadedDocument);
  // Suppress React DevTools Suspense warning (false positive from extension)


  return (
    <Room roomId={document.roomId}>
      <div className="min-h-screen p-4 bg-[#FAFBFD]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
          <Navbar data={document} />
          <ToolBar />
        </div>
        <div className="pt-[114px] print:pt-0">
            <EditorPage
            documentId={document._id}
            initialContent={document.initialContent ?? ""}
            />
        </div>
      </div>
    </Room>
  );
};