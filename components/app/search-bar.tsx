"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/public/icons/search-icon";
import { cn } from "@/lib/utils/app/utils";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";

export function SearchBar({
  collection,
  className,
  query,
  setQuery,
}: {
  collection: string;
  className?: string;
  query: string;
  setQuery: (q: string) => void;
}) {
  const [text, setText] = useState(query);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // to ensure text is reset when query changes
  useEffect(() => {
    setText(query);
  }, [query]);

  // to ensure the query is derived from the text after handling debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setQuery(text.toLowerCase().trim());
    }, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [text]);

  function clearQuery() {
    setText("");
    setQuery("");
  }

  return (
    <div className={cn("relative w-full", className)}>
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Search ${collection}`}
        className="border-border bg-background w-full rounded-sm py-3 pr-4 pl-10 text-sm placeholder:text-sm placeholder:font-normal"
      />

      {!!query && (
        <Button
          variant="ghost"
          className="absolute top-1/2 right-3 -translate-y-1/2 p-0"
          onClick={clearQuery}
        >
          <CloseIconNoBorders className="size-7" />
        </Button>
      )}
    </div>
  );
}
