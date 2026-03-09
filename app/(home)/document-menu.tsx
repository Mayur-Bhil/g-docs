import { RemoveDailog } from "@/components/remove-dailog";
import { RenameDailog } from "@/components/rename-dailog";
import { Button } from "@/components/ui/button"
import { FilePenIcon, MoreVertical, TrashIcon } from "lucide-react"
import { Id } from "../../convex/_generated/dataModel"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DocumentMenuProps {
    documentId: Id<"documents">;
    title: string;
    onNewTab: (id: Id<"documents">) => void;
}

export const DocumentMenu = ({ documentId, title, onNewTab }: DocumentMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-[#5f6368] hover:bg-[#e8eaed] rounded-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-md border-[#e0e0e0]">
                <RenameDailog documentId={documentId} initialTitle={title}>
                    <DropdownMenuItem
                    onSelect={(e)=>e.preventDefault()}
                    onClick={(e)=>e.stopPropagation()}
                    >
                        <FilePenIcon className="size-4 mr-2"/>
                        Rename
                    </DropdownMenuItem>
               </RenameDailog>
               <RemoveDailog documentId={documentId}>
                    <DropdownMenuItem
                    onSelect={(e)=>e.preventDefault()}
                    onClick={(e)=>e.stopPropagation()}
                    >
                        <TrashIcon className="size-4 mr-2"/>
                        Remove
                    </DropdownMenuItem>
               </RemoveDailog>
                <DropdownMenuItem className="text-sm" onClick={() => onNewTab(documentId)}>
                    Open in a New Tab
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}