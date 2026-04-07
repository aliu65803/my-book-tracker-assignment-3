import { NextResponse } from "next/server";
import { getAllBooks, addBook } from "@/lib/books";
import { BookInput } from "@/lib/types";

export async function GET() {
  const books = await getAllBooks();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const body = (await request.json()) as BookInput;

  if (!body.title?.trim() || !body.author?.trim()) {
    return NextResponse.json(
      { error: "Title and author are required" },
      { status: 400 }
    );
  }

  const validStatuses = ["want-to-read", "currently-reading", "finished"];
  if (!validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const book = await addBook(body);
  return NextResponse.json(book, { status: 201 });
}
