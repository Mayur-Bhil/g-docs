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
    <form onSubmit={handleSubmit} className="w-full">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "40px",
          borderRadius: "24px",
          backgroundColor: focused ? "#ffffff" : "#f0f4f9",
          border: focused ? "1px solid #c5cae9" : "1px solid transparent",
          boxShadow: focused
            ? "0 1px 3px 1px rgba(60,64,67,.15), 0 2px 8px 4px rgba(60,64,67,.1)"
            : "none",
          transition:
            "background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
          padding: "0 6px 0 12px",
          gap: "6px",
          cursor: "text",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Search Icon */}
        <Search
          size={18}
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
            minWidth: 0,      // critical — lets it shrink below content size
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "15px",
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
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#5f6368",
              transition: "background-color 0.1s ease",
              padding: 0,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e8eaed")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")
            }
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}

        {/* Submit — hidden on very small screens, visible from sm up */}
        <Button
          type="submit"
          size="sm"
          disabled={!query.trim()}
          className="rounded-full h-7 px-3 text-sm font-medium shrink-0 hidden sm:flex"
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
  );
};