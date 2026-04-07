# My Book Tracker

## Overview
A personal book tracker built with Next.js (App Router), TypeScript, and Tailwind CSS v4. Tracks reading status, ratings, notes, and displays book covers. Features multiple color themes, a bookshelf spine view, animated reading cat, and Open Library search integration.

## Tech Stack
- **Framework**: Next.js 15 with App Router (`src/` directory)
- **Styling**: Tailwind CSS v4 (CSS-based config via `@theme` in `globals.css`, runtime theme switching via CSS custom properties)
- **Storage**: Local JSON file (`src/data/books.json`) — client-side state backed by a local file, data lives in memory during the session and persists via API routes that read/write the JSON file
- **Covers**: Open Library Covers API (by ISBN) or manual URL

## Commands
- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build
- `npm run lint` — run ESLint

## Key Features

### At least 4 distinct pages / routes
| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | **Dashboard** — stats cards (total books, reading now, finished, avg rating), currently reading section, recently added grid, quick action links |
| `/library` | `src/app/library/page.tsx` | **Library** — full book collection with search, status filter pills, grid/shelf view toggle, and "Add Book" form |
| `/books/[id]` | `src/app/books/[id]/page.tsx` | **Book Detail** — full details for a single book with cover, metadata, notes, edit/delete actions |
| `/stats` | `src/app/stats/page.tsx` | **Stats** — reading status breakdown, rating distribution, top authors, reading timeline |

### A form that adds data
- **BookForm** (`src/components/BookForm.tsx`) — modal form on the Library page for adding and editing books
- Fields: title, author, ISBN, cover URL, reading status, star rating, notes
- **BookSearch** (`src/components/BookSearch.tsx`) — autocomplete search that queries the Open Library Search API as you type, letting you select a book to auto-fill title, author, and ISBN
- Data is managed via client-side state (`useState`) and persisted through API routes to `src/data/books.json`

### A dynamic route
- **`/books/[id]`** (`src/app/books/[id]/page.tsx`) — uses `useParams()` from `next/navigation` to extract the book ID, fetches book data from `/api/books/[id]`, and renders the detail page. Supports edit (via BookForm modal) and delete (with confirmation dialog, redirects to `/library`)

### A shared layout with navigation between pages
- **Layout** (`src/app/layout.tsx`) — root layout wrapping all pages with fonts, theme initialization script, the Nav component, and the animated ReadingCat
- **Nav** (`src/components/Nav.tsx`) — sticky top navigation bar with links to Dashboard, Library, and Stats. Highlights the active page using `usePathname()`. Includes the ThemePicker for switching themes and dark/light mode
- **ThemePicker** (`src/components/ThemePicker.tsx`) — dropdown to switch between Cozy, Ocean, and Forest themes, plus a dark mode toggle. Preferences saved to `localStorage` and restored on page load via a blocking script in the layout `<head>`

## Architecture

### Pages & API
- `src/app/page.tsx` — Dashboard (client component)
- `src/app/library/page.tsx` — Library with grid/shelf view toggle
- `src/app/books/[id]/page.tsx` — Book detail (dynamic route)
- `src/app/stats/page.tsx` — Reading statistics
- `src/app/api/books/route.ts` — REST API: GET all books, POST new book
- `src/app/api/books/[id]/route.ts` — REST API: GET/PUT/DELETE single book

### Data Model
```typescript
type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

interface Book {
  id: string;           // UUID, auto-generated on creation
  title: string;
  author: string;
  isbn?: string;        // used to fetch cover from Open Library
  coverUrl?: string;    // manual override, takes precedence over ISBN
  status: ReadingStatus;
  rating?: number;      // 1–5 stars
  notes?: string;
  dateAdded: string;    // ISO timestamp
  dateFinished?: string; // ISO timestamp, set when status = "finished"
}
```

### Libraries
- `src/lib/books.ts` — server-side JSON file CRUD (readBooks, writeBooks, getAllBooks, getBookById, addBook, updateBook, deleteBook)
- `src/lib/types.ts` — `Book` interface and `ReadingStatus` type
- `src/lib/covers.ts` — cover URL resolution: coverUrl > Open Library by ISBN > placeholder SVG

### Components
| Component | Purpose |
|---|---|
| `Nav` | Shared navigation bar with active link highlighting |
| `ThemePicker` | Theme (Cozy/Ocean/Forest) and dark mode switcher |
| `BookCard` | Cover card with title overlay, status badge, star rating |
| `BookGrid` | Responsive grid layout for BookCards |
| `BookShelf` | Spine-out bookshelf view with wooden plank, varying colors/widths |
| `BookForm` | Add/edit book modal with all fields |
| `BookSearch` | Open Library autocomplete for the form |
| `SearchBar` | Text search input for filtering by title/author |
| `StatusFilter` | Pill buttons to filter by reading status |
| `StarRating` | Interactive or read-only 1–5 star display |
| `DeleteConfirm` | Confirmation dialog for book deletion |
| `ReadingCat` | Animated SVG cat reading a book (bottom-right corner) |

## Theming
- Three themes: **Cozy** (warm browns), **Ocean** (blues/teals with wave decorations), **Forest** (greens with dappled light effect)
- Colors defined as CSS custom properties (`--w50` through `--w900`) in `globals.css`, swapped via `.theme-ocean` / `.theme-forest` classes on `<html>`
- Tailwind's `@theme inline` references these variables so all `warm-*` utility classes adapt at runtime
- Each theme has unique decorative CSS: ambient glows, gradient nav borders, SVG wave/hill decorations, custom border radius
- Dark mode via `dark` class on `<html>`, works independently of color theme
- Both preferences persisted in `localStorage` and restored before first paint

## Animations
- Page fade-in slide-up on navigation
- `.stagger-in` utility class for cascading card entrance animations
- ReadingCat: blinking eyes, swishing tail, page-turning, breathing motion
- Book cards: hover lift and scale transitions

## Testing
- **Playwright MCP** — used for browser-based testing and visual verification of all pages, themes, and interactions. Connected via `@playwright/mcp` running in headless mode. Enables navigating pages, clicking elements, evaluating JavaScript, and taking screenshots to verify UI behavior across themes and view modes.

## Notes
- `src/data/books.json` is the "database" — it should be committed to git
- Cover images from arbitrary HTTPS URLs are allowed via `next.config.ts` remote patterns
- This is a local-only app — JSON file writes won't persist on serverless deployments
