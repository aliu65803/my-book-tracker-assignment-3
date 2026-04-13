import { getSupabase } from "./supabase";
import { Book, BookInput } from "./types";

interface DbBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  isbn: string | null;
  cover_url: string | null;
  status: string;
  rating: number | null;
  notes: string | null;
  date_added: string;
  date_finished: string | null;
}

function toBook(row: DbBook): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    isbn: row.isbn ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    status: row.status as Book["status"],
    rating: row.rating ?? undefined,
    notes: row.notes ?? undefined,
    dateAdded: row.date_added,
    dateFinished: row.date_finished ?? undefined,
  };
}

export async function getAllBooks(userId: string): Promise<Book[]> {
  const { data, error } = await getSupabase()
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("date_added", { ascending: false });

  if (error) throw error;
  return (data as DbBook[]).map(toBook);
}

export async function getBookById(
  id: string,
  userId: string
): Promise<Book | undefined> {
  const { data, error } = await getSupabase()
    .from("books")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) return undefined;
  return toBook(data as DbBook);
}

export async function addBook(
  input: BookInput,
  userId: string
): Promise<Book> {
  const { data, error } = await getSupabase()
    .from("books")
    .insert({
      user_id: userId,
      title: input.title,
      author: input.author,
      isbn: input.isbn || null,
      cover_url: input.coverUrl || null,
      status: input.status,
      rating: input.rating || null,
      notes: input.notes || null,
      date_finished: input.dateFinished || null,
    })
    .select()
    .single();

  if (error) throw error;
  return toBook(data as DbBook);
}

export async function updateBook(
  id: string,
  updates: Partial<BookInput>,
  userId: string
): Promise<Book | null> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.author !== undefined) dbUpdates.author = updates.author;
  if (updates.isbn !== undefined) dbUpdates.isbn = updates.isbn || null;
  if (updates.coverUrl !== undefined) dbUpdates.cover_url = updates.coverUrl || null;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.rating !== undefined) dbUpdates.rating = updates.rating || null;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;
  if (updates.dateFinished !== undefined) dbUpdates.date_finished = updates.dateFinished || null;

  const { data, error } = await getSupabase()
    .from("books")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return null;
  return toBook(data as DbBook);
}

export async function deleteBook(
  id: string,
  userId: string
): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("books")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return false;
  return (count ?? 0) > 0;
}
