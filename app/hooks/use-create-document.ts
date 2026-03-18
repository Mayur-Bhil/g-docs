"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateDocument = () => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const router = useRouter();
  const createDoc = useMutation(api.documents.create);
  const docCount = useQuery(api.subscriptions.getDocumentCount) ?? 0;

  const create = async (title?: string) => {
    try {
      const id = await createDoc({ title });
      router.push(`/docs/${id}`);
      toast.success("Document created!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : String(err);
      if (message.includes("FREE_LIMIT_REACHED")) {
        setShowUpgrade(true);
      } else {
        toast.error("Failed to create document");
      }
    }
  };

  return { create, showUpgrade, setShowUpgrade, docCount };
};