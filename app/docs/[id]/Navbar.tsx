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
  MenubarShortcut,
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
  Globe,
  Copy,
  ClipboardPaste,
  Scissors,
  Trash2,
  Search,
  Save,
  FolderOpen,
  Share2,
  Settings,
  FilePlus,
  Eye,
  Moon,
  Sun,
  Languages,
  CheckSquare,
  FileEdit,
  History,
  Users,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";

export const Navbar = () => {
    const { editor } = useEditorStore();
    const [isSpellCheckEnabled, setIsSpellCheckEnabled] = React.useState(true);
    const [isMounted, setIsMounted] = React.useState(false);

    // Fix hydration mismatch
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // File Menu Actions
    const handleNewDocument = () => {
        if (confirm("Create a new document? Unsaved changes will be lost.")) {
            window.location.href = "/";
        }
    };

    const handleSave = () => {
        console.log("Document saved");
        alert("Document saved successfully!");
    };

    const handleExportJSON = () => {
        const json = editor?.getJSON();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportHTML = () => {
        const html = editor?.getHTML();
        const blob = new Blob([html || ''], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportText = () => {
        const text = editor?.getText();
        const blob = new Blob([text || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (!isMounted) return;
        
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'Document',
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    // Edit Menu Actions
    const handleUndo = () => {
        editor?.chain().focus().undo().run();
    };

    const handleRedo = () => {
        editor?.chain().focus().redo().run();
    };

    const handleCut = () => {
        if (!isMounted) return;
        document.execCommand('cut');
    };

    const handleCopy = () => {
        if (!isMounted) return;
        document.execCommand('copy');
    };

    const handlePaste = () => {
        if (!isMounted) return;
        document.execCommand('paste');
    };

    const handleSelectAll = () => {
        editor?.chain().focus().selectAll().run();
    };

    const handleFind = () => {
        if (!isMounted) return;
        
        const searchTerm = prompt("Search for:");
        if (searchTerm && searchTerm.trim() !== '') {
            const content = editor?.getText() || '';
            const lowerContent = content.toLowerCase();
            const lowerSearch = searchTerm.toLowerCase();
            
            const index = lowerContent.indexOf(lowerSearch);
            
            if (index !== -1) {
                const matches = content.match(new RegExp(searchTerm, 'gi'));
                const count = matches ? matches.length : 0;
                
                alert(`Found "${searchTerm}" ${count} time(s) in the document`);
            } else {
                alert(`"${searchTerm}" not found in document`);
            }
        }
    };

    const handleDelete = () => {
        editor?.chain().focus().deleteSelection().run();
    };

    // Insert Menu Actions
    const handleInsertImage = () => {
        if (!isMounted) return;
        
        const url = prompt("Enter image URL:");
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleInsertTable = () => {
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const handleInsertLink = () => {
        if (!isMounted) return;
        
        const url = prompt("Enter URL:");
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleInsertCheckbox = () => {
        editor?.chain().focus().toggleTaskList().run();
    };

    // Format Menu Actions
    const handleBold = () => {
        editor?.chain().focus().toggleBold().run();
    };

    const handleItalic = () => {
        editor?.chain().focus().toggleItalic().run();
    };

    const handleUnderline = () => {
        editor?.chain().focus().toggleUnderline().run();
    };

    const handleClearFormatting = () => {
        editor?.chain().focus().clearNodes().unsetAllMarks().run();
    };

    // View Menu Actions
    const handleToggleFullscreen = () => {
        if (!isMounted) return;
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Tools Menu Actions
    const handleToggleSpellCheck = () => {
        if (!isMounted) return;
        
        const editorElement = document.querySelector('.ProseMirror') as HTMLElement;
        if (editorElement) {
            const newValue = !isSpellCheckEnabled;
            editorElement.spellcheck = newValue;
            editorElement.setAttribute('spellcheck', newValue.toString());
            setIsSpellCheckEnabled(newValue);
            
            editor?.chain().focus().run();
            
            alert(newValue 
                ? '✓ Spell check enabled\n\nMisspelled words will be underlined.' 
                : '✗ Spell check disabled'
            );
        }
    };

    const handleWordCount = () => {
        const text = editor?.getText() || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
        const lines = text.split('\n').length;
        
        alert(
            `📊 Document Statistics\n\n` +
            `Words: ${words.toLocaleString()}\n` +
            `Characters: ${characters.toLocaleString()}\n` +
            `Characters (no spaces): ${charactersNoSpaces.toLocaleString()}\n` +
            `Paragraphs: ${paragraphs}\n` +
            `Lines: ${lines}`
        );
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!isMounted) {
        return (
            <nav className="flex items-center justify-between h-16 px-4 border-b">
                <div className="flex gap-2 items-center">
                    <Link href="/">
                        <Image src={"/g-doc.svg"} alt="G-DOCS Logo" width={35} height={35}/>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <DOcumentInput />
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex gap-2 items-center">
               <Link href="/">
                    <Image src={"/g-doc.svg"} alt="G-DOCS Logo" width={35} height={35}/>
               </Link>
               <div className="flex flex-col gap-1">
                {/* Document Inputs */}
                <DOcumentInput />
                {/* Menu Bar */}
                <Menubar className="border-none bg-transparent shadow-none h-auto p-0 ">
                    {/* File Menu */}
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            File
                        </MenubarTrigger>
                        <MenubarContent className="print:hidden">
                            <MenubarItem onClick={handleNewDocument} className="gap-2">
                                <FilePlus className="h-4 w-4"/>
                                New
                                <MenubarShortcut>Ctrl+N</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <FolderOpen className="h-4 w-4"/>
                                Open
                                <MenubarShortcut>Ctrl+O</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleSave} className="gap-2">
                                <Save className="h-4 w-4"/>
                                Save
                                <MenubarShortcut>Ctrl+S</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <Save className="h-4 w-4"/>
                                Save As...
                                <MenubarShortcut>Ctrl+Shift+S</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger className="gap-2">
                                    <Download className="h-4 w-4"/>
                                    Download
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem onClick={handleExportJSON} className="gap-2">
                                        <FileJson className="h-4 w-4"/>
                                        JSON
                                    </MenubarItem>
                                    <MenubarItem onClick={handleExportHTML} className="gap-2">
                                        <Globe className="h-4 w-4"/>
                                        HTML
                                    </MenubarItem>
                                    <MenubarItem className="gap-2">
                                        <FileText className="h-4 w-4"/>
                                        PDF
                                    </MenubarItem>
                                    <MenubarItem onClick={handleExportText} className="gap-2">
                                        <FileIcon className="h-4 w-4"/>
                                        Text
                                    </MenubarItem>
                                </MenubarSubContent>         
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleShare} className="gap-2">
                                <Share2 className="h-4 w-4"/>
                                Share
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <History className="h-4 w-4"/>
                                Version History
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={handlePrint} className="gap-2">
                                <Printer className="h-4 w-4"/>
                                Print
                                <MenubarShortcut>Ctrl+P</MenubarShortcut>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    
                    {/* Edit Menu */}
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Edit
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem onClick={handleUndo} className="gap-2">
                                <Undo className="h-4 w-4"/>
                                Undo
                                <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handleRedo} className="gap-2">
                                <Redo className="h-4 w-4"/>
                                Redo
                                <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleCut} className="gap-2">
                                <Scissors className="h-4 w-4"/>
                                Cut
                                <MenubarShortcut>Ctrl+X</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handleCopy} className="gap-2">
                                <Copy className="h-4 w-4"/>
                                Copy
                                <MenubarShortcut>Ctrl+C</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handlePaste} className="gap-2">
                                <ClipboardPaste className="h-4 w-4"/>
                                Paste
                                <MenubarShortcut>Ctrl+V</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleFind} className="gap-2">
                                <Search className="h-4 w-4"/>
                                Find
                                <MenubarShortcut>Ctrl+F</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handleSelectAll} className="gap-2">
                                <FileEdit className="h-4 w-4"/>
                                Select All
                                <MenubarShortcut>Ctrl+A</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleDelete} className="gap-2 text-red-600">
                                <Trash2 className="h-4 w-4"/>
                                Delete
                                <MenubarShortcut>Del</MenubarShortcut>
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>
                    
                    {/* Insert Menu */}
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Insert
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem onClick={handleInsertImage} className="gap-2">
                                <ImageIcon className="h-4 w-4"/>
                                Image
                            </MenubarItem>
                            <MenubarItem onClick={handleInsertTable} className="gap-2">
                                <Table className="h-4 w-4"/>
                                Table
                            </MenubarItem>
                            <MenubarItem onClick={handleInsertLink} className="gap-2">
                                <Globe className="h-4 w-4"/>
                                Link
                                <MenubarShortcut>Ctrl+K</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleInsertCheckbox} className="gap-2">
                                <CheckSquare className="h-4 w-4"/>
                                Checkbox List
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <FileText className="h-4 w-4"/>
                                Page Break
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>

                    {/* Format Menu */}
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Format
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem onClick={handleBold} className="gap-2">
                                <span className="font-bold text-base">B</span>
                                Bold
                                <MenubarShortcut>Ctrl+B</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handleItalic} className="gap-2">
                                <span className="italic text-base">I</span>
                                Italic
                                <MenubarShortcut>Ctrl+I</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handleUnderline} className="gap-2">
                                <span className="underline text-base">U</span>
                                Underline
                                <MenubarShortcut>Ctrl+U</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger className="gap-2">
                                    <AlignLeft className="h-4 w-4"/>
                                    Text Alignment
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="gap-2">
                                        <AlignLeft className="h-4 w-4"/>
                                        Align Left
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="gap-2">
                                        <AlignCenter className="h-4 w-4"/>
                                        Align Center
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().setTextAlign('right').run()} className="gap-2">
                                        <AlignRight className="h-4 w-4"/>
                                        Align Right
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().setTextAlign('justify').run()} className="gap-2">
                                        <AlignJustify className="h-4 w-4"/>
                                        Justify
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem onClick={handleClearFormatting} className="gap-2">
                                <Trash2 className="h-4 w-4"/>
                                Clear Formatting
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>

                    {/* View Menu */}
                    <MenubarMenu>
                        <MenubarTrigger  className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            View
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem onClick={handlePrint} className="gap-2">
                                <Eye className="h-4 w-4"/>
                                Print Layout
                            </MenubarItem>
                            <MenubarItem onClick={handleToggleFullscreen} className="gap-2">
                                <Eye className="h-4 w-4"/>
                                Fullscreen
                                <MenubarShortcut>F11</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger className="gap-2">
                                    <Sun className="h-4 w-4"/>
                                    Theme
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem className="gap-2">
                                        <Sun className="h-4 w-4"/>
                                        Light
                                    </MenubarItem>
                                    <MenubarItem className="gap-2">
                                        <Moon className="h-4 w-4"/>
                                        Dark
                                    </MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                        </MenubarContent>                        
                    </MenubarMenu>

                    {/* Tools Menu */}
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Tools
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem onClick={handleToggleSpellCheck} className="gap-2">
                                <Languages className="h-4 w-4"/>
                                {isSpellCheckEnabled ? 'Disable' : 'Enable'} Spell Check
                                <MenubarShortcut>F7</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem onClick={handleWordCount} className="gap-2">
                                <FileText className="h-4 w-4"/>
                                Word Count
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="gap-2">
                                <Settings className="h-4 w-4"/>
                                Preferences
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>

                    {/* Help Menu */}
                    <MenubarMenu>
                        <MenubarTrigger className="text-sm font-normal px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            Help
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem className="gap-2">
                                <FileText className="h-4 w-4"/>
                                Documentation
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <Search className="h-4 w-4"/>
                                Keyboard Shortcuts
                                <MenubarShortcut>Ctrl+/</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="gap-2">
                                About G-Docs
                            </MenubarItem>
                        </MenubarContent>                        
                    </MenubarMenu>
                </Menubar>
               </div>
            </div>

            {/* Right side - Collaboration/Settings */}
            <div className="flex items-center gap-2">
                <button 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Collaborators"
                >
                    <Users className="h-5 w-5 text-gray-600"/>
                </button>
                <button 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Settings"
                >
                    <Settings className="h-5 w-5 text-gray-600"/>
                </button>
            </div>
        </nav>
    );
};