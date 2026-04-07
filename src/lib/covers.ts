export function getCoverUrl(book: { isbn?: string; coverUrl?: string }): string {
  if (book.coverUrl) return book.coverUrl;
  if (book.isbn)
    return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
  return "/placeholder-cover.svg";
}
