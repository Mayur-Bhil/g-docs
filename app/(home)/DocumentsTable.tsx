import { Doc } from "@/convex/_generated/dataModel"
import { PaginationStatus } from "convex/react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LoaderIcon } from "lucide-react"

interface DocumentsTableProps {
    documents : Doc<"documents">[] | undefined,
    loadmore: (numItems: number) => void,
    status:PaginationStatus

}
export const DocumentsTable  = ({
    documents,
    loadmore,
    status
}:DocumentsTableProps)=>{
    return <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
            {documents === undefined ? (
                <div className="felx justify-center items-center h-24">
                    <LoaderIcon className="animate-spin text-muted-foreground" size={24} />
                </div>
            ):(
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead>Document Name</TableHead>
                                <TableHead>&nbsp;</TableHead>
                                <TableHead>Shared</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        {documents.length === 0 ? (
                            <TableBody>
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No documents found.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ):(
                            <TableBody>
                                Documents
                            </TableBody>  
                        )}
                    </Table>
            )}
        </div>
}   
                                     