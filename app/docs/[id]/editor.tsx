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
import { useEditorStore } from '@/store/use-editor-store';
import { Extension } from '@tiptap/core';

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

export const EditorPage = () => {
  const { setEditor } = useEditorStore();

  const editor = useEditor({
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
        style: 'padding-left: 56px; padding-right: 56px;',
        class:
          'focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text shadow-lg print:shadow-none print:rounded-none print:mx-0 print:my-0 print:p-0 print:w-full print:min-h-0',
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
        history: {
          depth: 100,
        },
      }),
      FontFamily,
      TextStyle,
      Color,
      FontSize,
      Underline,
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
      <h1>Welcome to Your Document Editor</h1>
      <p>This is a powerful document editor with many features:</p>
      
      <h2>Text Formatting</h2>
      <p>You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or <s>strikethrough</s>.</p>
      
      <h2>Lists</h2>
      <p>Create different types of lists:</p>
      <ul>
        <li>Bullet list item 1</li>
        <li>Bullet list item 2</li>
        <li>Bullet list item 3</li>
      </ul>
      
      <ol>
        <li>Numbered list item 1</li>
        <li>Numbered list item 2</li>
        <li>Numbered list item 3</li>
      </ol>
      
      <h2>Task Lists</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true">Completed task</li>
        <li data-type="taskItem" data-checked="false">Pending task</li>
      </ul>
      
      <h2>Tables</h2>
      <table>
        <tbody>
          <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>Text Formatting</td>
            <td>Bold, Italic, Underline</td>
            <td>✓ Available</td>
          </tr>
          <tr>
            <td>Links & Images</td>
            <td>Insert links and images</td>
            <td>✓ Available</td>
          </tr>
          <tr>
            <td>Alignment</td>
            <td>Left, Center, Right, Justify</td>
            <td>✓ Available</td>
          </tr>
        </tbody>
      </table>
      
      <p style="text-align: center">This text is centered</p>
      <p style="text-align: right">This text is right-aligned</p>
      
      <h3>Start creating your document now!</h3>
      <p>Click anywhere to start typing...</p>
    `,
  });

  return (
    <div className="w-full overflow-x-auto bg-[#f9fbfd] px-4 py-8 print:p-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[816px] mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EditorPage;