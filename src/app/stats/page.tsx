"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Book } from "@/lib/types";

export default function StatsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const stats = useMemo(() => {
    const finished = books.filter((b) => b.status === "finished");
    const currentlyReading = books.filter((b) => b.status === "currently-reading");
    const wantToRead = books.filter((b) => b.status === "want-to-read");

    const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
    const avgRating =
      ratedBooks.length > 0
        ? ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBooks.length
        : 0;

    // Rating distribution (1-5)
    const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const b of ratedBooks) {
      if (b.rating && b.rating >= 1 && b.rating <= 5) {
        ratingDist[b.rating]++;
      }
    }

    // Top authors
    const authorCounts: Record<string, number> = {};
    for (const b of books) {
      authorCounts[b.author] = (authorCounts[b.author] || 0) + 1;
    }
    const topAuthors = Object.entries(authorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    // Reading timeline (books finished by month)
    const monthCounts: Record<string, number> = {};
    for (const b of finished) {
      if (b.dateFinished) {
        const date = new Date(b.dateFinished);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthCounts[key] = (monthCounts[key] || 0) + 1;
      }
    }
    const timeline = Object.entries(monthCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => {
        const [year, m] = month.split("-");
        const date = new Date(Number(year), Number(m) - 1);
        const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        return { month, label, count };
      });

    return {
      total: books.length,
      finished: finished.length,
      currentlyReading: currentlyReading.length,
      wantToRead: wantToRead.length,
      avgRating,
      ratingDist,
      topAuthors,
      timeline,
    };
  }, [books]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-warm-500 text-center">Loading stats...</p>
      </main>
    );
  }

  if (books.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="font-heading text-3xl font-bold text-warm-900 dark:text-warm-50 mb-4">
          Reading Stats
        </h1>
        <p className="text-warm-600 dark:text-warm-300 text-lg mb-6">
          No books yet — add some books to see your reading stats!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-warm-600 text-warm-50 rounded-xl hover:bg-warm-700 transition-colors font-medium"
        >
          Go to Library
        </Link>
      </main>
    );
  }

  const statusMax = Math.max(stats.wantToRead, stats.currentlyReading, stats.finished, 1);
  const ratingMax = Math.max(...Object.values(stats.ratingDist), 1);
  const timelineMax = Math.max(...stats.timeline.map((t) => t.count), 1);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-warm-900 dark:text-warm-50 mb-8">
        Reading Stats
      </h1>

      {/* Overview Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-5 text-center">
          <p className="text-3xl font-bold text-warm-900 dark:text-warm-50">{stats.total}</p>
          <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">Total Books</p>
        </div>
        <div className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.finished}</p>
          <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">Finished</p>
        </div>
        <div className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-5 text-center">
          <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{stats.currentlyReading}</p>
          <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">Currently Reading</p>
        </div>
        <div className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-5 text-center">
          <p className="text-3xl font-bold text-warm-900 dark:text-warm-50">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">
            {stats.avgRating > 0 ? "Avg Rating / 5" : "No Ratings"}
          </p>
        </div>
      </section>

      {/* Reading Status Breakdown */}
      <section className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-6 mb-8">
        <h2 className="font-heading text-xl font-bold text-warm-900 dark:text-warm-50 mb-5">
          Reading Status Breakdown
        </h2>
        <div className="space-y-4">
          {[
            { label: "Want to Read", count: stats.wantToRead, color: "bg-amber-400" },
            { label: "Currently Reading", count: stats.currentlyReading, color: "bg-sky-400" },
            { label: "Finished", count: stats.finished, color: "bg-emerald-400" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-warm-700 dark:text-warm-200 font-medium">{item.label}</span>
                <span className="text-warm-500 dark:text-warm-400">{item.count}</span>
              </div>
              <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${(item.count / statusMax) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rating Distribution */}
      <section className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-6 mb-8">
        <h2 className="font-heading text-xl font-bold text-warm-900 dark:text-warm-50 mb-5">
          Rating Distribution
        </h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="flex items-center gap-1 w-16 shrink-0 text-sm text-warm-700 dark:text-warm-200">
                {star} <span className="text-amber-400">&#9733;</span>
              </span>
              <div className="flex-1 bg-warm-200 dark:bg-warm-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats.ratingDist[star] / ratingMax) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm text-warm-500 dark:text-warm-400">
                {stats.ratingDist[star]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Authors */}
      {stats.topAuthors.length > 0 && (
        <section className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-6 mb-8">
          <h2 className="font-heading text-xl font-bold text-warm-900 dark:text-warm-50 mb-5">
            Top Authors
          </h2>
          <div className="space-y-3">
            {stats.topAuthors.map(([author, count]) => (
              <div key={author} className="flex items-center justify-between">
                <span className="text-warm-800 dark:text-warm-100 font-medium">{author}</span>
                <span className="text-sm text-warm-500 dark:text-warm-400 bg-warm-200 dark:bg-warm-700 px-3 py-1 rounded-full">
                  {count} {count === 1 ? "book" : "books"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reading Timeline */}
      {stats.timeline.length > 0 && (
        <section className="bg-warm-50 dark:bg-warm-800 rounded-2xl shadow-md p-6 mb-8">
          <h2 className="font-heading text-xl font-bold text-warm-900 dark:text-warm-50 mb-5">
            Reading Timeline
          </h2>
          <div className="space-y-3">
            {stats.timeline.map((entry) => (
              <div key={entry.month}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-warm-700 dark:text-warm-200 font-medium">{entry.label}</span>
                  <span className="text-warm-500 dark:text-warm-400">
                    {entry.count} {entry.count === 1 ? "book" : "books"} finished
                  </span>
                </div>
                <div className="w-full bg-warm-200 dark:bg-warm-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-warm-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(entry.count / timelineMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
