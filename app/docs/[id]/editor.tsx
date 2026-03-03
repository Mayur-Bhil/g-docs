"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import ImageResize from 'tiptap-extension-resize-image';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEditorStore } from '@/store/use-editor-store';
import { Extension } from '@tiptap/core';
import { Ruler } from './ruler';

const lowlight = createLowlight(common);

// Custom FontSize Extension
export type FontSizeOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

// Custom LineHeight Extension
export type LineHeightOptions = {
  types: string[];
  defaultLineHeight: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: 'normal',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => {
              if (element.style.lineHeight) {
                return element.style.lineHeight;
              }
              return this.options.defaultLineHeight;
            },
            renderHTML: (attributes) => {
              if (
                !attributes.lineHeight ||
                attributes.lineHeight === this.options.defaultLineHeight
              ) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { lineHeight })
          );
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, 'lineHeight')
          );
        },
    };
  },
});

export const EditorPage = () => {
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) { 
      setEditor(editor); 
    },
    onDestroy() { 
      setEditor(null); 
    },
    onUpdate({ editor }) { 
      setEditor(editor); 
    },
    onSelectionUpdate({ editor }) { 
      setEditor(editor); 
    },
    onTransaction({ editor }) { 
      setEditor(editor); 
    },
    onFocus({ editor }) { 
      setEditor(editor); 
    },
    onBlur({ editor }) { 
      setEditor(editor); 
    },
    onContentError({ editor, error }) {
      console.error('Editor content error:', error);
    },
    editorProps: {
      attributes: {
        class:
          'focus:outline-none prose prose-sm max-w-none h-full',
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-4 border-t-2 border-gray-300',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono',
          },
        },
        codeBlock: false,
        history: {
          depth: 100,
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto',
        },
      }),
      FontFamily,
      TextStyle,
      Color,
      FontSize,
      LineHeight.configure({
        types: ['paragraph', 'heading'],
        defaultLineHeight: 'normal',
      }),
      Underline,
      Superscript.configure({
        HTMLAttributes: {
          class: 'align-super text-xs',
        },
      }),
      Subscript.configure({
        HTMLAttributes: {
          class: 'align-sub text-xs',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }),
      ImageResize.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({ 
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-50 font-bold p-3 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-3',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-none pl-2',
        },
      }),
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-1',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      Highlight.configure({ 
        multicolor: true,
      }),
    ],
    content: `
      <h1>Welcome to Your Paginated Document Editor</h1>
      <p>This editor works just like Google Docs with automatic page creation!</p>
      
      <h2>How It Works</h2>
      <p>As you type and add content, the document automatically flows into new pages. Each page is a standard A4 size (816×1054 pixels).</p>
      
      <h2>Features</h2>
      <ul>
        <li>📄 Automatic page breaks when content exceeds page height</li>
        <li>📊 Page numbers displayed at the bottom</li>
        <li>🖨️ Print-ready layout</li>
        <li>📝 Continuous editing experience</li>
      </ul>
      
      <h2>Try It Out!</h2>
      <p>Start typing below and watch as new pages appear automatically. The content flows naturally from one page to the next.</p>
      
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      
      <blockquote>
        "The best way to predict the future is to create it." - Peter Drucker
      </blockquote>
      
      <h2>Tables and More</h2>
      <table>
        <tbody>
          <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>Multi-page</td>
            <td>Automatic page creation</td>
            <td>✓ Active</td>
          </tr>
          <tr>
            <td>Formatting</td>
            <td>Rich text formatting</td>
            <td>✓ Active</td>
          </tr>
          <tr>
            <td>Tables</td>
            <td>Full table support</td>
            <td>✓ Active</td>
          </tr>
        </tbody>
      </table>
      
      <p>Keep typing to see more pages appear...</p>
    `,
  });

  return (
    <div className="w-full min-h-screen bg-[#f9fbfd] print:bg-white">
      {/* Page container with Google Docs style */}
          <Ruler/>
      <div className="flex justify-center py-8 px-4 print:p-0">
        <div className="flex flex-col gap-6 print:gap-0">
          {/* Single continuous editor with page styling */}
          <div className="relative">
            {/* Page wrapper with shadows and borders */}
            <div 
              className="bg-white border border-[#c7c7c7] shadow-lg print:shadow-none print:border-0"
              style={{
                width: '816px',
                minHeight: '1054px',
                padding: '56px',
              }}
            >
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Page indicators using CSS - More realistic page breaks */}
      <style jsx global>{`
        @media screen {
          .ProseMirror {
            min-height: 942px;
            /* Page break line appears at 1100px (allowing more content) */
            background-image: 
              repeating-linear-gradient(
                to bottom,
                transparent 0,
                transparent 1098px,
                #cbd5e1 1098px,
                #cbd5e1 1100px,
                transparent 1100px,
                transparent 1174px
              );
            background-size: 100% 1174px;
            background-position: 0 0;
            padding-bottom: 80px;
          }
        }
        
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .ProseMirror {
            background-image: none;
            page-break-after: auto;
            padding-bottom: 0;
          }
          
          /* Avoid breaking these elements across pages */
          .ProseMirror > * {
            page-break-inside: avoid;
          }
          
          .ProseMirror h1,
          .ProseMirror h2,
          .ProseMirror h3 {
            page-break-after: avoid;
          }
          
          .ProseMirror table {
            page-break-inside: avoid;
          }
          
          .ProseMirror blockquote {
            page-break-inside: avoid;
          }
          
          /* Better orphan/widow control */
          .ProseMirror p {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </div>
  );
};

export default EditorPage;