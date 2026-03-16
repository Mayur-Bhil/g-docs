"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { LoaderIcon } from "lucide-react";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const [value, setValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const update = useMutation(api.documents.update);

  const handleSave = async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || trimmed === title) {
      setValue(title);
      setStatus("saved");
      return;
    }
    setStatus("saving");
    try {
      await update({ id, title: trimmed });
      // small delay before showing checkmark — feels more natural
      setTimeout(() => setStatus("saved"), 600);
    } catch {
      setStatus("error");
      setValue(title);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    setStatus("saving");

    // debounce — 2s after user stops typing
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => handleSave(newVal), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (timerRef.current) clearTimeout(timerRef.current);
      handleSave(value);
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setValue(title);
      setStatus("saved");
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  const handleBlur = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    handleSave(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 h-7">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          style={{
            width: isEditing ? "240px" : `${Math.max(value.length * 8.5, 80)}px`,
            maxWidth: "340px",
            transition: "width 350ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease, background 200ms ease, border-color 200ms ease",
          }}
          className={`
            text-[15px] font-normal leading-tight px-2 py-0.5 rounded-md
            border outline-none text-[#202124] truncate
            ${isEditing
              ? "border-[#4285f4] bg-white shadow-[0_0_0_3px_rgba(66,133,244,0.15)]"
              : "border-transparent bg-transparent hover:border-[#dadce0] hover:bg-[#f1f3f4] cursor-pointer"
            }
          `}
          spellCheck={false}
        />
      </div>

      {/* status icon with fade transition */}
      <div
        className="flex items-center shrink-0"
        style={{ transition: "opacity 400ms ease", opacity: status === "saved" && !isEditing ? 0.7 : 1 }}
      >
        {status === "saving" && (
          <LoaderIcon
            className="w-[15px] h-[15px] text-[#9aa0a6]"
            style={{ animation: "spin 1.2s linear infinite" }}
          />
        )}
        {status === "saved" && (
          <BsCloudCheck
            className="w-[15px] h-[15px]"
            style={{
              color: "#34a853",
              transition: "opacity 500ms ease, transform 300ms ease",
              opacity: 1,
            }}
          />
        )}
        {status === "error" && (
          <BsCloudSlash className="w-[15px] h-[15px] text-[#ea4335]" />
        )}
      </div>
    </div>
  );
};