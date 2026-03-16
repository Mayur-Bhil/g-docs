import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { Document } from "./document";
import { api } from "@/convex/_generated/api";

interface DocumentIdProps {
  params: Promise<{ id: Id<"documents"> }>;
}

const DocumentIdPage = async ({ params }: DocumentIdProps) => {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" }) ?? undefined;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id },
    { token }
  );

  return <Document preLoadedDocument={preloadedDocument} />;
};

export default DocumentIdPage;