// app/docs/[id]/use-margin-sync.ts
"use client";

import { useStorage, useMutation } from "@liveblocks/react/suspense";
import { useEditorStore } from "@/store/use-editor-store";
import { useEffect } from "react";

export function useMarginSync() {
  const { setLeftMargin, setRightMargin } = useEditorStore();

  // Read from Liveblocks storage (shared across all users in the room)
  const liveblocksLeftMargin = useStorage((root) => root.leftMargin);
  const liveblocksRightMargin = useStorage((root) => root.rightMargin);

  // Write to Liveblocks storage
  const updateLeftMargin = useMutation(({ storage }, value: number) => {
    storage.set("leftMargin", value);
  }, []);

  const updateRightMargin = useMutation(({ storage }, value: number) => {
    storage.set("rightMargin", value);
  }, []);

  // When Liveblocks storage changes (another user moved the ruler),
  // push the new value into the local Zustand store so the editor re-renders
  useEffect(() => {
    if (liveblocksLeftMargin !== null && liveblocksLeftMargin !== undefined) {
      setLeftMargin(liveblocksLeftMargin);
    }
  }, [liveblocksLeftMargin, setLeftMargin]);

  useEffect(() => {
    if (liveblocksRightMargin !== null && liveblocksRightMargin !== undefined) {
      setRightMargin(liveblocksRightMargin);
    }
  }, [liveblocksRightMargin, setRightMargin]);

  return { updateLeftMargin, updateRightMargin };
}