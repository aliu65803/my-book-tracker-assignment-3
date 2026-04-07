import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/books";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const updated = await updateBook(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteBook(id);
  if (!deleted) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
