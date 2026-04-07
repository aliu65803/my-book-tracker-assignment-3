export type ReadingStatus = "want-to-read" | "currently-reading" | "finished";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  status: ReadingStatus;
  rating?: number;
  notes?: string;
  dateAdded: string;
  dateFinished?: string;
}

export type BookInput = Omit<Book, "id" | "dateAdded">;
