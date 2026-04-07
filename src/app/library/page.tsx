"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Book, ReadingStatus } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import BookGrid from "@/components/BookGrid";
import BookShelf from "@/components/BookShelf";
import BookForm from "@/components/BookForm";

type ViewMode = "grid" | "shelf";

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    return (localStorage.getItem("library-view") as ViewMode) || "grid";
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setBooks(data); });
    return () => { cancelled = true; };
  }, []);

  async function fetchBooks() {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  }

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        !search ||
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || book.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [books, search, statusFilter]);

  async function handleSave(data: Omit<Book, "id" | "dateAdded">) {
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchBooks();
  }

  function handleBookClick(book: Book) {
    router.push(`/books/${book.id}`);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-64">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <StatusFilter active={statusFilter} onChange={setStatusFilter} />
        <div className="flex items-center gap-2 sm:ml-auto">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden border border-warm-200 dark:border-warm-600">
            <button
              onClick={() => { setView("grid"); localStorage.setItem("library-view", "grid"); }}
              className={`p-2 transition-colors ${view === "grid" ? "bg-warm-500 text-white dark:bg-warm-400 dark:text-warm-900" : "bg-warm-50 dark:bg-warm-800 text-warm-500 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700"}`}
              aria-label="Grid view"
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => { setView("shelf"); localStorage.setItem("library-view", "shelf"); }}
              className={`p-2 transition-colors ${view === "shelf" ? "bg-warm-500 text-white dark:bg-warm-400 dark:text-warm-900" : "bg-warm-50 dark:bg-warm-800 text-warm-500 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700"}`}
              aria-label="Shelf view"
              title="Shelf view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M2 20h20" />
                <rect x="4" y="8" width="4" height="12" rx="0.5" />
                <rect x="9" y="6" width="4" height="14" rx="0.5" />
                <rect x="14" y="9" width="4" height="11" rx="0.5" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium bg-warm-500 text-white hover:bg-warm-600 dark:bg-warm-400 dark:text-warm-900 dark:hover:bg-warm-300 transition-colors shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Book
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <BookGrid books={filteredBooks} onBookClick={handleBookClick} />
      ) : (
        <BookShelf books={filteredBooks} onBookClick={handleBookClick} />
      )}

      {showForm && (
        <BookForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
