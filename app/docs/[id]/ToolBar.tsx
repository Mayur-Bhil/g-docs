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
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  ChevronDown,
  Palette,
  Highlighter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type ColorResult, CirclePicker } from "react-color";
import { type Level } from "@tiptap/extension-heading";
import { useCallback } from "react";
import * as React from "react";

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
        "h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-[#d3e3fd] transition-colors",
        isActive && "bg-[#c2e7ff]"
      )}
    >
      <Icon className="w-[18px] h-[18px] text-[#444746]" />
    </button>
  );
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: 'Normal text', value: 0, fontSize: '14px' },
    { label: 'Heading 1', value: 1, fontSize: '28px' },
    { label: 'Heading 2', value: 2, fontSize: '22px' },
    { label: 'Heading 3', value: 3, fontSize: '18px' },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 3; level++) {
      if (editor?.isActive('heading', { level: level as Level })) {
        return `Heading ${level}`;
      }
    }
    return 'Normal text';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[110px] shrink-0 flex items-center justify-between rounded-sm hover:bg-[#d3e3fd] px-2 text-sm transition-colors">
          <span className='truncate text-[#444746] text-[13px]'>
            {getCurrentHeading()}
          </span>
          <ChevronDown className='ml-2 w-4 h-4 shrink-0 text-[#444746]'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-1 bg-white rounded-sm shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)] min-w-[200px] z-50'>
        {headings.map(({ label, value, fontSize }) => (
          <button
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor?.chain().focus().setHeading({ level: value as Level }).run();
              }
            }}
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-3 py-2 rounded-sm hover:bg-[#f1f3f4] transition-colors text-left",
              (value === 0 && !editor?.isActive('heading')) && "bg-[#e8f0fe]",
              (value > 0 && editor?.isActive('heading', { level: value as Level })) && "bg-[#e8f0fe]"
            )}
          >
            <span className='text-[#444746]' style={{ fontSize }}>
              {label}
            </span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const fontSizes = [
    { label: '8', value: '8px' },
    { label: '9', value: '9px' },
    { label: '10', value: '10px' },
    { label: '11', value: '11px' },
    { label: '12', value: '12px' },
    { label: '14', value: '14px' },
    { label: '16', value: '16px' },
    { label: '18', value: '18px' },
    { label: '20', value: '20px' },
    { label: '22', value: '22px' },
    { label: '24', value: '24px' },
    { label: '26', value: '26px' },
    { label: '28', value: '28px' },
    { label: '36', value: '36px' },
    { label: '48', value: '48px' },
  ];

  const getCurrentFontSize = () => {
    const fontSize = editor?.getAttributes('textStyle').fontSize;
    if (fontSize) {
      return fontSize.replace('px', '');
    }
    return '14';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[65px] shrink-0 flex items-center justify-between rounded-sm hover:bg-[#d3e3fd] px-2 text-sm transition-colors">
          <span className='truncate text-[#444746] text-[13px]'>
            {getCurrentFontSize()}
          </span>
          <ChevronDown className='ml-2 w-4 h-4 shrink-0 text-[#444746]'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-0.5 bg-white rounded-sm shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)] min-w-[100px] max-h-[300px] overflow-y-auto z-50'>
        {fontSizes.map(({ label, value }) => (
          <button
            onClick={() => editor?.chain().focus().setFontSize(value).run()}
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-[#f1f3f4] text-sm transition-colors text-left",
              editor?.getAttributes('textStyle').fontSize === value && "bg-[#e8f0fe]"
            )}
          >
            <span className='text-[#444746]'>{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore(); 

  const fonts = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Calibri', value: 'Calibri, sans-serif' },
    { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[130px] shrink-0 flex items-center justify-between rounded-sm hover:bg-[#d3e3fd] px-2 text-sm transition-colors">  
          <span className='truncate text-[#444746] text-[13px]'>
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDown className='ml-2 w-4 h-4 shrink-0 text-[#444746]'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-1 flex flex-col gap-y-0.5 bg-white rounded-sm shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)] min-w-[180px] z-50'> 
        {fonts.map(({label, value}) => (
          <button 
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            key={value} 
            className={cn(
              "flex items-center gap-x-2 px-3 py-2 rounded-sm hover:bg-[#f1f3f4] text-sm transition-colors text-left",
              editor?.getAttributes("textStyle").fontFamily === value && "bg-[#e8f0fe]"
            )}
            style={{fontFamily: value}}>
            <span className='text-[13px] text-[#444746]'>{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes('textStyle').color || '#000000';
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-[#d3e3fd] px-1 gap-0.5 transition-colors">
          <Palette className='w-[18px] h-[18px] text-[#444746]' />
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2.5 bg-white rounded-sm shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)] z-50'>
        <CirclePicker
          color={value}
          onChange={onChange}
          colors={[
            '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
            '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
            '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
            '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
            '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
            '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
            '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
            '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
          ]}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const highlightColors = [
    { label: 'Yellow', value: '#ffff00' },
    { label: 'Lime', value: '#00ff00' },
    { label: 'Cyan', value: '#00ffff' },
    { label: 'Magenta', value: '#ff00ff' },
    { label: 'Light Yellow', value: '#fff59d' },
    { label: 'Light Green', value: '#c5e1a5' },
    { label: 'Light Blue', value: '#90caf9' },
    { label: 'Light Pink', value: '#f48fb1' },
    { label: 'Light Orange', value: '#ffcc80' },
    { label: 'Light Purple', value: '#ce93d8' },
    { label: 'Light Red', value: '#ef9a9a' },
    { label: 'Light Gray', value: '#e0e0e0' },
    { label: 'Light Cyan', value: '#80deea' },
    { label: 'Light Lime', value: '#e6ee9c' },
    { label: 'Orange', value: '#ff9800' },
    { label: 'Red', value: '#f44336' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-[#d3e3fd] px-1 gap-0.5 transition-colors">
          <Highlighter className='w-[18px] h-[18px] text-[#444746]' />
          <div className="w-4 h-0.5 bg-yellow-300 rounded" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2 bg-white rounded-sm shadow-[0_2px_6px_2px_rgba(0,0,0,0.15)] z-50'>
        <div className='grid grid-cols-4 gap-1 mb-2'>
          {highlightColors.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => editor?.chain().focus().toggleHighlight({ color: value }).run()}
              className="w-7 h-7 rounded-sm hover:ring-2 ring-[#4285f4] transition-all"
              style={{ backgroundColor: value }}
              title={label}
            />
          ))}
        </div>
        <button
          onClick={() => editor?.chain().focus().unsetHighlight().run()}
          className="w-full px-2 py-1.5 text-xs rounded-sm hover:bg-[#f1f3f4] text-[#444746] transition-colors"
        >
          None
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href || '';
    setUrl(previousUrl);
    setIsOpen(true);
  }, [editor]);

  const handleApply = () => {
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setIsOpen(false);
    setUrl('');
  };

  const handleRemove = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsOpen(false);
    setUrl('');
  };

  return (
    <>
      <ToolBarButton
        onClick={setLink}
        isActive={editor?.isActive('link')}
        icon={Link2}
      />
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-[420px] p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[#202124] text-base font-medium mb-4">Insert Link</h3>
            
            <div className="mb-5">
              <label className="block text-[#5f6368] text-sm mb-2">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-[#dadce0] rounded focus:outline-none focus:border-[#4285f4] focus:ring-1 focus:ring-[#4285f4] text-[#202124] text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApply();
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={handleRemove}
                className="px-4 py-2 text-sm text-[#d93025] hover:bg-[#fce8e6] rounded transition-colors"
              >
                Remove Link
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-[#5f6368] hover:bg-[#f1f3f4] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 text-sm text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'upload' | 'url'>('upload');
  const [url, setUrl] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const openDialog = () => {
    setIsOpen(true);
    setActiveTab('upload');
    setUrl('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      editor?.chain().focus().setImage({ src: base64 }).run();
      setUploading(false);
      setIsOpen(false);
    };
    reader.onerror = () => {
      alert('Failed to read image file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlInsert = () => {
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
      setIsOpen(false);
      setUrl('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileSelect({ target: input } as any);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <ToolBarButton
        onClick={openDialog}
        isActive={false}
        icon={ImageIcon}
      />
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-[480px]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-[#dadce0]">
              <h3 className="text-[#202124] text-base font-medium">Insert Image</h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#dadce0]">
              <button
                onClick={() => setActiveTab('upload')}
                className={cn(
                  "flex-1 px-5 py-3 text-sm font-medium transition-colors relative",
                  activeTab === 'upload' 
                    ? "text-[#1a73e8]" 
                    : "text-[#5f6368] hover:text-[#202124]"
                )}
              >
                Upload
                {activeTab === 'upload' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a73e8]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={cn(
                  "flex-1 px-5 py-3 text-sm font-medium transition-colors relative",
                  activeTab === 'url' 
                    ? "text-[#1a73e8]" 
                    : "text-[#5f6368] hover:text-[#202124]"
                )}
              >
                By URL
                {activeTab === 'url' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a73e8]" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {activeTab === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-[#dadce0] rounded-lg p-8 text-center hover:border-[#4285f4] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#1a73e8]" />
                      </div>
                      
                      {uploading ? (
                        <div className="text-[#5f6368]">
                          <div className="text-sm font-medium">Uploading...</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-[#202124] text-sm font-medium">
                            Click to upload or drag and drop
                          </div>
                          <div className="text-[#5f6368] text-xs">
                            PNG, JPG, GIF, WebP up to 5MB
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[#5f6368] text-sm mb-2">Image URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-[#dadce0] rounded focus:outline-none focus:border-[#4285f4] focus:ring-1 focus:ring-[#4285f4] text-[#202124] text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUrlInsert();
                      }
                    }}
                  />
                  <p className="text-[#5f6368] text-xs mt-2">Paste the URL of an image from the web</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-[#5f6368] hover:bg-[#f1f3f4] rounded transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              {activeTab === 'url' && (
                <button
                  onClick={handleUrlInsert}
                  disabled={!url || uploading}
                  className="px-4 py-2 text-sm text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded transition-colors disabled:bg-[#dadce0] disabled:cursor-not-allowed"
                >
                  Insert
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ToolBar = () => {
  const { editor } = useEditorStore();

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
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
        label: "Print",
        icon: Printer,
        onClick: () => window.print(),
      },
    ],
    [
      {
        label: "Bold",
        icon: Bold,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: editor?.isActive("bold"),
      },
      {
        label: "Italic",
        icon: Italic,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editor?.isActive("italic"),
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
    ],
    [
      {
        label: "Align Left",
        icon: AlignLeft,
        onClick: () => editor?.chain().focus().setTextAlign('left').run(),
        isActive: editor?.isActive({ textAlign: 'left' }),
      },
      {
        label: "Align Center",
        icon: AlignCenter,
        onClick: () => editor?.chain().focus().setTextAlign('center').run(),
        isActive: editor?.isActive({ textAlign: 'center' }),
      },
      {
        label: "Align Right",
        icon: AlignRight,
        onClick: () => editor?.chain().focus().setTextAlign('right').run(),
        isActive: editor?.isActive({ textAlign: 'right' }),
      },
      {
        label: "Align Justify",
        icon: AlignJustify,
        onClick: () => editor?.chain().focus().setTextAlign('justify').run(),
        isActive: editor?.isActive({ textAlign: 'justify' }),
      },
    ],
    [
      {
        label: "Bullet List",
        icon: List,
        onClick: () => editor?.chain().focus().toggleBulletList().run(),
        isActive: editor?.isActive("bulletList"),
      },
      {
        label: "Ordered List",
        icon: ListOrdered,
        onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        isActive: editor?.isActive("orderedList"),
      },
      {
        label: "Task List",
        icon: ListTodo,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },
    ],
  ];

  return (
    <div className="bg-[#f9fbfd] px-2.5 py-1 min-h-[44px] flex items-center gap-0.5 overflow-x-auto border-b border-[#dadce0] print:hidden">
      {/* History & Print */}
      {sections[0].map((section) => (
        <ToolBarButton key={section.label} {...section} />
      ))}
      
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      
      {/* Heading, Font & Size */}
      <HeadingLevelButton/>
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      <FontFamilyButton/>
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      <FontSizeButton/>
      
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      
      {/* Text Formatting */}
      {sections[1].map((section) => (  
        <ToolBarButton key={section.label} {...section} />
      ))}
      
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      
      {/* Text & Highlight Color */}
      <TextColorButton />
      <HighlightColorButton />
      
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      
      {/* Link & Image */}
      <LinkButton />
      <ImageButton />
      
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      
      {/* Text Alignment */}
      {sections[2].map((section) => (  
        <ToolBarButton key={section.label} {...section} />
      ))}
      
      <Separator orientation="vertical" className="h-5 w-px bg-[#dadce0] mx-0.5"/>
      
      {/* Lists */}
      {sections[3].map((section) => (  
        <ToolBarButton key={section.label} {...section} />
      ))}
    </div>
  );
};

export default ToolBar;