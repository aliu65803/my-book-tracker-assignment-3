"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Book, ReadingStatus } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import BookGrid from "@/components/BookGrid";
import BookForm from "@/components/BookForm";

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);

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
        <div className="sm:ml-auto">
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

      <BookGrid books={filteredBooks} onBookClick={handleBookClick} />

      {showForm && (
        <BookForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
