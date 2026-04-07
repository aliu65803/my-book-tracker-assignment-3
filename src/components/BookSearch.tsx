"use client";

import { useState, useRef, useEffect } from "react";

interface SearchResult {
  title: string;
  author: string;
  isbn: string | undefined;
  coverId: number | undefined;
}

interface BookSearchProps {
  onSelect: (result: SearchResult) => void;
  inputClass: string;
}

export default function BookSearch({ onSelect, inputClass }: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      searchBooks(value.trim());
    }, 400);
  }

  async function searchBooks(q: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=6&fields=title,author_name,isbn,cover_i`
      );
      const data = await res.json();
      const mapped: SearchResult[] = (data.docs ?? []).map(
        (doc: { title?: string; author_name?: string[]; isbn?: string[]; cover_i?: number }) => ({
          title: doc.title ?? "Unknown",
          author: doc.author_name?.[0] ?? "Unknown",
          isbn: doc.isbn?.[0],
          coverId: doc.cover_i,
        })
      );
      setResults(mapped);
      setOpen(mapped.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(result: SearchResult) {
    onSelect(result);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
        Search for a book
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className={inputClass}
          placeholder="Type a title or author to search..."
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-warm-300 dark:border-warm-600 border-t-warm-500 dark:border-t-warm-400 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-600 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 hover:bg-warm-100 dark:hover:bg-warm-700 transition-colors flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
              >
                {r.coverId ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${r.coverId}-S.jpg`}
                    alt=""
                    className="w-8 h-12 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-12 bg-warm-200 dark:bg-warm-600 rounded flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-warm-900 dark:text-warm-50 truncate">
                    {r.title}
                  </p>
                  <p className="text-xs text-warm-500 dark:text-warm-400 truncate">
                    {r.author}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
