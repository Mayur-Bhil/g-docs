import { Doc } from "@/convex/_generated/dataModel";
import { PaginationStatus } from "convex/react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LoaderIcon } from "lucide-react";
import { DocumentRow } from "./DocumentRow";

interface DocumentsTableProps {
    documents: Doc<"documents">[] | undefined;
    loadmore: (numItems: number) => void;
    status: PaginationStatus;
}

export const DocumentsTable = ({
    documents,
    loadmore,
    status,
}: DocumentsTableProps) => {
    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 py-4 sm:py-6 flex flex-col gap-2">
            {documents === undefined ? (
                <div className="flex justify-center items-center h-24">
                    <LoaderIcon className="animate-spin text-[#5f6368]" size={20} />
                </div>
            ) : (
                <Table className="border-separate border-spacing-0">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-none">
                            {/* Icon column */}
                            <TableHead className="w-8 sm:w-10 pr-2 pl-2 sm:pl-4" />

                            {/* Name */}
                            <TableHead className="text-xs font-medium text-[#5f6368] uppercase tracking-wide py-2 pr-4 sm:pr-8">
                                Name
                            </TableHead>

                            {/* Shared — hidden on mobile */}
                            <TableHead className="text-xs font-medium text-[#5f6368] uppercase tracking-wide py-2 w-[160px] hidden md:table-cell">
                                Shared
                            </TableHead>

                            {/* Created — hidden on mobile */}
                            <TableHead className="text-xs font-medium text-[#5f6368] uppercase tracking-wide py-2 w-[140px] hidden md:table-cell">
                                Created
                            </TableHead>

                            {/* Actions */}
                            <TableHead className="w-8 sm:w-10" />
                        </TableRow>
                    </TableHeader>

                    {documents.length === 0 ? (
                        <TableBody>
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center text-sm text-[#5f6368]"
                                >
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {documents.map((doc) => (
                                <DocumentRow key={doc._id} document={doc} />
                            ))}
                        </TableBody>
                    )}
                </Table>
            )}

            {/* Load More */}
          {documents && (status === "CanLoadMore" || status === "Exhausted") && (
        <div className="flex justify-center pt-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => loadmore(5)}
                disabled={status !== "CanLoadMore"}
                className="text-[#1a73e8] hover:bg-[#f1f3f4] text-sm font-medium"
            >
            {status === "CanLoadMore" ? "Load More" : "End of results"}
            </Button>
        </div>
    )}
        
        </div>
    );
};