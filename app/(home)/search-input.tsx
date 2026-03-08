"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useSearchParam } from "../hooks/use-search-params";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  const [search, setSearch] = useSearchParam();
  const [query, setQuery] = useState(search ?? "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    setQuery("");
    setSearch(null);
    inputRef.current?.focus();
  }, [setSearch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!query.trim()) return;
      setSearch(query.trim());
      inputRef.current?.blur();
    },
    [query, setSearch]
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 max-w-6xl w-full mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative w-full"
        style={{ maxWidth: "900px" }}
      >
        {/* Outer pill container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "46px",
            borderRadius: "24px",
            backgroundColor: focused ? "#ffffff" : "#f0f4f9",
            border: focused ? "1px solid #c5cae9" : "1px solid transparent",
            boxShadow: focused
              ? "0 1px 3px 1px rgba(60,64,67,.15), 0 2px 8px 4px rgba(60,64,67,.1)"
              : "none",
            transition:
              "background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
            padding: "0 8px 0 16px",
            gap: "8px",
            cursor: "text",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Search Icon */}
          <Search
            size={20}
            style={{
              flexShrink: 0,
              color: focused ? "#4285f4" : "#5f6368",
              transition: "color 0.15s ease",
            }}
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "16px",
              fontFamily: "'Google Sans', Roboto, sans-serif",
              fontWeight: 400,
              color: "#202124",
              lineHeight: "1",
              caretColor: "#4285f4",
            }}
          />

          {/* Clear button */}
          {query.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear();
              }}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#5f6368",
                transition: "background-color 0.1s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e8eaed";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="sm"
            disabled={!query.trim()}
            className="rounded-full h-8 px-4 text-sm font-medium shrink-0"
            style={{
              backgroundColor: focused || query.length > 0 ? "#1a73e8" : "transparent",
              color: focused || query.length > 0 ? "#fff" : "#5f6368",
              border: "none",
              transition: "background-color 0.15s ease, color 0.15s ease",
              boxShadow: "none",
            }}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};