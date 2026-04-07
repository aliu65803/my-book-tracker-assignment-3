"use client";

import { Book } from "@/lib/types";

interface BookShelfProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const BOOKS_PER_SHELF = 12;

// Generate a consistent color from a string
function stringToColor(str: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const palette = [
    { bg: "#8B2252", text: "#f8d4e0" }, // burgundy
    { bg: "#1B4332", text: "#b7e4c7" }, // forest green
    { bg: "#1B3A5C", text: "#a8cce8" }, // navy
    { bg: "#5C3D2E", text: "#e0c8b8" }, // brown
    { bg: "#4A1942", text: "#d4a8d0" }, // plum
    { bg: "#2D3A1A", text: "#c8d4a8" }, // olive
    { bg: "#3D1F0B", text: "#d4b896" }, // dark brown
    { bg: "#1A3344", text: "#a4c4d8" }, // steel blue
    { bg: "#44243B", text: "#d8b4cc" }, // mauve
    { bg: "#2B2D42", text: "#b8bcd8" }, // slate
    { bg: "#6B2737", text: "#e8c0c8" }, // wine
    { bg: "#1B4040", text: "#a8d4d4" }, // teal
  ];

  return palette[Math.abs(hash) % palette.length];
}

// Generate a spine width based on title length (simulating page count)
function spineWidth(title: string): number {
  const base = 32;
  const extra = Math.min(title.length * 0.8, 24);
  // Add some pseudo-random variation
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 3) - hash);
  }
  const variation = (Math.abs(hash) % 12) - 6;
  return Math.round(base + extra + variation);
}

// Generate a height variation (books aren't all the same height)
function spineHeight(title: string): number {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 4) - hash);
  }
  const base = 160;
  const variation = (Math.abs(hash) % 40) - 10;
  return base + variation;
}

export default function BookShelf({ books, onBookClick }: BookShelfProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-warm-300 dark:text-warm-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
        <h3 className="font-heading text-lg font-bold text-warm-500 dark:text-warm-400">
          No books yet
        </h3>
        <p className="text-warm-400 dark:text-warm-500 mt-1">
          Add your first book to get started!
        </p>
      </div>
    );
  }

  // Split books into shelf rows
  const shelves: Book[][] = [];
  let currentShelf: Book[] = [];
  let currentWidth = 0;
  const maxWidth = 800; // approximate max shelf width in px

  for (const book of books) {
    const w = spineWidth(book.title);
    if (currentWidth + w > maxWidth && currentShelf.length > 0) {
      shelves.push(currentShelf);
      currentShelf = [];
      currentWidth = 0;
    }
    currentShelf.push(book);
    currentWidth += w + 2; // 2px gap
  }
  if (currentShelf.length > 0) shelves.push(currentShelf);

  // Fallback: ensure at least basic chunking
  if (shelves.length === 0) {
    for (let i = 0; i < books.length; i += BOOKS_PER_SHELF) {
      shelves.push(books.slice(i, i + BOOKS_PER_SHELF));
    }
  }

  return (
    <div className="space-y-2">
      {shelves.map((shelfBooks, shelfIndex) => (
        <div key={shelfIndex}>
          {/* Books on this shelf */}
          <div className="flex items-end px-4 sm:px-6 pt-6 pb-0 stagger-in" style={{ gap: "2px" }}>
            {shelfBooks.map((book) => (
              <SpineBook key={book.id} book={book} onClick={() => onBookClick(book)} />
            ))}
          </div>
          {/* The shelf plank */}
          <div className="shelf-plank" />
        </div>
      ))}
    </div>
  );
}

function SpineBook({ book, onClick }: { book: Book; onClick: () => void }) {
  const color = stringToColor(book.title + book.author);
  const width = spineWidth(book.title);
  const height = spineHeight(book.title);

  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 focus:outline-none"
      title={`${book.title} by ${book.author}`}
    >
      <div
        className="relative transition-all duration-300 group-hover:-translate-y-4 group-hover:scale-[1.03] rounded-t-[2px]"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* Spine face */}
        <div
          className="absolute inset-0 rounded-t-[2px] overflow-hidden flex items-center justify-center"
          style={{ background: color.bg }}
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 3px,
                rgba(255,255,255,0.1) 3px,
                rgba(255,255,255,0.1) 4px
              )`,
            }}
          />

          {/* Top and bottom decorative bands */}
          <div
            className="absolute top-0 left-0 right-0 h-[6px]"
            style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)` }}
          />
          <div
            className="absolute top-[8px] left-[4px] right-[4px] h-[1px]"
            style={{ background: color.text, opacity: 0.3 }}
          />
          <div
            className="absolute bottom-[8px] left-[4px] right-[4px] h-[1px]"
            style={{ background: color.text, opacity: 0.3 }}
          />

          {/* Title text - vertical */}
          <div
            className="relative z-10 font-heading font-bold leading-none text-center px-[3px]"
            style={{
              color: color.text,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: width > 45 ? "11px" : "9px",
              maxHeight: `${height - 28}px`,
              overflow: "hidden",
              letterSpacing: "0.02em",
            }}
          >
            {book.title}
          </div>
        </div>

        {/* Left edge shadow (depth) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-tl-[2px]"
          style={{
            background: `linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 100%)`,
          }}
        />

        {/* Right edge highlight */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 100%)`,
          }}
        />

        {/* Top edge (pages) */}
        <div
          className="absolute top-0 left-[3px] right-[2px] h-[2px] rounded-t-[1px]"
          style={{
            background: "linear-gradient(180deg, #e8e0d4 0%, #d4ccc0 100%)",
          }}
        />
      </div>

      {/* Tooltip on hover */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 w-max max-w-[200px]">
        <div className="bg-warm-900 dark:bg-warm-100 text-warm-50 dark:text-warm-900 text-xs px-3 py-2 rounded-xl shadow-lg text-center">
          <p className="font-bold leading-tight line-clamp-2">{book.title}</p>
          <p className="text-warm-300 dark:text-warm-600 mt-0.5 line-clamp-1">{book.author}</p>
          {book.rating && book.rating > 0 && (
            <p className="text-amber-400 mt-0.5">{"★".repeat(book.rating)}</p>
          )}
        </div>
        <div className="w-0 h-0 mx-auto border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-warm-900 dark:border-t-warm-100" />
      </div>
    </button>
  );
}
