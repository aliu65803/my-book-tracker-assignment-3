import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllBooks, addBook } from "@/lib/books";
import { BookInput } from "@/lib/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const books = await getAllBooks(userId);
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const book = await addBook(body, userId);
  return NextResponse.json(book, { status: 201 });
}
