# My Book Tracker

## Overview
A personal book tracker built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Tracks reading status, ratings, notes, and displays book covers.

## Tech Stack
- **Framework**: Next.js 15 with App Router (`src/` directory)
- **Styling**: Tailwind CSS v4 (CSS-based config via `@theme` in `globals.css`)
- **Storage**: Local JSON file (`src/data/books.json`) — no database
- **Covers**: Open Library Covers API (by ISBN) or manual URL

## Commands
- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build
- `npm run lint` — run ESLint

## Architecture
- `src/app/page.tsx` — single-page client component (all state management lives here)
- `src/app/api/books/` — REST API routes (GET/POST collection, GET/PUT/DELETE by id)
- `src/lib/books.ts` — server-side JSON file read/write helpers
- `src/lib/types.ts` — `Book` interface and `ReadingStatus` type
- `src/lib/covers.ts` — cover URL resolution (Open Library → manual URL → placeholder)
- `src/components/` — UI components (BookCard, BookGrid, BookForm, SearchBar, StatusFilter, StarRating, ThemeToggle, DeleteConfirm)

## Theming
- Warm color palette defined in `globals.css` under `@theme inline` (warm-50 through warm-900)
- Dark mode uses `class` strategy — toggled via `dark` class on `<html>`
- Theme preference persisted in `localStorage`

## Notes
- `src/data/books.json` is the "database" — it should be committed to git
- Cover images from arbitrary HTTPS URLs are allowed via `next.config.ts` remote patterns
- This is a local-only app — JSON file writes won't persist on serverless deployments
