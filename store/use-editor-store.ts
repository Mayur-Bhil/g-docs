import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorState {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;

  // ✅ Margin state — set by Ruler, consumed by EditorPage
  leftMargin: number;
  rightMargin: number;
  setLeftMargin: (value: number) => void;
  setRightMargin: (value: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),

  leftMargin: 56,
  rightMargin: 760,
  setLeftMargin: (leftMargin) => set({ leftMargin }),
  setRightMargin: (rightMargin) => set({ rightMargin }),
}));