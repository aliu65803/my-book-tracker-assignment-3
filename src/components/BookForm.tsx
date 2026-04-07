"use client";

import { useState } from "react";
import { Book, ReadingStatus } from "@/lib/types";
import StarRating from "./StarRating";
import DeleteConfirm from "./DeleteConfirm";
import BookSearch from "./BookSearch";

interface BookFormProps {
  book?: Book;
  onSave: (data: Omit<Book, "id" | "dateAdded">) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export default function BookForm({ book, onSave, onDelete, onClose }: BookFormProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [isbn, setIsbn] = useState(book?.isbn ?? "");
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl ?? "");
  const [status, setStatus] = useState<ReadingStatus>(book?.status ?? "want-to-read");
  const [rating, setRating] = useState(book?.rating ?? 0);
  const [notes, setNotes] = useState(book?.notes ?? "");
  const [showDelete, setShowDelete] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || undefined,
      coverUrl: coverUrl.trim() || undefined,
      status,
      rating: rating || undefined,
      notes: notes.trim() || undefined,
      dateFinished:
        status === "finished"
          ? book?.dateFinished ?? new Date().toISOString()
          : undefined,
    });
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-warm-200 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-50 placeholder:text-warm-400 dark:placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition-colors";

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="bg-warm-50 dark:bg-warm-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-heading text-xl font-bold text-warm-900 dark:text-warm-50 mb-4">
            {book ? "Edit Book" : "Add a Book"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!book && (
              <BookSearch
                inputClass={inputClass}
                onSelect={(result) => {
                  setTitle(result.title);
                  setAuthor(result.author);
                  if (result.isbn) setIsbn(result.isbn);
                }}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. The Great Gatsby"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                Author *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. F. Scott Fitzgerald"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className={inputClass}
                placeholder="Used to auto-fetch cover image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={inputClass}
                placeholder="Overrides ISBN cover"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                className={inputClass}
              >
                <option value="want-to-read">Want to Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                Rating
              </label>
              <StarRating rating={rating} onChange={setRating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass}
                placeholder="Your thoughts on this book..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              {book && onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-warm-100 text-warm-700 dark:bg-warm-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-warm-500 text-white hover:bg-warm-600 dark:bg-warm-400 dark:text-warm-900 dark:hover:bg-warm-300 transition-colors"
              >
                {book ? "Save" : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showDelete && book && onDelete && (
        <DeleteConfirm
          bookTitle={book.title}
          onConfirm={onDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
