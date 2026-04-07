"use client";

import Image from "next/image";
import { Book } from "@/lib/types";
import { getCoverUrl } from "@/lib/covers";
import StarRating from "./StarRating";

const statusBadge: Record<string, { label: string; className: string }> = {
  "want-to-read": {
    label: "Want to Read",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  },
  "currently-reading": {
    label: "Reading",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
  },
  finished: {
    label: "Finished",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  },
};

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const badge = statusBadge[book.status];
  const coverUrl = getCoverUrl(book);

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden bg-white dark:bg-warm-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-warm-400"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized={coverUrl.includes("openlibrary.org")}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
          <h3 className="font-heading text-sm font-bold text-white leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
            {book.author}
          </p>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </div>
      {book.rating && book.rating > 0 && (
        <div className="px-3 py-2 flex justify-center">
          <StarRating rating={book.rating} size="sm" />
        </div>
      )}
    </button>
  );
}
