"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';

export const EditorPage = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left:56px; padding-right:56px;',
        class: 'focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text print:shadow-none print:rounded-none print:mx-0 print:my-0 print:p-0 print:w-full print:min-h-0'
      }
    },
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
      }),
      ImageResize,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TaskList, 
      TaskItem.configure({
        nested: true,
      })
    ],
    content:`  <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody> 
        </table>`
  });

  return (
    <div className='w-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print-overflow-visible'>
      <div className='min-w-max flex justify-center w-[816px] print:py-0 mx-auto print:w-full print:min-w-0'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EditorPage;