"use client";

import {
  Bold,
  Italic,
  LucideIcon,
  Strikethrough,
  Underline,
  Undo,
  Redo,
  Printer,
  SpellCheck,
  Eraser,
  BoldIcon,
  MessageSquarePlusIcon,
  ListTodoIcon,
  RemoveFormatting,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

interface ToolBarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const ToolBarButton = ({ onClick, isActive, icon: Icon }: ToolBarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80"
      )}
    >
      <Icon size={18} />
    </button>
  );
};


const FontFamilyButton = () => {
  const { editor } = useEditorStore(); 

  const Fonts = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },

  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={"h-7 w-[120px]  shrink-0 flex intems-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"}>  
          <span className='truncate'>
            {
              editor?.getAttributes("textStyle").fontFamily || "Arial"
            }
          </span>
          <ChevronDownIcon className='ml-2 size-4 shrink-0'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1'> 
       {
         Fonts.map(({label,value})=> (
             <button 
             onClick={()=> editor?.chain().focus().setFontFamily(value).run()}
             key={value} className=
             {cn("flex items-center gap-x-2 py-1  rounded-sm hover:bg-neutral-200/80 px-2 text-sm", editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
             )}
             style={{fontFamily:value}}>
              <span className='text-sm'>{label}</span>
            </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export const ToolBar = () => {
  const { editor } = useEditorStore();

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [{
        label: "Undo",
        icon: Undo,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",          
        icon: Redo,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "Underline",
        icon: Underline,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: editor?.isActive("underline"),
      },
      {
        label: "Strikethrough",
        icon: Strikethrough,
        onClick: () => editor?.chain().focus().toggleStrike().run(),
        isActive: editor?.isActive("strike"),
      },
       {
        label:"print",
        icon: Printer,
        onClick: () => window.print(),
      },
      {
        label:"Spell Check",
        icon: SpellCheck,
        onClick: () => {
            const current  = editor?.view.dom.getAttribute("spellcheck");
            editor?.view.dom.setAttribute("spellcheck", current === "true" ? "false" : "true");
        },
      },
      {
        label:"Clear Formatting",
        icon: Eraser,
        onClick: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
      }
    ],
    [
      {
        label:"bold",
        icon: BoldIcon,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: editor?.isActive("bold"),
      },{
        label: "Italic",
        icon: Italic,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editor?.isActive("italic"),
      },
      {
        label:"Comment",
        icon: MessageSquarePlusIcon,
        onClick: () => alert("Comment feature is not implemented yet."),
        isActive: false,
      },{
        label:"List Feature",
        icon:ListTodoIcon,
        onClick:()=> editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },{
        label:"Remove Formatting",
        icon: RemoveFormatting,
        onClick: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
      }
    ],
  ];

  return (
    <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-0.5 overflow-auto">
      {sections[0].map((section) => (
        <ToolBarButton key={section.label} {...section} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
      <FontFamilyButton/>
      <Separator orientation="vertical" className="h-6 bg-neutral-300 "/>
      <Separator orientation="vertical" className="h-6 bg-neutral-300 "/>
      <Separator orientation="vertical" className="h-6 bg-neutral-300 "/>
      <Separator orientation="vertical" className="h-6 bg-neutral-300 "/>
      {
        sections[1].map((section) => (  
          <ToolBarButton key={section.label} {...section} />
        ))
      }
      <Separator orientation="vertical" className="h-6 bg-neutral-300 "/>
    {
        sections[2]?.map((section) => (  
          <ToolBarButton key={section.label} {...section} />
        ))
      }
    </div>
  );
};

export default ToolBar;