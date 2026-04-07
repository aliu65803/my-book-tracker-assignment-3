"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/lib/types";
import { getCoverUrl } from "@/lib/covers";
import StarRating from "@/components/StarRating";
import BookForm from "@/components/BookForm";
import DeleteConfirm from "@/components/DeleteConfirm";

const statusConfig = {
  "want-to-read": { label: "Want to Read", classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  "currently-reading": { label: "Currently Reading", classes: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300" },
  finished: { label: "Finished", classes: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  async function fetchBook() {
    try {
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setBook(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(data: Omit<Book, "id" | "dateAdded">) {
    await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowEdit(false);
    fetchBook();
  }

  async function handleDelete() {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    router.push("/library");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-warm-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-warm-300 dark:border-warm-600 border-t-warm-500 dark:border-t-warm-400 rounded-full animate-spin mx-auto" />
          <p className="text-warm-500 dark:text-warm-400 text-sm font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-warm-900">
        <div className="text-center space-y-4">
          <div className="text-6xl text-warm-300 dark:text-warm-600">?</div>
          <h1 className="font-heading text-2xl font-bold text-warm-800 dark:text-warm-100">Book not found</h1>
          <p className="text-warm-500 dark:text-warm-400 text-sm">The book you are looking for does not exist or has been removed.</p>
          <Link
            href="/library"
            className="inline-block mt-4 px-6 py-2.5 rounded-2xl text-sm font-medium bg-warm-500 text-white hover:bg-warm-600 dark:bg-warm-400 dark:text-warm-900 dark:hover:bg-warm-300 transition-colors"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const coverUrl = getCoverUrl(book);
  const isOpenLibrary = coverUrl.includes("openlibrary.org");
  const status = statusConfig[book.status];

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-warm-50/80 dark:bg-warm-900/80 backdrop-blur-md border-b border-warm-200 dark:border-warm-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/library"
            className="flex items-center gap-2 text-warm-600 dark:text-warm-300 hover:text-warm-800 dark:hover:text-warm-100 transition-colors text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Library
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-warm-100 text-warm-700 dark:bg-warm-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Cover Image */}
            <div className="md:w-80 flex-shrink-0 bg-warm-100 dark:bg-warm-700/50 flex items-center justify-center p-8">
              <div className="relative w-56 h-80 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={coverUrl}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  unoptimized={isOpenLibrary}
                  sizes="224px"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 p-6 md:p-8 space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-warm-900 dark:text-warm-50 leading-tight">
                  {book.title}
                </h1>
                <p className="mt-1 text-lg text-warm-600 dark:text-warm-300">
                  by {book.author}
                </p>
              </div>

              {/* Status Badge and Rating */}
              <div className="flex flex-wrap items-center gap-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.classes}`}>
                  {status.label}
                </span>
                {book.rating ? (
                  <StarRating rating={book.rating} size="md" />
                ) : null}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {book.isbn && (
                  <div>
                    <span className="block text-warm-400 dark:text-warm-500 font-medium uppercase tracking-wide text-xs mb-0.5">ISBN</span>
                    <span className="text-warm-700 dark:text-warm-200">{book.isbn}</span>
                  </div>
                )}
                <div>
                  <span className="block text-warm-400 dark:text-warm-500 font-medium uppercase tracking-wide text-xs mb-0.5">Date Added</span>
                  <span className="text-warm-700 dark:text-warm-200">{formatDate(book.dateAdded)}</span>
                </div>
                {book.dateFinished && (
                  <div>
                    <span className="block text-warm-400 dark:text-warm-500 font-medium uppercase tracking-wide text-xs mb-0.5">Date Finished</span>
                    <span className="text-warm-700 dark:text-warm-200">{formatDate(book.dateFinished)}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {book.notes && (
                <div>
                  <h2 className="text-warm-400 dark:text-warm-500 font-medium uppercase tracking-wide text-xs mb-2">Notes</h2>
                  <div className="bg-warm-50 dark:bg-warm-700/50 rounded-xl p-4 text-sm text-warm-700 dark:text-warm-200 leading-relaxed whitespace-pre-wrap">
                    {book.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEdit && (
        <BookForm
          book={book}
          onSave={handleSave}
          onDelete={() => {
            setShowEdit(false);
            setShowDelete(true);
          }}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <DeleteConfirm
          bookTitle={book.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
