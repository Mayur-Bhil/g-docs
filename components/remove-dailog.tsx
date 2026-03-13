"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,


} from "@/components/ui/alert-dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import React, { useState } from "react"
interface RemoveDailogProps {
  
    documentId : Id<"documents">
    children : React.ReactNode;
}


import { toast } from "sonner";

export const RemoveDailog = ({ documentId, children }: RemoveDailogProps) => {
  const removebyId = useMutation(api.documents.remove);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogTitle>Are You sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your document.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoving(true);
              removebyId({ id: documentId })
                .then(() => toast.success("Document deleted successfully"))
                .catch((error) => {
                  // Shows the ConvexError message (e.g. "Only admin can delete")
                  toast.error(error?.data ?? "Failed to delete document");
                })
                .finally(() => setIsRemoving(false));
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};