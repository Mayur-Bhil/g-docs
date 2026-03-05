"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DOcumentInput } from "./document.input";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger 
} from "@/components/ui/menubar";
import { 
  FileIcon, 
  FileJson,
  FileText,
  Printer,
  Download,
  Plus,
  Undo,
  Redo,
  Image as ImageIcon,
  Table,
  GlobeIcon
} from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-16 px-4">
            <div className="flex gap-2 items-center">
               <Link href="/">
                    <Image src={"/g-doc.svg"} alt="G-DOCS Logo" width={35} height={35}/>
               </Link>
               <div className="flex flex-col gap-1">
                {/* Document Inputs */}
                <DOcumentInput />
                {/* Menu Bar */}
                <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            File
                        </MenubarTrigger>
                        <MenubarContent className="print:hidden">
                            <MenubarItem className="gap-2">
                                <Plus className="h-4 w-4"/>
                                New Document
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger className="gap-2">
                                    <Download className="h-4 w-4"/>
                                    Export
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem className="gap-2">
                                        <FileJson className="h-4 w-4"/>
                                        JSON
                                    </MenubarItem>
                                    <MenubarItem className="gap-2">
                                        <GlobeIcon className="h-4 w-4"/>
                                        HTML
                                    </MenubarItem>
                                    <MenubarItem className="gap-2">
                                        <FileText className="h-4 w-4"/>
                                        PDF
                                    </MenubarItem>
                                    <MenubarItem className="gap-2">
                                        <FileIcon className="h-4 w-4"/>
                                        Text
                                    </MenubarItem>
                                </MenubarSubContent>         
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem className="gap-2">
                                <Printer className="h-4 w-4"/>
                                Print
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Edit
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="gap-2">
                                <Undo className="h-4 w-4"/>
                                Undo
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <Redo className="h-4 w-4"/>
                                Redo
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>
                    
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Insert
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="gap-2">
                                <ImageIcon className="h-4 w-4"/>
                                Image
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <Table className="h-4 w-4"/>
                                Table
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>
                </Menubar>
               </div>
            </div>
        </nav>
    );
};  