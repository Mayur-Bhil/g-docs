"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import React, { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Flag, Ghost } from "lucide-react"


interface renamDailogProps {
    documentId : Id<"documents">
    initialTitle:string,
    children : React.ReactNode;
}


export const RenameDailog = ({documentId,initialTitle,children}:renamDailogProps)=>{
    const updateByID = useMutation(api.documents.update);
    const [isUpdateing,setIsUpdating] = useState(false)

    const [title,setTitle] = useState(initialTitle);
    const [open,setOpen] = useState(false);

    const onSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setIsUpdating(true);
        updateByID({id:documentId,title:title.trim() || "Untitled"}).then(()=> setOpen(false)).finally(()=>{
            setIsUpdating(false)
           
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent onClick={(e)=>e.stopPropagation()} className="select-none">
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                                <DialogTitle>Rename Document</DialogTitle>
                                <DialogDescription>
                                    Enter A new For This Document
                                </DialogDescription>
                        </DialogHeader>
                        <div className="my-4">
                                <Input
                                    value={title}
                                    onChange={(e)=>setTitle(e.target.value)}
                                    placeholder="Document Name"
                                    onClick={(e)=>e.stopPropagation()}
                                />
                        </div>
                        <DialogFooter>
                                <Button
                                    type="button"
                                    variant={"ghost"}
                                    disabled={isUpdateing}
                                    onClick={(e)=>{
                                          e.stopPropagation();
                                          setOpen(false)  
                                    }}
                                >
                                        cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdateing}
                                    onClick={(e)=>{
                                        e.stopPropagation()
                                    }}
                                    
                                >
                                        save
                                </Button>
                        </DialogFooter>
                    </form>
            </DialogContent>
        </Dialog>
    )
}