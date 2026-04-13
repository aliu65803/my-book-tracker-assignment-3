"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Book } from "@/lib/types";
import { getCoverUrl } from "@/lib/covers";
import Link from "next/link";
import Image from "next/image";

function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-12">
      {/* Hero */}
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-warm-900 dark:text-warm-50">
          Track Your Reading Journey
        </h1>
        <p className="text-lg sm:text-xl text-warm-600 dark:text-warm-300 max-w-2xl mx-auto">
          Keep track of the books you&apos;re reading, want to read, and have finished.
          Rate, review, and organize your personal library.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-warm-600 hover:bg-warm-700 text-warm-50 font-heading font-bold px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 border-2 border-warm-400 dark:border-warm-600 text-warm-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-warm-800 font-heading font-bold px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-in">
        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-6 space-y-3">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 w-fit mx-auto">
            <svg className="w-7 h-7 text-warm-800 dark:text-warm-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-warm-900 dark:text-warm-50">Organize Your Books</h3>
          <p className="text-sm text-warm-600 dark:text-warm-300">
            Track what you&apos;re reading, what&apos;s on your list, and what you&apos;ve finished.
          </p>
        </div>

        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-6 space-y-3">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 w-fit mx-auto">
            <svg className="w-7 h-7 text-warm-800 dark:text-warm-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-warm-900 dark:text-warm-50">Rate & Review</h3>
          <p className="text-sm text-warm-600 dark:text-warm-300">
            Give star ratings and add personal notes to remember your thoughts.
          </p>
        </div>

        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-6 space-y-3">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 w-fit mx-auto">
            <svg className="w-7 h-7 text-warm-800 dark:text-warm-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-warm-900 dark:text-warm-50">Reading Stats</h3>
          <p className="text-sm text-warm-600 dark:text-warm-300">
            See your reading habits with stats on authors, ratings, and more.
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalBooks = books.length;
  const currentlyReading = books.filter((b) => b.status === "currently-reading");
  const finished = books.filter((b) => b.status === "finished");
  const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
  const averageRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) /
          ratedBooks.length
        ).toFixed(1)
      : "—";

  const recentlyAdded = [...books]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-warm-500 text-lg font-heading">
          Loading your library...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-in">
        {/* Total Books */}
        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-5 flex items-center gap-4">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 shrink-0">
            <svg
              className="w-6 h-6 text-warm-800 dark:text-warm-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 font-heading">
              {totalBooks}
            </p>
            <p className="text-sm text-warm-600 dark:text-warm-300">
              Total Books
            </p>
          </div>
        </div>

        {/* Currently Reading */}
        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-5 flex items-center gap-4">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 shrink-0">
            <svg
              className="w-6 h-6 text-warm-800 dark:text-warm-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 font-heading">
              {currentlyReading.length}
            </p>
            <p className="text-sm text-warm-600 dark:text-warm-300">
              Reading Now
            </p>
          </div>
        </div>

        {/* Finished */}
        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-5 flex items-center gap-4">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 shrink-0">
            <svg
              className="w-6 h-6 text-warm-800 dark:text-warm-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 font-heading">
              {finished.length}
            </p>
            <p className="text-sm text-warm-600 dark:text-warm-300">
              Finished
            </p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-5 flex items-center gap-4">
          <div className="bg-warm-300 dark:bg-warm-600 rounded-xl p-3 shrink-0">
            <svg
              className="w-6 h-6 text-warm-800 dark:text-warm-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 font-heading">
              {averageRating}
              <span className="text-sm font-normal text-warm-500"> / 5</span>
            </p>
            <p className="text-sm text-warm-600 dark:text-warm-300">
              Avg Rating
            </p>
          </div>
        </div>
      </div>

      {/* Currently Reading Section */}
      <section>
        <h2 className="text-2xl font-heading font-bold text-warm-900 dark:text-warm-50 mb-4">
          Currently Reading
        </h2>
        {currentlyReading.length === 0 ? (
          <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-8 text-center">
            <p className="text-warm-500 dark:text-warm-400 text-lg">
              Nothing being read right now
            </p>
            <Link
              href="/library"
              className="inline-block mt-3 text-warm-600 dark:text-warm-300 underline hover:text-warm-800 dark:hover:text-warm-100 transition-colors"
            >
              Browse your library to pick something up
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 stagger-in">
            {currentlyReading.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="flex items-center gap-4 bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-4 min-w-[280px] hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="relative w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-warm-200 dark:bg-warm-700">
                  <Image
                    src={getCoverUrl(book)}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-warm-900 dark:text-warm-50 truncate">
                    {book.title}
                  </p>
                  <p className="text-sm text-warm-600 dark:text-warm-300 truncate">
                    {book.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recently Added Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold text-warm-900 dark:text-warm-50">
            Recently Added
          </h2>
          <Link
            href="/library"
            className="text-sm text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        {recentlyAdded.length === 0 ? (
          <div className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md p-8 text-center">
            <p className="text-warm-500 dark:text-warm-400 text-lg">
              No books yet. Start building your library!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-in">
            {recentlyAdded.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="bg-warm-100 dark:bg-warm-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all group"
              >
                <div className="relative w-full h-48 bg-warm-200 dark:bg-warm-700">
                  <Image
                    src={getCoverUrl(book)}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-heading font-bold text-warm-900 dark:text-warm-50 truncate">
                    {book.title}
                  </p>
                  <p className="text-sm text-warm-600 dark:text-warm-300 truncate">
                    {book.author}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-warm-200 dark:bg-warm-700 text-warm-700 dark:text-warm-200 capitalize">
                      {book.status.replace(/-/g, " ")}
                    </span>
                    {book.rating ? (
                      <span className="text-xs text-warm-500 flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-warm-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {book.rating}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 bg-warm-600 hover:bg-warm-700 text-warm-50 font-heading font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add a Book
        </Link>
        <Link
          href="/library"
          className="inline-flex items-center gap-2 border-2 border-warm-400 dark:border-warm-600 text-warm-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-warm-800 font-heading font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          View All Books
        </Link>
      </section>
    </div>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-warm-500 text-lg font-heading">
          Loading...
        </div>
      </div>
    );
  }

  return isSignedIn ? <Dashboard /> : <LandingPage />;
}
