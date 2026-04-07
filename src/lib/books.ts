import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Book, BookInput } from "./types";

const DATA_PATH = path.join(process.cwd(), "src", "data", "books.json");

async function readBooks(): Promise<Book[]> {
  try {
    const data = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeBooks(books: Book[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(books, null, 2));
}

export async function getAllBooks(): Promise<Book[]> {
  return readBooks();
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await readBooks();
  return books.find((b) => b.id === id);
}

export async function addBook(input: BookInput): Promise<Book> {
  const books = await readBooks();
  const book: Book = {
    ...input,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  books.push(book);
  await writeBooks(books);
  return book;
}

export async function updateBook(
  id: string,
  updates: Partial<BookInput>
): Promise<Book | null> {
  const books = await readBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...updates };
  await writeBooks(books);
  return books[index];
}

export async function deleteBook(id: string): Promise<boolean> {
  const books = await readBooks();
  const filtered = books.filter((b) => b.id !== id);
  if (filtered.length === books.length) return false;
  await writeBooks(filtered);
  return true;
}
