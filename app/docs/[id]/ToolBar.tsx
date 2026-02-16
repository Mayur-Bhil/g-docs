"use client";
import { Bold, Italic, LucideIcon, Strikethrough, Underline, Undo } from "lucide-react";
import { cn } from "@/lib/utils";

interface toolBarProps {
    onClick: () => void;
    isActive?: boolean;
    icon:LucideIcon;
}

const ToolBarButton = ({
    onClick,
    isActive,
    icon:Icon
}:toolBarProps) => {
    return (
        <button onClick={onClick} className={cn("text-sm h-7 min-w-7 items-center justify-center rounded-sm hover:bg-neutral-200/80",isActive && "bg-neutral-200/80")}>
            <Icon size={18} />
        </button>
    );
}

export const ToolBar = () => {
    const Sections:{
        label:string;
            icon:LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
        [
            {
                label:"Bold",
                icon: Bold,
                onClick: () => console.log("Bold clicked"),
                isActive: true,
            },
            {
                label:"Italic",
                icon: Italic,
                onClick: () => console.log("Italic clicked"),
            },
            {
                label :"Underline",
                icon: Underline,
                onClick: () => console.log("Underline clicked"),    
            },{
                label :"Strikethrough",
                icon: Strikethrough,
                onClick: () => console.log("Strikethrough clicked"),
            },
            {
                label :"Undo",
                icon: Undo,
                onClick: () => console.log("Undo clicked"), 
            }
        ]
    ];

  return (
    <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-0.5 overflow-auto">
        {Sections[0].map((section) => (
            <ToolBarButton key={section.label} {...section} />  
        ))}
    </div>

  );
};

export default ToolBar;