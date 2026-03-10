import { format } from "date-fns/format";   
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { Building2Icon, CircleUserIcon,} from "lucide-react";
import { SiGoogledocs } from "react-icons/si";
import { DocumentMenu } from "./document-menu";

interface DocumentRowProps {
    document: Doc<"documents">;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
   const router  = useRouter();  

    return (
        <TableRow 
        onClick={()=> router.push(`/docs/${document?._id}`)}
        className="cursor-pointer hover:bg-[#f1f3f4] border-none group transition-colors duration-100">
            {/* Icon */}
            <TableCell className="w-8 sm:w-10 pr-2 pl-2 sm:pl-4">
                <SiGoogledocs className="size-4 sm:size-5 fill-[#4285f4]" />
            </TableCell>

            {/* Title */}
            <TableCell className="font-normal text-[#202124] text-sm py-3 pr-4 sm:pr-8 max-w-[160px] sm:max-w-none truncate">
                {document.title}
            </TableCell>

            {/* Shared / Owner — hidden on mobile */}
            <TableCell className="text-[#5f6368] text-sm hidden md:table-cell w-[160px]">
                <div className="flex items-center gap-2">
                    {document.organizationId
                        ? <Building2Icon className="size-4 shrink-0" />
                        : <CircleUserIcon className="size-4 shrink-0" />}
                    <span>{document.organizationId ? "Organization" : "Personal"}</span>
                </div>
            </TableCell>

            {/* Created At — hidden on mobile */}
            <TableCell className="text-[#5f6368] text-sm hidden md:table-cell w-[140px] whitespace-nowrap">
                {format(new Date(document._creationTime), "MMM d, yyyy")}
            </TableCell>

            {/* Actions — always visible on mobile, hover-only on md+ */}
            <TableCell className="w-8 sm:w-10 pl-0 pr-2 sm:pr-3 text-right">
                <DocumentMenu 
                    documentId={document._id}
                    title={document.title}
                    onNewTab={()=> window.open(`/docs/${document?._id}`, "_blank")}
                />
            </TableCell>
        </TableRow>
    );
};  